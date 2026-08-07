"use client";

import { Menu, Heart, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import AuthNavControl from "@/components/account/AuthNavControl";
import { useCart } from "@/lib/cartContext";
import { localizedPath } from "@/lib/i18n";
import DesktopHeaderNav from "@/components/layout/DesktopHeaderNav";
import HeaderLogo from "@/components/layout/HeaderLogo";
import SidebarMenu from "@/components/layout/SidebarMenu";
import MarqueeSection from "@/components/sections/MarqueeSection";
import PromoAnnouncementBar from "@/components/promotions/PromoAnnouncementBar";
import SearchOverlay from "@/components/search/SearchOverlay";
import { useTranslation } from "@/lib/useTranslation";
import { useWishlist } from "@/lib/wishlistContext";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, toggleDrawer } = useCart();
  const { itemCount: wishlistCount, isHydrated: wishlistHydrated } =
    useWishlist();
  const { locale, switchLocale, t } = useTranslation();
  const favoritesHref = localizedPath(locale, "/favorites");
  const showWishlistBadge = wishlistHydrated && wishlistCount > 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <PromoAnnouncementBar />

      <SidebarMenu
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div
        className={`border-b border-nightview-light/50 bg-warm-white pt-2 pb-1.5 transition-all duration-300 md:pt-2.5 md:pb-2 lg:pb-0 ${
          scrolled ? "bg-warm-white/92 shadow-[0_4px_24px_rgba(28,23,25,0.06)] backdrop-blur-md" : ""
        }`}
      >
        <div
          className={`site-container grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300 ${
            scrolled
              ? "min-h-14 py-1 md:min-h-16 lg:min-h-16 lg:py-0"
              : "min-h-[5.75rem] py-1.5 sm:min-h-[6.25rem] md:min-h-[6.75rem] lg:h-[5.25rem] lg:py-0"
          }`}
        >
          <div className="flex items-center justify-start gap-0.5 sm:gap-1">
            <button
              type="button"
              className="rounded-md p-2 text-charcoal transition-colors hover:text-mauve lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-expanded={sidebarOpen}
              aria-label={t.aria_open_menu}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-md p-2 text-charcoal transition-colors hover:text-mauve"
              aria-label={t.aria_search}
              aria-expanded={searchOpen}
            >
              <Search className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
            </button>
          </div>

          <HeaderLogo
            href={localizedPath(locale, "/")}
            compact={scrolled}
            ariaLabel={t.aria_logo_home}
            subtitle={t.header_subtitle}
          />

          <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-3">
            <div className="hidden items-center rounded-full border border-nightview/40 px-2.5 py-1 text-xs lg:flex md:px-3 md:py-1.5">
              <button
                type="button"
                onClick={() => switchLocale("en")}
                className={
                  locale === "en"
                    ? "font-semibold text-nightview"
                    : "cursor-pointer text-soft-brown/60 hover:text-nightview"
                }
              >
                EN
              </button>
              <span className="mx-1.5 text-nightview-light">|</span>
              <button
                type="button"
                onClick={() => switchLocale("es")}
                className={
                  locale === "es"
                    ? "font-semibold text-nightview"
                    : "cursor-pointer text-soft-brown/60 hover:text-nightview"
                }
              >
                ES
              </button>
            </div>

            <AuthNavControl variant="header" />
            <Link
              href={favoritesHref}
              className="relative rounded-md p-2 text-charcoal transition-colors hover:text-mauve"
              aria-label={t.aria_favorites}
            >
              <Heart className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
              {showWishlistBadge ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[11px] font-medium text-charcoal">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={toggleDrawer}
              className="relative rounded-md p-2 text-charcoal transition-colors hover:text-mauve"
              aria-label={t.aria_cart}
            >
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[11px] font-medium text-charcoal">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <Suspense fallback={null}>
          <DesktopHeaderNav compact={scrolled} />
        </Suspense>
      </div>

      <MarqueeSection />
    </header>
  );
}
