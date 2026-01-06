/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        background: "#0a0a0a",
        primary: "#00ff88",
        secondary: "#ffff00",
        surface: "#1a1a1a",
        "surface-dim": "#333333",
      },
    },
  },
  plugins: [],
};
