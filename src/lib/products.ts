import {
  isShopCollectionSlug,
  type ShopCollectionSlug,
} from "@/lib/shopCategories";
import type { ShopifyImage, ShopifyProduct, ShopifyVariant } from "@/lib/shopify";

export type ProductViewData = {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  category: string;
  collectionHandles: string[];
  collectionSlug: ShopCollectionSlug | null;
  description: string;
  tagline?: string;
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string } | null;
  images: string[];
  /** Preferred card/thumbnail image — usually a lash close-up, not packaging */
  coverImage: string | null;
  available: boolean;
  handle?: string;
  variants: ShopifyVariant[];
  hasMultipleVariants: boolean;
};

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveCollectionSlug(
  handles: string[],
): ShopCollectionSlug | null {
  for (const handle of handles) {
    if (isShopCollectionSlug(handle)) {
      return handle;
    }
  }
  return null;
}

function isSelectableVariant(variant: ShopifyVariant) {
  return variant.title !== "Default Title";
}

function filenameFromUrl(url: string) {
  try {
    return decodeURIComponent(url.split("/").pop()?.split("?")[0] ?? "");
  } catch {
    return url;
  }
}

/**
 * Force a specific media file as the card cover for a product handle.
 * Keys may be a full handle or a handle prefix (e.g. "biker-babe" matches
 * "biker-babe-diy-lash-extension-kit"). Filename match ignores extension.
 */
const COVER_IMAGE_OVERRIDES: Record<string, string> = {
  "she-rises": "sherises3",
  // Current 2nd Shopify photo → cover/first
  "biker-babe": "bikerbabe2",
  "fresita": "fresita3",
};

function getCoverOverrideFilename(handle?: string) {
  if (!handle) return undefined;
  const normalized = handle.toLowerCase();
  if (COVER_IMAGE_OVERRIDES[normalized]) {
    return COVER_IMAGE_OVERRIDES[normalized];
  }
  for (const [key, filename] of Object.entries(COVER_IMAGE_OVERRIDES)) {
    if (normalized === key || normalized.startsWith(`${key}-`)) {
      return filename;
    }
  }
  return undefined;
}

function normalizeFilename(url: string) {
  return filenameFromUrl(url)
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "");
}

function findImageIndexByFilenameFragment(
  images: ShopifyImage[],
  fragment: string,
) {
  const key = fragment.toLowerCase();
  return images.findIndex((image) =>
    normalizeFilename(image.url).includes(key),
  );
}

function isPackagingImage(image: ShopifyImage, index: number) {
  const filename = normalizeFilename(image.url);
  const haystack = `${filename} ${image.altText ?? ""}`.toLowerCase();

  if (/box|package|packaging|container|kit-box|closed|sleeve/.test(haystack)) {
    return true;
  }

  // *1 files are commonly the packaging hero in this catalog
  if (/(\D|^)1$/.test(filename) || /product-?1$/.test(filename)) {
    return true;
  }

  // Shopify's first media is often packaging when no other cues exist
  return index === 0;
}

/**
 * Prefer eyelash / open-tray close-ups over outer packaging for card covers.
 * Later-numbered media files are usually the detail shots in this catalog.
 */
export function pickCoverImageIndex(
  images: ShopifyImage[],
  handle?: string,
): number {
  if (images.length <= 1) return 0;

  const overrideKey = getCoverOverrideFilename(handle);

  if (overrideKey) {
    const overrideIndex = findImageIndexByFilenameFragment(images, overrideKey);
    if (overrideIndex >= 0) {
      return overrideIndex;
    }
  }

  const scored = images.map((image, index) => {
    const filename = normalizeFilename(image.url);
    const haystack = `${filename} ${image.altText ?? ""}`.toLowerCase();
    let score = 0;

    if (/close|open|lash|cluster|detail|wear|eye|swatch|tray|zoom/.test(haystack)) {
      score += 12;
    }

    if (isPackagingImage(image, index)) {
      score -= 12;
    }

    const numberMatch = filename.match(/(\d+)$/);
    if (numberMatch) {
      const n = Number.parseInt(numberMatch[1], 10);
      score += n * 4;
      if (n === 1) {
        score -= 6;
      }
    }

    // Push later gallery images up — usually closer lash shots
    score += index * 3;

    return { index, score };
  });

  scored.sort((a, b) => b.score - a.score || a.index - b.index);
  return scored[0]?.index ?? 0;
}

/**
 * Reorder only: cover first, packaging/container last, other shots in between.
 * Does not remove any images.
 */
function orderImagesWithCoverFirst(
  images: ShopifyImage[],
  handle?: string,
): string[] {
  if (images.length === 0) return [];
  if (images.length === 1) return [images[0].url];

  const coverIndex = pickCoverImageIndex(images, handle);
  const cover = images[coverIndex];

  const packaging: ShopifyImage[] = [];
  const middle: ShopifyImage[] = [];

  images.forEach((image, index) => {
    if (index === coverIndex) return;
    if (isPackagingImage(image, index)) {
      packaging.push(image);
    } else {
      middle.push(image);
    }
  });

  return [cover, ...middle, ...packaging].map((image) => image.url);
}

export function shopifyProductToViewData(
  product: ShopifyProduct,
): ProductViewData {
  const variants = product.variants ?? [];
  const variant =
    variants.find((v) => v.availableForSale) ?? variants[0];
  const collectionHandles = product.collections?.map((c) => c.handle) ?? [];
  const collectionSlug = resolveCollectionSlug(collectionHandles);
  const category =
    product.productType?.trim() ||
    product.collections?.find((c) => isShopCollectionSlug(c.handle))?.title ||
    product.collections?.[0]?.title ||
    "";
  const selectableVariants = variants.filter(isSelectableVariant);
  const hasMultipleVariants =
    selectableVariants.length > 1 ||
    (variants.length > 1 && selectableVariants.length >= 1);

  const orderedImages = orderImagesWithCoverFirst(
    product.images,
    product.handle,
  );

  return {
    id: product.id,
    productId: product.id,
    variantId: variant?.id ?? product.id,
    title: product.title,
    category,
    collectionHandles,
    collectionSlug,
    description: product.description ? stripHtml(product.description) : "",
    price: variant?.price ?? product.priceRange.minVariantPrice,
    compareAtPrice: variant?.compareAtPrice ?? null,
    images: orderedImages,
    coverImage: orderedImages[0] ?? null,
    available: variant?.availableForSale ?? product.availableForSale,
    handle: product.handle,
    variants,
    hasMultipleVariants,
  };
}

export function mapShopProducts(
  shopifyProducts: ShopifyProduct[],
): ProductViewData[] {
  return shopifyProducts.map(shopifyProductToViewData);
}

export function getDefaultVariant(variants: ShopifyVariant[]) {
  return variants.find((variant) => variant.availableForSale) ?? variants[0];
}
