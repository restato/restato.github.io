import type { Language } from './types';
import { supportedLanguages as runtimeSupportedLanguages } from './supportedLanguages.mjs';

export const supportedLanguages = runtimeSupportedLanguages as readonly Language[];

export const existingToolLanguages = ['ko', 'en', 'ja'] as const;
