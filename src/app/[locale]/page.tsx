import CollectionSection from "@/components/sections/CollectionSection";
import TrustBanner from "@/components/sections/TrustBanner";
import { HOMEPAGE_COLLECTION_SECTIONS } from "@/lib/homepageCollections";
import { localizedPath, type Locale } from "@/lib/i18n";
import { mapShopProducts, type ProductViewData } from "@/lib/products";
import { getCollectionProducts } from "@/lib/shopify";
import { getTranslation } from "@/lib/translations";

const SECTION_PRODUCT_LIMIT = 8;

type HomepageSectionData = {
  handle: string;
  heading: string;
  subtitle?: string;
  products: ProductViewData[];
  viewAllHref: string;
  alternateBg: boolean;
};

async function loadCollectionSection(
  locale: Locale,
  config: (typeof HOMEPAGE_COLLECTION_SECTIONS)[number],
): Promise<HomepageSectionData | null> {
  const t = getTranslation(locale);

  try {
    const shopifyProducts = await getCollectionProducts(
      config.handle,
      config.limit ?? SECTION_PRODUCT_LIMIT,
    );
    const products = mapShopProducts(shopifyProducts);

    if (products.length === 0) {
      return null;
    }

    const viewAllHref = config.categorySlug
      ? `${localizedPath(locale, "/shop")}?category=${config.categorySlug}`
      : localizedPath(locale, "/shop");

    const subtitle =
      config.subtitleKey === "featured_sub"
        ? t.featured_sub
        : config.subtitleKey === "collection_section_sub"
          ? t.collection_section_sub
          : undefined;

    return {
      handle: config.handle,
      heading: t[config.headingKey],
      subtitle,
      products,
      viewAllHref,
      alternateBg: config.alternateBg ?? false,
    };
  } catch {
    return null;
  }
}

export default async function Home({
  params,
}: {
  params: { locale: Locale };
}) {
  const sections = (
    await Promise.all(
      HOMEPAGE_COLLECTION_SECTIONS.map((config) =>
        loadCollectionSection(params.locale, config),
      ),
    )
  ).filter((section): section is HomepageSectionData => section !== null);

  return (
    <>
      {sections.map((section, index) => (
        <CollectionSection
          key={section.handle}
          heading={section.heading}
          subtitle={section.subtitle}
          products={section.products}
          viewAllHref={section.viewAllHref}
          alternateBg={section.alternateBg}
          tightTop={index === 0}
        />
      ))}

      <TrustBanner />
    </>
  );
}
