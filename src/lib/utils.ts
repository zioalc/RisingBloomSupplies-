import type { Locale } from "@/lib/i18n";

export function formatPrice(
  amount: string,
  currencyCode: string,
  locale: Locale = "en",
) {
  const numberLocale = locale === "es" ? "es-US" : "en-US";
  return new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export function isCompareAtSale(
  price: { amount: string },
  compareAtPrice?: { amount: string } | null,
): boolean {
  if (!compareAtPrice?.amount) return false;
  return parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
}

function getVariantNumericId(variantId: string) {
  return variantId.split("/").pop() ?? variantId;
}

export function getCartUrl(variantId: string, quantity = 1) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const numericId = getVariantNumericId(variantId);
  const safeQuantity = Math.max(1, Math.floor(quantity));
  return `https://${domain}/cart/${numericId}:${safeQuantity}`;
}

export function getCheckoutUrl(variantId: string, quantity = 1) {
  return `${getCartUrl(variantId, quantity)}?checkout`;
}

export function getMultiItemCheckoutUrl(
  items: Array<{ variantId: string; quantity: number }>,
) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const cartLine = items
    .map(
      ({ variantId, quantity }) =>
        `${getVariantNumericId(variantId)}:${quantity}`,
    )
    .join(",");
  return `https://${domain}/cart/${cartLine}?checkout`;
}
