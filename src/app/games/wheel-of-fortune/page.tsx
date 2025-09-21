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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tag,
  Wrap,
  WrapItem,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, RepeatIcon, ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
  const [newItem, setNewItem] = useState('');
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [winner, setWinner] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);

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

    // 0.5초 후 모달 열기 (컨페티 효과를 보여주기 위해)
    setTimeout(() => {
      onOpen();
    }, 500);
  }, [items, prizeNumber, onOpen]);

  const resetItems = useCallback(() => {
    setItems(DEFAULT_ITEMS);
    setNewItem('');
    setWinner('');
  }, []);

  return (
    <Container maxW="6xl" py={8}>
      {/* Breadcrumb */}
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={6}>
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
      <HStack mb={6}>
        <Button 
          as={Link} 
          href="/" 
          leftIcon={<ArrowBackIcon />} 
          variant="ghost" 
          size="sm"
        >
          {t('backToHome')}
        </Button>
      </HStack>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        textAlign="center"
        mb={8}
      >
        <Heading 
          as="h1" 
          size="2xl" 
          color="gray.900" 
          mb={4}
          fontFamily="heading"
          fontWeight="bold"
        >
          🎯 {t('games.wheelOfFortune')}
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={6}>
          {t('gameDescriptions.wheelOfFortune')}
        </Text>
      </MotionBox>

      <Flex 
        direction={{ base: 'column', lg: 'row' }} 
        gap={8} 
        align="start"
      >
        {/* 항목 관리 패널 */}
        <VStack flex={1} spacing={6} align="stretch">
          {/* 항목 추가 */}
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" border="1px" borderColor="gray.200">
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.700">
                {t('wheelOfFortune.addNewItem')}
              </FormLabel>
              <HStack>
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder={t('wheelOfFortune.itemPlaceholder')}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  bg="gray.50"
                  aria-label={t('wheelOfFortune.itemInputLabel')}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px #3182ce'
                  }}
                />
                <IconButton
                  aria-label={t('wheelOfFortune.addItemButton')}
                  icon={<AddIcon />}
                  onClick={addItem}
                  colorScheme="blue"
                  isDisabled={!newItem.trim()}
                />
              </HStack>
            </FormControl>
          </Box>

          {/* 현재 항목 목록 */}
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" border="1px" borderColor="gray.200">
            <HStack justify="space-between" mb={4}>
              <Heading size="md" color="gray.700">
                {t('wheelOfFortune.currentItems')} ({items.length}개)
              </Heading>
              <IconButton
                aria-label={t('wheelOfFortune.resetToDefault')}
                icon={<RepeatIcon />}
                onClick={resetItems}
                size="sm"
                variant="ghost"
              />
            </HStack>
            
            <Wrap spacing={2}>
              {items.map((item, index) => (
                <WrapItem key={index}>
                  <Tag
                    size="lg"
                    borderRadius="full"
                    variant="solid"
                    bg={backgroundColors[index % backgroundColors.length]}
                    color="white"
                  >
                    <Text mr={2}>{item}</Text>
                    <IconButton
                      aria-label={`${item} ${t('wheelOfFortune.deleteItem')}`}
                      icon={<DeleteIcon />}
                      size="xs"
                      variant="ghost"
                      color="white"
                      onClick={() => removeItem(index)}
                      _hover={{ bg: 'whiteAlpha.300' }}
                    />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>

            {items.length === 0 && (
              <Text color="gray.500" textAlign="center" py={4}>
                {t('wheelOfFortune.noItems')}
              </Text>
            )}
          </Box>

          {/* 스핀 버튼 */}
          <Button
            size="lg"
            colorScheme="red"
            onClick={handleSpin}
            isDisabled={items.length < 2 || isSpinning}
            isLoading={isSpinning}
            loadingText={t('wheelOfFortune.spinning')}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            _focus={{ 
              outline: '2px solid',
              outlineColor: 'red.500',
              outlineOffset: '2px'
            }}
            transition="all 0.2s"
            w="full"
            h="60px"
            fontSize="lg"
            fontWeight="bold"
            aria-label={items.length < 2 
              ? t('wheelOfFortune.needMoreItems')
              : isSpinning 
                ? t('wheelOfFortune.spinningAriaLabel')
                : t('wheelOfFortune.spinButtonAriaLabel')
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && items.length >= 2 && !isSpinning) {
                e.preventDefault();
                handleSpin();
              }
            }}
          >
            {items.length < 2 
              ? t('wheelOfFortune.needMoreItems')
              : isSpinning 
                ? t('wheelOfFortune.spinning')
                : `🎯 ${t('wheelOfFortune.spinButton')}`
            }
          </Button>
        </VStack>

        {/* 휠 */}
        <Box 
          flex={1} 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          minH={{ base: "300px", md: "400px" }}
          position="relative"
        >
          <MotionBox
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            w={{ base: "280px", sm: "320px", md: "360px" }}
            h={{ base: "280px", sm: "320px", md: "360px" }}
            maxW="360px"
            maxH="360px"
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
                    maxWidth: '360px !important',
                    maxHeight: '360px !important',
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
                  fontSize={14}
                  textDistance={60}
                  spinDuration={0.8}
                />
              </Box>
            )}
          </MotionBox>
        </Box>
      </Flex>

      {/* 결과 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent mx={4} bg="white" borderRadius="2xl" overflow="hidden">
          <ModalHeader 
            textAlign="center" 
            fontSize="2xl" 
            fontWeight="bold"
            bg="gradient"
            bgGradient="linear(to-r, purple.500, pink.500)"
            color="white"
            py={6}
          >
            🎉 {t('wheelOfFortune.resultAnnouncement')}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={8} pt={6}>
            <VStack spacing={6}>
              <MotionBox
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2
                }}
              >
                <Box
                  bg="gradient"
                  bgGradient="linear(to-r, green.400, blue.500)"
                  color="white"
                  p={8}
                  borderRadius="2xl"
                  textAlign="center"
                  w="full"
                  shadow="xl"
                  position="relative"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
                    borderRadius: '2xl',
                    zIndex: -1,
                    opacity: 0.7,
                  }}
                >
                  <Text 
                    fontSize="4xl" 
                    fontWeight="bold" 
                    role="region" 
                    aria-live="polite"
                    textShadow="2px 2px 4px rgba(0,0,0,0.3)"
                  >
                    {winner}
                  </Text>
                  <Text fontSize="lg" mt={2} opacity={0.9}>
                    {t('wheelOfFortune.winner')}
                  </Text>
                </Box>
              </MotionBox>
              
              <Text color="gray.600" textAlign="center" fontSize="lg">
                🎊 {t('wheelOfFortune.congratulations')} 🎊
              </Text>
              
              <HStack spacing={3} w="full">
                <Button
                  colorScheme="blue"
                  onClick={onClose}
                  flex={1}
                  size="lg"
                  borderRadius="xl"
                >
                  {t('wheelOfFortune.confirm')}
                </Button>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    setTimeout(handleSpin, 500);
                  }}
                  flex={1}
                  size="lg"
                  borderRadius="xl"
                  isDisabled={items.length < 2}
                >
                  {t('wheelOfFortune.spinAgain')}
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}