import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const pagePath = join(process.cwd(), 'src/pages/projects/roomfit-3d.astro');
const mainLayoutPath = join(process.cwd(), 'src/layouts/MainLayout.astro');

describe('RoomFit project detail page', () => {
  it('contains the approved public product contract', () => {
    expect(existsSync(pagePath)).toBe(true);
    const source = readFileSync(pagePath, 'utf8');

    expect(source).toContain('https://roomfit-3d.vercel.app');
    expect(source).toContain('Open Live App');

    for (const feature of [
      'Accurate Measurements',
      'Magnetic Placement',
      'Fit Checks',
      'Local-First Storage',
    ]) {
      expect(source).toContain(feature);
    }

    for (const technology of [
      'React',
      'TypeScript',
      'Three.js',
      'React Three Fiber',
      'Zustand',
      'Vite',
      'Vitest',
      'Playwright',
    ]) {
      expect(source).toContain(technology);
    }

    expect(source).toContain('SoftwareApplication');
    expect(source).toContain('BreadcrumbList');
    expect(source).toContain('lang="en"');
    expect(source).toContain('lockLanguage={true}');
    expect(source).not.toContain('github.com/restato/roomfit-3d');
    expect(source).not.toContain('View on GitHub');
  });

  it('allows an English project page to keep its language metadata locked', () => {
    const source = readFileSync(mainLayoutPath, 'utf8');

    expect(source).toContain('lockLanguage?: boolean');
    expect(source).toContain('lockLanguage={lockLanguage}');
  });
});
