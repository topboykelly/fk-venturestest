import { cn } from "@/lib/cn";

/** Soft accent focus — no harsh black browser outline. */
const control =
  "w-full rounded-2xl border bg-paper px-4 py-3 text-ink outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted/60 focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/15 focus-visible:outline-none";

export function Field({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, "border-ink/10", className)} {...props} />;
}

export function TextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "min-h-28 resize-y border-ink/10", className)} {...props} />;
}
