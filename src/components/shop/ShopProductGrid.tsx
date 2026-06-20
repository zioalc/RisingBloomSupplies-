"use client";

import ProductCatalogRow from "@/components/shop/ProductCatalogRow";
import { mergeShopProducts } from "@/lib/products";
import type { ShopifyProduct } from "@/lib/shopify";
import { useTranslation } from "@/lib/useTranslation";

type ShopProductGridProps = {
  products: ShopifyProduct[];
};

export default function ShopProductGrid({ products }: ShopProductGridProps) {
  const { t } = useTranslation();
  const displayProducts = mergeShopProducts(products);

  return (
    <>
      <ProductCatalogRow
        products={displayProducts}
        carouselLabel={t.shop_heading}
      />

      {products.length === 0 && (
        <p className="mt-4 text-center text-xs text-soft-brown">
          {t.shop_fallback_note}
        </p>
      )}
    </>
  );
}
