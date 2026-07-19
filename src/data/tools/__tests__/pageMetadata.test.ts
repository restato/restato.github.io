import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';
import { getTool } from '../registry';
import {
  getLocalizedToolPageMetadata,
  isIndexableLocalizedToolUrl,
} from '../pageMetadata';

const detailRoutePath = join(process.cwd(), 'src/pages/[lang]/tools/[slug].astro');
const catalogRoutePath = join(process.cwd(), 'src/pages/[lang]/tools/index.astro');
const anonymousChatRoutePath = join(process.cwd(), 'src/pages/[lang]/anonymous-chat.astro');
const astroConfigPath = join(process.cwd(), 'astro.config.mjs');

describe('localized tool page metadata', () => {
  it.each([
    ['background-remover', 'en', 'Selected image bytes are not uploaded'],
    ['llm-cost', 'en', 'external exchange-rate service'],
    ['image-resizer', 'en', 'does not send those values to an external service'],
  ] as const)('uses the registry privacy disclosure for %s', (slug, lang, expectedDisclosure) => {
    const tool = getTool(slug);
    expect(tool).toBeDefined();

    const metadata = getLocalizedToolPageMetadata(tool!, lang);

    expect(metadata.privacy).toContain(expectedDisclosure);
  });

  it('keeps fallback localizations public but non-indexable and without hreflang alternates', () => {
    const metadata = getLocalizedToolPageMetadata(getTool('background-remover')!, 'en');

    expect(metadata.robots).toBe('noindex, follow');
    expect(metadata.alternateUrls).toEqual([]);
  });

  it('filters fallback tool and anonymous-chat URLs out of the sitemap without removing public routes', () => {
    expect(isIndexableLocalizedToolUrl('/ko/tools/background-remover')).toBe(false);
    expect(isIndexableLocalizedToolUrl('/en/anonymous-chat')).toBe(false);
    expect(isIndexableLocalizedToolUrl('/ko/tools')).toBe(true);
    expect(isIndexableLocalizedToolUrl('/ko/tools/image-crop-resizer')).toBe(true);
  });

  it('wires registry metadata and release filtering into localized route output', () => {
    const detailSource = readFileSync(detailRoutePath, 'utf8');
    const catalogSource = readFileSync(catalogRoutePath, 'utf8');
    const anonymousChatSource = readFileSync(anonymousChatRoutePath, 'utf8');
    const astroConfigSource = readFileSync(astroConfigPath, 'utf8');

    expect(detailSource).toContain('getLocalizedToolPageMetadata');
    expect(detailSource).toContain('const privacy = content.privacy');
    expect(detailSource).toContain('<span>{privacy}</span>');
    expect(detailSource).toContain('robots={robots}');
    expect(detailSource).toContain('alternateUrls={alternateUrls}');
    expect(catalogSource).toContain('getPublishedTools');
    expect(catalogSource).toContain('getPublishedTools().map');
    expect(anonymousChatSource).toContain('getLocalizedToolPageMetadata');
    expect(anonymousChatSource).toContain('robots={robots}');
    expect(astroConfigSource).toContain('isIndexableLocalizedToolUrl');
    expect(astroConfigSource).toContain('filter: isIndexableLocalizedToolUrl');
  });
});
