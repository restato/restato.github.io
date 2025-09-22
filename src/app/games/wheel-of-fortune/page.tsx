'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack,
  HStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Flex,
  Tag,
  Wrap,
  WrapItem,
  useToast,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, RepeatIcon, ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Play, RotateCcw, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// Dynamic import for react-custom-roulette (client-side only)
const Wheel = dynamic(
  () => import('react-custom-roulette').then((mod) => mod.Wheel),
  { ssr: false }
);

const MotionBox = motion(Box);

interface WheelItem {
  option: string;
  style?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

const DEFAULT_ITEMS = ['치킨', '피자', '라면', '김밥'];

const backgroundColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
  '#F1948A', '#85C1E9', '#D7BDE2', '#AED6F1'
];

export default function WheelOfFortunePage() {
  const { t } = useLanguage();
  const toast = useToast();
  
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
  const [newItem, setNewItem] = useState('');
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [winner, setWinner] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  // URL에서 초기 items 파싱
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlItems = urlParams.get('items');
      if (urlItems) {
        const parsedItems = urlItems.split(',').map(item => item.trim()).filter(Boolean);
        if (parsedItems.length > 0) {
          setItems(parsedItems);
        }
      }
    }
  }, []);

  // Wheel 데이터 변환
  const wheelData: WheelItem[] = items.map((item, index) => ({
    option: item,
    style: {
      backgroundColor: backgroundColors[index % backgroundColors.length],
      textColor: '#ffffff'
    }
  }));

  const addItem = useCallback(() => {
    if (!newItem.trim()) return;
    
    if (items.includes(newItem.trim())) {
      toast({
        title: t('wheelOfFortune.duplicateItem'),
        description: t('wheelOfFortune.duplicateItemDesc'),
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setItems(prev => [...prev, newItem.trim()]);
    setNewItem('');
  }, [newItem, items, toast, t]);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSpin = useCallback(() => {
    if (items.length < 2) {
      toast({
        title: t('wheelOfFortune.notEnoughItems'),
        description: t('wheelOfFortune.notEnoughItemsDesc'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    const newPrizeNumber = Math.floor(Math.random() * items.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  }, [items, isSpinning, toast, t]);

  const handleSpinStop = useCallback(() => {
    setMustSpin(false);
    setIsSpinning(false);
    const winnerItem = items[prizeNumber];
    setWinner(winnerItem);
    
    // 컨페티 효과 - 더 화려하게
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // 사운드 효과 (선택사항)
    try {
      const audio = new Audio('/sounds/win.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // 사운드 재생 실패 시 무시
      });
    } catch {
      // 사운드 파일이 없어도 무시
    }

    // 당첨자 표시
    setShowWinner(true);
  }, [items, prizeNumber]);

  const resetItems = useCallback(() => {
    setItems(DEFAULT_ITEMS);
    setNewItem('');
    setWinner('');
    setShowWinner(false);
  }, []);

  const handleSpinAgain = useCallback(() => {
    setShowWinner(false);
    setWinner('');
    // 0.3초 후 새로운 스핀 시작
    setTimeout(() => {
      handleSpin();
    }, 300);
  }, [handleSpin]);

  return (
    <Container maxW="7xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
      {/* Breadcrumb */}
      <Breadcrumb 
        spacing="8px" 
        separator={<ChevronRightIcon color="gray.500" />} 
        mb={{ base: 4, md: 6 }}
        fontSize={{ base: "sm", md: "md" }}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/">
            {t('home')}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>
            {t('games.wheelOfFortune')}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Back Button */}
      <HStack mb={{ base: 4, md: 6 }}>
        <Button 
          as={Link} 
          href="/" 
          leftIcon={<ArrowBackIcon />} 
          variant="ghost" 
          size={{ base: "sm", md: "md" }}
        >
          {t('backToHome')}
        </Button>
      </HStack>

      {/* 제목 섹션 */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        textAlign="center"
        mb={{ base: 6, md: 8 }}
      >
        <Heading 
          as="h1" 
          size={{ base: "xl", md: "2xl" }}
          color="gray.900" 
          mb={{ base: 2, md: 4 }}
          fontFamily="heading"
          fontWeight="bold"
        >
          🎯 {t('games.wheelOfFortune')}
        </Heading>
        <Text 
          fontSize={{ base: "md", md: "lg" }} 
          color="gray.600" 
          mb={{ base: 4, md: 6 }}
          px={{ base: 4, md: 0 }}
        >
          {t('gameDescriptions.wheelOfFortune')}
        </Text>
      </MotionBox>

      {/* 메인 컨텐츠 영역 */}
      <Flex 
        direction={{ base: 'column', xl: 'row' }} 
        gap={{ base: 6, md: 8 }} 
        align={{ base: "center", xl: "start" }}
        justify="center"
      >
        {/* 휠 섹션 - 모바일에서는 먼저 표시 */}
        <VStack 
          flex={{ base: "none", xl: 1 }} 
          spacing={{ base: 4, md: 6 }}
          order={{ base: 1, xl: 2 }}
          w="full"
          maxW={{ base: "100%", xl: "500px" }}
        >
          {/* 당첨자 표시 영역 */}
          {showWinner && (
            <MotionBox
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.2
              }}
              w="full"
              maxW={{ base: "320px", md: "400px" }}
            >
              <Box
                bg="gradient"
                bgGradient="linear(to-r, purple.500, pink.500, orange.400)"
                color="white"
                p={{ base: 4, md: 6 }}
                borderRadius="2xl"
                textAlign="center"
                shadow="xl"
                border="3px solid white"
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: '-3px',
                  left: '-3px',
                  right: '-3px',
                  bottom: '-3px',
                  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)',
                  borderRadius: '2xl',
                  zIndex: -1,
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              >
                <VStack spacing={{ base: 1, md: 2 }}>
                  <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium" opacity={0.9}>
                    🎉 {t('wheelOfFortune.winner')} 🎉
                  </Text>
                  <Text 
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold" 
                    textShadow="2px 2px 4px rgba(0,0,0,0.3)"
                    role="region" 
                    aria-live="polite"
                    wordBreak="break-word"
                  >
                    {winner}
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.8}>
                    {t('wheelOfFortune.congratulations')}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          )}

          {/* 휠 컨테이너 */}
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            minH={{ base: "320px", sm: "360px", md: "420px" }}
            position="relative"
            w="full"
          >
            <MotionBox
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              w={{ base: "300px", sm: "340px", md: "380px", lg: "400px" }}
              h={{ base: "300px", sm: "340px", md: "380px", lg: "400px" }}
              maxW="400px"
              maxH="400px"
              position="relative"
            >
              {wheelData.length > 0 && (
                <Box
                  w="100%"
                  h="100%"
                  sx={{
                    '& > div': {
                      width: '100% !important',
                      height: '100% !important',
                    },
                    '& canvas': {
                      width: '100% !important',
                      height: '100% !important',
                      maxWidth: '400px !important',
                      maxHeight: '400px !important',
                    }
                  }}
                >
                  <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={wheelData}
                    onStopSpinning={handleSpinStop}
                    outerBorderColor="#E2E8F0"
                    outerBorderWidth={4}
                    innerBorderColor="#CBD5E0"
                    innerBorderWidth={2}
                    radiusLineColor="#A0AEC0"
                    radiusLineWidth={1}
                    fontSize={12}
                    textDistance={55}
                    spinDuration={0.8}
                  />
                </Box>
              )}
              
              {/* 휠 중앙 플레이/다시 돌리기 버튼 */}
              <Button
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                size={{ base: "lg", md: "xl" }}
                colorScheme={showWinner ? "green" : "red"}
                onClick={showWinner ? handleSpinAgain : handleSpin}
                isDisabled={items.length < 2 || isSpinning}
                _hover={{ 
                  transform: 'translate(-50%, -50%) scale(1.05)',
                  boxShadow: 'xl' 
                }}
                _active={{
                  transform: 'translate(-50%, -50%) scale(0.95)'
                }}
                _focus={{ 
                  outline: '3px solid',
                  outlineColor: showWinner ? 'green.300' : 'red.300',
                  outlineOffset: '2px'
                }}
                transition="all 0.2s"
                w={{ base: "90px", sm: "100px", md: "110px" }}
                h={{ base: "90px", sm: "100px", md: "110px" }}
                borderRadius="full"
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="bold"
                color="white"
                shadow="lg"
                border="4px solid white"
                zIndex={10}
                aria-label={
                  items.length < 2 
                    ? t('wheelOfFortune.needMoreItems')
                    : isSpinning 
                      ? t('wheelOfFortune.spinningAriaLabel')
                      : showWinner
                        ? t('wheelOfFortune.spinAgain')
                        : t('wheelOfFortune.spinButtonAriaLabel')
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && items.length >= 2 && !isSpinning) {
                    e.preventDefault();
                    if (showWinner) {
                      handleSpinAgain();
                    } else {
                      handleSpin();
                    }
                  }
                }}
              >
                {items.length < 2 
                  ? '❌'
                  : isSpinning 
                    ? <Icon as={Loader2} boxSize={{ base: 5, md: 6 }} sx={{ 
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }} />
                    : showWinner
                      ? <Icon as={RotateCcw} boxSize={{ base: 5, md: 6 }} />
                      : <Icon as={Play} boxSize={{ base: 5, md: 6 }} />
                }
              </Button>
            </MotionBox>
          </Box>
        </VStack>

        {/* 항목 관리 패널 */}
        <VStack 
          flex={{ base: "none", xl: 1 }} 
          spacing={{ base: 4, md: 6 }} 
          align="stretch"
          order={{ base: 2, xl: 1 }}
          w="full"
          maxW={{ base: "100%", xl: "500px" }}
        >
          {/* 항목 추가 */}
          <Box 
            bg="white" 
            p={{ base: 4, md: 6 }} 
            borderRadius="lg" 
            shadow="sm" 
            border="1px" 
            borderColor="gray.200"
          >
            <FormControl>
              <FormLabel 
                fontWeight="bold" 
                color="gray.700"
                fontSize={{ base: "sm", md: "md" }}
                mb={{ base: 2, md: 3 }}
              >
                {t('wheelOfFortune.addNewItem')}
              </FormLabel>
              <Flex direction={{ base: "column", sm: "row" }} gap={{ base: 2, sm: 0 }}>
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder={t('wheelOfFortune.itemPlaceholder')}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  bg="gray.50"
                  aria-label={t('wheelOfFortune.itemInputLabel')}
                  size={{ base: "md", md: "lg" }}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px #3182ce'
                  }}
                  mr={{ base: 0, sm: 2 }}
                />
                <IconButton
                  aria-label={t('wheelOfFortune.addItemButton')}
                  icon={<AddIcon />}
                  onClick={addItem}
                  colorScheme="blue"
                  isDisabled={!newItem.trim()}
                  size={{ base: "md", md: "lg" }}
                  minW={{ base: "full", sm: "auto" }}
                />
              </Flex>
            </FormControl>
          </Box>

          {/* 현재 항목 목록 */}
          <Box 
            bg="white" 
            p={{ base: 4, md: 6 }} 
            borderRadius="lg" 
            shadow="sm" 
            border="1px" 
            borderColor="gray.200"
          >
            <Flex 
              justify="space-between" 
              align="center"
              mb={{ base: 3, md: 4 }}
              direction={{ base: "column", sm: "row" }}
              gap={{ base: 2, sm: 0 }}
            >
              <Heading 
                size={{ base: "sm", md: "md" }} 
                color="gray.700"
                textAlign={{ base: "center", sm: "left" }}
              >
                {t('wheelOfFortune.currentItems')} ({items.length}개)
              </Heading>
              <IconButton
                aria-label={t('wheelOfFortune.resetToDefault')}
                icon={<RepeatIcon />}
                onClick={resetItems}
                size="sm"
                variant="ghost"
              />
            </Flex>
            
            <Wrap spacing={{ base: 2, md: 3 }} justify="center">
              {items.map((item, index) => (
                <WrapItem key={index}>
                  <Tag
                    size={{ base: "md", md: "lg" }}
                    borderRadius="full"
                    variant="solid"
                    bg={backgroundColors[index % backgroundColors.length]}
                    color="white"
                    minH={{ base: "32px", md: "36px" }}
                  >
                    <Text 
                      mr={2} 
                      fontSize={{ base: "sm", md: "md" }}
                      wordBreak="break-word"
                      maxW="120px"
                      isTruncated
                    >
                      {item}
                    </Text>
                    <IconButton
                      aria-label={`${item} ${t('wheelOfFortune.deleteItem')}`}
                      icon={<DeleteIcon />}
                      size="xs"
                      variant="ghost"
                      color="white"
                      onClick={() => removeItem(index)}
                      _hover={{ bg: 'whiteAlpha.300' }}
                      minW="auto"
                    />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>

            {items.length === 0 && (
              <Text 
                color="gray.500" 
                textAlign="center" 
                py={{ base: 6, md: 8 }}
                fontSize={{ base: "sm", md: "md" }}
              >
                {t('wheelOfFortune.noItems')}
              </Text>
            )}
          </Box>
        </VStack>
      </Flex>
    </Container>
  );
}
