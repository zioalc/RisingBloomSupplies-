"use client";

import { Check } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useTranslation } from "@/lib/useTranslation";

export default function CartAddedToast() {
  const { addedToast, dismissAddedToast, openDrawer } = useCart();
  const { t } = useTranslation();

  if (!addedToast) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4 sm:bottom-8"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-full border border-champagne/80 bg-warm-white px-4 py-3 shadow-[0_8px_30px_rgba(28,23,25,0.12)]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose/20 text-charcoal">
          <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-charcoal">
            {t.cart_added_toast}
          </p>
          <p className="truncate text-xs text-soft-brown">{addedToast}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            dismissAddedToast();
            openDrawer();
          }}
          className="shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-mauve transition-colors hover:text-charcoal"
        >
          {t.cart_view}
        </button>
      </div>
    </div>
  );
}
