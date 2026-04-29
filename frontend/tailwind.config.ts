import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#07080d',
        abyss: '#0d0f1a',
        surface: '#13172a',
        border: '#1e2340',
        muted: '#2d3460',
        'text-secondary': '#7b8db0',
        'text-primary': '#e8ecf4',
        'text-bright': '#ffffff',
        gold: '#d4a017',
        'gold-light': '#f0c040',
        'gold-glow': 'rgba(212,160,23,0.15)',
        teal: '#00c9a7',
        'teal-glow': 'rgba(0,201,167,0.12)',
        danger: '#ff4757',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        hero: 'clamp(3rem, 6vw, 5.5rem)',
      },
      maxWidth: {
        content: '1280px',
      },
      borderRadius: {
        card: '1rem',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        power: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      transitionDuration: {
        fast: '200ms',
        base: '350ms',
        slow: '600ms',
        slower: '900ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'gold-pulse': 'goldPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,160,23,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(212,160,23,0)' },
        },
      },
      boxShadow: {
        'gold-glow': '0 0 30px rgba(212,160,23,0.2)',
        'teal-glow': '0 0 30px rgba(0,201,167,0.15)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4a017, #f0c040)',
        'teal-gradient': 'linear-gradient(135deg, #00c9a7, #00a896)',
        'surface-gradient': 'linear-gradient(180deg, #13172a 0%, #0d0f1a 100%)',
        'void-radial': 'radial-gradient(ellipse at top, #13172a 0%, #07080d 70%)',
      },
    },
  },
  plugins: [],
};

export default config;
