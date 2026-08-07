import type { Metadata } from "next";
import BackToHomeLink from "@/components/ui/BackToHomeLink";
import { type Locale } from "@/lib/i18n";
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
    title: t.promo_terms_meta_title,
    description: t.promo_terms_meta_description,
  };
}

export default function PromotionTermsPage({ params }: PageProps) {
  const t = getTranslation(params.locale);

  const sections = [
    {
      title: t.promo_terms_general_title,
      body: t.promo_terms_general_body,
    },
    {
      title: t.promo_terms_welcome_title.replace(
        "{code}",
        PROMOTIONS.welcome2026.code,
      ),
      body: t.promo_terms_welcome_body,
    },
    {
      title: t.promo_terms_local_title.replace(
        "{code}",
        PROMOTIONS.bloomlocal10.code,
      ),
      body: t.promo_terms_local_body,
    },
    {
      title: t.promo_terms_bday_title.replace(
        "{code}",
        PROMOTIONS.bloomday.code,
      ),
      body: t.promo_terms_bday_body,
    },
  ];

  return (
    <div className="page-padding bg-cream">
      <div className="site-container mx-auto max-w-3xl">
        <BackToHomeLink locale={params.locale} className="mb-4 block" />
        <p className="section-label">{t.footer_brand_label}</p>
        <h1 className="mt-2 font-sans text-2xl font-medium uppercase tracking-[0.18em] text-charcoal md:text-3xl md:tracking-[0.2em]">
          {t.promo_terms_title}
        </h1>
        <div className="section-divider !mx-0" />

        <p className="mt-8 font-sans text-base leading-relaxed text-soft-brown md:text-lg">
          {t.promo_terms_intro}
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-champagne/80 bg-warm-white/80 p-6 shadow-sm shadow-mauve/5 md:p-8"
            >
              <h2 className="font-serif text-xl text-charcoal md:text-2xl">
                {section.title}
              </h2>
              <p className="mt-3 whitespace-pre-line font-sans text-sm leading-relaxed text-charcoal/80 md:text-base">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
