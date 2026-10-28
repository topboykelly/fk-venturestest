import { Card } from "./ui";

const steps = [
  "Create a free Supabase project and open the SQL Editor.",
  "Paste and run supabase/schema.sql from this repo.",
  "Authentication → Users: add your admin email/password, then disable public sign-ups.",
  "Run: insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';",
  "Copy .env.example to .env.local and fill NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
  "Restart npm run dev, sign in here, then import starter products.",
];

export function SetupNotice() {
  return (
    <Card className="max-w-2xl">
      <p className="text-sm font-semibold tracking-wide text-[var(--admin-navy)] uppercase">Setup required</p>
      <h2 className="mt-2 text-2xl font-semibold">Connect Supabase to unlock admin</h2>
      <p className="mt-2 text-[var(--admin-muted)]">
        The storefront still works with the built-in catalogue. Follow these steps once to manage products and orders.
      </p>
      <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </Card>
  );
}
