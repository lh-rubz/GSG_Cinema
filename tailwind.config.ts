/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { toast: {
      light: {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
      },
      dark: {
        success: 'dark:bg-green-900 dark:text-green-100 dark:border-green-800',
        error: 'dark:bg-red-900 dark:text-red-100 dark:border-red-800',
      }
    }},
  },
  plugins: [],
}