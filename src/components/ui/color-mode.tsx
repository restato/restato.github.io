'use client';

import { Button, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button 
      onClick={toggleColorMode} 
      size="md" 
      variant="ghost"
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
    >
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}

// Re-export Chakra UI hooks for consistency
export { useColorMode, useColorModeValue };
