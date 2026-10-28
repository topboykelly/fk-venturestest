import { products as staticProducts } from "./catalog";
import type { Product } from "@/lib/product";

/** Starter catalogue imported into Supabase from /admin, and used when Supabase isn't configured. */
export const starterProducts: Product[] = staticProducts.map((p, i) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  price: p.price,
  description: p.description,
  badge: p.badge ?? null,
  images: p.image ? [p.image] : [],
  stock: 50,
  isActive: true,
  featured: p.badge === "bestseller",
  sortOrder: i,
}));
