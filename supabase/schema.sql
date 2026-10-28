-- F.K. Ventures database setup
--
-- 1. Create a free project at https://supabase.com.
-- 2. Open SQL Editor -> New query, paste this whole file and click Run.
-- 3. Authentication -> Users -> Add user: create the admin login (email + password).
--    Then turn OFF "Allow new users to sign up".
-- 4. Make that user an admin (replace the email):
--      insert into public.admins (user_id)
--      select id from auth.users where email = 'you@example.com';
-- 5. Copy .env.example to .env.local and paste the project URL and keys.
-- 6. Sign in at /admin and click "Import starter products".

create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Wholesale drinks: simple unit stock (no colour/size variants)

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('water', 'soft-drinks', 'juices', 'malt')),
  price numeric(10, 2) not null check (price >= 0),
  description text not null default '',
  badge text check (badge in ('new', 'bestseller', 'limited')),
  images text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_sort_idx on public.products (sort_order, created_at);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

alter table public.products enable row level security;

drop policy if exists "Anyone can view active products" on public.products;
create policy "Anyone can view active products" on public.products
  for select using (is_active or public.is_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products
  for delete to authenticated using (public.is_admin());

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  status text not null default 'new' check (status in ('new', 'confirmed', 'dispatched', 'delivered', 'cancelled')),
  first_name text not null,
  last_name text not null default '',
  phone text not null,
  email text,
  note text not null default '',
  items jsonb not null,
  subtotal numeric(10, 2) not null,
  total numeric(10, 2) not null,
  admin_note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists orders_created_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

drop policy if exists "Admins can view orders" on public.orders;
create policy "Admins can view orders" on public.orders
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- p_items: [{"product_id": uuid, "qty": int}]
create or replace function public.place_order(
  p_customer jsonb,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty int;
  v_lines jsonb := '[]'::jsonb;
  v_subtotal numeric(10, 2) := 0;
  v_line_total numeric(10, 2);
  v_reference text;
  v_n int := 0;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item ->> 'qty')::int;
    if v_qty is null or v_qty < 1 then
      raise exception 'BAD_QTY';
    end if;

    select * into v_product from public.products
      where id = (v_item ->> 'product_id')::uuid and is_active
      for update;
    if not found then
      raise exception 'PRODUCT_NOT_FOUND';
    end if;
    if v_product.stock < v_qty then
      raise exception 'OUT_OF_STOCK';
    end if;

    update public.products set stock = stock - v_qty where id = v_product.id;

    v_line_total := round(v_product.price * v_qty, 2);
    v_subtotal := v_subtotal + v_line_total;
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'name', v_product.name,
      'price', v_product.price,
      'qty', v_qty,
      'line_total', v_line_total
    ));
  end loop;

  loop
    v_n := v_n + 1;
    v_reference := 'FK-' || to_char(now(), 'YYMMDD') || '-' || lpad(v_n::text, 3, '0');
    exit when not exists (select 1 from public.orders where reference = v_reference);
  end loop;

  insert into public.orders (
    reference, first_name, last_name, phone, email, note, items, subtotal, total
  ) values (
    v_reference,
    coalesce(p_customer ->> 'first_name', 'Customer'),
    coalesce(p_customer ->> 'last_name', ''),
    coalesce(p_customer ->> 'phone', ''),
    nullif(p_customer ->> 'email', ''),
    coalesce(p_customer ->> 'note', ''),
    v_lines,
    v_subtotal,
    v_subtotal
  );

  return jsonb_build_object(
    'reference', v_reference,
    'items', v_lines,
    'subtotal', v_subtotal,
    'total', v_subtotal
  );
end;
$$;

revoke execute on function public.place_order(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.place_order(jsonb, jsonb) to service_role;

create or replace function public.set_order_status(p_order_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item jsonb;
begin
  if not public.is_admin() then
    raise exception 'NOT_ADMIN';
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'NOT_FOUND';
  end if;

  if v_order.status = p_status then
    return;
  end if;
  if v_order.status = 'cancelled' then
    raise exception 'ALREADY_CANCELLED';
  end if;

  if p_status = 'cancelled' then
    for v_item in select * from jsonb_array_elements(v_order.items) loop
      update public.products
      set stock = stock + (v_item ->> 'qty')::integer
      where id = (v_item ->> 'product_id')::uuid;
    end loop;
  end if;

  update public.orders set status = p_status where id = p_order_id;
end;
$$;

revoke execute on function public.set_order_status(uuid, text) from public, anon;
grant execute on function public.set_order_status(uuid, text) to authenticated;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());
