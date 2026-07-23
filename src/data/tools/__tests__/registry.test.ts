import { describe, expect, it } from 'vitest';
import { getAllToolSlugs, getToolBySlug, toolsConfig } from '../../tools';
import { getIndexableLanguages, getPublishedTools, getTool, toolsRegistry } from '../registry';
import { hasLocalizedToolComponent } from '../../../components/tools/LocalizedToolIsland';

describe('toolsRegistry', () => {
  it('preserves all 54 public tool definitions', () => {
    expect(toolsRegistry).toHaveLength(54);
  });

  it('provides a localized React island for every standard tool route', () => {
    const standardTools = getPublishedTools().filter(tool => tool.slug !== 'anonymous-chat');
    expect(standardTools.every(tool => hasLocalizedToolComponent(tool.slug))).toBe(true);
  });

  it('keeps the legacy catalog exports backed by the registry data', () => {
    expect(toolsConfig).toHaveLength(40);
    expect(getAllToolSlugs()).toEqual(toolsConfig.map(tool => tool.slug));
    expect(getToolBySlug('json')).toBe(toolsConfig.find(tool => tool.slug === 'json'));
  });

  it('contains unique slugs and valid relations', () => {
    const slugs = toolsRegistry.map(tool => tool.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const tool of toolsRegistry) {
      expect(tool.related).not.toContain(tool.slug);
      expect(tool.related.every(slug => slugs.includes(slug))).toBe(true);
    }
  });

  it('does not index incomplete localizations', () => {
    for (const tool of toolsRegistry) {
      for (const lang of tool.indexableLanguages) {
        expect(tool.content[lang]?.status).toBe('complete');
      }
    }
  });

  it('provides selectors for published tools and complete localizations', () => {
    expect(getTool('json')?.component).toBe('JsonFormatter');
    expect(getTool('missing-tool')).toBeUndefined();
    expect(getPublishedTools()).toEqual(toolsRegistry.filter(tool => tool.released));
    expect(getIndexableLanguages('json')).toEqual([
      'ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'es', 'pt', 'de', 'fr', 'it', 'id', 'hi',
    ]);
    expect(getIndexableLanguages('missing-tool')).toEqual([]);
  });

  it('classifies runtime asset downloads, network data, and peer connections accurately', () => {
    expect(getTool('background-remover')?.privacyMode).toBe('local-with-assets');
    expect(getTool('llm-cost')?.privacyMode).toBe('local-with-network-data');
    expect(getTool('anonymous-chat')?.privacyMode).toBe('peer-to-peer');
    expect(getTool('image-resizer')?.privacyMode).toBe('local-only');
  });

  it('discloses non-local privacy behavior in every existing locale', () => {
    const expectedPhrases = {
      'anonymous-chat': {
        ko: ['PeerJS', 'STUN을 사용해 직접 WebRTC 연결', 'TURN 릴레이는 구성하지 않습니다', '상대 피어', 'STUN으로 직접 연결을 설정하지 못할 수 있으며'],
        en: ['PeerJS', 'STUN-assisted direct WebRTC connection', 'No TURN relay is configured', 'intended peer', 'direct connection may fail'],
        ja: ['PeerJS', 'STUN を利用した直接の WebRTC 接続', 'TURN リレーは構成していません', '相手のピア', '直接接続を確立できない場合があります'],
      },
      'llm-cost': {
        ko: ['외부 환율 서비스', '전송되지'],
        en: ['external exchange-rate service', 'not sent'],
        ja: ['外部の為替レートサービス', '送信されません'],
      },
      'background-remover': {
        ko: ['모델 및 WASM', '다운로드', '업로드되지'],
        en: ['model and WASM', 'downloaded', 'not uploaded'],
        ja: ['モデルと WASM', 'ダウンロード', 'アップロードされません'],
      },
    } as const;

    for (const [slug, localizedPhrases] of Object.entries(expectedPhrases)) {
      const tool = getTool(slug);
      expect(tool).toBeDefined();

      for (const [language, phrases] of Object.entries(localizedPhrases)) {
        const privacy = tool?.content[language as 'ko' | 'en' | 'ja']?.privacy ?? '';
        for (const phrase of phrases) {
          expect(privacy).toContain(phrase);
        }
      }
    }
  });

  it('discloses that anonymous chat has no TURN relay', () => {
    expect(getTool('anonymous-chat')?.content.ko?.privacy).toContain('TURN 릴레이는 구성하지 않습니다');
    expect(getTool('anonymous-chat')?.content.en?.privacy).toContain('No TURN relay is configured');
    expect(getTool('anonymous-chat')?.content.ja?.privacy).toContain('TURN リレーは構成していません');
  });

  it('does not use the false generic no-data-sent statement for non-local modes', () => {
    const genericDisclosures = {
      ko: '모든 처리는 브라우저에서 실행되며 데이터가 서버로 전송되지 않습니다.',
      en: 'All processing happens in your browser and no data is sent to servers.',
      ja: 'すべての処理はブラウザで実行され、データがサーバーに送信されることはありません。',
    } as const;

    for (const slug of ['anonymous-chat', 'llm-cost', 'background-remover']) {
      const tool = getTool(slug);
      for (const language of ['ko', 'en', 'ja'] as const) {
        expect(tool?.content[language]?.privacy).not.toBe(genericDisclosures[language]);
      }
    }
  });

  it('uses curated cross-category relations for singleton and specialized tools', () => {
    expect(getTool('utm')?.related).toEqual(['url-encoder', 'qr-code', 'base64']);
    expect(getTool('background-remover')?.related).toEqual([
      'image-converter',
      'image-resizer',
      'appstore-screenshot',
    ]);
    expect(getTool('anonymous-chat')?.related).toEqual(['kor-eng', 'text-counter', 'timer']);
  });
});
