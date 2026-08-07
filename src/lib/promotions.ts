/**
 * Rise & Bloom promotions — advertising only.
 *
 * Discounts are created and validated in Shopify Admin.
 * This storefront must never calculate discounted totals or
 * invent eligibility. Customers enter codes at Shopify Checkout
 * unless a secure eligibility system is added later.
 *
 * Active Shopify codes:
 * - WELCOME2026 — 10% off entire order, first-time customers only
 * - BLOOMLOCAL10 — 10% off entire order, $25 minimum, local customers
 * - BLOOMDAY — 10% off entire order, birthday promotion
 *
 * Checkout helpers do NOT append discount codes. Customers enter
 * codes at Shopify checkout so non-public offers are not applied
 * without Shopify eligibility checks.
 */

export type PromoVisibility = "public" | "in_store" | "birthday";

export type PromotionId = "welcome2026" | "bloomlocal10" | "bloomday";

export type PromotionDefinition = {
  id: PromotionId;
  code: string;
  visibility: PromoVisibility;
  /** Public routes may advertise this offer */
  advertisePublicly: boolean;
};

export const PROMOTIONS: Record<PromotionId, PromotionDefinition> = {
  welcome2026: {
    id: "welcome2026",
    code: "WELCOME2026",
    visibility: "public",
    advertisePublicly: true,
  },
  bloomlocal10: {
    id: "bloomlocal10",
    code: "BLOOMLOCAL10",
    visibility: "in_store",
    advertisePublicly: false,
  },
  bloomday: {
    id: "bloomday",
    code: "BLOOMDAY",
    visibility: "birthday",
    advertisePublicly: true,
  },
};

export const PROMO_ANNOUNCEMENT_WELCOME_KEY = "rb-promo-welcome2026-bar-v4";
export const PROMO_ANNOUNCEMENT_LOCAL_KEY = "rb-promo-local-bar-v4";
export const PROMO_ANNOUNCEMENT_SHIPPING_KEY = "rb-promo-shipping-bar-v4";
