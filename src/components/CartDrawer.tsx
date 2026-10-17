"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { categoryLabel } from "@/data/store";
import { useCart } from "@/lib/cart";
import { formatCedi } from "@/lib/format";
import { PillLink } from "./ui/Button";
import { ProductImage } from "./ui/ProductImage";
import { QtyStepper } from "./ui/QtyStepper";
import { easeOut } from "./ui/Section";

export function CartDrawer() {
  const { isOpen, closeCart, lines, count, subtotal, updateQty, removeItem } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="cart-drawer" className="fixed inset-0 z-[60]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-2xl sm:inset-y-3 sm:right-3 sm:rounded-3xl dark:ring-1 dark:ring-white/10"
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="text-xl font-semibold">
                Your Cart <span className="text-muted">({count})</span>
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="grid size-10 place-items-center rounded-full bg-paper transition-colors hover:bg-accent-soft hover:text-accent"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <span className="grid size-16 place-items-center rounded-full bg-paper text-muted">
                    <ShoppingBag className="size-7" />
                  </span>
                  <p className="text-muted">Your cart is empty.</p>
                  <PillLink href="/#products" variant="dark" onClick={closeCart}>
                    Browse products
                  </PillLink>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {lines.map((line) => (
                    <li key={line.key} className="flex gap-3">
                      <Link
                        href={`/product/${line.product.slug}`}
                        onClick={closeCart}
                        className="relative size-20 shrink-0 overflow-hidden rounded-2xl"
                      >
                        <ProductImage
                          src={line.product.image}
                          alt={line.product.name}
                          sizes="80px"
                          className="size-full rounded-2xl"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="text-xs font-medium tracking-wide text-muted uppercase">
                          {categoryLabel(line.product.category)}
                        </p>
                        <Link
                          href={`/product/${line.product.slug}`}
                          onClick={closeCart}
                          className="truncate font-semibold hover:text-accent"
                        >
                          {line.product.name}
                        </Link>
                        <p className="mt-0.5 text-sm font-medium text-accent">{formatCedi(line.product.price)}</p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <QtyStepper
                            value={line.qty}
                            onChange={(qty) => updateQty(line.productId, qty)}
                            label={line.product.name}
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(line.productId)}
                            aria-label={`Remove ${line.product.name}`}
                            className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-ink/10 px-6 py-5">
                <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>{formatCedi(subtotal)}</span>
                </div>
                <PillLink href="/cart" variant="accent" arrow className="w-full" onClick={closeCart}>
                  Review order
                </PillLink>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
