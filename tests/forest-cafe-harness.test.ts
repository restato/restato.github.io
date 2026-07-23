import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = path.resolve(import.meta.dirname, '..');

async function readProjectFile(relativePath: string) {
  return readFile(path.join(projectRoot, relativePath), 'utf8');
}

describe('Forest Café deterministic browser harness', () => {
  it('runs both evidence projects in the baseline timezone', async () => {
    const config = await readProjectFile('playwright.config.ts');

    expect(config.match(/timezoneId:\s*'Asia\/Seoul'/g) ?? []).toHaveLength(2);
  });

  it('fixes wall-clock time before navigation and seeds seven absolute dashboard days', async () => {
    const visualSuite = await readProjectFile('tests/e2e/forest-cafe-visual.spec.ts');
    const fixedTimeCall = visualSuite.indexOf('await page.clock.setFixedTime(forestCafeFixedTime);');
    const navigationCall = visualSuite.indexOf('page.goto(route.path');
    const seedTimestamps = [...visualSuite.matchAll(/timestamp:\s*'([^']+)'/g)]
      .map((match) => match[1]);

    expect(visualSuite).toContain(
      "const forestCafeFixedTime = '2026-07-20T12:00:00.000+09:00';",
    );
    expect(fixedTimeCall).toBeGreaterThan(-1);
    expect(fixedTimeCall).toBeLessThan(navigationCall);
    expect(seedTimestamps).toHaveLength(7);
    expect(seedTimestamps.every((timestamp) => timestamp.endsWith('Z'))).toBe(true);
  });

  it('keeps the Minesweeper interaction inside the default timeout with direct cell lookup', async () => {
    const gameSuite = await readProjectFile(
      'src/components/games/__tests__/game-accessibility.test.tsx',
    );

    expect(gameSuite).not.toContain("getAllByRole('button', { name: /행.*열/ })");
    expect(gameSuite).not.toMatch(
      /preserves pre-game keyboard flags[\s\S]*?\},\s*30_000\);/,
    );
  });
});
