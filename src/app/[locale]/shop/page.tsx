import ShopProductGrid from "@/components/shop/ShopProductGrid";
import BackToHomeLink from "@/components/ui/BackToHomeLink";
import type { Locale } from "@/lib/i18n";
import { getShopPageLabelKey } from "@/lib/navigation";
import { isShopCollectionSlug } from "@/lib/shopCategories";
import { getProducts, type ShopifyProduct } from "@/lib/shopify";
import { getTranslation } from "@/lib/translations";
import type { Metadata } from "next";

function resolveShopHeading(
  locale: Locale,
  category?: string,
  navId?: string,
) {
  const t = getTranslation(locale);
  const labelKey = getShopPageLabelKey(category, navId);

  if (labelKey) {
    return t[labelKey];
  }

  return t.shop_heading;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { category?: string; nav?: string };
}): Promise<Metadata> {
  const t = getTranslation(params.locale);
  const heading = resolveShopHeading(
    params.locale,
    searchParams?.category,
    searchParams?.nav,
  );

  return {
    title: `${heading} | Rise & Bloom`,
    description: t.shop_meta_description,
  };
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { category?: string; nav?: string };
}) {
  const t = getTranslation(params.locale);
  const activeCategory =
    searchParams?.category && isShopCollectionSlug(searchParams.category)
      ? searchParams.category
      : null;
  const activeNavId = searchParams?.nav ?? null;
  const labelKey = getShopPageLabelKey(activeCategory, activeNavId);
  const pageHeading = labelKey ? t[labelKey] : t.shop_heading;
  const showShopIntro = !labelKey;

  let products: ShopifyProduct[] = [];

  try {
    products = await getProducts(50);
  } catch {
    products = [];
  }

  return (
    <div className="page-padding products-section-bg">
      <div className="site-container">
        <BackToHomeLink locale={params.locale} className="mb-4 block" />
        <div className="site-container-prose">
          {showShopIntro ? (
            <p className="section-label">{t.shop_label}</p>
          ) : null}
          <h1 className={`section-title ${showShopIntro ? "" : "mt-0"}`}>
            {pageHeading}
          </h1>
          {showShopIntro ? (
            <p className="mt-3 text-sm text-soft-brown md:text-base lg:text-lg">
              {t.shop_sub}
            </p>
          ) : null}
          <div className="section-divider" />
        </div>

        <div className="section-content">
          <ShopProductGrid
            products={products}
            category={activeCategory}
            pageHeading={pageHeading}
          />
        </div>
      </div>
    </div>
  );
}
