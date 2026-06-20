"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/lib/cartContext";
import { formatPrice, getMultiItemCheckoutUrl } from "@/lib/utils";
import { useTranslation } from "@/lib/useTranslation";

export default function CartDrawer() {
  const { t } = useTranslation();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const subtotal = items.reduce(
    (total, item) => total + parseFloat(item.price.amount) * item.quantity,
    0,
  );

  const currencyCode = items[0]?.price.currencyCode ?? "USD";
  const checkoutUrl =
    items.length > 0 ? getMultiItemCheckoutUrl(items) : undefined;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-charcoal/40 transition-opacity duration-300 ${
          isDrawerOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
        aria-hidden={!isDrawerOpen}
      />

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-warm-white shadow-xl transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isDrawerOpen}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-champagne/60 px-6 py-4">
          <h2 className="font-serif text-xl text-charcoal">{t.cart_title}</h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-md p-2 text-charcoal transition-colors hover:text-mauve"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6">
            <p className="text-sm text-charcoal/60">{t.cart_empty}</p>
          </div>
        ) : (
          <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            {items.map((item) => (
              <li
                key={item.variantId}
                className="flex gap-4 border-b border-champagne/40 pb-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-warm-white">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-charcoal">
                      {item.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      className="shrink-0 text-charcoal/40 transition-colors hover:text-mauve"
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-1 text-sm text-mauve">
                    {formatPrice(item.price.amount, item.price.currencyCode)}
                  </p>

                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      className="rounded-full border border-champagne p-1 text-charcoal transition-colors hover:border-mauve hover:text-mauve"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm text-charcoal">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                      className="rounded-full border border-champagne p-1 text-charcoal transition-colors hover:border-mauve hover:text-mauve"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-champagne/60 px-6 py-6">
          <div className="flex items-center justify-between">
            <span className="text-sm uppercase tracking-[0.12em] text-charcoal">
              {t.cart_subtotal}
            </span>
            <span className="text-lg font-medium text-mauve">
              {formatPrice(subtotal.toFixed(2), currencyCode)}
            </span>
          </div>

          {checkoutUrl && (
            <a
              href={checkoutUrl}
              className="mt-4 block w-full rounded-full bg-mauve py-3 text-center text-sm font-medium text-white transition-colors hover:bg-charcoal"
            >
              {t.cart_checkout}
            </a>
          )}
        </div>
      </aside>
    </>
  );
}
