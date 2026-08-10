import { NextRequest, NextResponse } from "next/server";
import { i18n, isLocale } from "@/lib/i18n";
import { hasValidPreviewCookie } from "@/lib/previewAccess";

function isMaintenanceMode() {
  return process.env.MAINTENANCE_MODE === "true";
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Temporary Coming Soon gate. API routes are excluded by the matcher so
  // auth callbacks and other APIs keep working while the storefront is hidden.
  if (isMaintenanceMode()) {
    if (pathname === "/coming-soon") {
      return NextResponse.next();
    }

    if (await hasValidPreviewCookie(request)) {
      // Developer preview cookie — allow normal storefront routing below.
    } else {
      return NextResponse.rewrite(new URL("/coming-soon", request.url));
    }
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    const locale = pathname.split("/")[1];
    if (locale && isLocale(locale)) {
      return NextResponse.next();
    }
  }

  const locale = i18n.defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|fonts|api).*)"],
};
