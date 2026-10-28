"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { setOrderStatus } from "@/app/admin/actions";
import { orderStatuses, type OrderStatus } from "@/data/store";
import { AdminButton } from "./ui";

export function OrderControls({ id, status }: { id: string; status: OrderStatus }) {
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="text-sm font-medium text-[var(--admin-muted)]" htmlFor="order-status">
        Status
      </label>
      <select
        id="order-status"
        defaultValue={status}
        disabled={pending || status === "cancelled"}
        onChange={(e) => {
          const next = e.target.value as OrderStatus;
          start(() => {
            void setOrderStatus(id, next);
          });
        }}
        className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold outline-none focus:ring-4 focus:ring-[var(--admin-navy)]/15"
      >
        {orderStatuses.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="size-4 animate-spin text-[var(--admin-navy)]" />}
      {status !== "cancelled" && (
        <AdminButton
          type="button"
          variant="danger"
          disabled={pending}
          onClick={() => {
            if (!confirm("Cancel this order and restore stock?")) return;
            start(() => {
              void setOrderStatus(id, "cancelled");
            });
          }}
        >
          Cancel order
        </AdminButton>
      )}
    </div>
  );
}
