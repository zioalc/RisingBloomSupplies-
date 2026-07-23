import type { ProductViewData } from "@/lib/products";

/** Shopify collection handles used in the storefront nav/shop filters */
export const SHOP_COLLECTION_SLUGS = [
  "nails",
  "lashes",
  "makeup",
  "tools-accessories",
] as const;

export type ShopCollectionSlug = (typeof SHOP_COLLECTION_SLUGS)[number];

/** Shopify "Home page" collection — featured products on the landing page */
export const FEATURED_COLLECTION_HANDLE = "frontpage";

export function isShopCollectionSlug(
  value: string,
): value is ShopCollectionSlug {
  return SHOP_COLLECTION_SLUGS.includes(value as ShopCollectionSlug);
}

/** @deprecated Use isShopCollectionSlug */
export const isShopCategorySlug = isShopCollectionSlug;

export function filterProductsByCategory(
  products: ProductViewData[],
  category?: string | null,
): ProductViewData[] {
  if (!category || !isShopCollectionSlug(category)) {
    return products;
  }

  return products.filter(
    (product) =>
      product.collectionHandles.includes(category) ||
      product.collectionSlug === category,
  );
}
