/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Hacky way to ensure dynamic some classes work
    'bg-red-400',
    'bg-red-500',
    'bg-green-400',
    'bg-green-500',
    'bg-amber-400',
    'bg-amber-500',
    'bg-slate-400',
    'bg-slate-500'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Red Hat Display"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
