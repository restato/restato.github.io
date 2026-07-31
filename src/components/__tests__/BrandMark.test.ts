import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const brandMarkPath = 'src/components/BrandMark.astro';
const brandMark = existsSync(brandMarkPath) ? readFileSync(brandMarkPath, 'utf8') : '';
const faviconPath = 'public/favicon.svg';
const favicon = existsSync(faviconPath) ? readFileSync(faviconPath, 'utf8') : '';
const provenancePath = 'public/brand-icons.provenance.json';

const approvedGeometry = [
  {
    element: 'rect',
    width: '32',
    height: '32',
    rx: '7',
    fill: 'var(--brand-icon-bg, #19553C)',
  },
  {
    element: 'path',
    d: 'M9 22V10h7.2c4.2 0 6.8 2.1 6.8 5.5 0 2.4-1.3 4.2-3.6 5.1L23 25h-4l-3-4.1h-3.4V22H9Z',
    fill: 'var(--brand-icon-r, #F7F8F7)',
  },
  {
    element: 'path',
    d: 'M13 13.4v4.2h3c2 0 3-.7 3-2.1s-1-2.1-3-2.1h-3Z',
    fill: 'var(--brand-icon-bg, #19553C)',
  },
  {
    element: 'path',
    d: 'M20.5 7.5c1.7.1 3.1.7 4 1.9-1.7.7-3.3.6-4.8-.4.1-.6.4-1.1.8-1.5Z',
    fill: 'var(--brand-icon-leaf, #9CC4AD)',
  },
] as const;

function extractGeometry(source: string) {
  return [...source.matchAll(/<(rect|path)\b([^>]*)\/?\s*>/g)].map((match) => {
    const attributes = Object.fromEntries(
      [...match[2].matchAll(/([\w:-]+)="([^"]*)"/g)].map((attribute) => [
        attribute[1],
        attribute[2],
      ]),
    );

    return Object.fromEntries(
      [
        ['element', match[1]],
        ['width', attributes.width],
        ['height', attributes.height],
        ['rx', attributes.rx],
        ['d', attributes.d],
        ['fill', attributes.fill],
      ].filter((entry): entry is [string, string] => entry[1] !== undefined),
    );
  });
}

function sha256(contents: string | Buffer) {
  return createHash('sha256').update(contents).digest('hex');
}

function pngDimensions(path: string) {
  const contents = readFileSync(path);

  expect(contents.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');

  return {
    width: contents.readUInt32BE(16),
    height: contents.readUInt32BE(20),
    sha256: sha256(contents),
  };
}

describe('Restato brand mark', () => {
  it('keeps the approved deterministic R and leaf geometry', () => {
    expect(brandMark).toContain('viewBox="0 0 32 32"');
    expect(extractGeometry(brandMark)).toEqual(approvedGeometry);
    expect(extractGeometry(favicon)).toEqual(approvedGeometry);
    expect(brandMark).not.toMatch(/\u{1F680}|✨|(?:href|src)=["']https?:\/\//u);
  });

  it('records deterministic dimensions, hashes, and source provenance for raster exports', () => {
    expect(existsSync(provenancePath)).toBe(true);

    const provenance = JSON.parse(readFileSync(provenancePath, 'utf8'));
    const expectedOutputs = {
      'public/apple-touch-icon.png': pngDimensions('public/apple-touch-icon.png'),
      'public/icon-192x192.png': pngDimensions('public/icon-192x192.png'),
      'public/icon-512x512.png': pngDimensions('public/icon-512x512.png'),
    };

    expect(provenance).toEqual({
      source: faviconPath,
      sourceGeometrySha256: sha256(JSON.stringify(approvedGeometry)),
      generator: 'macOS sips native-size SVG rasterization',
      outputs: expectedOutputs,
    });
    expect(expectedOutputs['public/apple-touch-icon.png']).toMatchObject({ width: 180, height: 180 });
    expect(expectedOutputs['public/icon-192x192.png']).toMatchObject({ width: 192, height: 192 });
    expect(expectedOutputs['public/icon-512x512.png']).toMatchObject({ width: 512, height: 512 });
  });

  it('is decorative by default and named only when a title is supplied', () => {
    expect(brandMark).toContain("aria-hidden={title ? undefined : 'true'}");
    expect(brandMark).toContain("role={title ? 'img' : undefined}");
    expect(brandMark).toContain('{title && <title>{title}</title>}');
  });

  it('exposes approved light and dark theme color variables', () => {
    expect(brandMark).toContain('--brand-icon-bg: #19553C');
    expect(brandMark).toContain('--brand-icon-r: #F7F8F7');
    expect(brandMark).toContain('--brand-icon-leaf: #9CC4AD');
    expect(brandMark).toContain('--brand-icon-bg: #70A889');
    expect(brandMark).toContain('--brand-icon-r: #111713');
    expect(brandMark).toContain('--brand-icon-leaf: #F0F4F1');
  });
});
