import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f8ff',
          100: '#e0f0ff',
          200: '#c0e0ff',
          300: '#80c0ff',
          400: '#4da0ff',
          500: '#0080ff',
          600: '#0066cc',
          700: '#004c99',
          800: '#003366',
          900: '#001933',
          950: '#000d1a',
        },
      },
      maxWidth: {
        '1200': '1200px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
  ],
};

export default config;