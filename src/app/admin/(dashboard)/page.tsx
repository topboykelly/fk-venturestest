import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Package, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { AdminHeader, AdminSkeleton, Card, StatusBadge, formatDate } from "@/components/admin/ui";
import { LOW_STOCK_THRESHOLD } from "@/data/store";
import { getAdminSession } from "@/lib/auth";
import { formatCedi } from "@/lib/format";
import { itemCount, type OrderRow } from "@/lib/orders";
import { productFromRow, type Product, type ProductRow } from "@/lib/product";

export const metadata: Metadata = { title: "Dashboard" };

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const session = await getAdminSession();
  if (!session) {
    return (
      <div className="flex flex-col gap-6">
        <AdminHeader title="Welcome" description="One-time setup to start managing your store." />
        <SetupNotice />
      </div>
    );
  }

  const since = daysAgo(30);
  const [{ data: productRows }, { data: recent }, { data: monthOrders }, { count: newCount }] = await Promise.all([
    session.supabase.from("products").select("*").order("sort_order"),
    session.supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6),
    session.supabase.from("orders").select("total, status").gte("created_at", since),
    session.supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const products = ((productRows ?? []) as ProductRow[])
    .map(productFromRow)
    .filter((p): p is Product => p !== null);
  const orders = (recent ?? []) as OrderRow[];
  const revenue = (monthOrders ?? [])
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const lowStock = products
    .filter((p) => p.isActive && p.stock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock);

  const stats = [
    { label: "New orders", value: String(newCount ?? 0), Icon: ReceiptText, href: "/admin/orders?status=new", tone: "soft" as const },
    { label: "Sales, last 30 days", value: formatCedi(revenue), Icon: Wallet, href: "/admin/orders", tone: "navy" as const },
    { label: "Orders, last 30 days", value: String(monthOrders?.length ?? 0), Icon: TrendingUp, href: "/admin/orders", tone: "soft" as const },
    { label: "Live products", value: String(products.filter((p) => p.isActive).length), Icon: Package, href: "/admin/products", tone: "soft" as const },
  ];

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title="Dashboard" description={`Signed in as ${session.user.email}`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, Icon, href, tone }) => (
          <Link key={label} href={href} className="group">
            <Card tone={tone} className="h-full transition-transform group-hover:-translate-y-0.5">
              <Icon className={`size-5 ${tone === "navy" ? "text-white/80" : "text-[var(--admin-navy)]"}`} />
              <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
              <p className={`text-sm ${tone === "navy" ? "text-white/70" : "text-[var(--admin-muted)]"}`}>{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <Card className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold">Your catalogue is empty.</span>{" "}
            <span className="text-[var(--admin-muted)]">Import starter products or add your first drink.</span>
          </p>
          <Link href="/admin/products" className="font-semibold text-[var(--admin-navy)] hover:underline">
            Go to products
          </Link>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--admin-navy)]">
              All orders <ArrowRight className="size-4" />
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--admin-muted)]">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-black/5">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-2xl px-2 py-3 hover:bg-[var(--admin-soft)]"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {o.reference}{" "}
                        <span className="font-normal text-[var(--admin-muted)]">
                          · {o.first_name} {o.last_name}
                        </span>
                      </p>
                      <p className="text-xs text-[var(--admin-muted)]">
                        {formatDate(o.created_at)} · {itemCount(o)} items
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-semibold">{formatCedi(Number(o.total))}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className="size-5 text-danger" />
            Low stock
          </h2>
          {lowStock.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--admin-muted)]">Everything is well stocked.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-1">
              {lowStock.slice(0, 12).map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-2xl px-2 py-2 text-sm hover:bg-[var(--admin-soft)]"
                  >
                    <span className="min-w-0 truncate">{product.name}</span>
                    <span className={product.stock === 0 ? "font-semibold text-danger" : "font-semibold"}>
                      {product.stock === 0 ? "Sold out" : `${product.stock} left`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
