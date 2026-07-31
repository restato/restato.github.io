import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { modernRestatoRoutes } from './e2e/modern-restato-routes';

const baselineDirectory = join(
  process.cwd(),
  'tests/e2e/modern-restato-visual.spec.ts-snapshots',
);
function expectedBaselineNames(id: string) {
  return [
    `${id}-desktop-light-desktop-darwin.png`,
    `${id}-desktop-dark-desktop-darwin.png`,
    `${id}-mobile-390-dark-mobile-390-darwin.png`,
  ];
}

describe('Modern Restato visual baseline synchronization', () => {
  it('keeps every route and expanded tag state represented by the exact browser baseline set', () => {
    const baselineNames = readdirSync(baselineDirectory)
      .filter((name) => name.endsWith('.png'))
      .sort();
    const expectedNames = [
      ...modernRestatoRoutes.flatMap(({ id }) => expectedBaselineNames(id)),
      ...expectedBaselineNames('blog-tags-expanded'),
    ].sort();

    expect(baselineNames).toHaveLength(60);
    expect(baselineNames).toEqual(expectedNames);
  });
});
