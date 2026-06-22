import type { Config } from "tailwindcss";

/**
 * Jetons de design — voir docs/06-design-system.md.
 * Palette officielle Diabaction Congo.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F4E79",
          hover: "#1A4268",
          soft: "#E8EEF5",
        },
        accent: {
          DEFAULT: "#D94B5A",
          hover: "#C53D4C",
          soft: "#FBE9EB",
        },
        ink: "#2D3748",
        canvas: "#F5F7FA",
        success: { DEFAULT: "#2F855A", soft: "#E6F4EA" },
        line: "#E2E8F0",
      },
      borderRadius: {
        card: "14px",
      },
      maxWidth: {
        container: "1200px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(45,55,72,0.06), 0 8px 24px rgba(45,55,72,0.06)",
        float: "0 12px 40px rgba(31,78,121,0.16)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
