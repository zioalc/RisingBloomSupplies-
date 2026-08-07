import ProductDetails from "@/components/ui/ProductDetails";
import BackToHomeLink from "@/components/ui/BackToHomeLink";
import { type Locale } from "@/lib/i18n";
import { getProductByHandle } from "@/lib/shopify";
import { getTranslation } from "@/lib/translations";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: { locale: Locale; handle: string };
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const t = getTranslation(params.locale);

  try {
    const product = await getProductByHandle(params.handle);

    if (!product) {
      return { title: t.product_not_found_title };
    }

    const plainDescription = product.description
      ?.replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);

    return {
      title: `${product.title} | Rise & Bloom`,
      description:
        plainDescription ||
        t.product_meta_fallback.replace("{title}", product.title),
      openGraph: product.images[0]
        ? { images: [{ url: product.images[0].url }] }
        : undefined,
    };
  } catch {
    return { title: t.product_fallback_title };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product = null;

  try {
    product = await getProductByHandle(params.handle);
  } catch {
    product = null;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="page-padding bg-cream">
      <div className="site-container">
        <BackToHomeLink locale={params.locale} />

        <div className="mt-6">
          <ProductDetails product={product} />
        </div>
      </div>
    </div>
  );
}
