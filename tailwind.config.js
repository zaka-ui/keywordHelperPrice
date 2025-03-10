/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
 theme: {
    extend: {
      colors: {
        'custom-blue': '#2e326d',
        'custom-dark': '#16172d',
      },
      animation: {
        'gradient-x': 'gradientX 5s ease infinite',
      },
      keyframes: {
        gradientX: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      },
    },
  },
  plugins: [],
}