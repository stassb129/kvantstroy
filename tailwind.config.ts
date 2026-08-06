import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1A1A1A',
          900: '#101010',
          800: '#1A1A1A',
          700: '#232323',
          600: '#2E2E2E',
          500: '#3A3A3A',
        },
        accent: {
          DEFAULT: '#E86A00',
          light: '#FF8A26',
          dark: '#C25600',
        },
        mist: '#F5F5F5',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #FF8A26 0%, #E86A00 60%, #C25600 100%)',
      },
      boxShadow: {
        accent: '0 18px 40px -12px rgba(232, 106, 0, 0.55)',
        glass: '0 24px 60px -20px rgba(0, 0, 0, 0.75)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(0, -28px, 0) scale(1.06)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
          '50%': { transform: 'translate3d(24px, 18px, 0) rotate(8deg)' },
        },
      },
      animation: {
        float: 'float 12s ease-in-out infinite',
        'float-slow': 'float-slow 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
