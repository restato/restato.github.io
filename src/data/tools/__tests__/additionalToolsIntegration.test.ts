import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import AdditionalToolIsland from '../../../components/tools/AdditionalToolIsland';
import { supportedLanguages } from '../locales';
import { getTool } from '../registry';
import { hasLocalizedToolComponent } from '../../../components/tools/LocalizedToolIsland';

const additionalSlugs = [
  'pdf-merge', 'pdf-split', 'pdf-rotate', 'images-to-pdf', 'pdf-to-images',
  'csv-json', 'text-cleaner', 'seo-generator',
  'modern-image-converter', 'exif-remover', 'favicon-generator', 'loan-calculator', 'audio-trimmer',
] as const;

describe('additional browser tools', () => {
  it.each(additionalSlugs)('publishes %s with a real component and twelve complete locales', slug => {
    const tool = getTool(slug);
    expect(tool, `${slug} registry entry`).toBeDefined();
    expect(hasLocalizedToolComponent(slug), `${slug} component`).toBe(true);
    expect(Object.keys(tool?.content ?? {}).sort()).toEqual([...supportedLanguages].sort());
    expect(tool?.indexableLanguages.sort()).toEqual([...supportedLanguages].sort());
    expect(tool?.privacyMode).toBe('local-only');
  });

  it('renders the PDF merge workflow through its route-lazy island with shared controls', async () => {
    const { container } = render(createElement(AdditionalToolIsland, { slug: 'pdf-merge', lang: 'en' }));

    const picker = await screen.findByRole('button', { name: /Choose PDFs to merge/ });
    expect(picker).toHaveClass('fc-tool-drop-zone');
    expect(container.querySelector('.fc-tool-panel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Merge PDF/ })).toHaveClass('fc-button', 'fc-button-primary');
    expect(screen.getByRole('button', { name: /Merge PDF/ })).not.toHaveClass('fc-button-secondary');
    expect(screen.getAllByRole('button', { name: /Choose PDFs to merge/ })).toHaveLength(1);
  });

  it('renders the audio workflow with shared field, action, and status classes', async () => {
    const { container } = render(createElement(AdditionalToolIsland, { slug: 'audio-trimmer', lang: 'en' }));

    expect(await screen.findByLabelText('Choose audio file')).toHaveClass('fc-input');
    expect(screen.getByRole('button', { name: 'Export trimmed WAV' })).toHaveClass('fc-button', 'fc-button-primary');
    expect(screen.getByRole('button', { name: 'Export trimmed WAV' }).closest('.fc-tool-actions')).not.toBeNull();
    expect(container.querySelector('.fc-tool-panel')).toBeInTheDocument();
    expect(container.querySelector('.fc-tool-result')).toBeNull();
  });

  it('keeps every additional route as an independent lazy import', () => {
    const islandSource = readFileSync(resolve('src/components/tools/AdditionalToolIsland.tsx'), 'utf8');
    for (const slug of additionalSlugs) {
      expect(islandSource).toMatch(new RegExp(`'${slug}': lazy\\(\\(\\) => import\\(`));
    }
  });
});
