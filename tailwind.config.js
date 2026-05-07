/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        credex: {
          dark: '#0F4C3E',
          light: '#00A878',
          accent: '#FFB703',
        }
      }
    },
  },
  plugins: [],
}
