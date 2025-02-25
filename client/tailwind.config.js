/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        amoled: {
          black: '#000000',
          dark: '#121212',
          gray: '#1e1e1e',
          light: '#2d2d2d',
          accent: '#8c52ff',
          text: {
            primary: '#ffffff',
            secondary: '#b3b3b3',
            disabled: '#757575'
          }
        }
      }
    },
  },
  plugins: [],
} 