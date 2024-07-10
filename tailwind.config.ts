/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['components/**/*.{vue,js,ts}', 'layouts/**/*.vue', 'pages/**/*.vue', 'App.{js,ts,vue}', 'app.{js,ts,vue}', 'Error.{js,ts,vue}', 'error.{js,ts,vue}', 'content/**/*.md'],
  darkMode: 'class',
  theme: {
    fontSize: {
      '3xs': ['0.5rem', '0.5625rem'],
      '2xs': ['0.625rem', '0.75rem'],
      xs: ['0.75rem', '0.875rem'],
      sm: ['0.875rem', '1.0625rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.25rem', '1.5625rem'],
      xl: ['1.5rem', '1.875rem'],
      '2xl': ['2rem', '2.5rem'],
      '3xl': ['2.5rem', '3.125rem'],
      '4xl': ['3rem', '3.625rem'],
      '5xl': ['3.5rem', '4.1875rem'],
    },
    fontFamily: {
      main: ['Oxanium', 'sans-serif'],
      sub: ['Oxanium', 'sans-serif'],
    },
    fontWeight: {
      light: 300,
      regular: 400,
      'semi-bold': 500,
      bold: 600,
    },
    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      light: {
        400: '#E8EDF4',
        500: '#D3DBEA',
        600: '#BDC9E0',
      },
      black: '#000000',
      dark: {
        400: '#101724',
        500: '#1B2537',
        600: '#23324D',
      },
      primary: {
        400: '#E8D78E',
        500: '#CABC7C',
        600: '#988D5D',
      },
      success: {
        400: '#89E774',
        500: '#4AD42B',
        600: '#66BE52',
      },
      warning: {
        400: '#F0CD42',
        500: '#ECC113',
        600: '#D7B942',
      },
      alert: {
        400: '#F24067',
        500: '#E11D48',
        600: '#C02650',
      },
    },
    extend: {},
  },
}
