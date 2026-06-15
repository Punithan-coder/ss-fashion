/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          cream: '#FFF8F5',
          ivory: '#FFF8F5',
          blush: '#FFE6E8',
          softPink: '#F6D8E2',
          rose: '#D89BB5',
          rosePink: '#D89BB5',
          champagne: '#D4B483',
          gold: '#D4B483',
          darkRose: '#B66A8C',
          charcoal: '#2C2C2C',
          stone: '#4A4046',
          grayLight: '#E8E3DF',
          grayDark: '#7E7A7A',
          lavender: '#F4EDF6',
          lavenderAccent: '#E3D7EB',
          beige: '#F6ECE2',
          warmBeige: '#ECD7C3',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideUp: 'slideUp 0.6s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
