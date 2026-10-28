import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { Card } from "@/components/admin/ui";
import { getAdminState } from "@/lib/auth";
import { brand } from "@/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Sign in" };
export const instant = false;

export default async function AdminLoginPage() {
  if (isSupabaseConfigured) {
    const state = await getAdminState();
    if (state.status === "admin") redirect("/admin");
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="hidden lg:block">
          <p className="text-sm font-semibold tracking-wide text-[var(--admin-navy)] uppercase">Admin portal</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Manage {brand.name}
          </h1>
          <p className="mt-4 max-w-md text-[var(--admin-muted)]">
            Update wholesale products, track stock, and follow customer orders — in one calm console.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              { value: "Stock", label: "Live inventory" },
              { value: "Orders", label: "Fulfilment queue" },
              { value: "Prices", label: "Wholesale rates" },
              { value: "Photos", label: "Product media" },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`rounded-[1.5rem] p-5 ${i === 1 ? "bg-[var(--admin-navy)] text-white" : "bg-white shadow-sm"}`}
              >
                <p className="text-xl font-semibold">{item.value}</p>
                <p className={`text-sm ${i === 1 ? "text-white/70" : "text-[var(--admin-muted)]"}`}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md">
          <p className="text-sm font-semibold tracking-wide text-[var(--admin-navy)] uppercase">Welcome back</p>
          <h2 className="mt-2 text-2xl font-semibold">Sign in</h2>
          <p className="mt-1 mb-6 text-sm text-[var(--admin-muted)]">Use your Supabase admin account.</p>
          {isSupabaseConfigured ? <LoginForm /> : <SetupNotice />}
        </Card>
      </div>
    </div>
  );
}
