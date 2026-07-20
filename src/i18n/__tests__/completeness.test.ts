import { describe, expect, it } from 'vitest';
import { supportedLanguages } from '../../data/tools/locales';
import { getPublishedTools, toolsRegistry } from '../../data/tools/registry';
import type { ToolDefinition } from '../../data/tools/types';
import {
  getCatalogCardContent,
  getPublicationState,
  isSubstantiveToolContent,
} from '../completeness';
import { categoryTranslations, sharedToolUi } from '../tool-ui';
import { getEnglishProfilePhrases } from '../../data/tools/localizedContent';
import { getToolFallbackNotice } from '../landing';

describe('localized tool completeness', () => {
  it('resolves exactly 41 tools across exactly 12 supported languages', () => {
    expect(supportedLanguages).toEqual([
      'ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'es', 'pt', 'de', 'fr', 'it', 'id', 'hi',
    ]);
    expect(toolsRegistry).toHaveLength(41);

    for (const tool of toolsRegistry) {
      expect(Object.keys(tool.content).sort()).toEqual([...supportedLanguages].sort());
    }
    expect(toolsRegistry.flatMap(tool => Object.keys(tool.content))).toHaveLength(41 * 12);
  });

  it('publishes substantive, actionable and visible help content for every resolved record', () => {
    for (const tool of toolsRegistry) {
      for (const lang of supportedLanguages) {
        const content = tool.content[lang];
        expect(content, `${tool.slug}/${lang}`).toBeDefined();
        expect(isSubstantiveToolContent(tool, lang), `${tool.slug}/${lang}`).toBe(true);
        expect(content?.status).toBe('complete');
        expect(content?.name.trim().length).toBeGreaterThanOrEqual(2);
        expect(content?.title.trim().length).toBeGreaterThanOrEqual(8);
        expect(content?.description.trim().length).toBeGreaterThanOrEqual(24);
        expect(content?.searchIntent.trim().length).toBeGreaterThanOrEqual(8);
        expect(content?.overview.trim().length).toBeGreaterThanOrEqual(32);
        expect(content?.steps.length).toBeGreaterThanOrEqual(3);
        expect(content?.examples.length).toBeGreaterThanOrEqual(1);
        expect(content?.limitations.length).toBeGreaterThanOrEqual(1);
        expect(content?.privacy.trim().length).toBeGreaterThanOrEqual(32);
        expect(content?.faq.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('keeps resolved copy tool-specific instead of repeating one generic record', () => {
    for (const lang of supportedLanguages) {
      const records = toolsRegistry.map(tool => tool.content[lang]!);
      expect(new Set(records.map(record => record.title)).size).toBe(41);
      expect(new Set(records.map(record => record.description)).size).toBe(41);
      expect(new Set(records.map(record => record.overview)).size).toBe(41);
      expect(new Set(records.map(record => record.steps.join('\n'))).size).toBe(41);
      expect(new Set(records.map(record => record.examples.join('\n'))).size).toBe(41);
      expect(new Set(records.map(record => record.limitations.join('\n'))).size).toBe(41);
      expect(new Set(records.map(record => record.faq.map(item => item.question).join('\n'))).size).toBe(41);
    }
  });

  it('does not insert English explanatory profile phrases into non-English records', () => {
    for (const tool of toolsRegistry) {
      const source = getEnglishProfilePhrases(tool.slug);
      const englishPhrases = [source.input, source.output, source.caveat]
        .filter(phrase => !/JSON Web Token|Base64|UUID|URL|HEX|RGB|HSL|EXIF|WebRTC/i.test(phrase));
      for (const lang of supportedLanguages.filter(language => language !== 'en')) {
        const record = tool.content[lang]!;
        expect(record.name, `${tool.slug}/${lang}`).not.toBe(source.label);
        const prose = [record.description, record.overview, ...record.steps, ...record.limitations, ...record.faq.flatMap(item => [item.question, item.answer])].join('\n');
        for (const phrase of englishPhrases) expect(prose, `${tool.slug}/${lang}: ${phrase}`).not.toContain(phrase);
      }
    }
  });

  it.each(['qr-code', 'password', 'jwt-decoder', 'background-remover', 'llm-cost', 'anonymous-chat', 'kor-eng'])('keeps %s input and output distinct in every language', slug => {
    const tool = toolsRegistry.find(item => item.slug === slug)!;
    for (const lang of supportedLanguages) {
      const record = tool.content[lang]!;
      expect(record.description).toContain(record.name);
      expect(record.overview).toContain(record.name);
      expect(record.examples[0]).toContain(record.name);
      if (lang !== 'en') expect(record.description).not.toBe(tool.content.en?.description);
    }
  });

  it('uses truthful privacy disclosures for every processing mode in every language', () => {
    const forbiddenLocalOnlyClaim = /no data is sent to servers|데이터가 서버로 전송되지|サーバーに送信されることはありません/i;
    for (const tool of toolsRegistry) {
      for (const lang of supportedLanguages) {
        const privacy = tool.content[lang]!.privacy;
        if (tool.privacyMode !== 'local-only' && ['ko', 'en', 'ja'].includes(lang)) {
          expect(privacy).not.toMatch(forbiddenLocalOnlyClaim);
        }
        if (tool.privacyMode === 'local-with-assets') expect(privacy).toMatch(/WASM/i);
        if (tool.privacyMode === 'local-with-network-data') expect(privacy).toMatch(/exchange|환율|為替|汇率|匯率|cambio|câmbio|Wechselkurs|change|cambio|kurs|विनिमय/i);
        if (tool.privacyMode === 'peer-to-peer') expect(privacy).toMatch(/PeerJS/i);
      }
    }
  });

  it('discloses temporary room connection metadata in every anonymous-chat locale', () => {
    const chat = toolsRegistry.find(tool => tool.slug === 'anonymous-chat')!;
    const metadata = /metadata|메타데이터|연결 정보|メタデータ|元数据|中繼資料|metadatos|metadados|Metadaten|métadonnées|metadati|मेटाडेटा/i;
    const temporary = /tempor|일시|一時|临时|暫時|vorübergehend|sementara|अस्थायी/i;
    for (const lang of supportedLanguages) {
      expect(chat.content[lang]!.privacy, lang).toMatch(metadata);
      expect(chat.content[lang]!.privacy, lang).toMatch(temporary);
    }
  });

  it('indexes only complete substantive records and returns reciprocal complete alternates', () => {
    for (const tool of getPublishedTools()) {
      for (const lang of supportedLanguages) {
        const state = getPublicationState(tool, lang);
        expect(state.indexable).toBe(true);
        expect(state.robots).toBe('index, follow');
        expect(state.alternates.map(item => item.lang)).toEqual(supportedLanguages);
        expect(state.alternates.find(item => item.lang === 'en')?.url).toContain('/en/');
      }
    }
  });

  it('keeps an incomplete locale public but noindex and removes it from all reciprocal alternates', () => {
    const source = toolsRegistry[0];
    const incomplete: ToolDefinition = {
      ...source,
      content: {
        ...source.content,
        fr: { ...source.content.fr!, status: 'fallback', overview: '' },
      },
    };

    expect(getPublicationState(incomplete, 'fr')).toEqual({
      indexable: false,
      robots: 'noindex, follow',
      alternates: expect.not.arrayContaining([expect.objectContaining({ lang: 'fr' })]),
    });
    expect(getPublicationState(incomplete, 'en').alternates.map(item => item.lang)).not.toContain('fr');
    expect(getCatalogCardContent(incomplete, 'fr')).toMatchObject({
      usedLanguage: 'en',
      usesFallback: true,
    });
    expect(getCatalogCardContent(incomplete, 'fr').notice).toBe(sharedToolUi.fr.fallbackNotice);
    expect(getToolFallbackNotice(incomplete, 'fr')).toBe(sharedToolUi.fr.fallbackNotice);
  });

  it('does not emit alternates for an unreleased tool even when its records are complete', () => {
    const unreleased = { ...toolsRegistry[0], released: false };
    expect(getPublicationState(unreleased, 'en')).toEqual({
      indexable: false,
      robots: 'noindex, follow',
      alternates: [],
    });
  });

  it('shows a truthful notice when a complete-status record fails substantive validation', () => {
    const source = toolsRegistry[0];
    const invalid: ToolDefinition = {
      ...source,
      content: { ...source.content, fr: { ...source.content.fr!, overview: '' } },
    };
    const card = getCatalogCardContent(invalid, 'fr');
    expect(card.usedLanguage).toBe('en');
    expect(card.usesFallback).toBe(true);
    expect(card.notice).toBe(sharedToolUi.fr.fallbackNotice);
    expect(getToolFallbackNotice(invalid, 'fr')).toBe(sharedToolUi.fr.fallbackNotice);
  });

  it('uses locale-specific semantic examples and limitations instead of concern boilerplate', () => {
    const bannedExampleFragments = /\b(daily|tomorrow|input tokens|photo\.png|product photo|app screen|share a room link)\b/i;
    for (const lang of supportedLanguages.filter(language => language !== 'en')) {
      const examples = toolsRegistry.map(tool => tool.content[lang]!.examples[0]);
      const limitations = toolsRegistry.map(tool => tool.content[lang]!.limitations[0]);
      expect(new Set(examples).size, `${lang} examples`).toBe(41);
      expect(new Set(limitations).size, `${lang} limitations`).toBe(41);
      for (const example of examples) expect(example, `${lang}: ${example}`).not.toMatch(bannedExampleFragments);
      expect(toolsRegistry.find(tool => tool.slug === 'utm')!.content[lang]!.limitations[0]).toMatch(/parameter|매개변수|パラメータ|参数|參數|parámetro|parâmetro|Parameter|paramètre|parametr|पैरामीटर/i);
    }
  });

  it('does not show a fallback notice once the requested catalog record is complete', () => {
    const card = getCatalogCardContent(toolsRegistry[0], 'hi');
    expect(card.usedLanguage).toBe('hi');
    expect(card.usesFallback).toBe(false);
    expect(card.notice).toBeNull();
  });

  it('provides common controls, statuses, navigation, footer, catalog and categories in all languages', () => {
    const requiredUi = [
      'home', 'tools', 'catalogTitle', 'allCategories', 'copy', 'download', 'clear',
      'input', 'output', 'loading', 'valid', 'invalid', 'success', 'error',
      'usageGuide', 'limitations', 'privacy', 'faq', 'fallbackNotice', 'footer',
    ] as const;
    const categoryIds = ['all', 'generators', 'converters', 'text', 'developer', 'design', 'image', 'marketing', 'productivity', 'calculators', 'random'] as const;

    for (const lang of supportedLanguages) {
      for (const key of requiredUi) expect(sharedToolUi[lang][key].trim(), `${lang}/${key}`).not.toBe('');
      for (const category of categoryIds) expect(categoryTranslations[lang][category].trim(), `${lang}/${category}`).not.toBe('');
    }
  });
});
