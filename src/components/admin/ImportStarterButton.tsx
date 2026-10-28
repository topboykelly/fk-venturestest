"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { importStarterProducts } from "@/app/admin/actions";
import { AdminButton } from "./ui";

export function ImportStarterButton() {
  const [pending, start] = useTransition();
  return (
    <AdminButton
      type="button"
      disabled={pending}
      onClick={() =>
        start(() => {
          void importStarterProducts();
        })
      }
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Importing…" : "Import starter products"}
    </AdminButton>
  );
}
