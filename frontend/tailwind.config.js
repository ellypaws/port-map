/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'semi-transparent': 'rgba(0, 0, 0, 0.5)',
        // transparent: 'transparent',
        // current: 'currentColor',
        // 'white': '#ffffff',
        // 'purple': '#3f3cbb',
        // 'midnight': '#121063',
        // 'metal': '#565584',
        // 'tahiti': '#3ab7bf',
        // 'silver': '#ecebff',
        // 'bubble-gum': '#ff77e9',
        // 'bermuda': '#78dcca',
      }
    },
  },
  plugins: [require("daisyui")],
  darkMode: 'media'
}