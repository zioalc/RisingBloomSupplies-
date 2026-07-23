import type { Metadata } from "next";
import CartProviderWrapper from "@/components/layout/CartProviderWrapper";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SetHtmlLang from "@/components/layout/SetHtmlLang";
import { i18n, isLocale, type Locale } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (params.locale === "es") {
    return {
      title: "Rise & Bloom | Kits de Extensiones de Pestañas DIY",
      description:
        "Compra los Kits de Racimos de Pestañas DIY de Rise & Bloom. Resultados profesionales de salón en casa.",
    };
  }

  return {
    title: "Rise & Bloom | DIY Lash Cluster Kits",
    description:
      "Shop Rise & Bloom DIY Lash Cluster Extension Kits. Full, fluttery lashes at home — no salon needed.",
  };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "en";

  return (
    <>
      <SetHtmlLang locale={locale} />
      <CartProviderWrapper>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </CartProviderWrapper>
    </>
  );
}