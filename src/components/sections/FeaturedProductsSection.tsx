"use client";

import CollectionSection from "@/components/sections/CollectionSection";
import type { ProductViewData } from "@/lib/products";
import { localizedPath } from "@/lib/i18n";
import { useTranslation } from "@/lib/useTranslation";

type FeaturedProductsSectionProps = {
  products: ProductViewData[];
};

/** Kept for reuse; homepage now renders CollectionSection directly. */
export default function FeaturedProductsSection({
  products,
}: FeaturedProductsSectionProps) {
  const { t, locale } = useTranslation();

  return (
    <CollectionSection
      heading={t.featured_heading}
      subtitle={t.featured_sub}
      products={products}
      viewAllHref={localizedPath(locale, "/shop")}
    />
  );
}
