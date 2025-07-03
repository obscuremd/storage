// tailwind.config.js
import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}", // make sure file types are included
    "./app/**/*.{js,ts,jsx,tsx}", // if using Next.js app directory
    "./components/**/*.{js,ts,jsx,tsx}", // if you have a shared components folder
  ],

  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};
