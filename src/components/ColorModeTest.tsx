'use client';

import { Box, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';

export function ColorModeTest() {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('gray.800', 'white');
  
  return (
    <Box 
      p={4} 
      bg={bg} 
      color={color}
      border="2px solid"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      borderRadius="md"
      mb={4}
    >
      <Text fontWeight="bold">Color Mode Test</Text>
      <Text>Current mode: {colorMode}</Text>
      <Text>Background should change with mode</Text>
    </Box>
  );
}
