# F.K. Ventures

MuteDeworld-style Next.js storefront for F.K. DealsGH Ventures — wholesale bottle drinks and minerals — plus a navy-blue Supabase admin console.

## Develop

Requires **Node 20+**.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

If you see a Turbopack font error or **(stale)** Next.js overlay:

```bash
rm -rf .next node_modules
npm install
npm run dev
```

## Admin (Supabase)

1. Create a free [Supabase](https://supabase.com) project.
2. SQL Editor → run [`supabase/schema.sql`](supabase/schema.sql).
3. Authentication → Users: create an admin user; disable public sign-ups.
4. Make them an admin:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
5. Copy [`.env.example`](.env.example) → `.env.local` and paste URL + anon + service_role keys.
6. Restart `npm run dev`, sign in at `/admin`, click **Import starter products**.

Without Supabase env vars the storefront still runs on the built-in catalogue; `/admin` shows setup steps.

## Edit content

- Brand, contact, nav, categories: [`src/data/store.ts`](src/data/store.ts)
- Starter products (demo / import): [`src/data/catalog.ts`](src/data/catalog.ts)
- Images: [`public/images/`](public/images/)
