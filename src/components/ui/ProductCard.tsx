"use client";

import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { useState, type MouseEvent } from "react";
import ProductPrice from "@/components/ui/ProductPrice";
import { isCompareAtSale } from "@/lib/utils";
import { useScrollFade } from "@/lib/useScrollFade";
import { useWishlist } from "@/lib/wishlistContext";
import { useTranslation } from "@/lib/useTranslation";

type ProductCardProps = {
  productId: string;
  handle?: string;
  title: string;
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string } | null;
  tagline?: string;
  image?: string | { url: string; altText: string | null } | null;
  images?: string[];
  availableForSale?: boolean;
  available?: boolean;
  onViewDetails?: (imageIndex?: number) => void;
  onAddToCart?: () => void;
};

function getImageSrc(
  image: ProductCardProps["image"],
): { src: string; alt: string | null } | null {
  if (!image) return null;
  if (typeof image === "string") return { src: image, alt: null };
  return { src: image.url, alt: image.altText };
}

function resolveGallery(
  images: string[] | undefined,
  fallback: ProductCardProps["image"],
): string[] {
  if (images && images.length > 0) return images;
  const single = getImageSrc(fallback);
  return single ? [single.src] : [];
}

export default function ProductCard({
  productId,
  handle,
  title,
  price,
  compareAtPrice,
  tagline,
  image,
  images,
  availableForSale = true,
  available,
  onViewDetails,
  onAddToCart,
}: ProductCardProps) {
  const { t } = useTranslation();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { ref: fadeRef, visible } = useScrollFade<HTMLElement>();
  const isAvailable = available ?? availableForSale;
  const gallery = resolveGallery(images, image);
  const onSale = isCompareAtSale(price, compareAtPrice);
  const saved = isInWishlist(productId);
  const [showingAlt, setShowingAlt] = useState(false);
  const hasAltImage = gallery.length > 1;
  const activeIndex = showingAlt && hasAltImage ? 1 : 0;
  const activeSrc = gallery[activeIndex] ?? gallery[0] ?? null;

  const handleWishlist = (event: MouseEvent) => {
    event.stopPropagation();
    toggleWishlist({ productId, handle });
  };

  const handleAddToCartClick = (event: MouseEvent) => {
    event.stopPropagation();
    onAddToCart?.();
  };

  const openDetails = () => {
    onViewDetails?.(activeIndex);
  };

  const actionButtons = (
    <>
      <button
        type="button"
        onClick={handleWishlist}
        className={`rounded-md p-2.5 transition-colors ${
          saved
            ? "bg-charcoal text-warm-white"
            : "bg-charcoal/80 text-white hover:bg-charcoal"
        }`}
        aria-label={saved ? t.wishlist_remove : t.wishlist_add}
        aria-pressed={saved}
      >
        <Heart
          className="h-4 w-4"
          strokeWidth={1.75}
          fill={saved ? "currentColor" : "none"}
        />
      </button>

      {isAvailable && onAddToCart ? (
        <button
          type="button"
          onClick={handleAddToCartClick}
          className="rounded-md bg-charcoal/80 p-2.5 text-white transition-colors hover:bg-charcoal"
          aria-label={t.add_to_cart}
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={1.75} />
        </button>
      ) : null}
    </>
  );

  return (
    <article
      ref={fadeRef}
      className={`group flex h-full flex-col transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      }`}
    >
      <div
        className="relative aspect-square cursor-pointer overflow-hidden bg-warm-white/40"
        onMouseEnter={() => {
          if (hasAltImage) setShowingAlt(true);
        }}
        onMouseLeave={() => setShowingAlt(false)}
        onClick={openDetails}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openDetails();
          }
        }}
        role={onViewDetails ? "button" : undefined}
        tabIndex={onViewDetails ? 0 : undefined}
        aria-label={onViewDetails ? `${t.view_details}: ${title}` : undefined}
      >
        {activeSrc ? (
          <Image
            src={activeSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-1.5 transition-opacity duration-300 ease-out"
          />
        ) : (
          <div className="absolute inset-0 bg-champagne/40" aria-hidden />
        )}

        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1.5">
          {onSale ? (
            <span className="bg-rose px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-charcoal">
              {t.sale_badge}
            </span>
          ) : null}
          {!isAvailable ? (
            <span className="bg-charcoal px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {t.sold_out}
            </span>
          ) : null}
        </div>

        {/* Desktop hover actions — wishlist + cart only */}
        <div className="pointer-events-none absolute inset-0 z-10 hidden items-end justify-center bg-gradient-to-t from-charcoal/45 via-transparent to-transparent pb-5 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 md:flex">
          <div
            className="flex items-center gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            {actionButtons}
          </div>
        </div>
      </div>

      {/* Mobile / touch actions — always visible below image */}
      <div className="mt-2 flex items-center justify-center gap-2 md:hidden">
        {actionButtons}
      </div>

      <div className="mt-3 px-1 text-center md:mt-3.5">
        <button
          type="button"
          onClick={openDetails}
          className="w-full text-center"
        >
          <h3 className="line-clamp-2 font-sans text-sm font-medium leading-snug text-charcoal transition-colors hover:text-mauve md:text-[0.9375rem]">
            {title}
          </h3>
        </button>

        {tagline ? (
          <p className="mt-1 line-clamp-2 font-sans text-xs leading-relaxed text-soft-brown md:text-sm">
            {tagline}
          </p>
        ) : null}

        <ProductPrice
          className="mt-1"
          price={price}
          compareAtPrice={compareAtPrice}
          size="card"
          align="center"
        />
      </div>
    </article>
  );
}
