/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'Outfit', 'sans-serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#07070C',
          900: '#0C0C14',
          800: '#14141F',
          700: '#1E1E2E',
        },
        gold: {
          300: '#F5E6C8',
          400: '#E8C872',
          500: '#D4AF37',
        },
      },
      boxShadow: {
        glow: '0 0 60px rgba(232, 93, 193, 0.35)',
        gold: '0 0 40px rgba(212, 175, 55, 0.28)',
      },
    },
  },
  plugins: [],
};
