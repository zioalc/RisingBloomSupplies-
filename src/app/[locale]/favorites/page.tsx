import type { Metadata } from "next";
import FavoritesClient from "@/components/wishlist/FavoritesClient";
import BackToHomeLink from "@/components/ui/BackToHomeLink";
import { type Locale } from "@/lib/i18n";
import { getTranslation } from "@/lib/translations";

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const t = getTranslation(params.locale);
  return {
    title: t.favorites_meta_title,
    description: t.favorites_meta_description,
  };
}

export default function FavoritesPage({ params }: PageProps) {
  const t = getTranslation(params.locale);

  return (
    <div className="page-padding products-section-bg">
      <div className="site-container">
        <BackToHomeLink locale={params.locale} className="mb-4 block" />
        <div className="site-container-prose">
          <p className="section-label">{t.shop_label}</p>
          <h1 className="section-title">{t.favorites_heading}</h1>
          <p className="mt-3 text-sm text-soft-brown md:text-base lg:text-lg">
            {t.favorites_sub}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-charcoal/60 md:text-sm">
            {t.favorites_device_notice}
          </p>
          <div className="section-divider" />
        </div>

        <div className="section-content">
          <FavoritesClient />
        </div>
      </div>
    </div>
  );
}
