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
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'Malgun Gothic',
          'Hiragino Sans',
          'Yu Gothic',
          'ui-monospace',
          'monospace',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            code: {
              backgroundColor: '#1e1e2e',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.625rem',
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
    },
  },
  plugins: [],
};
