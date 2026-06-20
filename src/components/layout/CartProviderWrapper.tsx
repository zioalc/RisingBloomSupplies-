"use client";

import { CartProvider } from "@/lib/cartContext";
import CartDrawer from "@/components/ui/CartDrawer";

export default function CartProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
