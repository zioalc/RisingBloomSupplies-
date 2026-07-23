import type { Metadata } from "next";
import Link from "next/link";
import BackToHomeLink from "@/components/ui/BackToHomeLink";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import {
  SUPPORT_PAGES,
  type SupportPageId,
} from "@/lib/supportPages";
import { getTranslation } from "@/lib/translations";

type SupportPageProps = {
  locale: Locale;
  pageId: SupportPageId;
};

export function SupportPage({ locale, pageId }: SupportPageProps) {
  const t = getTranslation(locale);
  const page = SUPPORT_PAGES[pageId];

  return (
    <div className="page-padding bg-cream">
      <div className="site-container mx-auto max-w-3xl">
        <BackToHomeLink locale={locale} className="mb-4 block" />
        <p className="section-label">{t.footer_brand_label}</p>
        <h1 className="mt-2 font-serif text-3xl text-charcoal md:text-4xl lg:text-5xl">
          {t[page.titleKey]}
        </h1>
        <div className="section-divider !mx-0" />

        <p className="mt-8 font-sans text-base leading-relaxed text-soft-brown md:text-lg">
          {t[page.introKey]}
        </p>

        <div className="mt-10 space-y-8">
          {page.blocks.map((block) => {
            if (block.type === "paragraph") {
              return (
                <p
                  key={block.key}
                  className="font-sans text-sm leading-relaxed text-charcoal/80 md:text-base md:leading-relaxed"
                >
                  {t[block.key]}
                </p>
              );
            }

            return (
              <div
                key={block.titleKey}
                className="rounded-2xl border border-champagne/80 bg-warm-white/80 p-6 shadow-sm shadow-mauve/5 md:p-8"
              >
                <h2 className="font-serif text-xl text-charcoal md:text-2xl">
                  {t[block.titleKey]}
                </h2>
                <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/80 md:text-base">
                  {t[block.bodyKey]}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={localizedPath(locale, "/contact")}
            className="inline-flex rounded-full border border-nightview/30 px-8 py-3 font-sans text-sm font-medium text-charcoal transition-colors hover:border-nightview hover:text-nightview md:text-base"
          >
            {t.footer_link_contact}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function buildSupportPageMetadata(pageId: SupportPageId) {
  return async function generateMetadata({
    params,
  }: {
    params: { locale: Locale };
  }): Promise<Metadata> {
    const t = getTranslation(params.locale);
    const page = SUPPORT_PAGES[pageId];

    return {
      title: t[page.metaTitleKey],
      description: t[page.metaDescKey],
    };
  };
}

export function buildSupportPage(pageId: SupportPageId) {
  const generateMetadata = buildSupportPageMetadata(pageId);

  function Page({ params }: { params: { locale: Locale } }) {
    return <SupportPage locale={params.locale} pageId={pageId} />;
  }

  return { Page, generateMetadata };
}
