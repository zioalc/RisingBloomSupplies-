import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { localizedPath, type Locale } from "@/lib/i18n";
import { getTranslation } from "@/lib/translations";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = getTranslation(params.locale);
  return {
    title: `${t.about_title} | Rise & Bloom`,
    description: t.about_p1.slice(0, 160),
  };
}

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const t = getTranslation(params.locale);

  return (
    <div className="page-padding bg-cream">
      <div className="site-container grid items-center gap-10 md:grid-cols-2 md:gap-12 xl:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-square">
          <Image
            src="/images/product-2.png"
            alt="Brenda — Rise & Bloom lash and nail studio"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          <p className="section-label">{t.about_label}</p>
          <h1 className="mt-2 font-serif text-3xl text-charcoal md:text-4xl lg:text-5xl xl:text-6xl">
            {t.about_title}
          </h1>

          <div className="mt-6 space-y-5 text-base leading-relaxed text-charcoal/75 md:text-lg">
            <p>{t.about_p1}</p>
            <p>{t.about_p2}</p>
            <p>{t.about_p3}</p>
          </div>

          <Link
            href={localizedPath(params.locale, "/shop")}
            className="mt-8 inline-block rounded-full border border-rose px-8 py-3 text-sm font-medium text-mauve transition-colors hover:bg-mauve hover:text-white"
          >
            {t.hero_btn_shop}
          </Link>
        </div>
      </div>
    </div>
  );
}
