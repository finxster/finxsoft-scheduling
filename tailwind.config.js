/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atipical: {
          blue: '#3B82F6',
          red: '#EF4444',
          green: '#10B981',
          yellow: '#F59E0B',
        },
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(44, 62, 80, 0.08)',
        card: '0 4px 12px rgba(44, 62, 80, 0.1)',
      },
    },
  },
  plugins: [],
}
