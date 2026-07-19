import type { Language } from './types';

export const supportedLanguages = [
  'ko',
  'en',
  'ja',
  'zh-CN',
  'zh-TW',
  'es',
  'pt',
  'de',
  'fr',
  'it',
  'id',
  'hi',
] as const satisfies readonly Language[];

export const existingToolLanguages = ['ko', 'en', 'ja'] as const;
