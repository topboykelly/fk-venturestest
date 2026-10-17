"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { categoryLabel } from "@/data/store";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatCedi } from "@/lib/format";
import type { Product } from "@/lib/catalog";
import { ProductImage } from "./ui/ProductImage";

export const badgeStyles: Record<NonNullable<Product["badge"]>, string> = {
  new: "bg-accent text-white",
  bestseller: "bg-night text-white dark:ring-1 dark:ring-white/10",
  limited: "bg-surface text-ink",
};

export function ProductCard({ product }: { product: Product }) {
  const { addItem, notify } = useCart();
  const href = `/product/${product.slug}`;

  const quickAdd = () => {
    const added = addItem(product.id);
    notify(added ? "Added to cart" : "Could not add item", added);
  };

  return (
    <article className="group relative flex h-full flex-col rounded-3xl bg-surface p-2.5 transition-shadow duration-300 hover:shadow-xl hover:shadow-accent/10 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent dark:ring-1 dark:ring-white/5">
      <div className="relative">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="aspect-square rounded-2xl"
          imageClassName="transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium capitalize shadow-sm",
                badgeStyles[product.badge],
              )}
            >
              {product.badge}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={quickAdd}
          aria-label={`Add ${product.name} to cart`}
          title="Quick add"
          className="absolute right-3 bottom-3 z-10 grid size-11 place-items-center rounded-full bg-surface text-ink shadow-md transition-all duration-300 group-hover:rotate-90 group-hover:bg-night group-hover:text-white hover:bg-accent!"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          {categoryLabel(product.category)}
        </p>
        <h3 className="mt-1 font-semibold sm:text-lg">
          <Link href={href} className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-baseline justify-between gap-2 pt-2">
          <p className="text-lg font-semibold text-accent">{formatCedi(product.price)}</p>
          <p className="text-xs text-muted">Wholesale</p>
        </div>
      </div>
    </article>
  );
}
