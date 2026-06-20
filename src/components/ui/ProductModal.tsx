"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/lib/cartContext";
import type { ProductViewData } from "@/lib/products";
import { formatPrice, getCheckoutUrl } from "@/lib/utils";
import { useTranslation } from "@/lib/useTranslation";
import ProductGallery from "./ProductGallery";

type ProductModalProps = {
  product: ProductViewData | null;
  initialImageIndex?: number;
  onClose: () => void;
};

export default function ProductModal({
  product,
  initialImageIndex = 0,
  onClose,
}: ProductModalProps) {
  const { addItem, openDrawer } = useCart();
  const { t } = useTranslation();
  const isOpen = product !== null;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      productId: product.productId,
      variantId: product.variantId,
      title: product.title,
      price: product.price,
      image: product.images[0] ?? null,
    });
    openDrawer();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-warm-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-warm-white/90 p-2 text-charcoal shadow-sm transition-colors hover:text-mauve"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto">
          <div className="grid md:grid-cols-2">
            <div className="overflow-hidden pt-12 md:p-6 md:pt-6">
              <ProductGallery
                images={product.images}
                alt={product.title}
                initialIndex={initialImageIndex}
              />
              {product.images.length > 1 && (
                <p className="mt-2 text-center text-xs text-soft-brown">
                  {t.gallery_swipe_hint}
                </p>
              )}
            </div>

            <div className="flex flex-col p-6 pt-2 md:p-6 md:pt-6">
              <p className="font-sans text-xs uppercase tracking-wide text-rose">
                {product.category === "Full Kit"
                  ? t.product_category_full_kit
                  : product.category}
              </p>
              <h2
                id="product-modal-title"
                className="mt-2 font-serif text-2xl text-charcoal md:text-3xl"
              >
                {product.title}
              </h2>
              <p className="mt-3 font-serif text-xl text-mauve">
                {formatPrice(product.price.amount, product.price.currencyCode)}
              </p>

              {!product.available && (
                <span className="mt-3 inline-block w-fit rounded-full bg-charcoal px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                  {t.sold_out}
                </span>
              )}

              {product.description && (
                <p className="mt-5 text-sm leading-relaxed text-soft-brown md:text-base">
                  {product.description}
                </p>
              )}

              {product.available && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 rounded-full bg-mauve px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal"
                  >
                    {t.add_to_cart}
                  </button>
                  <a
                    href={getCheckoutUrl(product.variantId)}
                    className="flex-1 rounded-full border border-rose px-6 py-3 text-center text-sm font-medium text-mauve transition-colors hover:bg-mauve hover:text-white"
                  >
                    {t.buy_now}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
