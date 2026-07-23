import Link from "next/link";
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
      className={`inline-block text-xs uppercase tracking-[0.15em] text-charcoal/60 transition-colors hover:text-mauve ${className}`}
    >
      {t.back_to_home}
    </Link>
  );
}
