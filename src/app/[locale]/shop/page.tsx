import ShopProductGrid from "@/components/shop/ShopProductGrid";
import BackToHomeLink from "@/components/ui/BackToHomeLink";
import type { Locale } from "@/lib/i18n";
import { getShopPageLabelKey } from "@/lib/navigation";
import { mapShopProducts, type ProductViewData } from "@/lib/products";
import { isShopCollectionSlug } from "@/lib/shopCategories";
import { getCollectionProducts, getProducts, localeToShopifyLanguage } from "@/lib/shopify";
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

  let products: ProductViewData[] = [];

  try {
    // Load the Shopify collection directly so new items appear on category pages.
    // Map on the server so the client only receives plain ProductViewData.
    const language = localeToShopifyLanguage(params.locale);
    const shopifyProducts = activeCategory
      ? await getCollectionProducts(activeCategory, 50, language)
      : await getProducts(50, language);
    products = mapShopProducts(shopifyProducts);
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
            /** Products already come from the selected collection when category is set */
            skipCategoryFilter={Boolean(activeCategory)}
          />
        </div>
      </div>
    </div>
  );
}
