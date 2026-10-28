import { Suspense } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminToast } from "@/components/admin/AdminToast";
import { getAdminState } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

async function Nav() {
  const state = isSupabaseConfigured ? await getAdminState() : { status: "unconfigured" as const };
  const showSignOut = state.status === "admin" || state.status === "not-admin";
  return <AdminNav showSignOut={showSignOut} />;
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <Suspense fallback={<aside className="hidden h-svh w-64 shrink-0 bg-white lg:block" />}>
        <Nav />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </div>
  );
}
