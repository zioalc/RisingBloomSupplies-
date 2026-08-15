import type { Translation } from "@/lib/translations/en";
import { localizedPath, type Locale } from "@/lib/i18n";

export type SupportPageId =
  | "faq"
  | "shipping-policy"
  | "returns-refund-policy"
  | "track-order"
  | "privacy-policy"
  | "terms-and-conditions"
  | "cookie-policy"
  | "accessibility"
  | "brand-notice";

type TranslationKey = keyof Translation;

type SupportPageBlock =
  | { type: "paragraph"; key: TranslationKey }
  | { type: "section"; titleKey: TranslationKey; bodyKey: TranslationKey };

export type SupportPageConfig = {
  id: SupportPageId;
  slug: string;
  metaTitleKey: TranslationKey;
  metaDescKey: TranslationKey;
  titleKey: TranslationKey;
  introKey: TranslationKey;
  blocks: SupportPageBlock[];
};

export const SUPPORT_PAGES: Record<SupportPageId, SupportPageConfig> = {
  faq: {
    id: "faq",
    slug: "faq",
    metaTitleKey: "faq_meta_title",
    metaDescKey: "faq_meta_description",
    titleKey: "faq_title",
    introKey: "faq_intro",
    blocks: [
      { type: "section", titleKey: "faq_q1", bodyKey: "faq_a1" },
      { type: "section", titleKey: "faq_q2", bodyKey: "faq_a2" },
      { type: "section", titleKey: "faq_q3", bodyKey: "faq_a3" },
      { type: "section", titleKey: "faq_q4", bodyKey: "faq_a4" },
      { type: "section", titleKey: "faq_q5", bodyKey: "faq_a5" },
      { type: "section", titleKey: "faq_q6", bodyKey: "faq_a6" },
    ],
  },
  "shipping-policy": {
    id: "shipping-policy",
    slug: "shipping-policy",
    metaTitleKey: "shipping_meta_title",
    metaDescKey: "shipping_meta_description",
    titleKey: "shipping_title",
    introKey: "shipping_intro",
    blocks: [
      { type: "paragraph", key: "shipping_p1" },
      { type: "paragraph", key: "shipping_p2" },
      { type: "paragraph", key: "shipping_p3" },
      { type: "section", titleKey: "shipping_pickup_title", bodyKey: "shipping_pickup_body" },
    ],
  },
  "returns-refund-policy": {
    id: "returns-refund-policy",
    slug: "returns-refund-policy",
    metaTitleKey: "returns_meta_title",
    metaDescKey: "returns_meta_description",
    titleKey: "returns_title",
    introKey: "returns_intro",
    blocks: [
      { type: "paragraph", key: "returns_p1" },
      { type: "paragraph", key: "returns_p2" },
      { type: "paragraph", key: "returns_p3" },
    ],
  },
  "track-order": {
    id: "track-order",
    slug: "track-order",
    metaTitleKey: "track_meta_title",
    metaDescKey: "track_meta_description",
    titleKey: "track_title",
    introKey: "track_intro",
    blocks: [
      { type: "paragraph", key: "track_p1" },
      { type: "paragraph", key: "track_p2" },
    ],
  },
  "privacy-policy": {
    id: "privacy-policy",
    slug: "privacy-policy",
    metaTitleKey: "privacy_meta_title",
    metaDescKey: "privacy_meta_description",
    titleKey: "privacy_title",
    introKey: "privacy_intro",
    blocks: [
      { type: "paragraph", key: "privacy_p1" },
      { type: "paragraph", key: "privacy_p2" },
      { type: "paragraph", key: "privacy_p3" },
    ],
  },
  "terms-and-conditions": {
    id: "terms-and-conditions",
    slug: "terms-and-conditions",
    metaTitleKey: "terms_meta_title",
    metaDescKey: "terms_meta_description",
    titleKey: "terms_title",
    introKey: "terms_intro",
    blocks: [
      { type: "paragraph", key: "terms_p1" },
      { type: "paragraph", key: "terms_p2" },
      { type: "paragraph", key: "terms_p3" },
      {
        type: "section",
        titleKey: "terms_third_party_title",
        bodyKey: "terms_third_party_body",
      },
    ],
  },
  "cookie-policy": {
    id: "cookie-policy",
    slug: "cookie-policy",
    metaTitleKey: "cookie_meta_title",
    metaDescKey: "cookie_meta_description",
    titleKey: "cookie_title",
    introKey: "cookie_intro",
    blocks: [
      { type: "paragraph", key: "cookie_p1" },
      { type: "paragraph", key: "cookie_p2" },
    ],
  },
  accessibility: {
    id: "accessibility",
    slug: "accessibility",
    metaTitleKey: "accessibility_meta_title",
    metaDescKey: "accessibility_meta_description",
    titleKey: "accessibility_title",
    introKey: "accessibility_intro",
    blocks: [
      { type: "paragraph", key: "accessibility_p1" },
      { type: "paragraph", key: "accessibility_p2" },
    ],
  },
  "brand-notice": {
    id: "brand-notice",
    slug: "brand-notice",
    metaTitleKey: "brand_notice_meta_title",
    metaDescKey: "brand_notice_meta_description",
    titleKey: "brand_notice_title",
    introKey: "brand_notice_intro",
    blocks: [
      { type: "paragraph", key: "brand_notice_p1" },
      { type: "paragraph", key: "brand_notice_p2" },
    ],
  },
};

export const CUSTOMER_SUPPORT_LINKS: Array<{
  id: string;
  labelKey: TranslationKey;
  href: (locale: Locale) => string;
  external?: boolean;
}> = [
  {
    id: "contact",
    labelKey: "footer_link_contact",
    href: (locale) => localizedPath(locale, "/contact"),
  },
  {
    id: "faq",
    labelKey: "footer_link_faq",
    href: (locale) => localizedPath(locale, "/faq"),
  },
  {
    id: "shipping",
    labelKey: "footer_link_shipping",
    href: (locale) => localizedPath(locale, "/shipping-policy"),
  },
  {
    id: "returns",
    labelKey: "footer_link_returns",
    href: (locale) => localizedPath(locale, "/returns-refund-policy"),
  },
  {
    id: "track",
    labelKey: "footer_link_track_order",
    href: (locale) => localizedPath(locale, "/track-order"),
  },
];

export const LEGAL_LINKS: Array<{
  id: string;
  labelKey: TranslationKey;
  href: (locale: Locale) => string;
}> = [
  {
    id: "privacy",
    labelKey: "footer_link_privacy",
    href: (locale) => localizedPath(locale, "/privacy-policy"),
  },
  {
    id: "terms",
    labelKey: "footer_link_terms",
    href: (locale) => localizedPath(locale, "/terms-and-conditions"),
  },
  {
    id: "cookies",
    labelKey: "footer_link_cookies",
    href: (locale) => localizedPath(locale, "/cookie-policy"),
  },
  {
    id: "accessibility",
    labelKey: "footer_link_accessibility",
    href: (locale) => localizedPath(locale, "/accessibility"),
  },
  {
    id: "brand-notice",
    labelKey: "footer_link_brand_notice",
    href: (locale) => localizedPath(locale, "/brand-notice"),
  },
  {
    id: "promotion-terms",
    labelKey: "footer_link_promo_terms",
    href: (locale) => localizedPath(locale, "/promotion-terms"),
  },
];

export function getSupportPageBySlug(
  slug: string,
): SupportPageConfig | undefined {
  return Object.values(SUPPORT_PAGES).find((page) => page.slug === slug);
}
