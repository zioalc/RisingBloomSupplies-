"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { isLocale, switchLocalePath, type Locale } from "@/lib/i18n";
import { en } from "@/lib/translations/en";
import { es } from "@/lib/translations/es";

const translations = { en, es };

export function useTranslation() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const paramLocale = params?.locale;
  const locale: Locale =
    typeof paramLocale === "string" && isLocale(paramLocale)
      ? paramLocale
      : "en";

  const t = translations[locale];

  const switchLocale = (nextLocale: Locale) => {
    router.push(switchLocalePath(pathname, nextLocale));
  };

  return { t, locale, switchLocale };
}
