"use client";

import Image from "next/image";
import Link from "next/link";
import ShopHours from "@/components/layout/ShopHours";
import StoreLocation from "@/components/layout/StoreLocation";
import {
  STORE_EMAIL,
  STORE_PHONE,
  SOCIAL_LINKS,
} from "@/lib/contact";
import { localizedPath } from "@/lib/i18n";
import {
  CUSTOMER_SUPPORT_LINKS,
  LEGAL_LINKS,
} from "@/lib/supportPages";
import { useTranslation } from "@/lib/useTranslation";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

export default function Footer() {
  const { t, locale } = useTranslation();

  const headingClass =
    "font-serif text-xs font-bold uppercase tracking-[0.16em] text-charcoal md:text-sm md:tracking-[0.18em]";
  const linkClass =
    "font-sans text-xs text-charcoal/75 transition-colors hover:text-charcoal md:text-sm";
  const textClass =
    "font-sans text-xs leading-relaxed text-charcoal/75 md:text-sm";

  const socialLinks = [
    {
      label: "Instagram",
      href: SOCIAL_LINKS.instagram,
      icon: InstagramIcon,
    },
    {
      label: "TikTok",
      href: SOCIAL_LINKS.tiktok,
      icon: TikTokIcon,
    },
  ] as const;

  return (
    <footer className="mt-auto border-t border-champagne/70 bg-gradient-to-b from-warm-white to-[#EBE0E5]">
      <div className="site-container py-5 md:py-10 lg:py-12">
        <div className="grid gap-5 md:gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-8 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col items-center text-center md:col-span-2 md:items-start md:text-left lg:col-span-4">
            <Link
              href={localizedPath(locale, "/")}
              className="inline-flex w-full max-w-[11rem] flex-col items-center sm:max-w-[14rem] md:max-w-[16rem] md:items-start"
              aria-label={t.aria_logo_home}
            >
              <Image
                src="/images/rise-bloom-logo.png"
                alt="Rise & Bloom"
                width={320}
                height={100}
                className="h-8 w-full object-contain object-left sm:h-10 md:h-12"
              />
              <span className="logo-display mt-1 w-full font-display text-[0.95rem] leading-tight tracking-[0.05em] sm:text-[1.15rem] md:mt-2 md:text-[1.35rem] lg:text-[1.45rem]">
                {t.header_subtitle}
              </span>
            </Link>

            <div className="mt-3 max-w-sm space-y-1 md:mt-4">
              <p className="font-serif text-xs font-medium leading-snug text-charcoal md:text-base">
                {t.footer_description_primary}
              </p>
              <p className="hidden font-sans text-sm text-charcoal/80 md:block md:text-[0.9375rem]">
                {t.footer_description_secondary}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2.5 md:mt-4 md:gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-charcoal/15 bg-warm-white/80 text-charcoal transition-all hover:border-charcoal hover:bg-charcoal hover:text-warm-white md:h-9 md:w-9"
                >
                  <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-6 lg:col-start-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-x-10 md:gap-8 lg:gap-x-12">
              <ShopHours compact className="min-w-0 w-full text-left" />
              <StoreLocation compact className="min-w-0 w-full text-left" />
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-champagne/60 pt-4 md:mt-8 md:pt-7">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-12">
            <div className="text-left">
              <h3 className={headingClass}>{t.footer_customer_support}</h3>
              <ul className="mt-2 space-y-1 md:mt-2.5 md:space-y-1.5">
                {CUSTOMER_SUPPORT_LINKS.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href(locale)} className={linkClass}>
                      {t[link.labelKey]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-left">
              <h3 className={headingClass}>{t.footer_legal}</h3>
              <ul className="mt-2 space-y-1 md:mt-2.5 md:space-y-1.5">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href(locale)} className={linkClass}>
                      {t[link.labelKey]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 text-left md:col-span-1">
              <h3 className={headingClass}>{t.footer_contact_title}</h3>
              <ul className={`mt-2 space-y-1 md:mt-2.5 md:space-y-1.5 ${textClass}`}>
                <li>
                  <a
                    href={`mailto:${STORE_EMAIL}`}
                    className={`${linkClass} break-all`}
                  >
                    {STORE_EMAIL}
                  </a>
                </li>
                {STORE_PHONE ? (
                  <li>
                    <a href={`tel:${STORE_PHONE}`} className={linkClass}>
                      {STORE_PHONE}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-champagne/70 px-6 py-2.5 md:py-3.5">
        <p className="text-center font-sans text-[11px] tracking-wide text-charcoal/60 md:text-sm">
          {t.footer_copyright}
        </p>
      </div>
    </footer>
  );
}
