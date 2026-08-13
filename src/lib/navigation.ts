import { localizedPath, type Locale } from "@/lib/i18n";
import {
  isShopCollectionSlug,
  type ShopCollectionSlug,
} from "@/lib/shopCategories";
import type { Translation } from "@/lib/translations/en";

export type NavLabelKey = keyof Translation;

export type NavLinkItem = {
  type: "link";
  id: string;
  labelKey: NavLabelKey;
  href: (locale: Locale) => string;
};

export type NavSubcategoryItem = {
  id: string;
  labelKey: NavLabelKey;
  collectionSlug: ShopCollectionSlug;
};

export type NavCategoryItem = {
  type: "category";
  id: string;
  labelKey: NavLabelKey;
  collectionSlug: ShopCollectionSlug;
  children: NavSubcategoryItem[];
};

export type NavigationItem = NavLinkItem | NavCategoryItem;

export const MOBILE_NAVIGATION_MENU: NavigationItem[] = [
  {
    type: "link",
    id: "account",
    labelKey: "nav_account",
    href: (locale) => localizedPath(locale, "/account"),
  },
  {
    type: "link",
    id: "favorites",
    labelKey: "nav_favorites",
    href: (locale) => localizedPath(locale, "/favorites"),
  },
  {
    type: "link",
    id: "home",
    labelKey: "nav_home",
    href: (locale) => localizedPath(locale, "/"),
  },
  {
    type: "link",
    id: "nails",
    labelKey: "sidebar_nails",
    href: (locale) => getCollectionHref(locale, "nails"),
  },
  {
    type: "link",
    id: "lashes",
    labelKey: "sidebar_lashes",
    href: (locale) => getCollectionHref(locale, "lashes"),
  },
  {
    type: "link",
    id: "makeup",
    labelKey: "sidebar_makeup",
    href: (locale) => getCollectionHref(locale, "makeup"),
  },
  {
    type: "link",
    id: "tools-accessories",
    labelKey: "sidebar_tools_accessories",
    href: (locale) => getCollectionHref(locale, "tools-accessories"),
  },
  {
    type: "link",
    id: "contact",
    labelKey: "nav_contact",
    href: (locale) => localizedPath(locale, "/contact"),
  },
];

export type DesktopNavLink = {
  id: string;
  labelKey: NavLabelKey;
  href: (locale: Locale) => string;
};

export const DESKTOP_NAVIGATION_LINKS: DesktopNavLink[] = [
  {
    id: "home",
    labelKey: "nav_home",
    href: (locale) => localizedPath(locale, "/"),
  },
  {
    id: "nails",
    labelKey: "sidebar_nails",
    href: (locale) => getCollectionHref(locale, "nails"),
  },
  {
    id: "lashes",
    labelKey: "sidebar_lashes",
    href: (locale) => getCollectionHref(locale, "lashes"),
  },
  {
    id: "makeup",
    labelKey: "sidebar_makeup",
    href: (locale) => getCollectionHref(locale, "makeup"),
  },
  {
    id: "tools-accessories",
    labelKey: "sidebar_tools_accessories",
    href: (locale) => getCollectionHref(locale, "tools-accessories"),
  },
  {
    id: "contact",
    labelKey: "nav_contact",
    href: (locale) => localizedPath(locale, "/contact"),
  },
];

/** @deprecated Use MOBILE_NAVIGATION_MENU */
export const NAVIGATION_MENU = MOBILE_NAVIGATION_MENU;

export function getCollectionHref(
  locale: Locale,
  slug: ShopCollectionSlug,
  navId?: string,
) {
  const base = `${localizedPath(locale, "/shop")}?category=${slug}`;
  return navId ? `${base}&nav=${navId}` : base;
}

const COLLECTION_LABEL_KEYS: Record<ShopCollectionSlug, NavLabelKey> = {
  nails: "sidebar_nails",
  lashes: "sidebar_lashes",
  makeup: "sidebar_makeup",
  "tools-accessories": "sidebar_tools_accessories",
};

export function getShopPageLabelKey(
  category?: string | null,
  navId?: string | null,
): NavLabelKey | null {
  if (navId) {
    for (const item of MOBILE_NAVIGATION_MENU) {
      if (item.type === "category") {
        const child = item.children.find((entry) => entry.id === navId);
        if (child) {
          return child.labelKey;
        }
      }

      if (item.type === "link" && item.id === navId) {
        return item.labelKey;
      }
    }
  }

  if (category && isShopCollectionSlug(category)) {
    return COLLECTION_LABEL_KEYS[category];
  }

  return null;
}

export function getCollectionSlugForCategory(
  categoryId: string,
): ShopCollectionSlug | null {
  const category = MOBILE_NAVIGATION_MENU.find(
    (item): item is NavCategoryItem =>
      item.type === "category" && item.id === categoryId,
  );

  return category?.collectionSlug ?? null;
}
