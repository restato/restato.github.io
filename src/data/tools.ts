// Compatibility exports for existing tool catalog consumers.
import { toolsConfig } from './tools/registry';
import type { ToolConfig } from './tools/registry';

export {
  anonymousChatSeo,
  getIndexableLanguages,
  getPublishedTools,
  getTool,
  toolsConfig,
  toolsRegistry,
} from './tools/registry';
export type { ToolConfig, ToolSEO } from './tools/registry';
export type {
  Language,
  Localized,
  LocalizationStatus,
  ToolContent,
  ToolDefinition,
  ToolPrivacyMode,
} from './tools/types';

export const categories = [
  { id: 'all', label: { ko: '전체', en: 'All', ja: 'すべて' } },
  { id: 'calculator', label: { ko: '계산기', en: 'Calculator', ja: '計算機' } },
  { id: 'generators', label: { ko: '생성기', en: 'Generators', ja: '生成ツール' } },
  { id: 'converters', label: { ko: '변환기', en: 'Converters', ja: '変換ツール' } },
  { id: 'text', label: { ko: '텍스트', en: 'Text', ja: 'テキスト' } },
  { id: 'developer', label: { ko: '개발자', en: 'Developer', ja: '開発者' } },
  { id: 'designer', label: { ko: '디자이너', en: 'Designer', ja: 'デザイナー' } },
  { id: 'image', label: { ko: '이미지/사진', en: 'Image/Photo', ja: '画像/写真' } },
  { id: 'random', label: { ko: '랜덤/뽑기', en: 'Random/Pick', ja: 'ランダム' } },
  { id: 'marketer', label: { ko: '마케터', en: 'Marketer', ja: 'マーケター' } },
  { id: 'productivity', label: { ko: '생산성', en: 'Productivity', ja: '生産性' } },
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return toolsConfig.find(tool => tool.slug === slug);
}

export function getAllToolSlugs(): string[] {
  return toolsConfig.map(tool => tool.slug);
}
