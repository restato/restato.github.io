import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectFiles = [
  'gallery.astro',
  'gyeol.astro',
  'jobworld-kids.astro',
  'local-price-extractor.astro',
  'neighborhood-change.astro',
  'quick-issue.astro',
  'roomfit-3d.astro',
] as const;

const projectSources = Object.fromEntries(
  projectFiles.map((file) => [
    file,
    readFileSync(join(process.cwd(), 'src/pages/projects', file), 'utf8'),
  ]),
) as Record<(typeof projectFiles)[number], string>;
const globalStyles = readFileSync(join(process.cwd(), 'src/styles/global.css'), 'utf8');

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

describe('Modern Restato project page contract', () => {
  it.each(projectFiles)('%s uses shared primitives without legacy effects', (file) => {
    const source = projectSources[file];

    expect(source).toMatch(/\bfc-page\b/);
    expect(source).toMatch(/\bfc-(?:surface|empty-state)\b/);
    for (const pattern of forbiddenPresentationPatterns) {
      expect(source).not.toMatch(pattern);
    }
  });

  it.each(projectFiles)('%s uses the shared section-flow hierarchy', (file) => {
    expect(projectSources[file]).toMatch(/class="fc-page fc-content fc-section-flow"/);
  });

  it('defines one responsive Modern Restato section-flow primitive', () => {
    expect(globalStyles).toMatch(/\.fc-section-flow\s*{[\s\S]*?display:\s*grid;[\s\S]*?gap:\s*clamp\(/);
    expect(globalStyles).toMatch(/\.fc-section-flow\s*>\s*:where\([\s\S]*?margin-block:\s*0;/);
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

  it('preserves the six original gallery entries through deterministic local media', () => {
    const source = projectSources['gallery.astro'];
    const expectedImages = Array.from({ length: 6 }, (_, index) => ({
      src: `/images/gallery/seed-${index + 1}-800x600.jpg`,
      alt: `Sample ${index + 1}`,
      title: `Sample Image ${index + 1}`,
    }));

    expect(source).not.toMatch(/https?:\/\/picsum\.photos/);
    for (const image of expectedImages) {
      expect(source).toContain(
        `{ src: '${image.src}', alt: '${image.alt}', title: '${image.title}' }`,
      );
      expect(existsSync(join(process.cwd(), 'public', image.src))).toBe(true);
    }
  });

  it('contains the jobworld process connectors in a positioned clipped grid', () => {
    const source = projectSources['jobworld-kids.astro'];
    const processGrid = source.match(/<div[^>]+data-jobworld-process-grid[^>]*>/)?.[0];

    expect(processGrid).toBeDefined();
    expect(processGrid).toContain('relative');
    expect(processGrid).toContain('overflow-hidden');
  });

  it('uses Modern Restato contrast-bearing classes for the identified text pairs', () => {
    const localPrice = projectSources['local-price-extractor.astro'];
    const roomfit = projectSources['roomfit-3d.astro'];

    expect(localPrice).toMatch(/data-local-price-primary-cta[^>]+fc-button-primary/);
    expect(roomfit).toMatch(/data-roomfit-eyebrow[^>]+fc-eyebrow/);
    expect(roomfit).not.toMatch(/data-roomfit-eyebrow[^>]+text-cyan-/);
  });

  it('keeps the project CTA and eyebrow token pairs at WCAG AA contrast', () => {
    const pairs = [
      ['#FFFFFF', '#19553C'], // light primary button
      ['#19211D', '#70A889'], // dark primary button
      ['#19553C', '#F7F8F7'], // light eyebrow
      ['#70A889', '#111713'], // dark eyebrow
    ] as const;

    for (const [foreground, background] of pairs) {
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
