import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';
import { getTool } from '../registry';
import { getToolFallbackNotice, landingContent } from '../../../i18n/landing';
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

  it('publishes a complete localization with reciprocal hreflang alternates', () => {
    const metadata = getLocalizedToolPageMetadata(getTool('background-remover')!, 'en');

    expect(metadata.robots).toBe('index, follow');
    expect(metadata.alternateUrls).toHaveLength(12);
  });

  it('labels incomplete requested content as English fallback when English is rendered', () => {
    const source = getTool('json')!;
    const tool = { ...source, content: { ...source.content, ko: { ...source.content.ko!, status: 'fallback' as const }, fr: undefined } };
    expect(getToolFallbackNotice(tool, 'ko')).toBe(landingContent.ko.fallbackNotice);
    expect(getToolFallbackNotice(tool, 'fr')).toBe(landingContent.fr.fallbackNotice);
  });

  it('keeps the English fallback notice when English content is complete but the requested locale is absent', () => {
    const source = getTool('json')!;
    const tool = {
      ...source,
      content: {
        ...source.content,
        en: { ...source.content.en!, status: 'complete' as const },
        fr: undefined,
      },
    };

    expect(getToolFallbackNotice(tool, 'fr')).toBe(landingContent.fr.fallbackNotice);
  });

  it('indexes a catalog only after every tool record in the locale is complete', () => {
    const state = getToolCatalogPublicationState('fr');
    expect(state.robots).toBe('index, follow');
    expect(state.alternateUrls).toHaveLength(12);
  });

  it('includes complete tool and catalog URLs while excluding compatibility redirects', () => {
    expect(isIndexableLocalizedToolUrl('/ko/tools/background-remover')).toBe(true);
    expect(isIndexableLocalizedToolUrl('/en/anonymous-chat')).toBe(true);
    expect(isIndexableLocalizedToolUrl('/ko/tools/image-crop-resizer')).toBe(false);
    expect(isIndexableLocalizedToolUrl('/ko/tools')).toBe(true);
    expect(isIndexableLocalizedToolUrl('/fr/tools/')).toBe(true);
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
    expect(detailSource).toContain('const faqSchema');
    expect(detailSource).toContain('content.faq.map');
    expect(detailSource).toContain('{content.privacy}');
    expect(detailSource).toContain('robots={robots}');
    expect(detailSource).toContain('alternateUrls={alternateUrls}');
    expect(catalogSource).toContain('getPublishedTools');
    expect(catalogSource).toContain('getPublishedTools().map');
    expect(anonymousChatSource).toContain('getLocalizedToolPageMetadata');
    expect(anonymousChatSource).toContain('const privacy = seo.privacy');
    expect(anonymousChatSource).toContain('<p class="chat-privacy">{privacy}</p>');
    expect(anonymousChatSource).toContain('robots={robots}');
    expect(detailSource).toContain('getToolFallbackNotice(tool, lang)');
    expect(anonymousChatSource).toContain('getToolFallbackNotice(tool, lang)');
    expect(astroConfigSource).toContain('isIndexableLocalizedToolUrl');
    expect(astroConfigSource).toContain('filter: isIndexableLocalizedToolUrl');
  });

  it('renders the anonymous chat help, FAQ schema, privacy and interactive fallback boundary', () => {
    const source = readFileSync(anonymousChatRoutePath, 'utf8');
    expect(source).toContain('seo.overview');
    expect(source).toContain('seo.steps.map');
    expect(source).toContain('seo.examples.map');
    expect(source).toContain('seo.limitations.map');
    expect(source).toContain('seo.faq.map');
    expect(source).toContain('FAQPage');
    expect(source).toContain('interactiveFallbackNotice');
  });
});
