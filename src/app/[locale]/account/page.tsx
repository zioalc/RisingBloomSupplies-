import type { Metadata } from "next";
import AccountClient from "@/components/account/AccountClient";
import BackToHomeLink from "@/components/ui/BackToHomeLink";
import { type Locale } from "@/lib/i18n";
import { getTranslation } from "@/lib/translations";

type PageProps = {
  params: { locale: Locale };
  searchParams?: { auth?: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const t = getTranslation(params.locale);
  return {
    title: t.account_meta_title,
    description: t.account_meta_description,
  };
}

export default function AccountPage({ params, searchParams }: PageProps) {
  const t = getTranslation(params.locale);

  return (
    <div className="page-padding products-section-bg">
      <div className="site-container">
        <BackToHomeLink locale={params.locale} className="mb-4 block" />
        <div className="site-container-prose">
          <p className="section-label">{t.account_label}</p>
          <h1 className="section-title">{t.account_heading}</h1>
          <p className="mt-3 text-sm text-soft-brown md:text-base lg:text-lg">
            {t.account_sub}
          </p>
          <div className="section-divider" />
        </div>

        <div className="section-content">
          <AccountClient authQuery={searchParams?.auth ?? null} />
        </div>
      </div>
    </div>
  );
}
