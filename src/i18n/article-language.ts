import { supportedLanguages } from '../data/tools/locales';
import type { Language } from '../data/tools/types';

export interface ArticleLanguageData {
  lang?: Language;
  title: string;
  description: string;
}

export function selectArticleLanguage(data: ArticleLanguageData): Language {
  if (data.lang && supportedLanguages.includes(data.lang)) return data.lang;

  const metadata = `${data.title} ${data.description}`;
  if (/\p{Script=Hangul}/u.test(metadata)) return 'ko';
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(metadata)) return 'ja';
  if (/\p{Script=Devanagari}/u.test(metadata)) return 'hi';
  if (/[\u3100-\u312f]|[體臺灣與為這個學習網頁開發實際]/u.test(metadata)) return 'zh-TW';
  if (/\p{Script=Han}/u.test(metadata)) return 'zh-CN';
  return 'en';
}
