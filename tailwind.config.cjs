module.exports = {
  content: ['./index.html', './cookies.html'],
  theme: {
    extend: {
      colors: {
        'brand-beige': '#e8e4df',
        'brand-dark': '#2c2c2c',
        'brand-accent': '#d35400',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      scale: { 140: '1.4' },
      brightness: { 60: '.6' },
    },
  },
};
