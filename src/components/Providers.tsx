'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/lib/theme';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
}