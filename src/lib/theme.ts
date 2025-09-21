'use client';

import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  fonts: {
    heading: `var(--font-fredoka), cursive`,
    body: `var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
    accent: {
      50: '#fff3e0',
      100: '#ffe0b2',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa726',
      500: '#ff9800',
      600: '#fb8c00',
      700: '#f57c00',
      800: '#ef6c00',
      900: '#e65100',
    }
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
        lineHeight: 'base',
      },
      '*': {
        boxSizing: 'border-box',
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
            bg: 'white',
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
            borderColor: 'gray.200',
            _hover: {
              borderColor: 'brand.200',
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
          color: 'gray.600',
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