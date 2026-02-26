/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        steel: {
          50: '#f4f6f8',
          100: '#e3e7ec',
          200: '#c9d1da',
          300: '#a3b1c0',
          400: '#768aa0',
          500: '#5b6f85',
          600: '#4e5d71',
          700: '#434e5e',
          800: '#3b4350',
          900: '#343a45',
          950: '#22272e',
        },
        forge: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
