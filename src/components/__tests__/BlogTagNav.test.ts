// @vitest-environment node

import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
// @ts-expect-error jsdom does not publish TypeScript declarations.
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, it } from 'vitest';
import BlogTagNav from '../BlogTagNav.astro';
import { initializeBlogTagNav } from '../blogTagNavDisclosure';
import type { BlogTagCountEntry } from '../../lib/blogTags';

const source = readFileSync('src/components/BlogTagNav.astro', 'utf8');
const disclosureSource = readFileSync('src/components/blogTagNavDisclosure.ts', 'utf8');
let astro: AstroContainer;

const entries = (count: number): BlogTagCountEntry[] => Array.from(
  { length: count },
  (_, index) => ({
    label: `Tag ${index + 1}`,
    slug: `tag-${index + 1}`,
    count: index + 1,
  }),
);

async function renderNavigation(count: number) {
  const html = await astro.renderToString(BlogTagNav, {
    props: {
      entries: entries(count),
      label: 'Blog tags',
      showMoreLabel: 'Show more',
      showLessLabel: 'Show less',
      formatCountLabel: (value: number) => `${value} post${value === 1 ? '' : 's'}`,
    },
  });
  const document = new JSDOM(html).window.document;
  return {
    document,
    nav: document.querySelector<HTMLElement>('[data-blog-tag-nav]')!,
  };
}

describe('BlogTagNav disclosure contract', () => {
  beforeAll(async () => {
    astro = await AstroContainer.create();
  });

  it('keeps overflow tags accessible through a labelled disclosure', () => {
    expect(source).toContain('entries.slice(0, 10)');
    expect(source).toContain('entries.slice(10)');
    expect(source).toContain('aria-expanded="false"');
    expect(source).toContain('aria-controls={overflowId}');
    expect(source).toContain('data-blog-tag-overflow');
    expect(source).toContain('data-show-more-label={showMoreLabel}');
    expect(source).toContain('data-show-less-label={showLessLabel}');
    expect(source).toContain('{entry.count}');
    expect(source).toContain('entries.length > 10');
  });

  it('gives each disclosure instance a unique controlled region', () => {
    expect(source).toContain('crypto.randomUUID()');
    expect(source).toContain('initializeBlogTagNav()');
    expect(disclosureSource).toContain("nav.querySelector<HTMLElement>('[data-blog-tag-overflow]')");
  });

  it('renders ten entries without an expand control', async () => {
    const { nav } = await renderNavigation(10);

    expect(nav.querySelectorAll('[data-blog-tag-link]')).toHaveLength(10);
    expect(nav.querySelector('.blog-tag-toggle')).not.toBeInTheDocument();
  });

  it('renders eleven entries with ten visible until the disclosure expands', async () => {
    const { document, nav } = await renderNavigation(11);
    const toggle = nav.querySelector<HTMLButtonElement>('.blog-tag-toggle')!;
    const overflow = nav.querySelector<HTMLElement>('[data-blog-tag-overflow]')!;
    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('[data-blog-tag-link]'));

    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(links).toHaveLength(11);
    for (const link of links.slice(0, 10)) expect(link).toBeVisible();
    expect(links[10]).not.toBeVisible();
    expect(overflow).toHaveAttribute('hidden');

    initializeBlogTagNav(document);
    toggle.click();

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(overflow).not.toHaveAttribute('hidden');
    expect(nav.querySelector('a[href="/blog/tag/tag-11"]')).toBeVisible();
  });
});
