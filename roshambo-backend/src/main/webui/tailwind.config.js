/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  safelist: [
    'bg-blue',
    'bg-red'
  ],
  theme: {
    extend: {
      colors: {
        red: '#ee0000',
        blue: '#0066cc',
        grey: '#3d3f42',
        black: '#212427'
      },
      fontFamily: {
        'sans': ['"Red Hat Display"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
