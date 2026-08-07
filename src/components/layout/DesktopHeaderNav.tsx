"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { DESKTOP_NAVIGATION_LINKS } from "@/lib/navigation";
import { useTranslation } from "@/lib/useTranslation";

type DesktopHeaderNavProps = {
  compact?: boolean;
};

export default function DesktopHeaderNav({ compact = false }: DesktopHeaderNavProps) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCollection = searchParams.get("category");

  return (
    <nav
      className="hidden border-t border-nightview-light/40 lg:block"
      aria-label={t.aria_main_nav}
    >
      <ul
        className={`site-container flex flex-wrap items-center justify-center gap-x-6 gap-y-1 transition-all duration-300 ${
          compact ? "py-1" : "py-1.5"
        }`}
      >
        {DESKTOP_NAVIGATION_LINKS.map((link) => {
          const href = link.href(locale);
          const isShopLink = href.includes("/shop");
          const isActive = isShopLink
            ? pathname.includes("/shop") &&
              (href.includes("category=")
                ? activeCollection === href.split("category=")[1]
                : !activeCollection)
            : pathname === href;

          return (
            <li key={link.id}>
              <Link
                href={href}
                className={`font-sans text-[0.7rem] uppercase tracking-[0.18em] transition-colors md:text-xs md:tracking-[0.2em] ${
                  isActive
                    ? "font-medium text-charcoal"
                    : "font-normal text-charcoal/75 hover:text-charcoal"
                }`}
              >
                {t[link.labelKey as keyof typeof t]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
