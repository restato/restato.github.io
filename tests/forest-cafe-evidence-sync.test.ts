import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const baselineDirectory = join(
  process.cwd(),
  'tests/e2e/forest-cafe-visual.spec.ts-snapshots',
);
const evidenceDirectory = join(
  process.cwd(),
  'docs/superpowers/reports/assets/forest-cafe',
);

function sha256(path: string) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function baselineNameFor(evidenceName: string) {
  if (evidenceName.includes('-mobile-390-')) {
    return evidenceName.replace(/\.png$/, '-mobile-390-darwin.png');
  }
  return evidenceName.replace(/\.png$/, '-desktop-darwin.png');
}

describe('Forest Café screenshot evidence synchronization', () => {
  it('keeps every documentation image byte-identical to its Playwright baseline', () => {
    const evidenceNames = readdirSync(evidenceDirectory)
      .filter((name) => name.endsWith('.png'))
      .sort();
    const baselineNames = readdirSync(baselineDirectory)
      .filter((name) => name.endsWith('.png'))
      .sort();

    expect(evidenceNames).toHaveLength(54);
    expect(baselineNames).toHaveLength(54);

    const mappedBaselineNames = evidenceNames.map(baselineNameFor).sort();
    expect(mappedBaselineNames).toEqual(baselineNames);

    for (const evidenceName of evidenceNames) {
      const baselineName = baselineNameFor(evidenceName);
      const evidencePath = join(evidenceDirectory, evidenceName);
      const baselinePath = join(baselineDirectory, baselineName);
      expect(
        sha256(evidencePath),
        `${basename(evidencePath)} must match ${basename(baselinePath)}`,
      ).toBe(sha256(baselinePath));
    }
  });
});
