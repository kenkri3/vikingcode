import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        viking: {
          bg: "#0A0D12",
          card: "#12161F",
          cardHover: "#181E2B",
          border: "#1F2937",
          borderHover: "#374151",
          purple: {
            DEFAULT: "#7C3AED",
            light: "#8B5CF6",
            accent: "#A78BFA",
            soft: "#C4B5FD",
            glow: "rgba(124, 58, 237, 0.25)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(124, 58, 237, 0.35)",
        "glow-lg": "0 0 40px -5px rgba(124, 58, 237, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
