import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your wholesale order and send it on WhatsApp.",
};

export default function CartRoute() {
  return <CartPage />;
}
