/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Roboto", "sans-serif"],
        noto: ["'Source Serif 4'", "serif"],
        code: ["'Source Code Pro'", "monospace"],
      },
      colors: {
        palBg: "#9ab0a6",
        pal1: "#F2E7D5",
        pal2: "#9f5871",
        pal3: "#e7e7e7",
        pal4: "#d38878",
        pal5: "#3d607b",
        pal6: "#b16c6c",
        palText: "#f5f5f5 ",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

/* palBg: "#222831",
        pal1: "#30475E",
        pal2: "#F05454",
        pal3: "#E8E8E8",
        pal4: "", */
