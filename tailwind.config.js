import * as theme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  darkMode: "class",
  plugins: [
    require("flowbite/plugin")({
      charts: true,
    }),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sora", "sans-serif"],
      },
      colors: {
        ...theme.colors,
        base: {
          DEFAULT: "#141414",
          50: "#555555",
          100: "#515151",
          200: "#4A4A4A",
          300: "#424242",
          400: "#3A3A3A",
          500: "#333333",
          600: "#2B2B2B",
          700: "#232323",
          800: "#1C1C1C",
          900: "#141414",
          950: "#070707",
        },
        none: {
          DEFAULT: "#333333",
        },
        red: {
          DEFAULT: "#C6251D",
        },
      },
    },
  },
};
