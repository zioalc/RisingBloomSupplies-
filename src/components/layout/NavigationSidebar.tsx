"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import AuthNavControl from "@/components/account/AuthNavControl";
import {
  getCollectionHref,
  getCollectionSlugForCategory,
  MOBILE_NAVIGATION_MENU,
  type NavCategoryItem,
  type NavLinkItem,
} from "@/lib/navigation";
import { isShopCollectionSlug } from "@/lib/shopCategories";
import { useTranslation } from "@/lib/useTranslation";
import { useWishlist } from "@/lib/wishlistContext";

type NavigationSidebarProps = {
  onNavigate?: () => void;
};

function isCategoryExpandedByDefault(
  categoryId: string,
  activeCollection: string | null,
) {
  if (!activeCollection || !isShopCollectionSlug(activeCollection)) {
    return false;
  }

  return getCollectionSlugForCategory(categoryId) === activeCollection;
}

export default function NavigationSidebar({
  onNavigate,
}: NavigationSidebarProps) {
  const { t, locale, switchLocale } = useTranslation();
  const { itemCount: wishlistCount, isHydrated: wishlistHydrated } =
    useWishlist();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCollection = searchParams.get("category");
  const activeNavId = searchParams.get("nav");
  const showWishlistBadge = wishlistHydrated && wishlistCount > 0;

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const defaults: Record<string, boolean> = {};

    for (const item of MOBILE_NAVIGATION_MENU) {
      if (item.type === "category") {
        defaults[item.id] = isCategoryExpandedByDefault(
          item.id,
          activeCollection,
        );
      }
    }

    setExpandedCategories(defaults);
  }, [activeCollection]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }));
  };

  const rowClass = (isActive: boolean) =>
    `flex min-h-[3.25rem] w-full items-center justify-between px-4 py-3.5 font-sans text-[0.8rem] uppercase tracking-[0.16em] transition-colors ${
      isActive
        ? "bg-nightview-light/35 font-medium text-charcoal"
        : "font-normal text-charcoal/80 hover:bg-nightview-light/20 hover:text-charcoal"
    }`;

  const childLinkClass = (isActive: boolean) =>
    `block px-4 py-2.5 pl-8 font-sans text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${
      isActive
        ? "font-medium text-charcoal"
        : "font-normal text-charcoal/70 hover:text-charcoal"
    }`;

  return (
    <nav className="flex flex-1 flex-col pb-6" aria-label={t.sidebar_menu_title}>
      <ul className="divide-y divide-nightview-light/50">
        {MOBILE_NAVIGATION_MENU.map((item) => {
          if (item.type === "link") {
            const link = item as NavLinkItem;

            if (link.id === "account") {
              return (
                <li key={link.id}>
                  <AuthNavControl variant="mobile" onNavigate={onNavigate} />
                </li>
              );
            }

            const href = link.href(locale);
            const [path, queryString] = href.split("?");
            const isActive = queryString
              ? pathname === path &&
                activeCollection ===
                  new URLSearchParams(queryString).get("category") &&
                (!new URLSearchParams(queryString).get("nav") ||
                  activeNavId ===
                    new URLSearchParams(queryString).get("nav"))
              : pathname === href;

            return (
              <li key={link.id}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={rowClass(isActive)}
                >
                  <span className="flex items-center gap-2">
                    <span>{t[link.labelKey as keyof typeof t]}</span>
                    {link.id === "favorites" && showWishlistBadge ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1.5 text-[11px] font-medium normal-case tracking-normal text-charcoal">
                        {wishlistCount > 99 ? "99+" : wishlistCount}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          }

          const category = item as NavCategoryItem;
          const isExpanded = expandedCategories[category.id] ?? false;
          const categoryHref = getCollectionHref(locale, category.collectionSlug);
          const isCategoryActive =
            pathname.includes("/shop") &&
            activeCollection === category.collectionSlug &&
            !activeNavId;

          return (
            <li key={category.id}>
              <div className={rowClass(isCategoryActive)}>
                <Link
                  href={categoryHref}
                  onClick={onNavigate}
                  className="flex-1 text-left"
                >
                  {t[category.labelKey as keyof typeof t]}
                </Link>
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="ml-2 rounded-md p-1.5 text-nightview transition-colors hover:bg-nightview-light/30"
                  aria-expanded={isExpanded}
                  aria-label={(isExpanded ? t.aria_collapse : t.aria_expand).replace(
                    "{label}",
                    t[category.labelKey as keyof typeof t],
                  )}
                >
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                    strokeWidth={1.75}
                  />
                </button>
              </div>

              {isExpanded ? (
                <ul className="border-t border-nightview-light/30 bg-warm-white/80 py-1">
                  {category.children.map((child) => {
                    const href = getCollectionHref(
                      locale,
                      child.collectionSlug,
                      child.id,
                    );
                    const isActive =
                      activeCollection === child.collectionSlug &&
                      activeNavId === child.id;

                    return (
                      <li key={child.id}>
                        <Link
                          href={href}
                          onClick={onNavigate}
                          className={childLinkClass(isActive)}
                        >
                          {t[child.labelKey as keyof typeof t]}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-nightview-light/50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        <div className="flex items-center justify-center gap-1 rounded-full border border-nightview/40 px-3 py-2 text-xs">
          <button
            type="button"
            onClick={() => {
              switchLocale("en");
              onNavigate?.();
            }}
            className={`min-h-11 min-w-[2.75rem] rounded-md px-2 ${
              locale === "en"
                ? "font-semibold text-nightview"
                : "text-soft-brown/60 hover:text-nightview"
            }`}
          >
            EN
          </button>
          <span className="text-nightview-light" aria-hidden>
            |
          </span>
          <button
            type="button"
            onClick={() => {
              switchLocale("es");
              onNavigate?.();
            }}
            className={`min-h-11 min-w-[2.75rem] rounded-md px-2 ${
              locale === "es"
                ? "font-semibold text-nightview"
                : "text-soft-brown/60 hover:text-nightview"
            }`}
          >
            ES
          </button>
        </div>
      </div>
    </nav>
  );
}
