import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { localizedPath, type Locale } from "@/lib/i18n";
import { getTranslation } from "@/lib/translations";

type BackToHomeLinkProps = {
  locale: Locale;
  className?: string;
};

export default function BackToHomeLink({
  locale,
  className = "",
}: BackToHomeLinkProps) {
  const t = getTranslation(locale);

  return (
    <Link
      href={localizedPath(locale, "/")}
      className={`inline-flex items-center gap-1 font-sans text-xs tracking-[0.12em] text-charcoal/55 transition-colors hover:text-charcoal ${className}`}
    >
      <ChevronLeft className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
      <span>{t.back_to_home}</span>
    </Link>
  );
}
