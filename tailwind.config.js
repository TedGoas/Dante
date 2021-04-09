const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    content: ['./src/**/*.njk', './src/**/*.svg'],
    layers: ['components', 'utilities'],
    options: {
      safelist: ['header-shadow', '-translate-y-full', 'hidden']
    }
  },
  theme: {
    screens: {
      sm: {'max':'640px'},
      md: {'max':'768px'},
      lg: {'max':'1024px'}
    },
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
      'mono': ['Menlo', 'Monaco', 'Cascadia Mono', 'Roboto Mono', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New', 'monospace'],
      'display': ['Caveat Brush', 'cursive']
    },
    fontSize: {
      'xs': '.875rem',
      'sm': '1rem',
      'base': '1.35rem',
      'lg': '1.5rem',
      'xl': '1.875rem',
      '2xl': '2.125rem',
      '3xl': '2.5rem',
      '4xl': '3.5rem',
      '5xl': '4.5rem',
      '6xl': '5.5rem',
      '7xl': '6.5rem'
      },
    colors: {
      sitebg: '#0E091D',
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.blueGray,
      teal: colors.teal,
      yellow: colors.yellow,
      red: colors.red,
      pink: colors.pink
    },
    extend: {

    },
  }
  /*plugins: [
    require('@tailwindcss/typography')
  ]*/
};
