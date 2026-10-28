"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, LayoutDashboard, LogOut, Menu, Package, ReceiptText, X } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { cn } from "@/lib/cn";
import { easeOut } from "../ui/Section";

const links = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/orders", label: "Orders", Icon: ReceiptText },
];

const linkClass = "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors";

export function AdminNav({ showSignOut }: { showSignOut: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const navLinks = (onNavigate?: () => void) => (
    <>
      {links.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          aria-current={isActive(href) ? "page" : undefined}
          className={cn(
            linkClass,
            isActive(href)
              ? "bg-[var(--admin-navy)] text-white"
              : "text-[var(--admin-ink)]/70 hover:bg-[var(--admin-soft)] hover:text-[var(--admin-ink)]",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </Link>
      ))}
      <Link
        href="/"
        target="_blank"
        onClick={onNavigate}
        className={cn(linkClass, "text-[var(--admin-ink)]/70 hover:bg-[var(--admin-soft)]")}
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        View store
      </Link>
    </>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-2 border-r border-black/5 bg-white p-4 lg:flex">
        <Link href="/admin" className="mb-4 flex items-center gap-3 px-2 py-3">
          <span className="grid size-10 place-items-center rounded-full bg-[var(--admin-navy)] text-sm font-bold text-white">
            F.K.
          </span>
          <span>
            <span className="block text-sm font-bold tracking-wide uppercase">F.K. Admin</span>
            <span className="text-xs text-[var(--admin-muted)]">Wholesale console</span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">{navLinks()}</nav>
        {showSignOut && (
          <form action={signOut}>
            <button
              type="submit"
              className={cn(linkClass, "w-full text-[var(--admin-muted)] hover:bg-danger/10 hover:text-danger")}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          </form>
        )}
      </aside>

      <header ref={barRef} className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <span className="grid size-9 place-items-center rounded-full bg-[var(--admin-navy)] text-xs text-white">F.K.</span>
            Admin
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full bg-[var(--admin-soft)]"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: easeOut }}
              className="flex flex-col gap-1 border-t border-black/5 p-3"
            >
              {navLinks(() => setOpen(false))}
              {showSignOut && (
                <form action={signOut}>
                  <button type="submit" className={cn(linkClass, "w-full text-danger")}>
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </form>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
