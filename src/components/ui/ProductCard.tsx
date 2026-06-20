"use client";

import Image from "next/image";
import { useTranslation } from "@/lib/useTranslation";

type ProductCardProps = {
  title: string;
  price: string;
  image?: string | { url: string; altText: string | null } | null;
  availableForSale?: boolean;
  available?: boolean;
  category?: string;
  variant?: "default" | "featured";
  onViewDetails?: () => void;
  onAddToCart?: () => void;
};

function getImageSrc(
  image: ProductCardProps["image"],
): { src: string; alt: string | null } | null {
  if (!image) return null;
  if (typeof image === "string") return { src: image, alt: null };
  return { src: image.url, alt: image.altText };
}

export default function ProductCard({
  title,
  price,
  image,
  availableForSale = true,
  available,
  category,
  variant = "default",
  onViewDetails,
  onAddToCart,
}: ProductCardProps) {
  const { t } = useTranslation();
  const isAvailable = available ?? availableForSale;
  const imageData = getImageSrc(image);
  const isFeatured = variant === "featured";

  const displayCategory =
    category === "Full Kit" ? t.product_category_full_kit : category;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
        isFeatured
          ? "border border-champagne/60 bg-cream shadow-warm-card hover:shadow-warm-card-hover"
          : "border border-champagne bg-warm-white shadow-warm-card hover:shadow-warm-card-hover"
      }`}
    >
      <button
        type="button"
        onClick={onViewDetails}
        className="group relative block w-full text-left"
        aria-label={`${t.view_details}: ${title}`}
      >
        <div className="relative aspect-square overflow-hidden bg-warm-white">
          {imageData ? (
            <Image
              src={imageData.src}
              alt={imageData.alt ?? title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : null}
          {!isAvailable && (
            <span className="absolute left-3 top-3 rounded-full bg-charcoal px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
              {t.sold_out}
            </span>
          )}
          {onViewDetails && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-warm-white/90 px-3 py-1 text-[10px] uppercase tracking-wider text-mauve opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              {t.tap_for_details}
            </span>
          )}
        </div>
      </button>

      <div className="flex flex-1 flex-col p-4 lg:p-5 xl:p-6">
        {category ? (
          <p
            className={`font-sans text-xs uppercase tracking-wide ${
              isFeatured ? "text-rose" : "text-mauve"
            }`}
          >
            {displayCategory}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onViewDetails}
          className="mt-1 text-left"
        >
          <h3 className="line-clamp-2 min-h-[2.5rem] font-sans text-sm font-medium leading-snug text-charcoal transition-colors hover:text-mauve md:text-base lg:text-lg">
            {title}
          </h3>
        </button>
        <p className="mt-1 block font-serif text-lg font-semibold text-mauve lg:text-xl xl:text-2xl">
          {price}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          {isAvailable && onAddToCart && (
            <button
              type="button"
              onClick={onAddToCart}
              className="w-full rounded-full bg-mauve py-2 text-center font-sans text-sm font-medium text-white transition-colors hover:bg-charcoal"
            >
              {t.add_to_cart}
            </button>
          )}
          {onViewDetails && (
            <button
              type="button"
              onClick={onViewDetails}
              className="w-full rounded-full border border-rose py-2 text-center font-sans text-sm text-mauve transition-colors hover:bg-mauve hover:text-white"
            >
              {t.view_details}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
