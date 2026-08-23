import type { Metadata } from "next";
import CheckoutResumeClient from "@/components/checkout/CheckoutResumeClient";
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
    title: t.checkout_resume_meta_title,
    description: t.checkout_resume_meta_description,
    robots: { index: false, follow: false },
  };
}

export default function CheckoutResumePage({ params }: PageProps) {
  const t = getTranslation(params.locale);

  return (
    <div className="page-padding products-section-bg">
      <div className="site-container">
        <BackToHomeLink locale={params.locale} className="mb-4 block" />
        <div className="site-container-prose">
          <p className="section-label">{t.checkout_resume_label}</p>
          <h1 className="section-title">{t.checkout_resume_heading}</h1>
          <div className="section-divider" />
        </div>

        <div className="section-content mt-6 md:mt-8">
          <CheckoutResumeClient />
        </div>
      </div>
    </div>
  );
}
