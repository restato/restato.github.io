import { access, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const TAG_ALIASES_SELECTOR = '#blog-tag-legacy-aliases';
const CASE_FALLBACK_DATA_ID = 'blog-tag-case-fallback-data';
const CASE_FALLBACK_RUN_ID = 'blog-tag-case-fallback-run';

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

async function walkHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkHtmlFiles(entryPath);
    return entry.name.endsWith('.html') ? [entryPath] : [];
  }));
  return files.flat();
}

export function classifyTagAlias(alias, canonicalSlug, caseSensitive) {
  const isCaseOnlyAlias = alias !== canonicalSlug
    && alias.toLocaleLowerCase('en-US') === canonicalSlug.toLocaleLowerCase('en-US');
  return !caseSensitive && isCaseOnlyAlias ? 'fallback' : 'redirect';
}

export function buildTagRedirectHtml(canonicalPath) {
  const escapedPath = escapeHtml(canonicalPath);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="${escapedPath}">
    <meta http-equiv="refresh" content="0;url=${escapedPath}">
    <title>Redirecting…</title>
  </head>
  <body>
    <p>Redirecting to <a href="${escapedPath}">${escapedPath}</a>.</p>
  </body>
</html>`;
}

async function isCaseSensitiveFilesystem(directory) {
  const probeDirectory = await mkdtemp(path.join(directory, '.restato-tag-case-probe-'));
  const lowercaseProbe = path.join(probeDirectory, 'case-probe');
  const uppercaseProbe = path.join(probeDirectory, 'CASE-PROBE');
  try {
    await writeFile(lowercaseProbe, 'probe');
    try {
      await access(uppercaseProbe);
      return false;
    } catch {
      return true;
    }
  } finally {
    await rm(probeDirectory, { recursive: true, force: true });
  }
}

async function injectCaseFallback(distDir, fallbackMap) {
  if (Object.keys(fallbackMap).length === 0) return;

  const notFoundPath = path.join(distDir, '404.html');
  let html = await readFile(notFoundPath, 'utf8');
  const dataScript = `<script id="${CASE_FALLBACK_DATA_ID}" type="application/json">${escapeJsonForHtml(fallbackMap)}</script>`;
  const runnerScript = `<script id="${CASE_FALLBACK_RUN_ID}">(() => { const redirects = JSON.parse(document.getElementById('${CASE_FALLBACK_DATA_ID}').textContent); const pathname = window.location.pathname.replace(/\\/+$/, '') || '/'; const target = redirects[pathname]; if (target) window.location.replace(target); })();</script>`;
  const injected = `${dataScript}${runnerScript}`;

  html = html
    .replace(new RegExp(`<script id="${CASE_FALLBACK_DATA_ID}"[\\s\\S]*?</script>`, 'g'), '')
    .replace(new RegExp(`<script id="${CASE_FALLBACK_RUN_ID}"[\\s\\S]*?</script>`, 'g'), '')
    .replace('</head>', `${injected}</head>`);
  await writeFile(notFoundPath, html);
}

export async function generateTagRedirects(distDir, options = {}) {
  const absoluteDistDir = path.resolve(distDir);
  const tagDirectory = path.join(absoluteDistDir, 'blog', 'tag');
  const caseSensitive = options.caseSensitive ?? await isCaseSensitiveFilesystem(absoluteDistDir);
  const canonicalPages = await walkHtmlFiles(tagDirectory);
  const fallbackMap = {};
  let created = 0;

  for (const canonicalPagePath of canonicalPages) {
    const $ = cheerio.load(await readFile(canonicalPagePath, 'utf8'));
    const aliasesNode = $(TAG_ALIASES_SELECTOR);
    if (aliasesNode.length !== 1) continue;

    const canonicalSlug = aliasesNode.attr('data-canonical-slug');
    const aliases = JSON.parse(aliasesNode.text());
    if (!canonicalSlug || !Array.isArray(aliases)) {
      throw new Error(`Invalid blog tag alias metadata in ${canonicalPagePath}`);
    }

    for (const alias of aliases) {
      if (typeof alias !== 'string' || alias.includes('/')) {
        throw new Error(`Invalid blog tag alias ${String(alias)} in ${canonicalPagePath}`);
      }

      const canonicalPath = `/blog/tag/${canonicalSlug}`;
      if (classifyTagAlias(alias, canonicalSlug, caseSensitive) === 'fallback') {
        fallbackMap[`/blog/tag/${alias}`] = canonicalPath;
        continue;
      }

      const redirectFile = path.join(tagDirectory, alias, 'index.html');
      if (path.resolve(redirectFile) === path.resolve(canonicalPagePath)) {
        throw new Error(`Refusing to overwrite canonical tag page ${canonicalPagePath}`);
      }
      await mkdir(path.dirname(redirectFile), { recursive: true });
      await writeFile(redirectFile, buildTagRedirectHtml(canonicalPath));
      created++;
    }
  }

  await injectCaseFallback(absoluteDistDir, fallbackMap);
  return { created, fallbackAliases: Object.keys(fallbackMap).length };
}

const isDirectInvocation = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectInvocation) {
  const result = await generateTagRedirects(process.argv[2] ?? 'dist');
  console.log(`Generated ${result.created} blog-tag redirect page(s); ${result.fallbackAliases} case-only alias(es) use the 404 fallback.`);
}
