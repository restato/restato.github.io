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
  VStack,
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
    gradient: 'linear(135deg, #667eea 0%, #764ba2 100%)', // 보라-파랑 생생한 그라데이션
    category: 'popular'
  },
  // {
  //   id: 'lottery',
  //   icon: '🎫',
  //   gradient: 'linear(135deg, #f093fb 0%, #f5576c 100%)', // 핑크-빨강 그라데이션
  //   category: 'popular'
  // },
  // {
  //   id: 'coinFlip',
  //   icon: '🪙',
  //   gradient: 'linear(135deg, #ffecd2 0%, #fcb69f 100%)', // 따뜻한 오렌지
  //   category: 'quick'
  // },
  // {
  //   id: 'dice',
  //   icon: '🎲',
  //   gradient: 'linear(135deg, #a8edea 0%, #fed6e3 100%)', // 민트-핑크
  //   category: 'quick'
  // },
  // {
  //   id: 'cards',
  //   icon: '🃏',
  //   gradient: 'linear(135deg, #d299c2 0%, #fef9d7 100%)', // 라벤더-크림
  //   category: 'classic'
  // },
  // {
  //   id: 'namePicker',
  //   icon: '📝',
  //   gradient: 'linear(135deg, #89f7fe 0%, #66a6ff 100%)', // 시원한 파랑
  //   category: 'utility'
  // },
  // {
  //   id: 'numberRange',
  //   icon: '🔢',
  //   gradient: 'linear(135deg, #fdbb2d 0%, #22c1c3 100%)', // 노랑-청록
  //   category: 'utility'
  // },
  // {
  //   id: 'rockPaperScissors',
  //   icon: '✂️',
  //   gradient: 'linear(135deg, #e0c3fc 0%, #9bb5ff 100%)', // 연보라-하늘
  //   category: 'classic'
  // },
];

