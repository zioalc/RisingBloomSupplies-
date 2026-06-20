import ShopProductGrid from "@/components/shop/ShopProductGrid";
import { getProducts, type ShopifyProduct } from "@/lib/shopify";
import { getTranslation } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = getTranslation(params.locale);
  return {
    title: t.shop_meta_title,
    description: t.shop_meta_description,
  };
}

export default async function ShopPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const t = getTranslation(params.locale);
  let products: ShopifyProduct[] = [];

  try {
    products = await getProducts(50);
  } catch {
    products = [];
  }

  return (
    <div className="page-padding bg-cream">
      <div className="site-container">
        <div className="site-container-prose">
          <p className="section-label">{t.shop_label}</p>
          <h1 className="section-title">{t.shop_heading}</h1>
          <p className="mt-3 text-sm text-soft-brown md:text-base lg:text-lg">
            {t.shop_sub}
          </p>
          <div className="section-divider" />
        </div>

        <ShopProductGrid products={products} />
      </div>
    </div>
  );
}
