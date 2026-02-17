/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0f0f0f',
        'secondary-dark': '#1a1a1a',
        'accent-red': '#ff4757',
        'accent-blue': '#2e86de',
        'accent-green': '#00d26a',
        'accent-purple': '#9c88ff',
        'text-primary': '#ffffff',
        'text-secondary': '#b2bec3',
        'text-muted': '#636e72',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      screens: {
        'xs': '360px',
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeIn 0.5s ease-out',
      },
      fontSize: {
        'xxs': '0.625rem',
        'xxs-plus': '0.6875rem',
        'micro': '0.5625rem',
      },
      spacing: {
        '0.5': '0.125rem',
        '0.75': '0.1875rem',
        '1.25': '0.3125rem',
        '1.75': '0.4375rem',
        '18': '4.5rem',
        '88': '22rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      maxWidth: {
        'xs': '20rem',
        '375': '23.4375rem',
      },
    },
  },
  plugins: [],
}