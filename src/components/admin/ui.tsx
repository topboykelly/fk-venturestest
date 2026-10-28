import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/data/store";
import { orderStatuses } from "@/data/store";

export function AdminHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--admin-ink)] md:text-4xl">{title}</h1>
        {description && <p className="mt-1 text-[var(--admin-muted)]">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function Card({
  className,
  tone = "light",
  children,
}: {
  className?: string;
  tone?: "light" | "navy" | "soft";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] p-5 sm:p-6",
        tone === "navy" && "bg-[var(--admin-navy)] text-white shadow-lg shadow-[var(--admin-navy)]/20",
        tone === "soft" && "bg-[var(--admin-soft)] text-[var(--admin-ink)]",
        tone === "light" && "bg-white text-[var(--admin-ink)] shadow-sm shadow-black/5",
        className,
      )}
    >
      {children}
    </div>
  );
}

const statusStyles: Record<OrderStatus, string> = {
  new: "bg-[var(--admin-navy)] text-white",
  confirmed: "bg-[var(--admin-soft)] text-[var(--admin-navy)]",
  dispatched: "bg-amber-100 text-amber-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-black/10 text-[var(--admin-muted)] line-through",
};

export function StatusBadge({ status }: { status: string }) {
  const known = orderStatuses.find((s) => s.id === status);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        known ? statusStyles[known.id] : "bg-black/10 text-[var(--admin-muted)]",
      )}
    >
      {known?.label ?? status}
    </span>
  );
}

export function AdminSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-56 animate-pulse rounded-2xl bg-white" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-[1.75rem] bg-white" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-[1.75rem] bg-white" />
    </div>
  );
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Accra",
});

export function formatDate(value: string) {
  return dateFormat.format(new Date(value));
}

export function internationalPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `233${digits.slice(1)}`;
  return digits;
}

export function AdminButton({
  className,
  variant = "navy",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "navy" | "ghost" | "danger" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50",
        variant === "navy" && "bg-[var(--admin-navy)] text-white hover:bg-[var(--admin-navy-deep)]",
        variant === "ghost" && "bg-white text-[var(--admin-ink)] hover:bg-[var(--admin-soft)]",
        variant === "danger" && "bg-danger/10 text-danger hover:bg-danger/20",
        className,
      )}
      {...props}
    />
  );
}
