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

