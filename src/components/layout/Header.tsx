"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
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
  const { itemCount: wishlistCount } = useWishlist();
  const { locale, t } = useTranslation();

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

  const openSearch = () => {
    setSidebarOpen(false);
    setSearchOpen(true);
  };

  return (
    <header className="sticky top-0 z-50">
      <PromoAnnouncementBar />

      <SidebarMenu
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSearch={openSearch}
      />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div
        className={`border-b border-nightview-light/40 bg-warm-white pt-0.5 pb-1.5 transition-all duration-300 md:pt-2.5 md:pb-2 lg:pb-0 ${
          scrolled
            ? "bg-warm-white/92 shadow-[0_4px_24px_rgba(28,23,25,0.06)] backdrop-blur-md"
            : ""
        }`}
      >
        <div
          className={`site-container grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300 ${
            scrolled
              ? "min-h-14 py-1 md:min-h-16 lg:min-h-16 lg:py-0"
              : "min-h-[5rem] py-1 sm:min-h-[5.75rem] sm:py-1.5 md:min-h-[6.25rem] lg:h-[5.25rem] lg:py-0"
          }`}
        >
          <div className="flex items-center justify-start">
            <button
              type="button"
              className="rounded-md p-2 text-charcoal transition-colors hover:text-charcoal/70"
              onClick={() => setSidebarOpen(true)}
              aria-expanded={sidebarOpen}
              aria-label={t.aria_open_menu}
            >
              <Menu className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
            </button>
          </div>

          <HeaderLogo
            href={localizedPath(locale, "/")}
            compact={scrolled}
            ariaLabel={t.aria_logo_home}
            subtitle={t.header_subtitle}
          />

          <div className="flex items-center justify-end">
            <div className="hidden items-center lg:flex">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="rounded-md p-2 text-charcoal transition-colors hover:text-charcoal/70"
                aria-label={t.aria_search}
                title={t.nav_search}
              >
                <Search className="h-6 w-6" strokeWidth={1.5} />
              </button>

              <AuthNavControl variant="header" />

              <Link
                href={localizedPath(locale, "/favorites")}
                className="relative rounded-md p-2 text-charcoal transition-colors hover:text-charcoal/70"
                aria-label={t.aria_favorites}
                title={t.nav_favorites}
              >
                <Heart className="h-6 w-6" strokeWidth={1.5} />
                {wishlistCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-charcoal px-1 text-[11px] font-medium text-warm-white">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                ) : null}
              </Link>
            </div>

            <button
              type="button"
              onClick={toggleDrawer}
              className="relative rounded-md p-2 text-charcoal transition-colors hover:text-charcoal/70"
              aria-label={t.aria_cart}
              title={t.nav_cart}
            >
              <ShoppingBag
                className="h-5 w-5 md:h-6 md:w-6"
                strokeWidth={1.5}
              />
              {itemCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-charcoal px-1 text-[11px] font-medium text-warm-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
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
