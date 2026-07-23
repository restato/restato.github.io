/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf5ef',
          100: '#d9e8dd',
          200: '#b4d0bc',
          300: '#8db89a',
          400: '#619777',
          500: '#2f7658',
          600: '#174a35',
          700: '#123b2a',
          800: '#0d2e21',
          900: '#092217',
        },
        accent: {
          50: '#fcf3ed',
          100: '#f5e1d2',
          200: '#ebc4a9',
          300: '#dfa17a',
          400: '#c98358',
          500: '#a7663b',
          600: '#8d522f',
          700: '#734126',
          800: '#5b321e',
          900: '#422416',
        },
      },
      fontFamily: {
        sans: [
          'D2Coding',
          'Noto Sans',
          'Noto Sans KR',
          'Noto Sans JP',
          'Noto Sans SC',
          'Noto Sans Arabic',
          'ui-monospace',
          'monospace',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            code: {
              backgroundColor: '#1e1e2e',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
