"use client";

import Link from "next/link";
import { localizedPath } from "@/lib/i18n";
import { useTranslation } from "@/lib/useTranslation";

export default function Footer() {
  const { t, locale } = useTranslation();

  const quickLinks = [
    { label: t.nav_home, href: localizedPath(locale, "/") },
    { label: t.nav_shop, href: localizedPath(locale, "/shop") },
    { label: t.nav_about, href: localizedPath(locale, "/about") },
    { label: t.nav_contact, href: localizedPath(locale, "/contact") },
  ];

  return (
    <footer
      className="mt-auto border-t border-champagne/80"
      style={{
        background:
          "linear-gradient(180deg, #FFFAFB 0%, #FAE5ED 100%)",
      }}
    >
      <div className="site-container grid gap-8 px-0 py-10 md:grid-cols-3 md:gap-8 md:py-12 lg:gap-12 xl:gap-16">
        <div>
          <h2 className="font-serif text-xl italic text-mauve md:text-2xl lg:text-3xl">Rise & Bloom</h2>
          <p className="mt-3 font-sans text-sm text-soft-brown md:text-base lg:text-lg">
            {t.footer_tagline}
          </p>
        </div>

        <div>
          <h3 className="font-sans text-xs uppercase tracking-[0.25em] text-mauve/80">
            {t.footer_links}
          </h3>
          <ul className="mt-4 list-none space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-sm text-soft-brown transition-colors hover:text-mauve"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs uppercase tracking-[0.25em] text-mauve/80">
            {t.footer_connect}
          </h3>
          <ul className="mt-4 list-none space-y-2 font-sans text-sm text-soft-brown">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-mauve"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-mauve"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@risingbloomsupplies.com"
                className="transition-colors hover:text-mauve"
              >
                hello@risingbloomsupplies.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-champagne/60 px-6 py-5">
        <p className="text-center font-sans text-xs text-soft-brown/80">
          {t.footer_copyright}
        </p>
      </div>
    </footer>
  );
}
