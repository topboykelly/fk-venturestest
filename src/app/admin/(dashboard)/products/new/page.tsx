import type { Metadata } from "next";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminHeader } from "@/components/admin/ui";
import { getAdminSession } from "@/lib/auth";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  const session = await getAdminSession();
  if (!session) {
    return (
      <div className="flex flex-col gap-6">
        <AdminHeader title="New product" />
        <SetupNotice />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title="New product" description="Add a wholesale drink to the catalogue." />
      <ProductForm />
    </div>
  );
}
