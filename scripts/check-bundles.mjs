import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

export const BUNDLE_BUDGETS = Object.freeze({
  hub: 180,
  text: 220,
  developer: 400,
  image: 550,
  pdf: 900,
});

export const INITIAL_BUNDLE_ROUTES = Object.freeze([
  { route: '/ko/tools', kind: 'hub', budgetKb: BUNDLE_BUDGETS.hub },
  { route: '/ko/tools/text-counter', kind: 'text', budgetKb: BUNDLE_BUDGETS.text },
  { route: '/ko/tools/json', kind: 'developer', budgetKb: BUNDLE_BUDGETS.developer },
  { route: '/ko/tools/image-resizer', kind: 'image', budgetKb: BUNDLE_BUDGETS.image },
]);

function resolveWithin(directory, relativePath, label) {
  if (typeof relativePath !== 'string' || relativePath.length === 0) {
    throw new Error(`${label} path is invalid`);
  }
  if (/%(?:2f|5c)/i.test(relativePath)) {
    throw new Error(`${label} contains an encoded separator: ${relativePath}`);
  }
  if (
    path.isAbsolute(relativePath) ||
    /^[a-z]:[\\/]/i.test(relativePath) ||
    relativePath.includes('\\') ||
    relativePath.includes('\0')
  ) {
    throw new Error(`${label} is outside the build root: ${relativePath}`);
  }

  const root = path.resolve(directory);
  const target = path.resolve(root, relativePath);
  const relative = path.relative(root, target);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`${label} is outside the build root: ${relativePath}`);
  }
  return target;
}

function routeHtmlPath(directory, route) {
  const relative = route.replace(/^\/+|\/+$/g, '');
  return resolveWithin(directory, path.join(relative, 'index.html'), `Route ${route}`);
}

function normalizeAssetUrl(value) {
  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(value)) return null;
  if (/%(?:2f|5c)/i.test(value)) {
    throw new Error(`Route asset contains an encoded separator: ${value}`);
  }
  if (value.includes('\\')) {
    throw new Error(`Route asset contains a path separator: ${value}`);
  }
  try {
    const pathname = new URL(value, 'https://restato.invalid').pathname;
    return decodeURIComponent(pathname).replace(/^\//, '');
  } catch {
    return null;
  }
}

function extractRouteEntries(html) {
  const entries = new Set();
  const attributePattern = /\b(?:src|href|component-url|renderer-url|before-hydration-url)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(attributePattern)) {
    const asset = normalizeAssetUrl(match[1]);
    if (asset?.endsWith('.js')) entries.add(asset);
  }
  return [...entries];
}

function validateManifest(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid Vite manifest: expected an object');
  }

  for (const [key, entry] of Object.entries(value)) {
    if (!entry || typeof entry !== 'object' || typeof entry.file !== 'string') {
      throw new Error(`Invalid Vite manifest entry: ${key}`);
    }
    if (
      entry.imports !== undefined &&
      (!Array.isArray(entry.imports) || entry.imports.some((item) => typeof item !== 'string'))
    ) {
      throw new Error(`Invalid Vite manifest imports: ${key}`);
    }
    if (
      entry.dynamicImports !== undefined &&
      (!Array.isArray(entry.dynamicImports) ||
        entry.dynamicImports.some((item) => typeof item !== 'string'))
    ) {
      throw new Error(`Invalid Vite manifest dynamic imports: ${key}`);
    }
  }

  return value;
}

function isPdfEntry(key, entry) {
  return /(^|[\/_-])pdf([\/_-]|\.|$)/i.test(`${key}/${entry.file}/${entry.name ?? ''}`);
}

function collectEntries(rootKeys, manifest, includeDynamicImports = false) {
  const visited = new Set();
  const active = new Set();

  function visit(key) {
    if (active.has(key)) throw new Error(`Cycle in Vite manifest imports at ${key}`);
    if (visited.has(key)) return;
    const entry = manifest[key];
    if (!entry) throw new Error(`Unknown Vite manifest import: ${key}`);

    active.add(key);
    const importedKeys = includeDynamicImports
      ? [...(entry.imports ?? []), ...(entry.dynamicImports ?? [])]
      : entry.imports ?? [];
    for (const importedKey of importedKeys) visit(importedKey);
    active.delete(key);
    visited.add(key);
  }

  for (const key of rootKeys) visit(key);
  return [...visited];
}

export async function auditBundles(directory, routes) {
  let manifest;
  try {
    const manifestPath = resolveWithin(directory, '.vite/manifest.json', 'Vite manifest');
    const raw = await readFile(manifestPath, 'utf8');
    manifest = validateManifest(JSON.parse(raw));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`Invalid Vite manifest JSON: ${error.message}`);
    throw error;
  }

  const keyByFile = new Map();
  for (const [key, entry] of Object.entries(manifest)) {
    resolveWithin(directory, entry.file, `Manifest asset ${entry.file}`);
    if (keyByFile.has(entry.file)) throw new Error(`Duplicate Vite manifest file: ${entry.file}`);
    keyByFile.set(entry.file, key);
  }

  const results = [];
  for (const route of routes) {
    const htmlPath = routeHtmlPath(directory, route.route);
    let html;
    try {
      html = await readFile(htmlPath, 'utf8');
    } catch {
      throw new Error(`Configured route is missing: ${route.route}`);
    }

    const assetRoots = extractRouteEntries(html);
    if (assetRoots.length === 0) {
      throw new Error(`No manifest-backed JavaScript found for ${route.route}`);
    }
    const rootKeys = assetRoots.map((asset) => {
      const key = keyByFile.get(asset);
      if (!key) throw new Error(`Unknown route asset for ${route.route}: ${asset}`);
      return key;
    });
    const staticKeys = collectEntries(rootKeys, manifest);
    const allReachableKeys = collectEntries(rootKeys, manifest, true);

    if (route.kind !== 'pdf') {
      const pdfKey = allReachableKeys.find((key) => isPdfEntry(key, manifest[key]));
      if (pdfKey) {
        throw new Error(
          `PDF chunk reached ${route.kind} route ${route.route}; PDF assets must remain lazy-route-only (${pdfKey})`,
        );
      }
    }

    let gzipBytes = 0;
    for (const key of staticKeys) {
      const entry = manifest[key];
      if (!entry.file.endsWith('.js')) continue;
      let contents;
      try {
        contents = await readFile(
          resolveWithin(directory, entry.file, `Manifest asset ${entry.file}`),
        );
      } catch {
        throw new Error(`Manifest asset is missing: ${entry.file}`);
      }
      gzipBytes += gzipSync(contents).byteLength;
    }

    const budgetBytes = route.budgetKb * 1024;
    if (gzipBytes > budgetBytes) {
      throw new Error(
        `${route.route} is ${(gzipBytes / 1024).toFixed(1)} KB gzip; budget is ${route.budgetKb} KB`,
      );
    }
    results.push({
      ...route,
      gzipBytes,
      assets: staticKeys.map((key) => manifest[key].file),
    });
  }

  return results;
}

async function main() {
  const directory = path.resolve(process.argv[2] ?? 'dist');
  const results = await auditBundles(directory, INITIAL_BUNDLE_ROUTES);
  for (const result of results) {
    process.stdout.write(
      `${result.route}: ${(result.gzipBytes / 1024).toFixed(1)} KB gzip / ${result.budgetKb} KB\n`,
    );
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`Bundle check failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
