import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  classifyTagAlias,
  generateTagRedirects,
} from '../generate-tag-redirects.mjs';

const temporaryDirectories: string[] = [];

async function makeDistFixture(slug: string, aliases: string[]) {
  const directory = await mkdtemp(join(tmpdir(), 'restato-tag-redirects-'));
  temporaryDirectories.push(directory);
  const page = join(directory, 'blog', 'tag', slug, 'index.html');
  await mkdir(join(directory, 'blog', 'tag', slug), { recursive: true });
  await writeFile(
    page,
    `<!doctype html><head><script id="blog-tag-legacy-aliases" type="application/json" data-canonical-slug="${slug}">${JSON.stringify(aliases)}</script></head><body>canonical ${slug}</body>`,
  );
  await writeFile(join(directory, '404.html'), '<!doctype html><head></head><body>not found</body>');
  return directory;
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })));
});

describe('blog tag redirect artifact generation', () => {
  it('creates non-colliding static redirect pages with canonical, noindex, and meta refresh', async () => {
    const distDir = await makeDistFixture('ai-agent', ['AI%20Agent', '%EA%B0%9C%EB%B0%9C%20%EB%8F%84%EA%B5%AC']);

    const result = await generateTagRedirects(distDir, { caseSensitive: true });
    const redirect = await readFile(join(distDir, 'blog/tag/AI%20Agent/index.html'), 'utf8');

    expect(result).toEqual({ created: 2, fallbackAliases: 0 });
    expect(redirect).toContain('<meta name="robots" content="noindex, follow">');
    expect(redirect).toContain('<link rel="canonical" href="/blog/tag/ai-agent">');
    expect(redirect).toContain('<meta http-equiv="refresh" content="0;url=/blog/tag/ai-agent">');
  });

  it('protects canonical files on case-insensitive filesystems and injects a 404 fallback map', async () => {
    const distDir = await makeDistFixture('ai', ['AI']);

    const result = await generateTagRedirects(distDir, { caseSensitive: false });
    const canonical = await readFile(join(distDir, 'blog/tag/ai/index.html'), 'utf8');
    const fallback = await readFile(join(distDir, '404.html'), 'utf8');

    expect(result).toEqual({ created: 0, fallbackAliases: 1 });
    expect(canonical).toContain('canonical ai');
    expect(fallback).toContain('"/blog/tag/AI":"/blog/tag/ai"');
    expect(fallback).toContain('blog-tag-case-fallback-run');
  });

  it('uses exact redirects on a case-sensitive filesystem and fallback only for case-only aliases otherwise', () => {
    expect(classifyTagAlias('AI', 'ai', true)).toBe('redirect');
    expect(classifyTagAlias('AI', 'ai', false)).toBe('fallback');
    expect(classifyTagAlias('AI%20Agent', 'ai-agent', false)).toBe('redirect');
  });
});
