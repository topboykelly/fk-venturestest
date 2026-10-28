"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { easeOut } from "../ui/Section";

const MESSAGES: Record<string, string> = {
  saved: "Product saved",
  deleted: "Product deleted",
  imported: "Starter products imported",
  status: "Order status updated",
};

export function AdminToast() {
  const params = useSearchParams();
  const router = useRouter();
  const key = params.get("toast");
  const message = key ? MESSAGES[key] : null;

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete("toast");
      router.replace(url.pathname + url.search);
    }, 2500);
    return () => clearTimeout(t);
  }, [message, router]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="flex items-center gap-2 rounded-full bg-[var(--admin-navy)] px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            <Check className="size-4" />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
