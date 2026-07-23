import type { Language } from '../data/tools/types';

export const skipLinkLabels: Record<Language, string> = {
  ko: '본문으로 건너뛰기',
  en: 'Skip to main content',
  ja: '本文へ移動',
  'zh-CN': '跳到主要内容',
  'zh-TW': '跳到主要內容',
  es: 'Saltar al contenido principal',
  pt: 'Pular para o conteúdo principal',
  de: 'Zum Hauptinhalt springen',
  fr: 'Aller au contenu principal',
  it: 'Vai al contenuto principale',
  id: 'Lewati ke konten utama',
  hi: 'मुख्य सामग्री पर जाएँ',
};

export function getSkipLinkLabel(language: string): string {
  return skipLinkLabels[language as Language] ?? skipLinkLabels.ko;
}
