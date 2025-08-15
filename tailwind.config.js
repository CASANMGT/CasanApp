/** @type {import('tailwindcss').Config} */
export default {
  // darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        background1: "url('/src/assets/illustrations/splash.png')",
        background2: "url('/src/assets/illustrations/background2.png')",
        bgComingSoon: "url('/src/assets/illustrations/bg-coming-soon.png')",
        chargingLocation:
          "url('/src/assets/illustrations/charging-location.png')",
      },

      colors: {
        // BASE
        baseGray: "#F5F5F5",
        baseLightGray: "#F5F8F9",
        baseLightGray2: "#FAFAFA",

        // BLACK
        blackBold: "#1A1A1A",
        black100: "#37394A",
        black90: "#4B4D5C",
        black70: "#737480",
        black50: "#9B9CA4",
        black30: "#C3C4C9",
        black20: "#E4E4E7",
        black10: "#EBEBED",
        black5: "#F5F5F6",
        darkMode:"#252526",

        // PRIMARY
        primary100: "#2dba9d",
        primary90: "#30B4BD",
        primary70: "#5EC5CC",
        primary50: "#8CD5DA",
        primary30: "#BAE6E9",
        primary10: "#E8F7F8",

        // SECONDARY
        secondary100: "#EDD22D",
        secondary90: "#EFD642",
        secondary70: "#F2DF6C",
        secondary50: "#F6E896",
        secondary30: "#FAF2C0",
        secondary10: "#FDFBEA",

        // OTHER
        gold:'#D79D20',
        orange: "#FFBE4D",
        strokeOrange: "#FFE5B8",
        lightOrange: "#FFFAF1",
        red: "#DD2E44",
        strokeRed: "#F1ABB4",
        lightRed: "#FCEEF0",
        green: "#19AD3C",
        strokeGreen: "#A3D3B1",
        lightGreen: "#EDF8EF",
      },

      animation: {
        pulseRing: "pulseRing 2s infinite ease-in-out",
        rotateGradient: "rotateGradient 6s linear infinite",
        soundWave: "soundWave 1.5s ease-out infinite",
        charging: "charging 2s linear infinite",
        scan: "scan 5s linear infinite",
        slideDown: 'slideDown 1s ease-in-out',
      },

      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: 0.6 },
          "50%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0.6 },
        },
        rotateGradient: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        soundWave: {
          "0%": { transform: "scale(0.8)", opacity: 0.8 },
          "70%": { transform: "scale(1)", opacity: 0.3 },
          "100%": { transform: "scale(1.2)", opacity: 0 },
        },
        charging: {
          "0%": { transform: "scale(0.8)", opacity: 0.4 },
          "50%": { transform: "scale(1)", opacity: 0.6 },
          "100%": { transform: "scale(0.8)", opacity: 0.8 },
        },
        scan: {
          "0%": { top: "0", opacity: 0.3, transform: "scale(0.8)" },
          "12%": { top: "25%", opacity: 1, transform: "scale(1)" },
          "24%": { top: "50%", opacity: 1, transform: "scale(1)" },
          "36%": { top: "75%", opacity: 1, transform: "scale(1)" },
          "50%": { top: "100%", opacity: 0.3, transform: "scale(0.8)" },
          "64%": { top: "75%", opacity: 1, transform: "scale(1)" },
          "76%": { top: "50%", opacity: 1, transform: "scale(1)" },
          "88%": { top: "25%", opacity: 1, transform: "scale(1)" },
          "100%": { top: "0", opacity: 0.3, transform: "scale(0.8)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20rem)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
