import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ImportStarterButton } from "@/components/admin/ImportStarterButton";
import { ProductRowActions } from "@/components/admin/ProductRowActions";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { AdminHeader, AdminSkeleton, Card } from "@/components/admin/ui";
import { categoryLabel } from "@/data/store";
import { getAdminSession } from "@/lib/auth";
import { formatCedi } from "@/lib/format";
import { coverPhoto, productFromRow, type Product, type ProductRow } from "@/lib/product";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Products />
    </Suspense>
  );
}

async function Products() {
  const session = await getAdminSession();
  if (!session) {
    return (
      <div className="flex flex-col gap-6">
        <AdminHeader title="Products" />
        <SetupNotice />
      </div>
    );
  }

  const { data } = await session.supabase.from("products").select("*").order("sort_order").order("created_at");
  const products = ((data ?? []) as ProductRow[]).map(productFromRow).filter((p): p is Product => p !== null);

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title="Products" description={`${products.length} in catalogue`}>
        <ImportStarterButton />
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-navy)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--admin-navy-deep)]"
        >
          <Plus className="size-4" />
          Add product
        </Link>
      </AdminHeader>

      {products.length === 0 ? (
        <Card>
          <p className="font-semibold">No products yet.</p>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">Import the starter catalogue or create one manually.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[var(--admin-soft)] text-[var(--admin-muted)]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Stock</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {products.map((p) => {
                  const photo = coverPhoto(p);
                  return (
                    <tr key={p.id} className="hover:bg-[var(--admin-soft)]/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 overflow-hidden rounded-2xl bg-[var(--admin-soft)]">
                            {photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={photo} alt="" className="size-full object-contain p-1" />
                            ) : null}
                          </div>
                          <div>
                            <Link href={`/admin/products/${p.id}`} className="font-semibold hover:text-[var(--admin-navy)]">
                              {p.name}
                            </Link>
                            <p className="text-xs text-[var(--admin-muted)]">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">{categoryLabel(p.category)}</td>
                      <td className="px-5 py-3 font-semibold">{formatCedi(p.price)}</td>
                      <td className="px-5 py-3">{p.stock}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            p.isActive ? "bg-emerald-100 text-emerald-800" : "bg-black/10 text-[var(--admin-muted)]"
                          }`}
                        >
                          {p.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <ProductRowActions id={p.id} name={p.name} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
