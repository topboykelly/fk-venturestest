import { PillLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm font-medium tracking-wide text-accent uppercase">404</p>
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Page not found</h1>
      <p className="max-w-md text-muted">That link doesn&apos;t match anything in the shop.</p>
      <PillLink href="/" variant="dark" arrow>
        Back home
      </PillLink>
    </section>
  );
}
