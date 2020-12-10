module.exports = {
  purge: {
    layers: ['components', 'utilities'],
    content: ['./src/**/*.tsx'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        '-10': '-10',
      },
      gridAutoRows: (theme) => theme('height'),
      fontSize: {
        xxs: ['0.5rem', '0.75rem'],
      },
    },
  },
  variants: {
    extend: {
      borderRadius: ['first', 'last'],
      ringWidth: ['hover'],
      ringColor: ['hover'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
