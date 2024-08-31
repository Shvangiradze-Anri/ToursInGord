/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        "section-icon-width": "calc(11px + 0.300625dvw)",
      },

      boxShadow: {
        "whole-black": [
          "inset 0px -100px 70px black",
          "inset 0px 100px 70px black",
        ],
        "whole-white": [
          "inset 0px -100px 70px white",
          "inset 0px 100px 70px  white",
        ],
        "whole-black-Book": [
          "inset 0px -50px 30px black",
          "inset 0px 50px 30px black",
        ],
        "whole-white-Book": [
          "inset 0px -50px 30px white",
          "inset 0px 50px 30px  white",
        ],
        "bot-black": "inset 0px -100px 70px 20px black",
        "bot-white": "inset 0px -100px 70px 20px white",
        "orange-drop": " 0px 0px 20px 5px #e89c3e",
        "black-drop": " 0px 0px 20px 5px black",
        "blue-drop": " 0px 0px 20px 5px #1E40AF",
        "white-drop": " 0px 0px 20px 5px white",
        "aside-shadow": "0px 0px 20px #00e1ff77",
      },
      fontSize: {
        "res-sm": "calc(11px + 0.300625dvw)",
        "res-md-sm": "calc(14px + 0.300625dvw)",
        "res-base": "calc(16px + 0.300625dvw)",
        "res-md": "calc(17px + 0.390625dvw)",
        "res-lg": "calc(21px + 0.890625dvw)",
        "res-xl": "calc(24px + 1.390625dvw)",

        "res-special-galerry-title": "calc(18px + 0.800625dvw)",
        "res-special-galerry-text": "calc(13px + 0.300625dvw)",
        "res-special-checkbox": "calc(5px + 0.300625dvw)",
        "res-special-errors": "calc(9px + 0.300000dvw)",
      },
      screens: {
        "min-300": "300px",
        "min-400": "400px",
        "min-500": "500px",
        "min-600": "600px",
        "min-700": "700px",
        "min-800": "800px",
        "min-900": "900px",
        "min-1000": "1000px",
        "min-1100": "1100px",
        "min-1200": "1200px",
        "min-1300": "1300px",
        "min-1400": "1400px",
        "min-1500": "1500px",
        "min-1600": "1600px",
        "min-2000": "2000px",
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
};
