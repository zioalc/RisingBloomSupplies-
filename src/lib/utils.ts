export function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

function getVariantNumericId(variantId: string) {
  return variantId.split("/").pop() ?? variantId;
}

export function getCartUrl(variantId: string) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const numericId = getVariantNumericId(variantId);
  return `https://${domain}/cart/${numericId}:1`;
}

export function getCheckoutUrl(variantId: string) {
  return `${getCartUrl(variantId)}?checkout`;
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
