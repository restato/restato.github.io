import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { modernRestatoRoutes } from './e2e/modern-restato-routes';

const baselineDirectory = join(
  process.cwd(),
  'tests/e2e/modern-restato-visual.spec.ts-snapshots',
);
const evidenceDirectory = join(
  process.cwd(),
  'docs/superpowers/reports/assets/modern-restato',
);

const screenshotStates = [
  ...modernRestatoRoutes.map(({ id }) => id),
  'blog-tags-expanded',
];
const screenshotVariants = [
  { project: 'desktop', theme: 'light' },
  { project: 'desktop', theme: 'dark' },
  { project: 'mobile-390', theme: 'dark' },
] as const;

const baselineNameFor = (state: string, project: string, theme: string) => (
  `${state}-${project}-${theme}-${project}-darwin.png`
);
const evidenceNameFor = (state: string, project: string, theme: string) => (
  `${state}-${project}-${theme}.png`
);

const finalEvidencePairs = new Map([
  ['home-light.png', 'home-en-desktop-light-desktop-darwin.png'],
  ['home-dark.png', 'home-en-desktop-dark-desktop-darwin.png'],
  ['blog-tags-collapsed.png', 'blog-index-desktop-light-desktop-darwin.png'],
  ['blog-tags-expanded.png', 'blog-tags-expanded-desktop-light-desktop-darwin.png'],
  ['tool-mobile-dark.png', 'text-tool-en-mobile-390-dark-mobile-390-darwin.png'],
]);

function sha256(path: string) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

describe('Modern Restato screenshot evidence synchronization', () => {
  it('keeps every documentation image byte-identical to its Playwright baseline', () => {
    const matrixPairs = screenshotStates.flatMap((state) => (
      screenshotVariants.map(({ project, theme }) => ({
        evidenceName: evidenceNameFor(state, project, theme),
        baselineName: baselineNameFor(state, project, theme),
      }))
    ));
    const expectedBaselineNames = matrixPairs.map(({ baselineName }) => baselineName).sort();
    const expectedEvidenceNames = [
      ...matrixPairs.map(({ evidenceName }) => evidenceName),
      ...finalEvidencePairs.keys(),
    ].sort();
    const baselineNames = readdirSync(baselineDirectory)
      .filter((name) => name.endsWith('.png'))
      .sort();
    const evidenceNames = readdirSync(evidenceDirectory)
      .filter((name) => name.endsWith('.png'))
      .sort();

    expect(baselineNames).toEqual(expectedBaselineNames);
    expect(evidenceNames).toEqual(expectedEvidenceNames);

    for (const { evidenceName, baselineName } of matrixPairs) {
      const evidencePath = join(evidenceDirectory, evidenceName);
      const baselinePath = join(baselineDirectory, baselineName);
      expect(
        sha256(evidencePath),
        `${basename(evidencePath)} must match ${basename(baselinePath)}`,
      ).toBe(sha256(baselinePath));
    }

    for (const [evidenceName, baselineName] of finalEvidencePairs) {
      const evidencePath = join(evidenceDirectory, evidenceName);
      const baselinePath = join(baselineDirectory, baselineName);
      expect(
        sha256(evidencePath),
        `${basename(evidencePath)} must match ${basename(baselinePath)}`,
      ).toBe(sha256(baselinePath));
    }
  });
});
