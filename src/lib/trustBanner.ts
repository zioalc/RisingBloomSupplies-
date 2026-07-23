export type TrustBannerItem = {
  id: string;
  icon: "shipping" | "processing" | "pickup";
  titleKey:
    | "trust_shipping_title"
    | "trust_processing_title"
    | "trust_pickup_title";
  bodyKey:
    | "trust_shipping_body"
    | "trust_processing_body"
    | "trust_pickup_body";
};

/** Edit this list to update the homepage trust banner copy later. */
export const TRUST_BANNER_ITEMS: TrustBannerItem[] = [
  {
    id: "shipping",
    icon: "shipping",
    titleKey: "trust_shipping_title",
    bodyKey: "trust_shipping_body",
  },
  {
    id: "pickup",
    icon: "pickup",
    titleKey: "trust_pickup_title",
    bodyKey: "trust_pickup_body",
  },
  {
    id: "processing",
    icon: "processing",
    titleKey: "trust_processing_title",
    bodyKey: "trust_processing_body",
  },
];
