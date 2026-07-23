import type { Metadata } from "next";
import BackToHomeLink from "@/components/ui/BackToHomeLink";
import DiscountPromo from "@/components/promotions/DiscountPromo";
import { localizedPath, type Locale } from "@/lib/i18n";
import { PROMOTIONS } from "@/lib/promotions";
import { getTranslation } from "@/lib/translations";

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const t = getTranslation(params.locale);
  return {
    title: t.promo_local_meta_title,
    description: t.promo_local_meta_description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function LocalThankYouPage({ params }: PageProps) {
  const t = getTranslation(params.locale);

  return (
    <div className="page-padding bg-cream">
      <div className="site-container max-w-2xl">
        <BackToHomeLink locale={params.locale} className="mb-6 block" />
        <DiscountPromo
          variant="card"
          visibility="in_store"
          title={t.promo_local_title}
          description={t.promo_local_body.replace(
            "{code}",
            PROMOTIONS.lovelocal10.code,
          )}
          code={PROMOTIONS.lovelocal10.code}
          ctaLabel={t.promo_shop_now}
          ctaHref={localizedPath(params.locale, "/shop")}
          termsNote={t.promo_local_terms_note}
        />
      </div>
    </div>
  );
}
