/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bakeryPink: '#ffe5ec',
        bakerySoftPink: '#fff5f8',
        bakeryPrimary: '#ff6f91',
        bakeryBrown: '#5C4033',
        bakeryCream: '#fff5f8'
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif']
      }
    }
  },
  plugins: []
};

