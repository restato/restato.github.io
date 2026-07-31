import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  BUNDLE_BUDGETS,
  INITIAL_BUNDLE_ROUTES,
  auditBundles,
} from '../check-bundles.mjs';

const temporaryDirectories: string[] = [];

async function createFixture({
  manifest,
  html,
  assets,
}: {
  manifest?: unknown;
  html?: string;
  assets?: Record<string, Uint8Array | string>;
}) {
  const baseDirectory = await mkdtemp(path.join(tmpdir(), 'restato-bundles-'));
  temporaryDirectories.push(baseDirectory);
  const directory = path.join(baseDirectory, 'dist');
  await mkdir(directory, { recursive: true });

  if (manifest !== undefined) {
    await mkdir(path.join(directory, '.vite'), { recursive: true });
    await writeFile(
      path.join(directory, '.vite', 'manifest.json'),
      JSON.stringify(manifest),
    );
  }

  if (html !== undefined) {
    await mkdir(path.join(directory, 'ko', 'tools'), { recursive: true });
    await writeFile(path.join(directory, 'ko', 'tools', 'index.html'), html);
  }

  for (const [file, contents] of Object.entries(assets ?? {})) {
    const target = path.join(directory, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, contents);
  }

  return directory;
}

function deterministicBytes(length: number) {
  let state = 0x12345678;
  const bytes = new Uint8Array(length);
  for (let index = 0; index < length; index += 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    bytes[index] = state >>> 24;
  }
  return bytes;
}

