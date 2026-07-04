/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        slate: {
          50: "#F7F8FA",
          100: "#EEF1F5",
          200: "#E2E6EC",
          400: "#8A93A3",
          500: "#667085",
          600: "#475065",
        },
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          400: "#5B6EE8",
          500: "#3F51D6",
          600: "#3140B8",
          700: "#26338F",
        },
        teal: {
          400: "#2FB6A8",
          500: "#209E92",
        },
        coral: {
          400: "#F0765A",
          500: "#E15C3F",
        },
        gold: {
          400: "#E3A63E",
          500: "#C98A24",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        pop: "0 8px 24px rgba(16,24,40,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
