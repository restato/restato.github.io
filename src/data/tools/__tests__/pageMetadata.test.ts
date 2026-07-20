import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';
import { getTool } from '../registry';
import {
  getToolCatalogPublicationState,
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

  it('keeps fallback catalogs non-indexable and out of reciprocal alternates', () => {
    expect(getToolCatalogPublicationState('fr')).toEqual({
      robots: 'noindex, follow',
      alternateUrls: [],
    });
  });

  it('filters fallback tool and anonymous-chat URLs out of the sitemap without removing public routes', () => {
    expect(isIndexableLocalizedToolUrl('/ko/tools/background-remover')).toBe(false);
    expect(isIndexableLocalizedToolUrl('/en/anonymous-chat')).toBe(false);
    expect(isIndexableLocalizedToolUrl('/ko/tools/image-crop-resizer')).toBe(false);
    expect(isIndexableLocalizedToolUrl('/ko/tools')).toBe(false);
    expect(isIndexableLocalizedToolUrl('/fr/tools/')).toBe(false);
    expect(isIndexableLocalizedToolUrl('/en/blog/not-a-tool')).toBe(true);
  });

  it('exposes the anonymous-chat connection disclosure from the registry', () => {
    const metadata = getLocalizedToolPageMetadata(getTool('anonymous-chat')!, 'en');

    expect(metadata.privacy).toContain('PeerJS signaling');
    expect(metadata.privacy).toContain('STUN-assisted direct WebRTC connection');
    expect(metadata.privacy).toContain('intended peer');
    expect(metadata.privacy).toContain('No TURN relay is configured');
    expect(metadata.privacy).toContain('may fail when STUN cannot establish a path');
    expect(metadata.privacy).toContain('room connection metadata may be temporarily recorded');
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
    expect(anonymousChatSource).toContain('const privacy = seo.privacy');
    expect(anonymousChatSource).toContain('<p class="chat-privacy">{privacy}</p>');
    expect(anonymousChatSource).toContain('robots={robots}');
    expect(detailSource).toContain("content.status === 'fallback'");
    expect(anonymousChatSource).toContain("seo.status === 'fallback'");
    expect(astroConfigSource).toContain('isIndexableLocalizedToolUrl');
    expect(astroConfigSource).toContain('filter: isIndexableLocalizedToolUrl');
  });
});
