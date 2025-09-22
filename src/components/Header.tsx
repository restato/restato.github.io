'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  HStack,
  Avatar,
  VStack
} from '@chakra-ui/react';
import { useLanguage } from './LanguageProvider';
import { LanguageSelector } from './LanguageSelector';
import { ColorModeButton } from './ui/color-mode';

export function Header() {
  const { t } = useLanguage();

  return (
    <Box as="header" bg="bg.canvas" shadow="md" borderBottom="1px" borderColor="border">
      <Container maxW="7xl" py={4}>
        <Flex align="center" justify="space-between">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <HStack spacing={3}>
              <Avatar 
                size="md" 
                bg="gradient(to-br, brand.500, purple.600)" 
                color="white"
                name="🎯"
                src=""
              />
              <VStack align="start" spacing={0}>
                <Heading 
                  size="lg" 
                  color="text" 
                  fontFamily="heading"
                  fontWeight="bold"
                >
                  {t('title')}
                </Heading>
                <Text fontSize="sm" color="text.muted">
                  {t('subtitle')}
                </Text>
              </VStack>
            </HStack>
          </Link>
          
          <HStack spacing={4}>
            {/* <ColorModeButton /> */}
            <LanguageSelector />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}