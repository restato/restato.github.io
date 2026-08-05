import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('production build translation gate', () => {
  it('validates bilingual pairs before Astro can emit deployable output', () => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
    ) as { scripts?: Record<string, string> };
    const build = packageJson.scripts?.build ?? '';

    expect(build).toMatch(/^npm run verify:translations\s*&&\s*astro build\b/u);
  });

  it('keeps quality and deploy workflows behind the gated build command', () => {
    for (const workflow of ['quality.yml', 'deploy.yml']) {
      const source = readFileSync(
        join(process.cwd(), '.github', 'workflows', workflow),
        'utf8',
      );

      expect(source, workflow).toContain('run: npm run build');
      expect(source, workflow).not.toMatch(/\bastro build\b/u);
    }
  });
});
