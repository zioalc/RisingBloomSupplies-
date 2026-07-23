"use client";

import ProductCard from "@/components/ui/ProductCard";
import ProductModal from "@/components/ui/ProductModal";
import { useCart } from "@/lib/cartContext";
import type { ProductViewData } from "@/lib/products";
import { useState } from "react";

type ProductCatalogRowProps = {
  products: ProductViewData[];
  carouselLabel?: string;
  compactTop?: boolean;
};

export default function ProductCatalogRow({
  products,
  carouselLabel = "Shop products",
  compactTop = false,
}: ProductCatalogRowProps) {
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<ProductViewData | null>(
    null,
  );
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  const openProduct = (product: ProductViewData, imageIndex = 0) => {
    setInitialImageIndex(imageIndex);
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: ProductViewData) => {
    if (product.hasMultipleVariants) {
      openProduct(product);
      return;
    }

    addItem({
      productId: product.productId,
      variantId: product.variantId,
      title: product.title,
      price: product.price,
      image: product.coverImage ?? product.images[0] ?? null,
    });
  };

  return (
    <>
      <div
        className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12 ${
          compactTop ? "mt-6 md:mt-8" : "mt-8 md:mt-10"
        }`}
        aria-label={carouselLabel}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            productId={product.productId}
            handle={product.handle}
            image={product.coverImage ?? product.images[0] ?? null}
            images={product.images}
            title={product.title}
            tagline={product.tagline}
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            available={product.available}
            onViewDetails={(imageIndex) => openProduct(product, imageIndex)}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        initialImageIndex={initialImageIndex}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
