'use client';

import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  fonts: {
    heading: `var(--font-fredoka), cursive`,
    body: `var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#1db954', // Spotify Green
      600: '#1ed760',
      700: '#1aa34a',
      800: '#168f3a',
      900: '#0f7a2e',
    },
    accent: {
      50: '#fef7ff',
      100: '#fdf2ff',
      200: '#fce7ff',
      300: '#f8d4fe',
      400: '#f0abfc',
      500: '#e879f9', // Vibrant Purple
      600: '#d946ef',
      700: '#c026d3',
      800: '#a21caf',
      900: '#86198f',
    },
    spotify: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#1db954', // Main Spotify Green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    neon: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef', // Neon Pink
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    }
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#0a0a0a' : 'gray.50', // Spotify-like dark background
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        lineHeight: 'base',
      },
      '*': {
        boxSizing: 'border-box',
      },
    }),
  },
  semanticTokens: {
    colors: {
      'bg.canvas': {
        default: 'white',
        _dark: '#0a0a0a', // Deep Spotify black
      },
      'bg.subtle': {
        default: 'gray.50',
        _dark: '#121212', // Spotify card background
      },
      'bg.muted': {
        default: 'gray.100',
        _dark: '#1a1a1a', // Slightly lighter than canvas
      },
      text: {
        default: 'gray.900',
        _dark: '#ffffff',
      },
      'text.muted': {
        default: 'gray.600',
        _dark: '#b3b3b3', // Spotify muted text
      },
      'text.subtle': {
        default: 'gray.500',
        _dark: '#6a6a6a',
      },
      border: {
        default: 'gray.200',
        _dark: '#2a2a2a', // Subtle borders in dark mode
      },
      'border.muted': {
        default: 'gray.100',
        _dark: '#1a1a1a',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: {
          borderRadius: 'lg',
          fontWeight: 'semibold',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        outline: {
          borderRadius: 'lg',
          fontWeight: 'semibold',
          _hover: {
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'sm',
          _hover: {
            boxShadow: 'lg',
            transform: 'translateY(-4px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
      variants: {
        elevated: {
          container: {
            bg: { base: 'white', _dark: 'gray.800' },
            boxShadow: 'md',
            _hover: {
              boxShadow: 'xl',
              transform: 'translateY(-6px)',
            },
          },
        },
        outline: {
          container: {
            border: '1px solid',
            borderColor: { base: 'gray.200', _dark: 'gray.600' },
            _hover: {
              borderColor: { base: 'brand.200', _dark: 'brand.400' },
              boxShadow: 'md',
            },
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: 'bold',
      },
      sizes: {
        '2xl': {
          fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
          lineHeight: 'shorter',
        },
        xl: {
          fontSize: { base: '2xl', md: '3xl' },
          lineHeight: 'short',
        },
        lg: {
          fontSize: { base: 'xl', md: '2xl' },
          lineHeight: 'short',
        },
      },
    },
    Text: {
      baseStyle: {
        lineHeight: 'tall',
      },
      variants: {
        subtitle: {
          fontSize: { base: 'lg', md: 'xl' },
          color: { base: 'gray.600', _dark: 'gray.400' },
          lineHeight: 'tall',
        },
      },
    },
    Container: {
      baseStyle: {
        maxW: '7xl',
        px: { base: 4, md: 6, lg: 8 },
      },
    },
  },
  space: {
    '18': '4.5rem',
  },
  sizes: {
    '7xl': '80rem',
  },
})