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
          'orange-light': '#FF7A1F',
          cream: '#FAF8F5',
          white: '#FFFFFF',
          gray: '#E6E6E6',
          'gray-dark': '#CCCCCC',
          'text-dark': '#333333',
          'text-light': '#666666',
          gold: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Literata', 'Georgia', 'serif'],
      },
      backgroundColor: {
        'audible-main': '#FAF8F5',
        'audible-secondary': '#FFFFFF',
      },
      textColor: {
        'audible-primary': '#333333',
        'audible-secondary': '#666666',
      },
    },
  },
  plugins: [],
}

