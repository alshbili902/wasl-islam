/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          DEFAULT: '#072A20',
          light: '#0D4334',
          dark: '#041A13',
          muted: '#125341',
        },
        gold: {
          DEFAULT: '#C5A059',
          light: '#DFC082',
          dark: '#9F7D3B',
          glow: 'rgba(197, 160, 89, 0.25)',
        },
        pearl: {
          DEFAULT: '#F8FAF9',
          card: '#FFFFFF',
          subtle: '#EEF3F0',
        },
        night: {
          DEFAULT: '#0B131E',
          card: '#111D2C',
          elevated: '#172639',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', '-apple-system', 'sans-serif'],
        quran: ['Amiri', 'Traditional Arabic', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(197, 160, 89, 0.3)',
        'royal-glass': '0 8px 32px 0 rgba(7, 42, 32, 0.12)',
      },
    },
  },
  plugins: [],
};

