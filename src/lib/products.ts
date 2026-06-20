import type { ShopifyProduct } from "@/lib/shopify";

export type ProductViewData = {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  category: string;
  description: string;
  price: { amount: string; currencyCode: string };
  images: string[];
  available: boolean;
  handle?: string;
};

const variantBase =
  process.env.NEXT_PUBLIC_FEATURED_VARIANT_ID ??
  "gid://shopify/ProductVariant/featured";

export const CATALOG_TITLE = "DIY Lash Extension Kit — Blink With Purpose";
export const CATALOG_PRICE = { amount: "19.99", currencyCode: "USD" } as const;
export const CATALOG_DESCRIPTION =
  "Brenda's signature DIY lash cluster kit — everything you need for full, fluttery lashes at home. Includes premium lash clusters, bond & seal, applicator tweezers, and step-by-step instructions.";

export const FEATURED_LASH_KIT: ProductViewData = {
  id: "blink-with-purpose-kit",
  productId: "featured-blink-with-purpose",
  variantId: variantBase,
  title: CATALOG_TITLE,
  category: "Full Kit",
  description: CATALOG_DESCRIPTION,
  price: { ...CATALOG_PRICE },
  images: [
    "/images/product-1.png",
    "/images/product-2.png",
    "/images/product-3.png",
  ],
  available: true,
};

const catalogImageSets = [
  ["/images/product-1.png", "/images/product-2.png", "/images/product-3.png"],
  ["/images/product-2.png", "/images/product-3.png", "/images/product-1.png"],
  ["/images/product-3.png", "/images/product-1.png", "/images/product-2.png"],
  ["/images/product-1.png", "/images/product-3.png"],
  ["/images/product-2.png", "/images/product-1.png"],
  ["/images/product-3.png", "/images/product-2.png"],
  ["/images/product-1.png", "/images/product-2.png"],
  ["/images/product-2.png", "/images/product-3.png"],
];

/** Brenda's shop catalog — placeholder items until real products are added */
export const SHOP_CATALOG: ProductViewData[] = catalogImageSets.map(
  (images, index) => ({
    id: `blink-with-purpose-kit-${index + 1}`,
    productId: `featured-blink-with-purpose-${index + 1}`,
    variantId: index === 0 ? variantBase : `${variantBase}-${index + 1}`,
    title: CATALOG_TITLE,
    category: "Full Kit",
    description: CATALOG_DESCRIPTION,
    price: { ...CATALOG_PRICE },
    images,
    available: true,
  }),
);

export function shopifyProductToViewData(
  product: ShopifyProduct,
): ProductViewData {
  const variant =
    product.variants?.find((v) => v.availableForSale) ?? product.variants?.[0];

  return {
    id: product.id,
    productId: product.id,
    variantId: variant?.id ?? product.id,
    title: product.title,
    category: "Full Kit",
    description:
      product.description
        ?.replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim() || CATALOG_DESCRIPTION,
    price: variant?.price ?? product.priceRange.minVariantPrice,
    images: product.images.length
      ? product.images.map((img) => img.url)
      : ["/images/product-1.png"],
    available: variant?.availableForSale ?? product.availableForSale,
    handle: product.handle,
  };
}

export function mergeShopProducts(
  shopifyProducts: ShopifyProduct[],
): ProductViewData[] {
  if (shopifyProducts.length === 0) {
    return SHOP_CATALOG;
  }

  const shopifyItems = shopifyProducts.map(shopifyProductToViewData);
  const shopifyIds = new Set(shopifyItems.map((p) => p.id));
  const catalogOnly = SHOP_CATALOG.filter((p) => !shopifyIds.has(p.id));

  return [...shopifyItems, ...catalogOnly];
}
