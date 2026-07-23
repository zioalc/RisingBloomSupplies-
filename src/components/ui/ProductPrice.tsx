import { formatPrice, isCompareAtSale } from "@/lib/utils";

type Money = {
  amount: string;
  currencyCode: string;
};

type ProductPriceProps = {
  price: Money;
  compareAtPrice?: Money | null;
  prefix?: string;
  size?: "card" | "detail";
  align?: "left" | "center";
  className?: string;
};

const sizeClasses = {
  card: {
    regular: "font-sans text-sm font-normal tracking-wide text-charcoal md:text-[0.9375rem]",
    compare:
      "font-sans text-sm font-normal tracking-wide text-charcoal/40 line-through md:text-[0.9375rem]",
    sale: "font-sans text-sm font-normal tracking-wide text-charcoal md:text-[0.9375rem]",
  },
  detail: {
    regular: "font-sans text-lg font-normal tracking-wide text-charcoal md:text-xl",
    compare:
      "font-sans text-base font-normal tracking-wide text-charcoal/40 line-through md:text-lg",
    sale: "font-sans text-lg font-normal tracking-wide text-charcoal md:text-xl",
  },
} as const;

export default function ProductPrice({
  price,
  compareAtPrice,
  prefix = "",
  size = "card",
  align = "center",
  className = "",
}: ProductPriceProps) {
  const styles = sizeClasses[size];
  const formattedPrice = formatPrice(price.amount, price.currencyCode);
  const onSale = isCompareAtSale(price, compareAtPrice);

  if (!onSale || !compareAtPrice) {
    return (
      <p className={`${styles.regular} ${className}`}>
        {prefix}
        {formattedPrice}
      </p>
    );
  }

  const formattedCompare = formatPrice(
    compareAtPrice.amount,
    compareAtPrice.currencyCode,
  );

  const alignClass =
    align === "center"
      ? "items-center justify-center"
      : "items-baseline justify-start";

  return (
    <div
      className={`flex flex-wrap gap-x-2 gap-y-0.5 ${alignClass} ${className}`}
    >
      <span className={styles.compare}>{formattedCompare}</span>
      <span className={styles.sale}>
        {prefix}
        {formattedPrice}
      </span>
    </div>
  );
}
