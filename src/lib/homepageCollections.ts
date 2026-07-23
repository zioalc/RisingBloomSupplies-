import {
  FEATURED_COLLECTION_HANDLE,
  type ShopCollectionSlug,
} from "@/lib/shopCategories";
import type { Translation } from "@/lib/translations/en";

export type HomepageCollectionConfig = {
  handle: string;
  headingKey: keyof Translation;
  subtitleKey?: "featured_sub" | "collection_section_sub";
  categorySlug?: ShopCollectionSlug;
  limit: number;
  alternateBg?: boolean;
};

export const HOMEPAGE_COLLECTION_SECTIONS: HomepageCollectionConfig[] = [
  {
    handle: FEATURED_COLLECTION_HANDLE,
    headingKey: "featured_heading",
    subtitleKey: "featured_sub",
    limit: 8,
    alternateBg: false,
  },
  {
    handle: "nails",
    headingKey: "sidebar_nails",
    subtitleKey: "collection_section_sub",
    categorySlug: "nails",
    limit: 8,
    alternateBg: true,
  },
  {
    handle: "lashes",
    headingKey: "sidebar_lashes",
    subtitleKey: "collection_section_sub",
    categorySlug: "lashes",
    limit: 8,
    alternateBg: false,
  },
  {
    handle: "makeup",
    headingKey: "sidebar_makeup",
    subtitleKey: "collection_section_sub",
    categorySlug: "makeup",
    limit: 8,
    alternateBg: true,
  },
  {
    handle: "tools-accessories",
    headingKey: "sidebar_tools_accessories",
    subtitleKey: "collection_section_sub",
    categorySlug: "tools-accessories",
    limit: 8,
    alternateBg: false,
  },
];
