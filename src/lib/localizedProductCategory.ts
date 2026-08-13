import type { ProductViewData } from "@/lib/products";
import type { ShopCollectionSlug } from "@/lib/shopCategories";
import type { Translation } from "@/lib/translations/en";

const SLUG_LABEL_KEYS: Record<ShopCollectionSlug, keyof Translation> = {
  nails: "sidebar_nails",
  lashes: "sidebar_lashes",
  makeup: "sidebar_makeup",
  "tools-accessories": "sidebar_tools_accessories",
};

const ENGLISH_TYPE_TO_SLUG: Record<string, ShopCollectionSlug> = {
  nails: "nails",
  nail: "nails",
  lashes: "lashes",
  lash: "lashes",
  makeup: "makeup",
  "tools & accessories": "tools-accessories",
  "tools and accessories": "tools-accessories",
  tools: "tools-accessories",
  accessories: "tools-accessories",
};

export function localizedProductCategory(
  product: Pick<ProductViewData, "collectionSlug" | "category">,
  t: Translation,
): string {
  if (product.collectionSlug) {
    return t[SLUG_LABEL_KEYS[product.collectionSlug]];
  }

  const normalized = product.category.trim().toLowerCase();
  const slug = ENGLISH_TYPE_TO_SLUG[normalized];
  if (slug) return t[SLUG_LABEL_KEYS[slug]];

  return product.category;
}
