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
        cream: "#FDF5F8",
        "warm-white": "#FFFAFB",
        blush: "#F5D0D8",
        rose: "#E8A0AD",
        mauve: "#B5606A",
        amber: "#D4869A",
        gold: "#D4A0B0",
        champagne: "#EDD0D8",
        charcoal: "#1C1C1C",
        "soft-brown": "#755560",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      boxShadow: {
        "warm-card": "0 4px 30px rgba(181, 96, 106, 0.08)",
        "warm-card-hover": "0 8px 40px rgba(181, 96, 106, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
