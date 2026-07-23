"use client";

import { SOCIAL_LINKS } from "@/lib/contact";
import { useTranslation } from "@/lib/useTranslation";

export default function InstagramSection() {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-cream">
      <div className="site-container text-center">
        <p className="section-label">{t.instagram_label}</p>
        <h2 className="section-title">{t.instagram_connect_heading}</h2>
        <p className="mt-2 text-sm text-charcoal md:text-base">
          {t.instagram_handle}
        </p>

        <div className="section-content grid grid-cols-2 gap-[clamp(0.75rem,2vw,1.5rem)] sm:grid-cols-3 lg:gap-6 xl:grid-cols-6 xl:gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg"
              style={{
                background: "linear-gradient(135deg, #E2C8D4, #D8BCC8)",
              }}
              aria-hidden
            />
          ))}
        </div>

        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full border border-mauve px-8 py-3 text-sm font-medium text-mauve transition-colors hover:bg-mauve hover:text-charcoal"
        >
          {t.instagram_heading}
        </a>
      </div>
    </section>
  );
}
