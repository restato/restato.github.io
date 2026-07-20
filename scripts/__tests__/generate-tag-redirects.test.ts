import { createServer } from 'node:http';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  classifyTagAlias,
  generateTagRedirects,
} from '../generate-tag-redirects.mjs';

const temporaryDirectories: string[] = [];

interface LegacyAlias {
  filesystemSegment: string;
  urlSegment: string;
}

async function makeDistFixture(slug: string, aliases: LegacyAlias[]) {
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

async function requestStaticPage(distDir: string, pathname: string) {
  const server = createServer(async (request, response) => {
    let decodedPathname;
    try {
      decodedPathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    } catch {
      response.writeHead(404, { connection: 'close' }).end('not found');
      return;
    }
    const page = join(distDir, decodedPathname.replace(/^\/+/, ''), 'index.html');
    try {
      const body = await readFile(page);
      response.writeHead(200, { 'content-type': 'text/html', connection: 'close' }).end(body);
    } catch {
      response.writeHead(404, { connection: 'close' }).end('not found');
    }
  });
  const listening = new Promise<void>(resolve => server.once('listening', resolve));
  server.listen(0, '127.0.0.1');
  await listening;
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Static test server did not expose a port');

  try {
    return await fetch(`http://127.0.0.1:${address.port}${pathname}`);
  } finally {
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })));
});

describe('blog tag redirect artifact generation', () => {
  it('creates non-colliding static redirect pages with canonical, noindex, and meta refresh', async () => {
    const distDir = await makeDistFixture('ai-agent', [
      { filesystemSegment: 'AI Agent', urlSegment: 'AI%20Agent' },
      { filesystemSegment: '개발 도구', urlSegment: '%EA%B0%9C%EB%B0%9C%20%EB%8F%84%EA%B5%AC' },
    ]);

    const result = await generateTagRedirects(distDir, { caseSensitive: true });
    const redirect = await readFile(join(distDir, 'blog/tag/AI Agent/index.html'), 'utf8');

    expect(result).toEqual({ created: 2, fallbackAliases: 0 });
    expect(redirect).toContain('<meta name="robots" content="noindex, follow">');
    expect(redirect).toContain('<link rel="canonical" href="/blog/tag/ai-agent">');
    expect(redirect).toContain('<meta http-equiv="refresh" content="0;url=/blog/tag/ai-agent">');
  });

  it('protects canonical files on case-insensitive filesystems and injects a 404 fallback map', async () => {
    const distDir = await makeDistFixture('ai', [{ filesystemSegment: 'AI', urlSegment: 'AI' }]);

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
    expect(classifyTagAlias('AI Agent', 'ai-agent', false)).toBe('redirect');
  });

  it('serves raw filesystem aliases through their encoded URLs without accepting double encoding', async () => {
    const distDir = await makeDistFixture('ai-agent', [
      { filesystemSegment: 'AI Agent', urlSegment: 'AI%20Agent' },
      { filesystemSegment: 'C++', urlSegment: 'C%2B%2B' },
      { filesystemSegment: '개발 도구', urlSegment: '%EA%B0%9C%EB%B0%9C%20%EB%8F%84%EA%B5%AC' },
    ]);
    await generateTagRedirects(distDir, { caseSensitive: true });

    for (const pathname of [
      '/blog/tag/AI%20Agent/',
      '/blog/tag/C%2B%2B/',
      '/blog/tag/%EA%B0%9C%EB%B0%9C%20%EB%8F%84%EA%B5%AC/',
    ]) {
      const response = await requestStaticPage(distDir, pathname);
      expect(response.status).toBe(200);
      expect(await response.text()).toContain('0;url=/blog/tag/ai-agent');
    }

    for (const pathname of [
      '/blog/tag/AI%2520Agent/',
      '/blog/tag/C%252B%252B/',
      '/blog/tag/%25EA%25B0%259C%25EB%25B0%259C%2520%25EB%258F%2584%25EA%25B5%25AC/',
    ]) {
      expect((await requestStaticPage(distDir, pathname)).status).toBe(404);
    }
  });
});
