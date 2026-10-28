import type { OrderStatus } from "@/data/store";

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  line_total: number;
};

export type OrderRow = {
  id: string;
  reference: string;
  status: OrderStatus;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  note: string;
  items: OrderItem[];
  subtotal: number | string;
  total: number | string;
  admin_note: string;
  created_at: string;
};

export function itemCount(order: Pick<OrderRow, "items">) {
  return (order.items ?? []).reduce((n, i) => n + (i.qty || 0), 0);
}
