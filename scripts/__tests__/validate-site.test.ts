import { execFile as execFileCallback } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { afterEach, describe, expect, it } from 'vitest';
import { createGeneratedPathIndex, resolveGeneratedPath, validateSite } from '../validate-site.mjs';

const fixtureDirectories: string[] = [];
const execFile = promisify(execFileCallback);

afterEach(async () => {
  await Promise.all(fixtureDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })));
});

async function createFixture(files: Record<string, string>) {
  const directory = await mkdtemp(join(tmpdir(), 'validate-site-'));
  fixtureDirectories.push(directory);

  await Promise.all(Object.entries(files).map(async ([file, content]) => {
    const target = join(directory, file);
    await mkdir(join(target, '..'), { recursive: true });
    await writeFile(target, content);
  }));

  return directory;
}

function page(options: {
  canonical?: string;
  alternates?: Array<[string, string]>;
  body?: string;
}) {
  const alternates = options.alternates
    ?.map(([lang, href]) => `<link rel="alternate" hreflang="${lang}" href="${href}">`)
    .join('') ?? '';

  const canonical = options.canonical
    ? `<link rel="canonical" href="${options.canonical}">`
    : '';

  return `<!doctype html><html><head>${canonical}${alternates}</head><body>${options.body ?? ''}</body></html>`;
}

describe('validateSite', () => {
  it('rejects an empty generated output directory', async () => {
    const directory = await createFixture({});

    const result = await validateSite(directory);

    expect(result).toEqual({
      pages: 0,
      errors: ['No generated HTML pages found in generated output'],
    });
  });

  it('reports duplicate canonical links', async () => {
    const directory = await createFixture({
      'index.html': `${page({ canonical: 'https://restato.github.io/' })}<link rel="canonical" href="https://restato.github.io/duplicate">`,
    });

    const result = await validateSite(directory);

    expect(result.errors).toContain('index.html: expected exactly one canonical link, found 2');
  });

  it('reports pages without a canonical link', async () => {
    const directory = await createFixture({
      'index.html': page({}),
    });

    const result = await validateSite(directory);

    expect(result.errors).toContain('index.html: expected exactly one canonical link, found 0');
  });

  it('reports internal links whose generated target is missing', async () => {
    const directory = await createFixture({
      'index.html': page({
        canonical: 'https://restato.github.io/',
        body: '<a href="/missing-page">Missing page</a>',
      }),
    });

    const result = await validateSite(directory);

    expect(result.errors).toContain('index.html: broken internal link /missing-page');
  });

  it('reports hreflang links that are not reciprocal', async () => {
    const directory = await createFixture({
      'en/tools/example/index.html': page({
        canonical: 'https://restato.github.io/en/tools/example',
        alternates: [
          ['en', 'https://restato.github.io/en/tools/example'],
          ['ko', 'https://restato.github.io/ko/tools/example'],
        ],
      }),
      'ko/tools/example/index.html': page({
        canonical: 'https://restato.github.io/ko/tools/example',
        alternates: [['ko', 'https://restato.github.io/ko/tools/example']],
      }),
    });

    const result = await validateSite(directory);

    expect(result.errors).toContain(
      'en/tools/example/index.html: hreflang ko target does not link back with hreflang en',
    );
  });

  it('resolves trailing slashes, query strings, fragments, redirects, and static assets exactly', async () => {
    const directory = await createFixture({
      'index.html': page({
        canonical: 'https://restato.github.io/',
        body: [
          '<a href="/guide/?from=home#intro">Guide</a>',
          '<a href="/legacy">Legacy redirect</a>',
          '<a href="/assets/guide.pdf">Download</a>',
        ].join(''),
      }),
      'guide/index.html': page({ canonical: 'https://restato.github.io/guide/' }),
      'legacy/index.html': '<!doctype html><head><link rel="canonical" href="https://restato.github.io/guide/"><meta http-equiv="refresh" content="0;url=/guide/"></head><a href="/guide/">Redirecting</a>',
      'assets/guide.pdf': 'fixture',
    });

    const result = await validateSite(directory);

    expect(result).toEqual({ pages: 3, errors: [] });
  });

  it('reports a generated redirect whose meta-refresh target is missing', async () => {
    const directory = await createFixture({
      'legacy/index.html': '<!doctype html><head><link rel="canonical" href="https://restato.github.io/guide/"><meta http-equiv="refresh" content="0;url=/missing-guide"></head>',
    });

    const result = await validateSite(directory);

    expect(result.errors).toContain(
      'legacy/index.html: broken redirect target /missing-guide',
    );
  });

  it('resolves generated paths with spaces after URL encoding', async () => {
    const directory = await createFixture({
      'index.html': page({
        canonical: 'https://restato.github.io/',
        body: '<a href="/blog/tag/AI Agent">AI Agent</a>',
      }),
      'blog/tag/AI Agent/index.html': page({ canonical: 'https://restato.github.io/blog/tag/AI%20Agent' }),
    });

    const result = await validateSite(directory);

    expect(result.errors).toEqual([]);
  });

  it('reports route casing that does not exactly match generated output paths', async () => {
    const directory = await createFixture({
      'index.html': page({
        canonical: 'https://restato.github.io/',
        body: '<a href="/blog/tag/AI">AI</a>',
      }),
      'blog/tag/ai/index.html': page({ canonical: 'https://restato.github.io/blog/tag/ai' }),
    });

    const result = await validateSite(directory);

    expect(result.errors).toContain(
      'index.html: internal link /blog/tag/AI differs by case from generated path /blog/tag/ai',
    );
  });

  it('reports an ambiguous case-folded internal path instead of hiding it', () => {
    const result = resolveGeneratedPath('/blog/tag/aI', createGeneratedPathIndex(new Set([
      '/blog/tag/AI',
      '/blog/tag/ai',
    ])));

    expect(result).toEqual({
      status: 'ambiguous',
      matches: ['/blog/tag/AI', '/blog/tag/ai'],
    });
  });

  it('reuses a precomputed exact and folded path index during resolution', () => {
    const index = createGeneratedPathIndex(new Set(['/guide', '/assets/guide.pdf']));

    expect(resolveGeneratedPath('/guide/', index)).toEqual({ status: 'found' });
    expect(resolveGeneratedPath('/assets/GUIDE.pdf', index)).toEqual({
      status: 'case-mismatch',
      matches: ['/assets/guide.pdf'],
    });
  });

  it('links localized tool breadcrumbs to the published localized tool index', async () => {
    const source = await readFile(
      join(process.cwd(), 'src/pages/[lang]/tools/[slug].astro'),
      'utf8',
    );

    expect(source).toContain('<li><a href={`/${lang}/tools`}');
    expect(source).not.toContain('<li><a href={`/${lang}`}');
  });

  it('reports a successful validation result through the CLI', async () => {
    const directory = await createFixture({
      'index.html': page({ canonical: 'https://restato.github.io/' }),
    });

    const { stdout } = await execFile(process.execPath, [
      'scripts/validate-site.mjs',
      directory,
    ], { cwd: process.cwd() });

    expect(stdout).toBe('Site validation passed for 1 HTML page(s).\n');
  });
});
