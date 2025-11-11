/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        audible: {
          orange: '#F86800',
          'orange-dark': '#E05D00',
          navy: '#1F2937',
          'navy-light': '#374151',
          cream: '#F9FAFB',
          gold: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Literata', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

