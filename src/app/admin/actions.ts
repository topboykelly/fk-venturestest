"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { starterProducts } from "@/data/seed";
import { isOrderStatus } from "@/data/store";
import { checkProductInput, type ProductInput, type ProductInputErrors } from "@/lib/admin-products";
import { requireAdmin } from "@/lib/auth";
import { PRODUCTS_TAG } from "@/lib/catalog";
import { productToRow } from "@/lib/product";
import { PRODUCT_IMAGES_BUCKET, isSupabaseConfigured, supabaseUrl } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

export type SignInState = { error: string } | null;

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (!isSupabaseConfigured) return { error: "Connect Supabase first (see the setup steps)." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("signIn failed:", error.code ?? error.name, error.message);
    if (error.code === "email_not_confirmed") {
      return { error: "This email isn't confirmed yet. Confirm it in Supabase → Authentication → Users." };
    }
    if (error.code === "invalid_credentials") return { error: "That email and password don't match an account." };
    if (error.name === "AuthRetryableFetchError" || error.status === 0 || !error.status) {
      return { error: "Couldn't reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL in .env.local." };
    }
    return { error: `Sign-in failed: ${error.message}` };
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    return { error: "This account isn't an admin. Add it to the admins table." };
  }

  redirect("/admin");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

const publicPrefix = `${supabaseUrl}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;

function storagePaths(urls: string[]) {
  return urls
    .filter((u) => u.startsWith(publicPrefix))
    .map((u) => u.slice(publicPrefix.length))
    .filter(Boolean);
}

export async function saveProduct(
  input: ProductInput,
  id?: string,
): Promise<ActionResult | { ok: false; error: string; fieldErrors: ProductInputErrors }> {
  const { supabase } = await requireAdmin();
  const { product, errors } = checkProductInput(input);
  if (Object.keys(errors).length) {
    return { ok: false, error: "Fix the highlighted fields.", fieldErrors: errors };
  }

  const row = productToRow({ ...product, ...(id ? { id } : {}) });
  const { error } = id
    ? await supabase.from("products").update(row).eq("id", id)
    : await supabase.from("products").insert(row);

  if (error) {
    console.error("saveProduct:", error.message);
    if (error.code === "23505") return { ok: false, error: "That slug is already used." };
    return { ok: false, error: error.message };
  }

  updateTag(PRODUCTS_TAG);
  redirect(`/admin/products?toast=saved`);
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").select("images").eq("id", id).maybeSingle();
  const paths = storagePaths((data?.images as string[] | null) ?? []);
  if (paths.length) await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove(paths);

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  updateTag(PRODUCTS_TAG);
  redirect("/admin/products?toast=deleted");
}

export async function importStarterProducts(): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const rows = starterProducts.map(({ id: _id, ...rest }) => productToRow(rest));
  const { error } = await supabase.from("products").upsert(rows, { onConflict: "slug" });
  if (error) {
    console.error("importStarterProducts:", error.message);
    return { ok: false, error: error.message };
  }
  updateTag(PRODUCTS_TAG);
  redirect("/admin/products?toast=imported");
}

export async function uploadProductImage(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const { supabase } = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose an image file." };
  if (file.size > 5 * 1024 * 1024) return { ok: false, error: "Images must be under 5MB." };

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

export async function setOrderStatus(id: string, status: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isOrderStatus(status)) return { ok: false, error: "Unknown status." };

  const supabase = await createSessionClient();
  const { error } = await supabase.rpc("set_order_status", { p_order_id: id, p_status: status });
  if (error) {
    console.error("setOrderStatus:", error.message);
    return { ok: false, error: error.message };
  }
  redirect(`/admin/orders/${id}?toast=status`);
}
