/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: '#9B6DFF',
        'accent-dim': '#7B4DDF',
        'accent-glow': 'rgba(155, 109, 255, 0.15)',
        surface: 'rgba(255, 255, 255, 0.04)',
        'surface-hover': 'rgba(255, 255, 255, 0.07)',
        'surface-active': 'rgba(255, 255, 255, 0.10)',
        border: 'rgba(255, 255, 255, 0.08)',
        'border-accent': 'rgba(155, 109, 255, 0.3)',
        muted: 'rgba(255, 255, 255, 0.35)',
        subtle: 'rgba(255, 255, 255, 0.55)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-lg': '0 24px 64px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
        accent: '0 0 40px rgba(155, 109, 255, 0.25)',
        'accent-sm': '0 0 20px rgba(155, 109, 255, 0.15)',
      },
      backdropBlur: {
        glass: '24px',
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'breathe-slow': 'breathe 12s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.15)', opacity: '0.9' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(155, 109, 255, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(155, 109, 255, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
