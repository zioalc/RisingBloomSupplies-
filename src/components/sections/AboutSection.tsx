"use client";

import Link from "next/link";
import { localizedPath } from "@/lib/i18n";
import { ABOUT_SECTION_BACKGROUND_IMAGE } from "@/lib/sectionImages";
import { useTranslation } from "@/lib/useTranslation";

export default function AboutSection() {
  const { t, locale } = useTranslation();

  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="about-section-bg absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${ABOUT_SECTION_BACKGROUND_IMAGE})`,
        }}
        aria-hidden
      />

      <div
        className="absolute inset-0 z-[1] bg-[#FFFAFB]/85"
        aria-hidden
      />

      <div className="section-padding relative z-10">
        <div className="site-container flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl bg-warm-white/80 p-8 text-center shadow-sm backdrop-blur-sm md:p-10 lg:max-w-3xl lg:p-12">
            <p className="section-label">{t.about_label}</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-charcoal md:text-4xl lg:text-5xl">
              {t.about_heading_1}{" "}
              <span className="italic text-mauve">{t.about_heading_2}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-soft-brown md:text-lg">
              {t.about_body}
            </p>
            <div className="mx-auto mt-6 h-px w-16 bg-rose/60" />
            <Link
              href={localizedPath(locale, "/about")}
              className="mt-6 inline-block rounded-full border border-mauve px-8 py-3 font-sans text-sm font-medium text-mauve transition-colors hover:bg-mauve hover:text-white"
            >
              {t.about_btn}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
