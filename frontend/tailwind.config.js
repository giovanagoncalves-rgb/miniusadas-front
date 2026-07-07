/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        yanmar: {
          red:       '#D40000',
          'red-dark':'#A80000',
          dark:      '#1A1A1A',
          gray:      '#F5F5F5',
          border:    '#E0E0E0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
