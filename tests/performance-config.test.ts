import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);

describe('performance gate configuration', () => {
  it('ships no global remote font request and uses a system-language font stack', async () => {
    const [layout, tailwind] = await Promise.all([
      readFile(path.join(projectRoot, 'src/layouts/BaseLayout.astro'), 'utf8'),
      readFile(path.join(projectRoot, 'tailwind.config.mjs'), 'utf8'),
    ]);

    expect(layout).not.toMatch(/cdn\.jsdelivr\.net|pretendard\.css/i);
    expect(tailwind).not.toMatch(/Pretendard/);
    expect(tailwind).toContain('system-ui');
    expect(tailwind).toContain('Apple SD Gothic Neo');
    expect(tailwind).toContain('Malgun Gothic');
    expect(tailwind).toContain('Hiragino Sans');
    expect(tailwind).toContain('Yu Gothic');
  });

  it('keeps the SEO category gate while skipping only intentional crawlability', () => {
    const config = require(path.join(projectRoot, 'lighthouserc.cjs'));

    expect(config.ci.collect.settings.skipAudits).toEqual(['is-crawlable']);
    expect(config.ci.assert.assertions['categories:seo']).toEqual([
      'error',
      { minScore: 0.9 },
    ]);
  });
});
