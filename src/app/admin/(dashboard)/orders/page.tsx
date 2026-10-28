import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { AdminHeader, AdminSkeleton, Card, StatusBadge, formatDate } from "@/components/admin/ui";
import { orderStatuses, type OrderStatus } from "@/data/store";
import { getAdminSession } from "@/lib/auth";
import { formatCedi } from "@/lib/format";
import { itemCount, type OrderRow } from "@/lib/orders";

export const metadata: Metadata = { title: "Orders" };
export const instant = false;

export default function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Orders searchParams={searchParams} />
    </Suspense>
  );
}

async function Orders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return (
      <div className="flex flex-col gap-6">
        <AdminHeader title="Orders" />
        <SetupNotice />
      </div>
    );
  }

  const { status } = await searchParams;
  const filter = orderStatuses.some((s) => s.id === status) ? (status as OrderStatus) : null;

  let query = session.supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (filter) query = query.eq("status", filter);
  const { data } = await query;
  const orders = (data ?? []) as OrderRow[];

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title="Orders" description={`${orders.length} shown`} />

      <div className="flex flex-wrap gap-2">
        <FilterPill href="/admin/orders" active={!filter} label="All" />
        {orderStatuses.map((s) => (
          <FilterPill key={s.id} href={`/admin/orders?status=${s.id}`} active={filter === s.id} label={s.label} />
        ))}
      </div>

      {orders.length === 0 ? (
        <Card>
          <p className="font-semibold">No orders{filter ? ` with status “${filter}”` : ""}.</p>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">
            Orders appear here when customers place them through the storefront.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[var(--admin-soft)] text-[var(--admin-muted)]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Items</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[var(--admin-soft)]/60">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold hover:text-[var(--admin-navy)]">
                        {o.reference}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      {o.first_name} {o.last_name}
                      <p className="text-xs text-[var(--admin-muted)]">{o.phone}</p>
                    </td>
                    <td className="px-5 py-3">{itemCount(o)}</td>
                    <td className="px-5 py-3 font-semibold">{formatCedi(Number(o.total))}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-[var(--admin-muted)]">{formatDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function FilterPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[var(--admin-navy)] text-white"
          : "bg-white text-[var(--admin-ink)] hover:bg-[var(--admin-soft)]"
      }`}
    >
      {label}
    </Link>
  );
}
