'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';
import { useLanguage } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const games = [
  {
    id: 'wheelOfFortune',
    icon: '🎯',
    gradient: 'linear(to-br, purple.500, blue.500)',
  },
  // {
  //   id: 'bingo',
  //   icon: '🎯',
  //   gradient: 'linear(to-br, blue.500, cyan.500)',
  // },
  // {
  //   id: 'lottery',
  //   icon: '🎫',
  //   gradient: 'linear(to-br, green.500, teal.500)',
  // },
  // {
  //   id: 'coinFlip',
  //   icon: '🪙',
  //   gradient: 'linear(to-br, yellow.500, orange.500)',
  // },
  // {
  //   id: 'dice',
  //   icon: '⚀',
  //   gradient: 'linear(to-br, purple.500, violet.500)',
  // },
  // {
  //   id: 'cards',
  //   icon: '🃏',
  //   gradient: 'linear(to-br, indigo.500, blue.500)',
  // },
  // {
  //   id: 'namePicker',
  //   icon: '📝',
  //   gradient: 'linear(to-br, teal.500, cyan.500)',
  // },
  // {
  //   id: 'numberRange',
  //   icon: '🔢',
  //   gradient: 'linear(to-br, pink.500, rose.500)',
  // },
  // {
  //   id: 'rockPaperScissors',
  //   icon: '✂️',
  //   gradient: 'linear(to-br, gray.500, slate.500)',
  // },
  // {
  //   id: 'teamDivider',
  //   icon: '👥',
  //   gradient: 'linear(to-br, orange.500, red.500)',
  // },
];

export default function Home() {
  const { t, isLoaded } = useLanguage();
  const cardBg = useColorModeValue('white', 'gray.800');
  const featureBg = useColorModeValue('white', 'gray.700');

  // 번역이 로딩 중일 때 로딩 표시
  if (!isLoaded) {
    return (
      <Container maxW="7xl" py={8}>
        <Box textAlign="center">
          <Text>로딩 중...</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      {/* Hero Section */}


      {/* Games Grid */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        mb={16}
      >
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3, xl: 4 }} 
          spacing={6}
        >
          {games.map((game, index) => (
            <MotionCard
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              bg={cardBg}
              shadow="lg"
              borderRadius="xl"
              overflow="hidden"
              cursor="pointer"
              _hover={{
                shadow: 'xl',
                transform: 'translateY(-4px)',
              }}
              sx={{
                transition: 'all 0.3s ease',
              }}
            >
              <Link href={`/games/${game.id === 'wheelOfFortune' ? 'wheel-of-fortune' : game.id}`}>
                <Box
                  bgGradient={game.gradient}
                  p={6}
                  color="white"
                  textAlign="center"
                >
                  <Text fontSize="4xl" mb={4}>
                    {game.icon}
                  </Text>
                  <Heading size="md" mb={2} fontFamily="heading">
                    {t(`games.${game.id}`)}
                  </Heading>
                  <Text fontSize="sm" opacity={0.9}>
                    {t(`gameDescriptions.${game.id}`)}
                  </Text>
                </Box>
              </Link>
            </MotionCard>
          ))}
        </SimpleGrid>
      </MotionBox>
    </Container>
  );
}