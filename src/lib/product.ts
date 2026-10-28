import { badges, isCategory, type Badge, type Category } from "@/data/store";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  badge: Badge | null;
  images: string[];
  stock: number;
  isActive: boolean;
  featured: boolean;
  sortOrder: number;
};

export function coverPhoto(product: Pick<Product, "images">) {
  return product.images[0] ?? "";
}

export function heroProductFrom(products: Product[]) {
  return products.find((p) => p.featured && p.badge === "bestseller")
    ?? products.find((p) => p.featured)
    ?? products.find((p) => p.badge === "bestseller")
    ?? products[0]
    ?? null;
}

export function isSoldOut(product: Pick<Product, "stock">) {
  return product.stock <= 0;
}

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number | string;
  description: string;
  badge: string | null;
  images: string[] | null;
  stock: number;
  is_active: boolean;
  featured: boolean;
  sort_order: number;
};

export function productFromRow(row: ProductRow): Product | null {
  if (!isCategory(row.category)) return null;
  const badge = row.badge && badges.includes(row.badge as Badge) ? (row.badge as Badge) : null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    description: row.description ?? "",
    badge,
    images: Array.isArray(row.images) ? row.images.filter(Boolean) : [],
    stock: Math.max(0, Number(row.stock) || 0),
    isActive: Boolean(row.is_active),
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order) || 0,
  };
}

export function productToRow(product: Omit<Product, "id"> & { id?: string }) {
  return {
    ...(product.id ? { id: product.id } : {}),
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    badge: product.badge,
    images: product.images,
    stock: product.stock,
    is_active: product.isActive,
    featured: product.featured,
    sort_order: product.sortOrder,
  };
}
