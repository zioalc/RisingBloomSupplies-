"use client";

import { Heart, Minus, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FinalSaleCheckoutBlock } from "@/components/checkout/FinalSaleCheckoutBlock";
import ProductGallery from "@/components/ui/ProductGallery";
import ProductPrice from "@/components/ui/ProductPrice";
import { useCart } from "@/lib/cartContext";
import { localizedProductCategory } from "@/lib/localizedProductCategory";
import type { ProductViewData } from "@/lib/products";
import { getDefaultVariant } from "@/lib/products";
import type { ShopifyVariant } from "@/lib/shopify";
import { getCheckoutUrl } from "@/lib/utils";
import { useTranslation } from "@/lib/useTranslation";
import { useWishlist } from "@/lib/wishlistContext";

type ProductModalProps = {
  product: ProductViewData | null;
  initialImageIndex?: number;
  onClose: () => void;
};

function shouldShowVariantSelector(variants: ShopifyVariant[]) {
  if (variants.length <= 1) return false;
  return !(variants.length === 1 && variants[0].title === "Default Title");
}

export default function ProductModal({
  product,
  initialImageIndex = 0,
  onClose,
}: ProductModalProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t } = useTranslation();
  const isOpen = product !== null;
  const variants = product?.variants ?? [];
  const saved = product ? isInWishlist(product.productId) : false;

  const [selectedVariant, setSelectedVariant] = useState<
    ShopifyVariant | undefined
  >(undefined);
  const [quantity, setQuantity] = useState(1);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSelectedVariant(getDefaultVariant(product.variants));
    setQuantity(1);
    setDescriptionExpanded(false);
  }, [product]);

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

  const activeVariant = useMemo(() => {
    if (!product) return undefined;
    return selectedVariant ?? getDefaultVariant(product.variants);
  }, [product, selectedVariant]);

  if (!product) return null;

  const showVariantSelector = shouldShowVariantSelector(variants);
  const price = activeVariant?.price ?? product.price;
  const compareAtPrice = activeVariant?.compareAtPrice ?? product.compareAtPrice;
  const isAvailable =
    activeVariant?.availableForSale ?? product.available;
  const description = product.description?.trim() ?? "";
  const descriptionNeedsToggle = description.length > 180;
  const categoryLabel = localizedProductCategory(product, t);

  const handleAddToCart = () => {
    if (!activeVariant || !isAvailable) return;

    addItem({
      productId: product.productId,
      variantId: activeVariant.id,
      title: product.title,
      price: activeVariant.price,
      image: product.images[0] ?? product.coverImage ?? null,
      quantity,
    });
    onClose();
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

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-warm-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-warm-white/90 p-2 text-charcoal shadow-sm transition-colors hover:text-mauve"
          aria-label={t.aria_close}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="grid md:grid-cols-2">
            <div className="overflow-hidden pt-12 md:p-6 md:pt-6">
              <ProductGallery
                images={product.images}
                alt={product.title}
                initialIndex={initialImageIndex}
              />
            </div>

            <div className="flex flex-col p-6 pt-2 md:p-6 md:pt-6">
              {categoryLabel ? (
                <p className="font-sans text-xs uppercase tracking-wide text-rose">
                  {categoryLabel}
                </p>
              ) : null}
              <div
                className={`flex items-start justify-between gap-3 ${
                  categoryLabel ? "mt-2" : ""
                }`}
              >
                <h2
                  id="product-modal-title"
                  className="font-serif text-2xl text-charcoal md:text-3xl"
                >
                  {product.title}
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    toggleWishlist({
                      productId: product.productId,
                      handle: product.handle,
                    })
                  }
                  className="mt-1 shrink-0 rounded-md p-2 text-charcoal transition-colors hover:bg-charcoal/5"
                  aria-label={saved ? t.wishlist_remove : t.wishlist_add}
                  aria-pressed={saved}
                >
                  <Heart
                    className="h-5 w-5"
                    strokeWidth={1.5}
                    fill={saved ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {product.tagline ? (
                <p className="mt-2 text-sm leading-relaxed text-soft-brown md:text-base">
                  {product.tagline}
                </p>
              ) : null}

              <ProductPrice
                className="mt-3"
                price={price}
                compareAtPrice={compareAtPrice}
                size="detail"
                align="left"
              />

              {!isAvailable && (
                <span className="mt-3 inline-block w-fit rounded-full bg-charcoal px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                  {t.sold_out}
                </span>
              )}

              {showVariantSelector ? (
                <div className="mt-5">
                  <label
                    htmlFor="modal-variant-select"
                    className="text-xs uppercase tracking-[0.15em] text-charcoal"
                  >
                    {t.select_option}
                  </label>
                  <select
                    id="modal-variant-select"
                    value={activeVariant?.id ?? ""}
                    onChange={(event) => {
                      const variant = variants.find(
                        (item) => item.id === event.target.value,
                      );
                      if (variant) setSelectedVariant(variant);
                    }}
                    className="mt-2 w-full rounded-lg border border-champagne bg-warm-white px-4 py-3 text-sm text-charcoal focus:border-mauve focus:outline-none focus:ring-1 focus:ring-mauve"
                  >
                    {variants.map((variant) => (
                      <option
                        key={variant.id}
                        value={variant.id}
                        disabled={!variant.availableForSale}
                      >
                        {variant.title}
                        {!variant.availableForSale
                          ? t.variant_sold_out_suffix
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {isAvailable ? (
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.15em] text-charcoal">
                    {t.quantity_label}
                  </p>
                  <div className="mt-2 flex w-fit items-center gap-1 rounded-full border border-champagne px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:text-mauve"
                      aria-label={t.aria_decrease_qty}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[1.5rem] text-center text-sm font-medium text-charcoal">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:text-mauve"
                      aria-label={t.aria_increase_qty}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : null}

              {description ? (
                <div className="mt-5">
                  <p
                    className={`text-sm leading-relaxed text-soft-brown md:text-base ${
                      descriptionExpanded || !descriptionNeedsToggle
                        ? ""
                        : "line-clamp-4"
                    }`}
                  >
                    {description}
                  </p>
                  {descriptionNeedsToggle ? (
                    <button
                      type="button"
                      onClick={() => setDescriptionExpanded((open) => !open)}
                      className="mt-2 text-sm font-medium text-mauve underline-offset-4 transition-colors hover:text-charcoal hover:underline"
                      aria-expanded={descriptionExpanded}
                    >
                      {descriptionExpanded
                        ? t.read_less
                        : `… ${t.read_more}`}
                    </button>
                  ) : null}
                </div>
              ) : null}

              {isAvailable && activeVariant ? (
                <div className="mt-8 space-y-4">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full rounded-full bg-rose px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-nightview-dark hover:text-charcoal"
                  >
                    {t.add_to_cart}
                  </button>

                  <FinalSaleCheckoutBlock
                    checkoutUrl={getCheckoutUrl(activeVariant.id, quantity)}
                    buttonLabel={t.buy_now}
                    buttonClassName="w-full rounded-full border border-rose px-6 py-3 text-center text-sm font-medium text-mauve transition-colors hover:bg-rose hover:text-charcoal"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
