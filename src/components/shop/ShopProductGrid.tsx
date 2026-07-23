"use client";

import ProductCatalogRow from "@/components/shop/ProductCatalogRow";
import ProductsEmptyState from "@/components/ui/ProductsEmptyState";
import { STORE_ADDRESS } from "@/lib/contact";
import { localizedPath } from "@/lib/i18n";
import { filterProductsByCategory } from "@/lib/shopCategories";
import { mapShopProducts } from "@/lib/products";
import type { ShopifyProduct } from "@/lib/shopify";
import { useTranslation } from "@/lib/useTranslation";

type ShopProductGridProps = {
  products: ShopifyProduct[];
  category?: string | null;
  pageHeading?: string;
};

export default function ShopProductGrid({
  products,
  category,
  pageHeading,
}: ShopProductGridProps) {
  const { t, locale } = useTranslation();
  const displayProducts = filterProductsByCategory(
    mapShopProducts(products),
    category,
  );

  if (displayProducts.length === 0) {
    const isCategoryEmpty = Boolean(category) || products.length > 0;

    return (
      <ProductsEmptyState
        title={t.shop_empty_title}
        message={
          isCategoryEmpty ? t.shop_empty_category : t.shop_empty_products
        }
        detail={t.shop_empty_detail}
        actions={[
          {
            href: STORE_ADDRESS.mapsUrl,
            label: t.shop_empty_visit_us,
            external: true,
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
