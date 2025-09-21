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

export function Header() {
  const { t, isLoaded } = useLanguage();

  return (
    <Box as="header" bg="white" shadow="md" borderBottom="1px" borderColor="gray.200">
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
                  color="gray.900" 
                  fontFamily="heading"
                  fontWeight="bold"
                >
                  {t('title')}
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  {t('subtitle')}
                </Text>
              </VStack>
            </HStack>
          </Link>
          
          <HStack spacing={4}>
            <LanguageSelector />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}