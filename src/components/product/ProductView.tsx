"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { categoryLabel } from "@/data/store";
import { useCart } from "@/lib/cart";
import { whatsappUrl } from "@/lib/contact";
import { formatCedi } from "@/lib/format";
import { coverPhoto, type Product } from "@/lib/product";
import { PillButton, PillLink } from "../ui/Button";
import { ProductImage } from "../ui/ProductImage";
import { QtyStepper } from "../ui/QtyStepper";
import { easeOut } from "../ui/Section";
import { WhatsappIcon } from "../ui/SocialIcons";

export function ProductView({ product }: { product: Product }) {
  const { addItem, notify, openCart } = useCart();
  const [qty, setQty] = useState(1);

  const add = () => {
    const ok = addItem(product.id, qty);
    notify(ok ? "Added to cart" : "Could not add item", ok);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easeOut }}
        className="relative overflow-hidden rounded-4xl bg-surface p-4 dark:ring-1 dark:ring-white/5"
      >
        <ProductImage
          src={coverPhoto(product)}
          alt={product.name}
          sizes="(min-width: 1024px) 40vw, 100vw"
          preload
          className="aspect-square rounded-3xl"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
        className="flex flex-col lg:pt-4"
      >
        <p className="text-sm font-medium tracking-wide text-muted uppercase">
          {categoryLabel(product.category)}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{product.name}</h1>
        <p className="mt-4 text-3xl font-semibold text-accent">{formatCedi(product.price)}</p>
        <p className="mt-1 text-sm text-muted">Wholesale case price</p>
        <p className="mt-6 max-w-md text-muted leading-relaxed">{product.description}</p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <QtyStepper value={qty} onChange={setQty} label={product.name} />
          <PillButton variant="dark" arrow onClick={add}>
            Add to cart
          </PillButton>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <PillButton variant="outline" onClick={openCart}>
            View cart
          </PillButton>
          <PillLink
            href={whatsappUrl(`Hi, I'm interested in ${product.name} (wholesale).`)}
            target="_blank"
            rel="noreferrer"
            variant="accent"
            className="gap-2"
          >
            <WhatsappIcon className="size-4" />
            Ask on WhatsApp
          </PillLink>
        </div>
      </motion.div>
    </div>
  );
}
