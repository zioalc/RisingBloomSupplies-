import Image from "next/image";
import Link from "next/link";

type HeaderLogoProps = {
  href: string;
  compact?: boolean;
  ariaLabel?: string;
  subtitle?: string;
};

export default function HeaderLogo({
  href,
  compact = false,
  ariaLabel = "Rise & Bloom",
  subtitle,
}: HeaderLogoProps) {
  return (
    <Link
      href={href}
      className={`group block min-w-0 text-center transition-all duration-300 ${
        compact ? "scale-[0.88] md:scale-[0.92]" : "scale-100"
      }`}
      aria-label={ariaLabel}
    >
      <div className="flex flex-col items-center">
        <Image
          src="/images/rise-bloom-logo.png"
          alt="Rise & Bloom"
          width={520}
          height={160}
          priority
          className={`w-auto max-w-[min(100%,14rem)] object-contain sm:max-w-none ${
            compact
              ? "h-[2.1rem] sm:h-[2.35rem] md:h-[2.65rem] lg:h-[3rem]"
              : "h-[2.5rem] sm:h-[2.85rem] md:h-[3.25rem] lg:h-[4rem]"
          }`}
        />

        {!compact && subtitle ? (
          <span className="logo-display mt-1 whitespace-nowrap px-1 font-display text-[0.82rem] leading-tight tracking-[0.04em] sm:mt-1.5 sm:text-[0.95rem] md:text-[1.2rem] lg:mt-1.5 lg:text-[1.75rem]">
            {subtitle}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
