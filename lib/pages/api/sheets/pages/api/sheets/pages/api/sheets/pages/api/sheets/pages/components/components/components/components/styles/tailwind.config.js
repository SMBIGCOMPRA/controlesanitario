module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7fa',
          100: '#e0eef5',
          200: '#b8dbe3',
          300: '#8bb4bd',
          400: '#5f8e98',
          500: '#0f4e5f',
          600: '#0a3a48',
          700: '#0b3b4c',
          800: '#0a3645',
          900: '#092e3c',
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.2, 0.9, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s ease',
        'slide-down': 'slideDown 0.2s ease',
      },
    },
  },
  plugins: [],
}
