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
        display: ["Raleway", "sans-serif"],
        noto: ["'Source Serif 4'", "serif"],
      },
      colors: {
        palBg: "#FFF4E0",
        pal2: "#FFBF9B",
        pal1: "#B46060",
        pal3: "#4D4D4D",
        pal4: "#ef9492",
        pal5: "",
        pal6: "",
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
