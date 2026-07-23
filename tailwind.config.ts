import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /** Exact Rise & Bloom logo outline pink */
        "brand-pink": "#EC6AA6",
        cream: "#F3EDF0",
        "warm-white": "#FAF6F8",
        flower: "#EED0DA",
        blush: "#E8CCD6",
        /** Deeper logo-family pink for solid fills / accents */
        rose: "#C75A8F",
        mauve: "#EC6AA6",
        nightview: "#EC6AA6",
        "logo-pink": "#EC6AA6",
        "nightview-dark": "#B84D7E",
        "nightview-light": "#DDD0D6",
        "banner-bg": "#EED0DA",
        "banner-bg-deep": "#E4C4CF",
        amber: "#EC6AA6",
        gold: "#C9A0B0",
        champagne: "#DFCCD4",
        charcoal: "#1C1719",
        "soft-brown": "#6A5860",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
        display: ["var(--font-display)", "sans-serif"],
      },
      boxShadow: {
        "warm-card": "0 4px 28px rgba(28, 23, 25, 0.06)",
        "warm-card-hover": "0 8px 36px rgba(28, 23, 25, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
