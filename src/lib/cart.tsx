"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Product } from "@/data/catalog";

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

const EMPTY: StoredLine[] = [];
let lines: StoredLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

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

function load() {
  loaded = true;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    lines = Array.isArray(parsed) ? parsed.filter(isStoredLine) : EMPTY;
  } catch {
    lines = EMPTY;
  }
}

function getSnapshot() {
  if (!loaded) load();
  return lines;
}

const getServerSnapshot = () => EMPTY;

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      loaded = false;
      load();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function commit(next: StoredLine[]) {
  lines = next.length ? next : EMPTY;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {}
  listeners.forEach((l) => l());
}

export function CartProvider({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastId = useRef(0);

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

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
      const existing = lines.find((l) => l.productId === productId);
      if (existing) {
        commit(
          lines.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l)),
        );
      } else {
        commit([...lines, { productId, qty }]);
      }
      return true;
    },
    [byId],
  );

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      commit(lines.filter((l) => l.productId !== productId));
      return;
    }
    commit(lines.map((l) => (l.productId === productId ? { ...l, qty } : l)));
  }, []);

  const removeItem = useCallback((productId: string) => {
    commit(lines.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => commit([]), []);

  const value: CartContextValue = {
    lines: cartLines,
    count,
    subtotal,
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
