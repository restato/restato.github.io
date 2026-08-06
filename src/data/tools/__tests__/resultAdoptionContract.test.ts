import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { toolsConfig } from '../registry';
import { additionalTools as dataTextTools } from '../additions/data-text';
import { additionalTools as mediaCalculatorTools } from '../additions/media-calc';
import { additionalTools as pdfTools } from '../additions/pdf';
import { additionalTools as randomTools } from '../additions/random';
import { toolResultAdoption } from '../resultAdoption';

const publicTools = [
  ...toolsConfig.map(({ slug, component }) => ({ slug, component })),
  { slug: 'anonymous-chat', component: 'Chat' },
  ...dataTextTools.map(({ slug, component }) => ({ slug, component })),
  ...mediaCalculatorTools.map(({ slug, component }) => ({ slug, component })),
  ...pdfTools.map(({ slug, component }) => ({ slug, component })),
  ...randomTools.map(({ slug, component }) => ({ slug, component })),
].sort((left, right) => left.slug.localeCompare(right.slug));

describe('public tool result-adoption contract', () => {
  it('classifies every registry tool exactly once with a concrete rationale', () => {
    const audited = [...toolResultAdoption]
      .map(({ slug, component }) => ({ slug, component }))
      .sort((left, right) => left.slug.localeCompare(right.slug));

    expect(audited).toEqual(publicTools);
    expect(new Set(toolResultAdoption.map(({ slug }) => slug)).size).toBe(toolResultAdoption.length);
    for (const entry of toolResultAdoption) {
      expect(entry.rationale.trim().length, entry.slug).toBeGreaterThan(30);
    }
  });

  it('keeps every tool-result classification backed by the executable primitive', () => {
    for (const entry of toolResultAdoption.filter(({ mode }) => mode === 'tool-result')) {
      const sourceDirectory = ['csv-json', 'text-cleaner', 'seo-generator'].includes(entry.slug)
        ? 'src/components/tools/data-text'
        : 'src/components/tools';
      const source = readFileSync(resolve(sourceDirectory, `${entry.component}.tsx`), 'utf8');

      expect(source, entry.slug).toMatch(/<ToolResult(?:\s|>)/);
    }
  });
});
