/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        krakow: {
          blue: '#0052A5',
          gold: '#E3A824',
          dark: '#0A192F',
          light: '#F4F7FB',
          border: '#D0D7DE'
        }
      }
    },
  },
  plugins: [],
}
