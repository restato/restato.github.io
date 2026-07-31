/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F7F8F7',
          100: '#EDF3EF',
          200: '#DCE3DF',
          300: '#9CC4AD',
          400: '#70A889',
          500: '#19553C',
          600: '#236B4C',
          700: '#2C7655',
          800: '#303A34',
          900: '#1D3D2F',
        },
        accent: {
          50: '#F7F8F7',
          100: '#EDF3EF',
          200: '#DCE3DF',
          300: '#9CC4AD',
          400: '#70A889',
          500: '#19553C',
          600: '#236B4C',
          700: '#2C7655',
          800: '#303A34',
          900: '#1D3D2F',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Segoe UI', 'sans-serif'],
        mono: ['D2Coding', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            code: {
              backgroundColor: 'var(--surface-soft)',
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
    },
  },
  plugins: [],
};
