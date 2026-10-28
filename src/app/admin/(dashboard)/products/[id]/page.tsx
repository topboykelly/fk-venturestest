import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminHeader } from "@/components/admin/ui";
import { getAdminSession } from "@/lib/auth";
import { productFromRow, type ProductRow } from "@/lib/product";

export const metadata: Metadata = { title: "Edit product" };
export const instant = false;

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAdminSession();
  if (!session) {
    return (
      <div className="flex flex-col gap-6">
        <AdminHeader title="Edit product" />
        <SetupNotice />
      </div>
    );
  }

  const { data } = await session.supabase.from("products").select("*").eq("id", id).maybeSingle();
  const product = data ? productFromRow(data as ProductRow) : null;
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title={product.name} description="Edit wholesale details and stock." />
      <ProductForm product={product} />
    </div>
  );
}
