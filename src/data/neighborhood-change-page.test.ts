import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

describe('Neighborhood Change project page', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/pages/projects/neighborhood-change.astro'),
    'utf8',
  );

  it('uses only approved public product facts and links to the live app', () => {
    expect(source).toContain('Seoul and Bundang');
    expect(source).toContain('500 m · 1 km · 2 km');
    expect(source).toContain('No Sign-Up');
    expect(source).toContain('https://neighborhood-change.vercel.app');
    expect(source).toContain('VWorld');
    expect(source).toContain('BuildingHUB');
    expect(source).not.toContain('github.com/restato/neighborhood-change');
  });

  it('publishes SoftwareApplication structured data', () => {
    expect(source).toContain("'@type': 'SoftwareApplication'");
    expect(source).toContain("applicationCategory: 'UtilitiesApplication'");
  });
});
