"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { saveProduct, uploadProductImage } from "@/app/admin/actions";
import { badges, categories, type Badge, type Category } from "@/data/store";
import type { ProductInput, ProductInputErrors } from "@/lib/admin-products";
import { checkProductInput } from "@/lib/admin-products";
import type { Product } from "@/lib/product";
import { AdminButton, Card } from "./ui";
import { Field, Select, TextArea, TextInput } from "../ui/fields";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function emptyProduct(): ProductInput {
  return {
    slug: "",
    name: "",
    category: "water",
    price: 0,
    description: "",
    badge: null,
    images: [],
    stock: 0,
    isActive: true,
    featured: false,
    sortOrder: 0,
  };
}

export function ProductForm({ product }: { product?: Product }) {
  const initial = useMemo<ProductInput>(
    () =>
      product
        ? {
            slug: product.slug,
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description,
            badge: product.badge,
            images: product.images,
            stock: product.stock,
            isActive: product.isActive,
            featured: product.featured,
            sortOrder: product.sortOrder,
          }
        : emptyProduct(),
    [product],
  );

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<ProductInputErrors>({});
  const [serverError, setServerError] = useState("");
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(product));

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const checked = checkProductInput(form);
    setErrors(checked.errors);
    if (Object.keys(checked.errors).length) return;
    setServerError("");
    start(() => {
      void (async () => {
        const result = await saveProduct(checked.product, product?.id);
        if (result && !result.ok) setServerError(result.error);
      })();
    });
  };

  const onUpload = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setUploading(true);
    setServerError("");
    try {
      for (const file of Array.from(fileList)) {
        const data = new FormData();
        data.set("file", file);
        const result = await uploadProductImage(data);
        if (!result.ok) {
          setServerError(result.error);
          break;
        }
        setForm((f) => ({ ...f, images: [...f.images, result.url] }));
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-6">
        <Card className="flex flex-col gap-4">
          <Field id="name" label="Name">
            <TextInput
              id="name"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({
                  ...f,
                  name,
                  slug: slugTouched ? f.slug : slugify(name),
                }));
              }}
              required
            />
            {errors.name && <p className="mt-1 text-sm text-danger">{errors.name}</p>}
          </Field>
          <Field id="slug" label="Slug">
            <TextInput
              id="slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
              required
            />
            {errors.slug && <p className="mt-1 text-sm text-danger">{errors.slug}</p>}
          </Field>
          <Field id="description" label="Description">
            <TextArea
              id="description"
              rows={5}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Photos</h2>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--admin-soft)] px-4 py-2 text-sm font-semibold text-[var(--admin-navy)] hover:bg-[var(--admin-navy)] hover:text-white">
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Upload
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => onUpload(e.target.files)}
              />
            </label>
          </div>
          {errors.images && <p className="text-sm text-danger">{errors.images}</p>}
          {form.images.length === 0 ? (
            <p className="text-sm text-[var(--admin-muted)]">No photos yet. Upload or paste a URL below.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {form.images.map((url) => (
                <li key={url} className="group relative overflow-hidden rounded-2xl bg-[var(--admin-soft)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="aspect-square w-full object-contain p-2" />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-white/90 text-danger opacity-0 shadow transition group-hover:opacity-100"
                    onClick={() => set("images", form.images.filter((u) => u !== url))}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <TextInput
              placeholder="https://… or /images/…"
              id="image-url"
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (!value) return;
                set("images", [...form.images, value]);
                (e.target as HTMLInputElement).value = "";
              }}
            />
            <AdminButton
              type="button"
              variant="ghost"
              onClick={() => {
                const el = document.getElementById("image-url") as HTMLInputElement | null;
                const value = el?.value.trim();
                if (!value) return;
                set("images", [...form.images, value]);
                if (el) el.value = "";
              }}
            >
              <Plus className="size-4" />
              Add
            </AdminButton>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card tone="soft" className="flex flex-col gap-4">
          <Field id="category" label="Category">
            <Select
              id="category"
              value={form.category}
              onChange={(e) => set("category", e.target.value as Category)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
            {errors.category && <p className="mt-1 text-sm text-danger">{errors.category}</p>}
          </Field>
          <Field id="price" label="Wholesale price (GH₵)">
            <TextInput
              id="price"
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
            />
            {errors.price && <p className="mt-1 text-sm text-danger">{errors.price}</p>}
          </Field>
          <Field id="stock" label="Stock (cases / units)">
            <TextInput
              id="stock"
              type="number"
              min={0}
              step={1}
              value={form.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
            />
            {errors.stock && <p className="mt-1 text-sm text-danger">{errors.stock}</p>}
          </Field>
          <Field id="badge" label="Badge">
            <Select
              id="badge"
              value={form.badge ?? ""}
              onChange={(e) => set("badge", (e.target.value || null) as Badge | null)}
            >
              <option value="">None</option>
              {badges.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="sortOrder" label="Sort order">
            <TextInput
              id="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", Number(e.target.value))}
            />
          </Field>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="size-4 rounded border-black/20"
            />
            Active on storefront
          </label>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="size-4 rounded border-black/20"
            />
            Featured
          </label>
        </Card>

        {serverError && (
          <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
            {serverError}
          </p>
        )}

        <AdminButton type="submit" disabled={pending} className="w-full py-3">
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </AdminButton>
      </div>
    </form>
  );
}
