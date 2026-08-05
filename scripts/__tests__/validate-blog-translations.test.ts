import { execFile as execFileCallback } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { afterEach, describe, expect, it } from 'vitest';
import { validateBlogTranslations } from '../validate-blog-translations.mjs';

const fixtureDirectories: string[] = [];
const execFile = promisify(execFileCallback);

afterEach(async () => {
  await Promise.all(fixtureDirectories.splice(0).map(directory => rm(directory, {
    recursive: true,
    force: true,
  })));
});

async function createFixture(files: Record<string, string>) {
  const directory = await mkdtemp(join(tmpdir(), 'validate-blog-translations-'));
  fixtureDirectories.push(directory);

  await Promise.all(Object.entries(files).map(async ([file, content]) => {
    const target = join(directory, 'src/content/blog', file);
    await mkdir(join(target, '..'), { recursive: true });
    await writeFile(target, content);
  }));

  return directory;
}

function post(lang: string, translationKey: string) {
  return `---\nlang: ${lang}\ntranslationKey: ${translationKey}\n---\n# Article\n`;
}

describe('validateBlogTranslations', () => {
  it('accepts a complete, matching translation pair', async () => {
    const root = await createFixture({
      'en/opus-guide.mdx': post('en', 'opus-guide'),
      'ko/opus-guide.mdx': post('ko', 'opus-guide'),
    });

    expect(validateBlogTranslations(root)).toEqual([]);
  });

  it('reports a missing locale counterpart', async () => {
    const rootWithOnlyEnglish = await createFixture({
      'en/opus-guide.mdx': post('en', 'opus-guide'),
    });

    expect(validateBlogTranslations(rootWithOnlyEnglish)).toContain(
      'translation pair opus-guide is missing ko',
    );
  });

  it('reports duplicate locale documents', async () => {
    const rootWithDuplicateEnglish = await createFixture({
      'en/opus-guide.mdx': post('en', 'opus-guide'),
      'en/opus-guide-copy.mdx': post('en', 'opus-guide'),
      'ko/opus-guide.mdx': post('ko', 'opus-guide'),
    });

    expect(validateBlogTranslations(rootWithDuplicateEnglish)).toContain(
      'translation pair opus-guide has duplicate en documents',
    );
  });

  it('reports filenames that disagree with the public slug', async () => {
    const rootWithMismatchedFilename = await createFixture({
      'en/opus-guide.mdx': post('en', 'opus-guide'),
      'ko/opus-guide-korean.mdx': post('ko', 'opus-guide'),
    });

    expect(validateBlogTranslations(rootWithMismatchedFilename)).toContain(
      'translation pair opus-guide uses inconsistent public slugs',
    );
  });

  it('rejects translation keys outside the locale directories', async () => {
    const rootWithRootTranslationKey = await createFixture({
      'opus-guide.mdx': post('en', 'opus-guide'),
    });

    expect(validateBlogTranslations(rootWithRootTranslationKey)).toContain(
      'paired document must live under src/content/blog/en or src/content/blog/ko',
    );
  });

  it('prints validation errors and exits nonzero through the CLI', async () => {
    const root = await createFixture({
      'en/opus-guide.mdx': post('en', 'opus-guide'),
    });

    await expect(execFile(process.execPath, [
      join(process.cwd(), 'scripts/validate-blog-translations.mjs'),
    ], { cwd: root })).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining('translation pair opus-guide is missing ko'),
    });
  });
});
