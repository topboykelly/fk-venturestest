import type { Metadata } from "next";
import { brand } from "@/data/store";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: `%s · ${brand.name} Admin`,
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="admin-shell min-h-svh bg-[var(--admin-canvas)] text-[var(--admin-ink)] antialiased"
      style={
        {
          "--admin-navy": "#0B2A6F",
          "--admin-navy-deep": "#081F54",
          "--admin-soft": "#EEF1F7",
          "--admin-canvas": "#F5F6FA",
          "--admin-ink": "#0F172A",
          "--admin-muted": "#64748B",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
