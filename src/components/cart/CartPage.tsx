"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import { brand } from "@/data/store";
import { useCart } from "@/lib/cart";
import { whatsappUrl } from "@/lib/contact";
import { formatCedi } from "@/lib/format";
import { PillLink } from "../ui/Button";
import { ProductImage } from "../ui/ProductImage";
import { QtyStepper } from "../ui/QtyStepper";
import { easeOut } from "../ui/Section";
import { Accent, SectionHeading } from "../ui/SectionHeading";

function orderMessage(
  lines: { product: { name: string; price: number }; qty: number; lineTotal: number }[],
  subtotal: number,
) {
  const rows = lines
    .map((l) => `• ${l.product.name} × ${l.qty} — ${formatCedi(l.lineTotal)}`)
    .join("\n");
  return `Hi ${brand.fullName}, I'd like to place a wholesale order:\n\n${rows}\n\nTotal: ${formatCedi(subtotal)}`;
}

export function CartPage() {
  const { lines, count, subtotal, updateQty, removeItem, clear, ready } = useCart();

  if (!ready) {
    return (
      <section className="relative bg-grid pt-32 pb-20 md:pt-36 md:pb-28">
        <div className="container-page">
          <div className="h-40 animate-pulse rounded-4xl bg-surface" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-grid pt-32 pb-20 md:pt-36 md:pb-28">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <SectionHeading
            label="Review & Order"
            title={
              <>
                Your <Accent>Cart</Accent>
              </>
            }
          />
          <Link href="/#products" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent">
            <ArrowLeft className="size-4" />
            Continue shopping
          </Link>
        </motion.div>

        {lines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex flex-col items-center gap-5 rounded-4xl bg-surface px-6 py-16 text-center dark:ring-1 dark:ring-white/5"
          >
            <span className="grid size-16 place-items-center rounded-full bg-paper text-muted">
              <ShoppingBag className="size-7" />
            </span>
            <p className="text-lg text-muted">Your cart is empty.</p>
            <PillLink href="/#products" variant="dark" arrow>
              Browse products
            </PillLink>
          </motion.div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <ul className="flex flex-col gap-4">
              {lines.map((line) => (
                <li
                  key={line.key}
                  className="flex gap-4 rounded-3xl bg-surface p-4 dark:ring-1 dark:ring-white/5"
                >
                  <Link href={`/product/${line.product.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-2xl">
                    <ProductImage
                      src={line.product.image}
                      alt={line.product.name}
                      sizes="96px"
                      className="size-full rounded-2xl"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/product/${line.product.slug}`} className="font-semibold hover:text-accent">
                      {line.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-accent">{formatCedi(line.product.price)} each</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QtyStepper
                        value={line.qty}
                        onChange={(qty) => updateQty(line.productId, qty)}
                        label={line.product.name}
                      />
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{formatCedi(line.lineTotal)}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(line.productId)}
                          aria-label={`Remove ${line.product.name}`}
                          className="grid size-9 place-items-center rounded-full text-muted hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-4xl bg-surface p-6 dark:ring-1 dark:ring-white/5 lg:sticky lg:top-28">
              <h2 className="text-xl font-semibold">Order summary</h2>
              <p className="mt-1 text-sm text-muted">
                {count} {count === 1 ? "item" : "items"}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 text-lg font-semibold">
                <span>Total</span>
                <span>{formatCedi(subtotal)}</span>
              </div>
              <p className="mt-3 text-sm text-muted">
                Send your order on WhatsApp — we&apos;ll confirm stock and delivery.
              </p>
              <PillLink
                href={whatsappUrl(orderMessage(lines, subtotal))}
                target="_blank"
                rel="noreferrer"
                variant="accent"
                arrow
                className="mt-6 w-full"
              >
                <MessageCircle className="size-4" />
                Order on WhatsApp
              </PillLink>
              <button
                type="button"
                onClick={clear}
                className="mt-3 w-full rounded-full px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-paper hover:text-danger"
              >
                Clear cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
