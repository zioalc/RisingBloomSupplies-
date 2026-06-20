"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cartContext";
import { localizedPath } from "@/lib/i18n";
import { useTranslation } from "@/lib/useTranslation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, toggleDrawer } = useCart();
  const { t, locale, switchLocale } = useTranslation();

  const navLinks = [
    { label: t.nav_home, href: localizedPath(locale, "/") },
    { label: t.nav_shop, href: localizedPath(locale, "/shop") },
    { label: t.nav_about, href: localizedPath(locale, "/about") },
    { label: t.nav_contact, href: localizedPath(locale, "/contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`border-b border-champagne bg-warm-white transition-all duration-300 ${
          scrolled ? "bg-warm-white/95 shadow-sm backdrop-blur-md" : ""
        }`}
      >
        <div
          className={`site-container flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-14 md:h-16" : "h-16 md:h-[4.5rem] lg:h-20"
          }`}
        >
          <button
            type="button"
            className="rounded-md p-2 text-mauve transition-colors hover:text-rose md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>

          <div className="hidden md:block md:w-20 lg:w-24" aria-hidden />

          <Link href={localizedPath(locale, "/")} className="text-center">
            <span
              className={`block font-serif italic leading-tight text-charcoal transition-all duration-300 ${
                scrolled
                  ? "text-2xl md:text-3xl"
                  : "text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
              }`}
            >
              Rise & Bloom
            </span>
            <span
              className={`mt-0.5 block font-sans uppercase tracking-[0.35em] text-mauve transition-all duration-300 ${
                scrolled
                  ? "text-[10px] md:text-[11px]"
                  : "text-[10px] md:text-xs"
              }`}
            >
              {t.header_subtitle}
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
            <div className="flex items-center rounded-full border border-rose px-2.5 py-1 text-xs md:px-3 md:py-1.5">
              <button
                type="button"
                onClick={() => switchLocale("en")}
                className={
                  locale === "en"
                    ? "font-semibold text-mauve"
                    : "cursor-pointer text-soft-brown/60 hover:text-mauve"
                }
              >
                EN
              </button>
              <span className="mx-1.5 text-blush">|</span>
              <button
                type="button"
                onClick={() => switchLocale("es")}
                className={
                  locale === "es"
                    ? "font-semibold text-mauve"
                    : "cursor-pointer text-soft-brown/60 hover:text-mauve"
                }
              >
                ES
              </button>
            </div>

            <button
              type="button"
              className="rounded-md p-2 text-mauve transition-colors hover:text-rose"
              aria-label="Search"
            >
              <Search className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={toggleDrawer}
              className="relative rounded-md p-2 text-mauve transition-colors hover:text-rose"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-mauve px-1 text-[11px] font-medium text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav
          className="hidden border-t border-champagne md:block"
          aria-label="Main navigation"
        >
          <ul
            className={`site-container flex items-center justify-center gap-8 transition-all duration-300 md:gap-12 lg:gap-16 ${
              scrolled ? "py-2 md:py-2.5" : "py-2.5 md:py-3 lg:py-3.5"
            }`}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-sans font-medium uppercase tracking-wide text-charcoal transition-all duration-300 hover:text-mauve ${
                    scrolled ? "text-xs md:text-sm" : "text-sm md:text-base"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {menuOpen && (
          <nav
            className="border-t border-champagne bg-warm-white md:hidden"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-champagne/60">
                  <Link
                    href={link.href}
                    className="block px-6 py-4 text-base uppercase tracking-wide text-charcoal transition-colors hover:bg-blush/40 hover:text-mauve"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
