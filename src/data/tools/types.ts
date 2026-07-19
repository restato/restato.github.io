export type Language = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW' | 'es' | 'pt' | 'de' | 'fr' | 'it' | 'id' | 'hi';
export type LocalizationStatus = 'complete' | 'fallback';
export type ToolPrivacyMode = 'local-only' | 'local-with-assets';

export type Localized<T> = Partial<Record<Language, T>>;

export interface ToolContent {
  status: LocalizationStatus;
  name: string;
  title: string;
  description: string;
  searchIntent: string;
  overview: string;
  steps: string[];
  examples: string[];
  limitations: string[];
  privacy: string;
  faq: Array<{ question: string; answer: string }>;
}

export interface ToolDefinition {
  slug: string;
  icon: string;
  category: string;
  cluster: string;
  component: string;
  privacyMode: ToolPrivacyMode;
  related: string[];
  content: Partial<Record<Language, ToolContent>>;
  indexableLanguages: Language[];
  released: boolean;
  updatedAt: string;
}
