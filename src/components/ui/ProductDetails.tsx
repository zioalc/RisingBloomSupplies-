"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cartContext";
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify";
import { FinalSaleCheckoutBlock } from "@/components/checkout/FinalSaleCheckoutBlock";
import ProductGallery from "@/components/ui/ProductGallery";
import ProductPrice from "@/components/ui/ProductPrice";
import { getCheckoutUrl } from "@/lib/utils";
import { useTranslation } from "@/lib/useTranslation";
import { useWishlist } from "@/lib/wishlistContext";

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
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t } = useTranslation();
  const variants = product.variants ?? [];
  const saved = isInWishlist(product.id);
  const [selectedVariant, setSelectedVariant] = useState<
    ShopifyVariant | undefined
  >(() => getDefaultVariant(variants));

  const showVariantSelector = shouldShowVariantSelector(variants);
  const activeVariant = selectedVariant ?? getDefaultVariant(variants);
  const price = activeVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAtPrice = activeVariant?.compareAtPrice ?? null;
  const isAvailable =
    activeVariant?.availableForSale ?? product.availableForSale;
  const galleryImages = product.images.map((img) => img.url);

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div>
        <ProductGallery
          images={galleryImages}
          alt={product.title}
        />
      </div>

      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-serif text-3xl text-charcoal md:text-4xl">
            {product.title}
          </h1>
          <button
            type="button"
            onClick={() =>
              toggleWishlist({
                productId: product.id,
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

        <ProductPrice
          className="mt-3"
          price={price}
          compareAtPrice={compareAtPrice}
          size="detail"
          align="left"
        />

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
          <div className="mt-8 space-y-4">
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
              }}
              className="inline-block w-full rounded-full bg-rose px-8 py-3 text-center text-sm font-medium text-charcoal transition-colors hover:bg-nightview-dark hover:text-charcoal sm:w-auto"
            >
              {t.add_to_cart}
            </button>

            <FinalSaleCheckoutBlock
              checkoutUrl={getCheckoutUrl(activeVariant.id)}
              buttonLabel={t.buy_now}
              buttonClassName="inline-block w-full rounded-full border border-rose px-8 py-3 text-center text-sm font-medium text-mauve transition-colors hover:bg-rose hover:text-charcoal sm:w-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}
