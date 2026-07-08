/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        yanmar: {
          red:       '#CC0000',
          'red-dark':'#AA0000',
          dark:      '#1C1C1C',
          gray:      '#F7F7F7',
          border:    '#E8E8E8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
