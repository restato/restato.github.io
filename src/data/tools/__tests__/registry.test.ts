import { describe, expect, it } from 'vitest';
import { getAllToolSlugs, getToolBySlug, toolsConfig } from '../../tools';
import { getIndexableLanguages, getPublishedTools, getTool, toolsRegistry } from '../registry';

describe('toolsRegistry', () => {
  it('preserves all 41 public tool definitions', () => {
    expect(toolsRegistry).toHaveLength(41);
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
    expect(getIndexableLanguages('json')).toEqual([]);
    expect(getIndexableLanguages('missing-tool')).toEqual([]);
  });

  it('classifies runtime asset downloads, network data, and peer connections accurately', () => {
    expect(getTool('background-remover')?.privacyMode).toBe('local-with-assets');
    expect(getTool('llm-cost')?.privacyMode).toBe('local-with-network-data');
    expect(getTool('anonymous-chat')?.privacyMode).toBe('peer-to-peer');
    expect(getTool('image-resizer')?.privacyMode).toBe('local-only');
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
