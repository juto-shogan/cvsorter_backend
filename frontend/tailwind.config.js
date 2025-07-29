// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // <--- Make sure this line covers your component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}