export const supportedLanguages = Object.freeze([
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
]);

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const supportedLanguagePattern = supportedLanguages.map(escapeRegExp).join('|');
