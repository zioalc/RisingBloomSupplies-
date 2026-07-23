"use client";

import { CartProvider } from "@/lib/cartContext";
import { WishlistProvider } from "@/lib/wishlistContext";
import CartAddedToast from "@/components/ui/CartAddedToast";
import CartDrawer from "@/components/ui/CartDrawer";

export default function CartProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <CartDrawer />
        <CartAddedToast />
      </WishlistProvider>
    </CartProvider>
  );
}
