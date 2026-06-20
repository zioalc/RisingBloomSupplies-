/** @type {import('next').NextConfig} */

/**
 * Locale routing for the App Router is handled via src/middleware.ts
 * and the [locale] segment. Locale settings: src/lib/i18n.ts
 *
 * i18n: { locales: ['en', 'es'], defaultLocale: 'en' }
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
