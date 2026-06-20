"use client";

import Link from "next/link";
import { localizedPath } from "@/lib/i18n";
import { useTranslation } from "@/lib/useTranslation";

export default function ShopCategoriesSection() {
  const { t, locale } = useTranslation();

  const categories = [
    { name: t.cat_1, description: t.cat_1_desc },
    { name: t.cat_2, description: t.cat_2_desc },
    { name: t.cat_3, description: t.cat_3_desc },
    { name: t.cat_4, description: t.cat_4_desc },
  ];

  return (
    <section
      className="section-padding"
      style={{
        background: "linear-gradient(180deg, #FDF5F8 0%, #FAE5ED 100%)",
      }}
    >
      <div className="site-container">
        <div className="site-container-prose">
          <h2 className="section-title">{t.categories_heading}</h2>
          <div className="section-divider" />
        </div>

        <div className="section-content grid grid-cols-2 gap-[clamp(1rem,2vw,2rem)] md:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={localizedPath(locale, "/shop")}
              className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md sm:min-h-[260px] md:min-h-[300px] lg:min-h-[360px] xl:min-h-[420px]"
              style={{
                background:
                  "linear-gradient(160deg, #F5D0D8 0%, #EDD0D8 60%, #FAE5ED 100%)",
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-mauve/0 transition-colors duration-300 group-hover:bg-mauve/[0.15]" />
              <div className="relative px-3 pb-4 pt-8 text-center md:px-5 md:pb-6 lg:px-6 lg:pb-8">
                <h3 className="font-serif text-lg italic text-charcoal md:text-xl lg:text-2xl xl:text-3xl">
                  {category.name}
                </h3>
                <p className="mt-2 line-clamp-2 font-sans text-[11px] leading-snug text-soft-brown md:text-sm lg:text-base">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
