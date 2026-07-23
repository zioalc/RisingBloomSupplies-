/**
 * Rise & Bloom promotions — advertising only.
 *
 * Discounts are created and validated in Shopify Admin.
 * This storefront must never calculate discounted totals or
 * invent eligibility. Customers enter codes at Shopify Checkout
 * unless a secure eligibility system is added later.
 *
 * --- Checkout / discount URL notes (Shopify) ---
 * Supported Shopify patterns (not auto-wired in this app):
 * 1. Discount landing URL:
 *    https://{shop}/discount/{CODE}
 *    Stores the code in a cookie, then redirects into the shop.
 * 2. Cart permalink query:
 *    https://{shop}/cart/{variantId}:{qty}?discount={CODE}&checkout
 * 3. Storefront Cart API `cartDiscountCodesUpdate`
 *    (not used — cart is local + checkout permalink today)
 *
 * Current checkout helpers (`getCheckoutUrl`, `getMultiItemCheckoutUrl`)
 * do NOT append discount codes. Customers are instructed to enter the
 * code during Shopify checkout so LOVELOCAL10 / BLOOMBDAY are not
 * applied without eligibility checks.
 */

export type PromoVisibility = "public" | "in_store" | "birthday";

export type PromotionId = "bloom10" | "lovelocal10" | "bloombday";

export type PromotionDefinition = {
  id: PromotionId;
  code: string;
  visibility: PromoVisibility;
  /** Public routes may advertise this offer */
  advertisePublicly: boolean;
};

export const PROMOTIONS: Record<PromotionId, PromotionDefinition> = {
  bloom10: {
    id: "bloom10",
    code: "BLOOM10",
    visibility: "public",
    advertisePublicly: true,
  },
  lovelocal10: {
    id: "lovelocal10",
    code: "LOVELOCAL10",
    visibility: "in_store",
    advertisePublicly: false,
  },
  bloombday: {
    id: "bloombday",
    code: "BLOOMBDAY",
    visibility: "birthday",
    advertisePublicly: true,
  },
};

export const PROMO_ANNOUNCEMENT_BLOOM10_KEY = "rb-promo-bloom10-bar-v3";
export const PROMO_ANNOUNCEMENT_INSTORE_KEY = "rb-promo-instore-bar-v3";
export const PROMO_ANNOUNCEMENT_SHIPPING_KEY = "rb-promo-shipping-bar-v3";

/** @deprecated use PROMO_ANNOUNCEMENT_BLOOM10_KEY */
export const PROMO_ANNOUNCEMENT_STORAGE_KEY = PROMO_ANNOUNCEMENT_BLOOM10_KEY;
