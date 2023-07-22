/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Hacky way to ensure dynamic some classes work
    'bg-red',
    'bg-green',
    'bg-yellow'
  ],
  theme: {
    extend: {
      colors: {
        red: '#ee0000',
        blue: '#0066cc',
        yellow: '#e6ad3b',
        green: '#6ec664',
        grey: '#212427'
      },
      fontFamily: {
        'sans': ['"Red Hat Display"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
