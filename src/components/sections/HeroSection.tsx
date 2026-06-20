"use client";

import Image from "next/image";
import Link from "next/link";
import { localizedPath } from "@/lib/i18n";
import { useTranslation } from "@/lib/useTranslation";

export default function HeroSection() {
  const { t, locale } = useTranslation();

  return (
    <section
      className="relative overflow-hidden section-padding"
      style={{
        background:
          "linear-gradient(160deg, #FAE5ED 0%, #FDF5F8 50%, #F5D0D8 100%)",
      }}
    >
      <div className="site-container relative grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 2xl:gap-20">
        <div className="text-center lg:text-left">
          <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-mauve md:text-xs lg:text-sm">
            {t.hero_label}
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-[1.1] text-charcoal sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[6.5rem]">
            {t.hero_heading_1}
            <br />
            <span className="italic text-mauve">{t.hero_heading_2}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md font-sans text-base leading-relaxed text-soft-brown sm:text-lg lg:mx-0 lg:max-w-xl xl:max-w-2xl xl:text-xl">
            {t.hero_sub}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={localizedPath(locale, "/shop")}
              className="inline-block rounded-full bg-mauve px-8 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-charcoal md:px-10 md:py-3.5 md:text-base lg:text-lg"
            >
              {t.hero_btn_shop}
            </Link>
            <Link
              href={localizedPath(locale, "/about")}
              className="inline-block rounded-full border border-mauve px-8 py-3 font-sans text-sm font-medium text-mauve transition-colors hover:bg-blush md:px-10 md:py-3.5 md:text-base lg:text-lg"
            >
              {t.hero_btn_about}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full lg:max-w-none">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl md:h-96 md:w-96"
            style={{
              background:
                "radial-gradient(circle, #F5D0D8 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 aspect-square overflow-hidden rounded-3xl hero-product-shadow">
            <Image
              src="/images/product-1.png"
              alt="Rise & Bloom DIY Lash Extension Kit by Brenda"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
