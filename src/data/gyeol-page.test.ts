import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Gyeol project page', () => {
  const source = readFileSync(join(process.cwd(), 'src/pages/projects/gyeol.astro'), 'utf8');
  const publicRoot = join(process.cwd(), 'public');

  it('publishes only approved in-review product facts', () => {
    expect(source).toContain('오늘의 결');
    expect(source).toContain('In App Review');
    expect(source).toContain('Your journal stays on this iPhone');
    expect(source).toContain('7-day and 30-day patterns');
    expect(source).toContain('Korean and English');
    expect(source).not.toContain('github.com/restato/gyeol-ios');
    expect(source).not.toContain('apps.apple.com');
    expect(source).not.toContain('Submission ID');
  });

  it('renders the approved icon and three English screenshots', () => {
    const assets = [
      '/images/projects/gyeol/app-icon.png',
      '/images/projects/gyeol/01-today.jpg',
      '/images/projects/gyeol/02-past.jpg',
      '/images/projects/gyeol/03-patterns.jpg',
    ];
    for (const asset of assets) {
      expect(source).toContain(asset);
      expect(existsSync(join(publicRoot, asset))).toBe(true);
    }
  });

  it('publishes SoftwareApplication data without a sale offer', () => {
    expect(source).toContain("'@type': 'SoftwareApplication'");
    expect(source).toContain("operatingSystem: 'iOS 26 or later'");
    expect(source).not.toContain("'@type': 'Offer'");
  });
});
