import type { Locale } from "@/lib/i18n";
import { en } from "./en";
import { es } from "./es";

const translations = { en, es };

export function getTranslation(locale: Locale) {
  return translations[locale] ?? en;
}

export { en, es };
