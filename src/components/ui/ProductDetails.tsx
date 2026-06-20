"use client";

import { useState } from "react";
import { useCart } from "@/lib/cartContext";
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify";
import { formatPrice, getCheckoutUrl } from "@/lib/utils";
import { useTranslation } from "@/lib/useTranslation";
import ProductGallery from "./ProductGallery";

type ProductDetailsProps = {
  product: ShopifyProduct;
};

function getDefaultVariant(variants: ShopifyVariant[]) {
  return variants.find((variant) => variant.availableForSale) ?? variants[0];
}

function shouldShowVariantSelector(variants: ShopifyVariant[]) {
  if (variants.length <= 1) return false;
  return !(variants.length === 1 && variants[0].title === "Default Title");
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem, openDrawer } = useCart();
  const { t } = useTranslation();
  const variants = product.variants ?? [];
  const [selectedVariant, setSelectedVariant] = useState<
    ShopifyVariant | undefined
  >(() => getDefaultVariant(variants));

  const showVariantSelector = shouldShowVariantSelector(variants);
  const activeVariant = selectedVariant ?? getDefaultVariant(variants);
  const price = activeVariant?.price ?? product.priceRange.minVariantPrice;
  const isAvailable =
    activeVariant?.availableForSale ?? product.availableForSale;
  const galleryImages =
    product.images.length > 0
      ? product.images.map((img) => img.url)
      : ["/images/product-1.png"];

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div>
        <ProductGallery
          images={galleryImages}
          alt={product.title}
        />
        {galleryImages.length > 1 && (
          <p className="mt-2 text-center text-xs text-soft-brown">
            {t.gallery_swipe_hint}
          </p>
        )}
      </div>

      <div>
        <h1 className="font-serif text-3xl text-charcoal md:text-4xl">
          {product.title}
        </h1>

        <p className="mt-3 font-serif text-xl text-mauve">
          {formatPrice(price.amount, price.currencyCode)}
        </p>

        {!isAvailable && (
          <span className="mt-4 inline-block rounded-full bg-charcoal px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
            {t.sold_out}
          </span>
        )}

        {showVariantSelector && (
          <div className="mt-6">
            <label
              htmlFor="variant-select"
              className="text-xs uppercase tracking-[0.15em] text-charcoal"
            >
              {t.select_option}
            </label>
            <select
              id="variant-select"
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
                  {!variant.availableForSale ? t.variant_sold_out_suffix : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {product.description && (
          <div
            className="mt-6 space-y-4 text-sm leading-relaxed text-soft-brown md:text-base [&_a]:text-mauve [&_a]:underline [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-charcoal [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        {activeVariant && isAvailable && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                addItem({
                  productId: product.id,
                  variantId: activeVariant.id,
                  title: product.title,
                  price: activeVariant.price,
                  image: product.images[0]?.url ?? null,
                });
                openDrawer();
              }}
              className="inline-block rounded-full bg-mauve px-8 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-charcoal"
            >
              {t.add_to_cart}
            </button>
            <a
              href={getCheckoutUrl(activeVariant.id)}
              className="inline-block rounded-full border border-rose px-8 py-3 text-center text-sm font-medium text-mauve transition-colors hover:bg-mauve hover:text-white"
            >
              {t.buy_now}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
