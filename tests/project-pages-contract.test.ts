import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectFiles = [
  'gallery.astro',
  'jobworld-kids.astro',
  'local-price-extractor.astro',
  'quick-issue.astro',
  'roomfit-3d.astro',
] as const;

const projectSources = Object.fromEntries(
  projectFiles.map((file) => [
    file,
    readFileSync(join(process.cwd(), 'src/pages/projects', file), 'utf8'),
  ]),
) as Record<(typeof projectFiles)[number], string>;

const forbiddenPresentationPatterns = [
  /\bbg-gradient-to-/,
  /\bfrom-(?:amber|blue|cyan|indigo|orange|purple|sky)-/,
  /\bto-(?:amber|blue|cyan|indigo|orange|purple|sky)-/,
  /\bbackdrop-blur/,
  /\bhover:-translate-y-/,
  /\bhover:scale-/,
] as const;

function relativeLuminance(hex: string) {
  const channels = hex.match(/[a-f\d]{2}/gi)?.map((channel) => parseInt(channel, 16) / 255) ?? [];
  const [red, green, blue] = channels.map((channel) => (
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
}

function contrastRatio(first: string, second: string) {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)]
    .sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Forest Café project page contract', () => {
  it.each(projectFiles)('%s uses shared primitives without legacy effects', (file) => {
    const source = projectSources[file];

    expect(source).toMatch(/\bfc-page\b/);
    expect(source).toMatch(/\bfc-(?:surface|empty-state)\b/);
    for (const pattern of forbiddenPresentationPatterns) {
      expect(source).not.toMatch(pattern);
    }
  });

  it('makes every gallery opener a semantic button and names the modal dialog', () => {
    const source = projectSources['gallery.astro'];

    expect(source).toMatch(/<button[\s\S]*?data-gallery-item/);
    expect(source).not.toMatch(/<div[^>]+data-index=/);
    expect(source).toMatch(/role="dialog"/);
    expect(source).toMatch(/aria-modal="true"/);
    expect(source).toMatch(/aria-labelledby="gallery-dialog-title"/);
    expect(source).toMatch(/id="gallery-dialog-title"/);
    expect(source).toMatch(/data-gallery-close/);
  });

  it('contains the jobworld process connectors in a positioned clipped grid', () => {
    const source = projectSources['jobworld-kids.astro'];
    const processGrid = source.match(/<div[^>]+data-jobworld-process-grid[^>]*>/)?.[0];

    expect(processGrid).toBeDefined();
    expect(processGrid).toContain('relative');
    expect(processGrid).toContain('overflow-hidden');
  });

  it('uses Forest Café contrast-bearing classes for the identified text pairs', () => {
    const localPrice = projectSources['local-price-extractor.astro'];
    const roomfit = projectSources['roomfit-3d.astro'];

    expect(localPrice).toMatch(/data-local-price-primary-cta[^>]+fc-button-primary/);
    expect(roomfit).toMatch(/data-roomfit-eyebrow[^>]+fc-eyebrow/);
    expect(roomfit).not.toMatch(/data-roomfit-eyebrow[^>]+text-cyan-/);
  });

  it('keeps the project CTA and eyebrow token pairs at WCAG AA contrast', () => {
    const pairs = [
      ['#fffaf0', '#174a35'], // light primary button
      ['#18221c', '#6fa989'], // dark primary button
      ['#935832', '#f4efe5'], // light eyebrow
      ['#cf936a', '#111814'], // dark eyebrow
    ] as const;

    for (const [foreground, background] of pairs) {
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
