export const i18n = {
  locales: ["en", "es"],
  defaultLocale: "en",
} as const;

export type Locale = (typeof i18n.locales)[number];

export function isLocale(value: string): value is Locale {
  return i18n.locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}

export function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (maybeLocale && isLocale(maybeLocale)) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }

  return pathname || "/";
}

export function switchLocalePath(pathname: string, locale: Locale) {
  const pathWithoutLocale = stripLocaleFromPath(pathname);
  return localizedPath(locale, pathWithoutLocale);
}
