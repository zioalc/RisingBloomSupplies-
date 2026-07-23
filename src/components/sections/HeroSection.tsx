"use client";

import Link from "next/link";
import { localizedPath } from "@/lib/i18n";
import { useTranslation } from "@/lib/useTranslation";

export default function HeroSection() {
  const { t, locale } = useTranslation();

  return (
    <section className="relative overflow-hidden border-b border-champagne/50 bg-gradient-to-b from-warm-white via-[#f8eef3] to-[#f3e4eb]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,_rgba(238,106,167,0.16)_0%,_transparent_55%)]"
        aria-hidden
      />

      <div className="site-container relative z-10 flex min-h-[42vh] flex-col items-center justify-center py-14 text-center md:min-h-[48vh] md:py-20 lg:min-h-[52vh] lg:py-24">
        <p className="font-sans text-xs uppercase tracking-[0.28em] text-mauve/80 md:text-sm">
          {t.hero_label}
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight text-charcoal md:text-5xl lg:text-6xl">
          <span className="block">{t.hero_heading_1}</span>
          <span className="mt-1 block text-mauve">{t.hero_heading_2}</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-soft-brown md:text-base lg:text-lg">
          {t.hero_sub}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={localizedPath(locale, "/shop")}
            className="rounded-full bg-mauve px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal hover:text-white"
          >
            {t.hero_btn_shop}
          </Link>
          <Link
            href={`${localizedPath(locale, "/shop")}?category=lashes`}
            className="rounded-full border border-mauve/50 bg-warm-white/70 px-8 py-3 text-sm font-medium text-mauve transition-colors hover:border-mauve hover:bg-mauve hover:text-charcoal"
          >
            {t.hero_btn_collections}
          </Link>
        </div>
      </div>
    </section>
  );
}
