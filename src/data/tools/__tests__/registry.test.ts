import { describe, expect, it } from 'vitest';
import { getAllToolSlugs, getToolBySlug, toolsConfig } from '../../tools';
import { toolsRegistry } from '../registry';

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
});