export default function Home() {
  const { t, isLoaded } = useLanguage();
  
  // 모든 useColorModeValue 호출을 컴포넌트 최상단에서 실행
  const loadingBg = useColorModeValue('gray.50', '#0a0a0a');
  const loadingTextColor = useColorModeValue('gray.800', 'white');
  const loadingMutedColor = useColorModeValue('gray.600', 'text.muted');
  const categoryHeaderColor = useColorModeValue('gray.800', 'white');
  const glassOverlayLight = useColorModeValue(
    'rgba(255, 255, 255, 0.25)',
    'rgba(255, 255, 255, 0.05)'
  );
  const glassBorderLight = useColorModeValue(
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 0.1)'
  );
  const glassOverlayHover = useColorModeValue(
    'rgba(255, 255, 255, 0.4)',
    'rgba(255, 255, 255, 0.1)'
  );
  const glassBorderHover = useColorModeValue(
    'rgba(255, 255, 255, 0.5)',
    'rgba(255, 255, 255, 0.2)'
  );
  
  // 카테고리별 게임 그룹핑
  const gamesByCategory = {
    popular: games.filter(game => game.category === 'popular'),
    quick: games.filter(game => game.category === 'quick'),
    classic: games.filter(game => game.category === 'classic'),
    utility: games.filter(game => game.category === 'utility'),
  };
  
  const categoryTitles = {
    popular: '인기 게임',
    quick: '빠른 게임',
    classic: '클래식 게임',
    utility: '유틸리티',
  };

  // 번역이 로딩 중일 때 로딩 표시
  if (!isLoaded) {
    return (
      <Box 
        minH="100vh" 
        bg={loadingBg}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={8}>
          {/* Spotify-style loading animation */}
          <MotionBox
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Box
              w="80px"
              h="80px"
              borderRadius="full"
              bgGradient="linear(45deg, #667eea, #f093fb, #fdbb2d)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                w: '60px',
                h: '60px',
                borderRadius: 'full',
                bg: loadingBg,
              }}
            >
              <Text fontSize="2xl" position="relative" zIndex={1}>
                🎯
              </Text>
            </Box>
          </MotionBox>
          
          <VStack spacing={4} textAlign="center">
            <MotionBox
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heading 
                size="lg" 
                color={loadingTextColor}
                fontFamily="heading"
              >
                게임 준비 중...
              </Heading>
            </MotionBox>
            
            <Text 
              color={loadingMutedColor}
              fontSize="md"
            >
              잠시만 기다려주세요
            </Text>
            
            {/* Loading dots */}
            <Box display="flex" gap={2}>
              {[0, 1, 2].map((i) => (
                <MotionBox
                  key={i}
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="#667eea"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </Box>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <Container maxW="7xl" py={12}>
        {/* Games Sections by Category */}
        <VStack spacing={16} align="stretch">
          {Object.entries(gamesByCategory).map(([category, categoryGames], sectionIndex) => (
            categoryGames.length > 0 && (
              <MotionBox
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.2 }}
              >
                {/* Category Header */}
                <Box mb={8}>
                  <Heading 
                    size="lg" 
                    mb={2}
                    color={categoryHeaderColor}
                    fontFamily="heading"
                  >
                    {categoryTitles[category as keyof typeof categoryTitles]}
                  </Heading>
                  <Box 
                    w="60px" 
                    h="4px" 
                    bgGradient="linear(to-r, #667eea, #f093fb)" 
                    borderRadius="full"
                  />
                </Box>

                {/* Games Grid */}
                <SimpleGrid 
                  columns={{ base: 1, md: 2, lg: 3, xl: 4 }} 
                  spacing={6}
                >
                  {categoryGames.map((game, index) => (
                    <MotionCard
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: (sectionIndex * 0.2) + (index * 0.1) }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -12,
                        rotateY: 5,
                      }}
                      whileTap={{ scale: 0.98 }}
                      bg="transparent"
                      shadow="none"
                      borderRadius="3xl"
                      overflow="hidden"
                      cursor="pointer"
                      position="relative"
                      sx={{
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        transformStyle: 'preserve-3d',
                        perspective: '1000px',
                      }}
                    >
                      <Link href={`/games/${game.id === 'wheelOfFortune' ? 'wheel-of-fortune' : game.id}`}>
                        <Box
                          position="relative"
                          borderRadius="3xl"
                          overflow="hidden"
                          _before={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bg: glassOverlayLight,
                            backdropFilter: 'blur(20px) saturate(180%)',
                            border: '1px solid',
                            borderColor: glassBorderLight,
                            borderRadius: '3xl',
                            zIndex: 1,
                          }}
                          _hover={{
                            _before: {
                              bg: glassOverlayHover,
                              borderColor: glassBorderHover,
                              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                            }
                          }}
                        >
                          {/* Background Gradient */}
                          <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bgGradient={game.gradient}
                            opacity={0.8}
                            zIndex={0}
                          />
                          
                          {/* Subtle texture overlay */}
                          <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            opacity={0.05}
                            bg="repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)"
                            zIndex={0}
                          />
                          
                          {/* Content */}
                          <Box
                            p={8}
                            color="white"
                            textAlign="center"
                            position="relative"
                            zIndex={2}
                          >
                            <MotionBox
                              whileHover={{ 
                                scale: 1.1,
                                rotate: [0, -5, 5, 0],
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <Text 
                                fontSize="5xl" 
                                mb={4} 
                                filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                                style={{
                                  textShadow: '0 0 20px rgba(255,255,255,0.5)',
                                }}
                              >
                                {game.icon}
                              </Text>
                            </MotionBox>
                            
                            <Heading 
                              size="md" 
                              mb={3} 
                              fontFamily="heading" 
                              textShadow="0 2px 4px rgba(0,0,0,0.4)"
                              fontWeight="bold"
                            >
                              {t(`games.${game.id}`) || game.id}
                            </Heading>
                            
                            <Text 
                              fontSize="sm" 
                              opacity={0.95} 
                              lineHeight="tall"
                              textShadow="0 1px 2px rgba(0,0,0,0.3)"
                            >
                              {t(`gameDescriptions.${game.id}`) || '재미있는 게임을 즐겨보세요!'}
                            </Text>
                            
                            {/* Subtle glow effect */}
                            <Box
                              position="absolute"
                              top="50%"
                              left="50%"
                              transform="translate(-50%, -50%)"
                              w="120%"
                              h="120%"
                              bgGradient="radial(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
                              opacity={0}
                              transition="opacity 0.3s ease"
                              _groupHover={{ opacity: 1 }}
                              pointerEvents="none"
                              zIndex={1}
                            />
                          </Box>
                        </Box>
                      </Link>
                    </MotionCard>
                  ))}
                </SimpleGrid>
              </MotionBox>
            )
          ))}
        </VStack>
      </Container>
    </>
  );
}