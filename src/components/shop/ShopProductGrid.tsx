"use client";

import ProductCatalogRow from "@/components/shop/ProductCatalogRow";
import ProductsEmptyState from "@/components/ui/ProductsEmptyState";
import { localizedPath } from "@/lib/i18n";
import type { ProductViewData } from "@/lib/products";
import { filterProductsByCategory } from "@/lib/shopCategories";
import { useTranslation } from "@/lib/useTranslation";

type ShopProductGridProps = {
  products: ProductViewData[];
  category?: string | null;
  pageHeading?: string;
  /** When true, products are already collection-scoped from the server */
  skipCategoryFilter?: boolean;
};

export default function ShopProductGrid({
  products,
  category,
  pageHeading,
  skipCategoryFilter = false,
}: ShopProductGridProps) {
  const { t, locale } = useTranslation();
  const displayProducts = skipCategoryFilter
    ? products
    : filterProductsByCategory(products, category);

  if (displayProducts.length === 0) {
    return (
      <ProductsEmptyState
        message={
          category ? t.shop_empty_category : t.shop_empty_products
        }
        actions={[
          {
            href: localizedPath(locale, "/shop"),
            label: t.nav_shop_all,
          },
          {
            href: localizedPath(locale, "/"),
            label: t.shop_empty_shop_featured,
          },
        ]}
      />
    );
  }

  return (
    <ProductCatalogRow
      products={displayProducts}
      carouselLabel={pageHeading ?? t.shop_heading}
    />
  );
}