afterEach(async () => {
  const { rm } = await import('node:fs/promises');
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe('auditBundles', () => {
  it('publishes the required route budgets', () => {
    expect(BUNDLE_BUDGETS).toEqual({
      hub: 180,
      text: 220,
      developer: 400,
      image: 550,
      pdf: 900,
    });
    expect(INITIAL_BUNDLE_ROUTES).toEqual([
      { route: '/ko/tools', kind: 'hub', budgetKb: 180 },
      { route: '/ko/tools/text-counter', kind: 'text', budgetKb: 220 },
      { route: '/ko/tools/json', kind: 'developer', budgetKb: 400 },
      { route: '/ko/tools/image-resizer', kind: 'image', budgetKb: 550 },
    ]);
  });

  it('rejects a heavy PDF chunk reachable from the hub before a PDF route exists', async () => {
    const directory = await createFixture({
      manifest: {
        'src/hub.ts': {
          file: '_astro/hub.js',
          isEntry: true,
          imports: ['src/pdf-worker.ts'],
        },
        'src/pdf-worker.ts': {
          file: '_astro/pdf-worker.js',
        },
      },
      html: '<astro-island component-url="/_astro/hub.js"></astro-island>',
      assets: {
        '_astro/hub.js': 'export const hub = true;',
        '_astro/pdf-worker.js': deterministicBytes(200 * 1024),
      },
    });

    await expect(
      auditBundles(directory, [
        { route: '/ko/tools', kind: 'hub', budgetKb: 180 },
      ]),
    ).rejects.toThrow(/PDF.*hub.*lazy/i);
  });

  it('rejects a PDF chunk dynamically reachable from the hub without charging it to initial gzip', async () => {
    const directory = await createFixture({
      manifest: {
        'src/hub.ts': {
          file: '_astro/hub.js',
          dynamicImports: ['src/pdf-worker.ts'],
        },
        'src/pdf-worker.ts': { file: '_astro/pdf-worker.js' },
      },
      html: '<astro-island component-url="/_astro/hub.js"></astro-island>',
      assets: {
        '_astro/hub.js': 'hub',
        '_astro/pdf-worker.js': deterministicBytes(200 * 1024),
      },
    });

    await expect(
      auditBundles(directory, [
        { route: '/ko/tools', kind: 'hub', budgetKb: 180 },
      ]),
    ).rejects.toThrow(/PDF.*hub.*lazy/i);
  });

  it('counts transitive shared chunks once and excludes dynamic imports', async () => {
    const directory = await createFixture({
      manifest: {
        'src/hub.ts': {
          file: '_astro/hub.js',
          imports: ['src/a.ts', 'src/b.ts'],
          dynamicImports: ['src/lazy.ts'],
        },
        'src/a.ts': { file: '_astro/a.js', imports: ['src/shared.ts'] },
        'src/b.ts': { file: '_astro/b.js', imports: ['src/shared.ts'] },
        'src/shared.ts': { file: '_astro/shared.js' },
        'src/lazy.ts': { file: '_astro/lazy.js' },
      },
      html: '<script type="module" src="/_astro/hub.js"></script>',
      assets: {
        '_astro/hub.js': 'hub',
        '_astro/a.js': 'a',
        '_astro/b.js': 'b',
        '_astro/shared.js': 'shared',
        '_astro/lazy.js': deterministicBytes(300 * 1024),
      },
    });

    const [result] = await auditBundles(directory, [
      { route: '/ko/tools', kind: 'hub', budgetKb: 180 },
    ]);

    expect(result.assets).toEqual(
      expect.arrayContaining([
        '_astro/hub.js',
        '_astro/a.js',
        '_astro/b.js',
        '_astro/shared.js',
      ]),
    );
    expect(result.assets).not.toContain('_astro/lazy.js');
    expect(result.assets.filter((asset: string) => asset === '_astro/shared.js')).toHaveLength(1);
  });

  it('ignores external scripts while retaining local manifest entries', async () => {
    const directory = await createFixture({
      manifest: { entry: { file: '_astro/entry.js' } },
      html: [
        '<script src="https://cdn.example.com/analytics.js"></script>',
        '<script src="/_astro/entry.js"></script>',
      ].join(''),
      assets: { '_astro/entry.js': 'entry' },
    });

    const [result] = await auditBundles(directory, [
      { route: '/ko/tools', kind: 'hub', budgetKb: 180 },
    ]);
    expect(result.assets).toEqual(['_astro/entry.js']);
  });

  it.each([
    ['missing manifest', {}, /manifest/i],
    ['invalid manifest', { manifest: [] }, /invalid vite manifest/i],
    [
      'missing configured route',
      { manifest: { entry: { file: '_astro/entry.js' } } },
      /configured route is missing/i,
    ],
    [
      'unknown route asset',
      {
        manifest: { entry: { file: '_astro/entry.js' } },
        html: '<script src="/_astro/unknown.js"></script>',
      },
      /unknown route asset/i,
    ],
    [
      'unknown imported chunk',
      {
        manifest: { entry: { file: '_astro/entry.js', imports: ['missing'] } },
        html: '<script src="/_astro/entry.js"></script>',
      },
      /unknown vite manifest import/i,
    ],
    [
      'invalid dynamic imports',
      {
        manifest: { entry: { file: '_astro/entry.js', dynamicImports: [42] } },
        html: '<script src="/_astro/entry.js"></script>',
      },
      /invalid vite manifest dynamic imports/i,
    ],
    [
      'unknown dynamic import',
      {
        manifest: { entry: { file: '_astro/entry.js', dynamicImports: ['missing'] } },
        html: '<script src="/_astro/entry.js"></script>',
      },
      /unknown vite manifest import/i,
    ],
  ])('fails closed for %s', async (_name, fixture, expected) => {
    const directory = await createFixture(fixture);
    await expect(
      auditBundles(directory, [
        { route: '/ko/tools', kind: 'hub', budgetKb: 180 },
      ]),
    ).rejects.toThrow(expected);
  });

  it('handles valid cyclic Vite imports by counting each static asset once', async () => {
    const directory = await createFixture({
      manifest: {
        entry: { file: '_astro/entry.js', imports: ['shared'] },
        shared: { file: '_astro/shared.js', imports: ['entry'] },
      },
      html: '<script src="/_astro/entry.js"></script>',
      assets: { '_astro/entry.js': 'entry', '_astro/shared.js': 'shared' },
    });

    const [result] = await auditBundles(directory, [
      { route: '/ko/tools', kind: 'hub', budgetKb: 180 },
    ]);
    expect(result.assets.sort()).toEqual(['_astro/entry.js', '_astro/shared.js']);
  });

  it('fails closed when a configured route has no manifest-backed JavaScript', async () => {
    const directory = await createFixture({
      manifest: { entry: { file: '_astro/entry.js' } },
      html: '<main>No JavaScript references</main>',
      assets: { '_astro/entry.js': 'unused' },
    });

    await expect(
      auditBundles(directory, [
        { route: '/ko/tools', kind: 'hub', budgetKb: 180 },
      ]),
    ).rejects.toThrow(/no manifest-backed javascript/i);
  });

  it('rejects a configured route that escapes the build root', async () => {
    const directory = await createFixture({
      manifest: { entry: { file: '_astro/entry.js' } },
      html: '<script src="/_astro/entry.js"></script>',
      assets: { '_astro/entry.js': 'entry' },
    });

    await expect(
      auditBundles(directory, [
        { route: '/../../outside', kind: 'hub', budgetKb: 180 },
      ]),
    ).rejects.toThrow(/route.*outside.*build root/i);
  });

  it('rejects encoded separators in route asset URLs', async () => {
    const directory = await createFixture({
      manifest: { entry: { file: '_astro/../secret.js' } },
      html: '<script src="/_astro/%2e%2e%2fsecret.js"></script>',
      assets: { 'secret.js': 'secret' },
    });

    await expect(
      auditBundles(directory, [
        { route: '/ko/tools', kind: 'hub', budgetKb: 180 },
      ]),
    ).rejects.toThrow(/encoded separator/i);
  });

  it('rejects a manifest asset mapping that escapes the build root', async () => {
    const directory = await createFixture({
      manifest: {
        entry: { file: '_astro/entry.js', imports: ['escape'] },
        escape: { file: '../outside.js' },
      },
      html: '<script src="/_astro/entry.js"></script>',
      assets: {
        '_astro/entry.js': 'entry',
        '../outside.js': 'outside',
      },
    });

    await expect(
      auditBundles(directory, [
        { route: '/ko/tools', kind: 'hub', budgetKb: 180 },
      ]),
    ).rejects.toThrow(/manifest asset.*outside.*build root/i);
  });
});
