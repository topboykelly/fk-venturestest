"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Product } from "@/lib/product";

const STORAGE_KEY = "fk_cart";

type StoredLine = { productId: string; qty: number };

export type CartLine = StoredLine & {
  key: string;
  product: Product;
  lineTotal: number;
};

type Toast = { id: number; message: string; ok: boolean };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  isOpen: boolean;
  toast: Toast | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, qty?: number) => boolean;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  notify: (message: string, ok?: boolean) => void;
  dismissToast: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isStoredLine(value: unknown): value is StoredLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.productId === "string" &&
    typeof line.qty === "number" &&
    Number.isInteger(line.qty) &&
    line.qty > 0
  );
}

function readStorage(): StoredLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isStoredLine) : [];
  } catch {
    return [];
  }
}

function writeStorage(next: StoredLine[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

export function CartProvider({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  const [stored, setStored] = useState<StoredLine[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastId = useRef(0);

  useEffect(() => {
    setStored(readStorage());
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStored(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const commit = useCallback((next: StoredLine[]) => {
    setStored(next);
    writeStorage(next);
  }, []);

  const cartLines: CartLine[] = useMemo(
    () =>
      stored
        .map((line) => {
          const product = byId.get(line.productId);
          if (!product) return null;
          return {
            ...line,
            key: line.productId,
            product,
            lineTotal: product.price * line.qty,
          };
        })
        .filter((l): l is CartLine => l !== null),
    [stored, byId],
  );

  const count = cartLines.reduce((n, l) => n + l.qty, 0);
  const subtotal = cartLines.reduce((n, l) => n + l.lineTotal, 0);

  const notify = useCallback((message: string, ok = true) => {
    toastId.current += 1;
    setToast({ id: toastId.current, message, ok });
  }, []);

  const addItem = useCallback(
    (productId: string, qty = 1) => {
      if (!byId.has(productId) || qty < 1) return false;
      setStored((prev) => {
        const existing = prev.find((l) => l.productId === productId);
        const next = existing
          ? prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l))
          : [...prev, { productId, qty }];
        writeStorage(next);
        return next;
      });
      return true;
    },
    [byId],
  );

  const updateQty = useCallback((productId: string, qty: number) => {
    setStored((prev) => {
      const next =
        qty <= 0 ? prev.filter((l) => l.productId !== productId) : prev.map((l) => (l.productId === productId ? { ...l, qty } : l));
      writeStorage(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setStored((prev) => {
      const next = prev.filter((l) => l.productId !== productId);
      writeStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setStored([]);
    writeStorage([]);
  }, []);

  const value: CartContextValue = {
    lines: cartLines,
    count,
    subtotal,
    ready,
    isOpen,
    toast,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    addItem,
    updateQty,
    removeItem,
    clear,
    notify,
    dismissToast: () => setToast(null),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
