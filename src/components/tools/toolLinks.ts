import type { Language } from '../../data/tools/types';

export function getLocalizedToolHref(slug: string, lang: Language): string {
  return slug === 'anonymous-chat'
    ? `/${lang}/anonymous-chat/`
    : `/${lang}/tools/${slug}/`;
}
