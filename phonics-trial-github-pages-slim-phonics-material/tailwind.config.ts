import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#202436",
        sky: "#48A8F0",
        mint: "#22C7A5",
        lemon: "#FFE14D",
        coral: "#FF6B6B",
        lilac: "#7C6EF8",
        paper: "#F8FBFF"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(35, 45, 80, 0.12)"
      },
      fontFamily: {
        display: ["Arial", "Helvetica", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
