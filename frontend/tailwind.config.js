/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#E94560', dark: '#C73E54', light: '#FF6B8A' },
        secondary: { DEFAULT: '#0F3460', dark: '#0A2440', light: '#1A4A80' },
        accent: '#F4D03F',
        background: '#0A0A0A',
        surface: { DEFAULT: '#161616', elevated: '#1F1F1F' }
      },
      fontFamily: { heading: ['Playfair Display', 'serif'], body: ['DM Sans', 'sans-serif'] }
    }
  },
  plugins: []
};