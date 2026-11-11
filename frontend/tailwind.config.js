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
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Electric Spatial Blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        spatial: {
          bg: '#0a0d14',
          surface: 'rgba(18, 24, 38, 0.72)',
          'surface-light': 'rgba(30, 41, 59, 0.6)',
          card: 'rgba(255, 255, 255, 0.04)',
          'card-hover': 'rgba(255, 255, 255, 0.08)',
          'card-active': 'rgba(59, 130, 246, 0.15)',
          border: 'rgba(255, 255, 255, 0.12)',
          'border-light': 'rgba(255, 255, 255, 0.06)',
          'border-glow': 'rgba(96, 165, 250, 0.4)',
          text: '#f8fafc',
          muted: '#94a3b8',
          accent: '#3b82f6',
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
        'spatial-window': '0 30px 80px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.15) inset',
        'spatial-card': '0 10px 30px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'spatial-glow': '0 0 25px -5px rgba(59, 130, 246, 0.5), 0 8px 20px -6px rgba(59, 130, 246, 0.4)',
        'spatial-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.5)',
        'spatial-dock': '0 12px 40px -8px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.18)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'radar-spin': 'spin 12s linear infinite',
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
