import { products, type Product } from "@/data/catalog";

export type { Product };

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export function heroProductFrom(list: Product[]) {
  return list.find((p) => p.badge === "bestseller") ?? list[0];
}
