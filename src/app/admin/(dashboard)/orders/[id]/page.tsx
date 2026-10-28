import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { OrderControls } from "@/components/admin/OrderControls";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { AdminHeader, Card, StatusBadge, formatDate, internationalPhone } from "@/components/admin/ui";
import { getAdminSession } from "@/lib/auth";
import { formatCedi } from "@/lib/format";
import type { OrderRow } from "@/lib/orders";

export const metadata: Metadata = { title: "Order" };
export const instant = false;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAdminSession();
  if (!session) {
    return (
      <div className="flex flex-col gap-6">
        <AdminHeader title="Order" />
        <SetupNotice />
      </div>
    );
  }

  const { data } = await session.supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const order = data as OrderRow;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--admin-navy)]">
          <ArrowLeft className="size-4" />
          All orders
        </Link>
        <AdminHeader
          title={order.reference}
          description={`${formatDate(order.created_at)} · ${order.first_name} ${order.last_name}`}
        >
          <StatusBadge status={order.status} />
        </AdminHeader>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="text-lg font-semibold">Items</h2>
          <ul className="mt-4 divide-y divide-black/5">
            {(order.items ?? []).map((item, i) => (
              <li key={`${item.product_id}-${i}`} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-[var(--admin-muted)]">
                    {item.qty} × {formatCedi(Number(item.price))}
                  </p>
                </div>
                <p className="font-semibold">{formatCedi(Number(item.line_total))}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>{formatCedi(Number(order.total))}</span>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card tone="soft">
            <h2 className="text-lg font-semibold">Customer</h2>
            <p className="mt-3 font-medium">
              {order.first_name} {order.last_name}
            </p>
            <a
              href={`https://wa.me/${internationalPhone(order.phone)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--admin-navy)]"
            >
              <Phone className="size-4" />
              {order.phone}
            </a>
            {order.email && <p className="mt-2 text-sm text-[var(--admin-muted)]">{order.email}</p>}
            {order.note && <p className="mt-4 text-sm">{order.note}</p>}
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold">Fulfilment</h2>
            <OrderControls id={order.id} status={order.status} />
          </Card>
        </div>
      </div>
    </div>
  );
}
