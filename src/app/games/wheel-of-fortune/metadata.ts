import { Metadata } from 'next';
import { generateMetadata, gamesSEO } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata(
  gamesSEO['wheel-of-fortune'],
  'ko',
  '/games/wheel-of-fortune'
);
