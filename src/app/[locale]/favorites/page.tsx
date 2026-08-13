import type { Metadata } from "next";
import FavoritesClient from "@/components/wishlist/FavoritesClient";
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
        <h1 className="font-serif text-3xl text-charcoal md:text-4xl">
          {t.favorites_heading}
        </h1>

        <div className="mt-6 md:mt-8">
          <FavoritesClient />
        </div>
      </div>
    </div>
  );
}
