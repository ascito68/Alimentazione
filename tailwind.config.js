/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colazione: '#F59E0B',
        pranzo: '#10B981',
        spuntino: '#F97316',
        cena: '#6366F1',
      },
    },
  },
  plugins: [],
}
