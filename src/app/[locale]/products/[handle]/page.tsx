import ProductDetails from "@/components/ui/ProductDetails";
import { localizedPath, type Locale } from "@/lib/i18n";
import { getProductByHandle } from "@/lib/shopify";
import { getTranslation } from "@/lib/translations";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: { locale: Locale; handle: string };
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProductByHandle(params.handle);

    if (!product) {
      return { title: "Product Not Found | Rise & Bloom" };
    }

    const plainDescription = product.description
      ?.replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);

    return {
      title: `${product.title} | Rise & Bloom`,
      description:
        plainDescription || `Shop ${product.title} at Rise & Bloom.`,
      openGraph: product.images[0]
        ? { images: [{ url: product.images[0].url }] }
        : undefined,
    };
  } catch {
    return { title: "Product | Rise & Bloom" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const t = getTranslation(params.locale);
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
        <Link
          href={localizedPath(params.locale, "/shop")}
          className="text-xs uppercase tracking-[0.15em] text-charcoal/60 transition-colors hover:text-mauve"
        >
          {t.back_to_shop}
        </Link>

        <div className="mt-6">
          <ProductDetails product={product} />
        </div>
      </div>
    </div>
  );
}
