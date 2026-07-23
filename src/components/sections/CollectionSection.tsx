"use client";

import Link from "next/link";
import ProductCatalogRow from "@/components/shop/ProductCatalogRow";
import type { ProductViewData } from "@/lib/products";
import { useTranslation } from "@/lib/useTranslation";

type CollectionSectionProps = {
  heading: string;
  subtitle?: string;
  products: ProductViewData[];
  viewAllHref: string;
  viewAllLabel?: string;
  alternateBg?: boolean;
  tightTop?: boolean;
};

export default function CollectionSection({
  heading,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel,
  alternateBg = false,
  tightTop = false,
}: CollectionSectionProps) {
  const { t } = useTranslation();

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className={`${
        tightTop
          ? "pt-6 pb-10 md:pt-8 md:pb-12 lg:pt-8 lg:pb-14"
          : "py-10 md:py-12 lg:py-14"
      } ${
        alternateBg
          ? "bg-[#faf4f7]"
          : "bg-gradient-to-b from-warm-white to-[#f7f0f3]"
      }`}
    >
      <div className="site-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-sans text-lg font-medium uppercase tracking-[0.22em] text-charcoal md:text-xl lg:text-2xl lg:tracking-[0.26em]">
            {heading}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-3 max-w-xl font-sans text-xs font-normal leading-relaxed tracking-wide text-soft-brown md:text-sm">
              {subtitle}
            </p>
          ) : null}
          <div
            className="mx-auto mt-5 flex w-14 flex-col gap-[3px]"
            aria-hidden
          >
            <span className="h-px w-full bg-rose/55" />
            <span className="h-px w-full bg-rose/35" />
          </div>
        </div>

        <ProductCatalogRow
          products={products}
          carouselLabel={heading}
          compactTop
        />

        <div className="mt-10 flex justify-center md:mt-12">
          <Link
            href={viewAllHref}
            className="rounded-full border border-charcoal/80 bg-transparent px-8 py-2.5 text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] text-charcoal transition-colors hover:border-rose hover:bg-rose hover:text-charcoal md:px-10 md:text-xs"
          >
            {viewAllLabel ?? t.view_all}
          </Link>
        </div>
      </div>
    </section>
  );
}
