/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        spatial: {
          bg: '#101012',
          surface: 'rgba(24, 24, 27, 0.78)',
          card: 'rgba(255, 255, 255, 0.04)',
          border: 'rgba(255, 255, 255, 0.1)',
          text: '#f4f4f5',
          muted: '#a1a1aa',
        }
      },
      fontFamily: {
        sans: ['SF Pro Display', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '48px',
        '4xl': '64px',
      },
      boxShadow: {
        'spatial-window': '0 28px 70px -16px rgba(0, 0, 0, 0.72), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)',
        'spatial-card': '0 10px 30px -8px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.09)',
        'spatial-glow': '0 6px 20px -4px rgba(5, 150, 105, 0.4)',
        'spatial-dock': '0 12px 36px -8px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
