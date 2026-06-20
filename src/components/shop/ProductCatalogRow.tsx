"use client";

import ProductCard from "@/components/ui/ProductCard";
import ProductCarousel from "@/components/ui/ProductCarousel";
import ProductModal from "@/components/ui/ProductModal";
import { useCart } from "@/lib/cartContext";
import type { ProductViewData } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

type ProductCatalogRowProps = {
  products: ProductViewData[];
  variant?: "default" | "featured";
  carouselLabel?: string;
};

export default function ProductCatalogRow({
  products,
  variant = "default",
  carouselLabel = "Shop products",
}: ProductCatalogRowProps) {
  const { addItem, openDrawer } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<ProductViewData | null>(
    null,
  );
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  const openProduct = (product: ProductViewData, imageIndex = 0) => {
    setInitialImageIndex(imageIndex);
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: ProductViewData) => {
    addItem({
      productId: product.productId,
      variantId: product.variantId,
      title: product.title,
      price: product.price,
      image: product.images[0] ?? null,
    });
    openDrawer();
  };

  return (
    <>
      <div className="section-content">
        <ProductCarousel ariaLabel={carouselLabel}>
          {products.map((product) => (
            <div
              key={product.id}
              data-carousel-item
              className="w-[clamp(260px,22vw,420px)] shrink-0 snap-start"
            >
              <ProductCard
                image={product.images[0] ?? null}
                title={product.title}
                price={formatPrice(
                  product.price.amount,
                  product.price.currencyCode,
                )}
                category={product.category}
                available={product.available}
                variant={variant}
                onViewDetails={() => openProduct(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            </div>
          ))}
        </ProductCarousel>
      </div>

      <ProductModal
        product={selectedProduct}
        initialImageIndex={initialImageIndex}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
