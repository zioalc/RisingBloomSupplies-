"use client";

import ProductCatalogRow from "@/components/shop/ProductCatalogRow";
import { SHOP_CATALOG } from "@/lib/products";
import { useTranslation } from "@/lib/useTranslation";

export default function FeaturedProductsSection() {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-warm-white">
      <div className="site-container">
        <div className="site-container-prose">
          <p className="section-label">{t.featured_label}</p>
          <h2 className="section-title">{t.featured_heading}</h2>
          <p className="mt-3 text-sm text-soft-brown">{t.featured_sub}</p>
          <div className="section-divider" />
        </div>

        <ProductCatalogRow
          products={SHOP_CATALOG}
          variant="featured"
          carouselLabel={t.featured_heading}
        />
      </div>
    </section>
  );
}
