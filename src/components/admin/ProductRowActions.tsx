"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";
import { AdminButton } from "./ui";

export function ProductRowActions({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/products/${id}`}
        className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--admin-soft)] text-[var(--admin-navy)] hover:bg-[var(--admin-navy)] hover:text-white"
        aria-label={`Edit ${name}`}
      >
        <Pencil className="size-4" />
      </Link>
      <AdminButton
        type="button"
        variant="danger"
        className="size-9 px-0"
        disabled={pending}
        aria-label={`Delete ${name}`}
        onClick={() => {
          if (!confirm(`Delete “${name}”? This cannot be undone.`)) return;
          start(() => {
            void deleteProduct(id);
          });
        }}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </AdminButton>
    </div>
  );
}
