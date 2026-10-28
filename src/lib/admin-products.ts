import { badges, isCategory, type Badge } from "@/data/store";
import type { Product } from "./product";

export type ProductInput = Omit<Product, "id">;

export type ProductInputErrors = Partial<
  Record<"name" | "slug" | "category" | "price" | "images" | "stock", string>
>;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function checkProductInput(input: ProductInput): { product: ProductInput; errors: ProductInputErrors } {
  const errors: ProductInputErrors = {};
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

  const name = text(input.name, 120);
  if (!name) errors.name = "Give the product a name.";

  const slug = text(input.slug, 80).toLowerCase();
  if (!SLUG.test(slug)) errors.slug = "Use lowercase letters, numbers and dashes only.";

  const category = isCategory(String(input.category)) ? input.category : null;
  if (!category) errors.category = "Pick a category.";

  const price = Number(input.price);
  if (!Number.isFinite(price) || price < 0 || price > 1_000_000) errors.price = "Enter a valid price.";

  const images = Array.isArray(input.images)
    ? input.images.filter((url) => typeof url === "string" && (url.startsWith("https://") || url.startsWith("/")))
    : [];
  if (images.length > 12) errors.images = "Use 12 photos or fewer.";

  const stock = Number(input.stock);
  if (!Number.isInteger(stock) || stock < 0 || stock > 100_000) {
    errors.stock = "Stock must be a whole number, 0 or more.";
  }

  const badge = input.badge && badges.includes(input.badge as Badge) ? input.badge : null;
  const sortOrder = Number.isInteger(Number(input.sortOrder)) ? Number(input.sortOrder) : 0;

  return {
    errors,
    product: {
      slug,
      name,
      category: category ?? "water",
      price: Math.round(price * 100) / 100,
      description: text(input.description, 2000),
      badge,
      images,
      stock: Number.isInteger(stock) ? stock : 0,
      isActive: Boolean(input.isActive),
      featured: Boolean(input.featured),
      sortOrder,
    },
  };
}
