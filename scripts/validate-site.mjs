import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const SITE_ORIGIN = 'https://restato.github.io';

function normalizePathname(pathname) {
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

function encodeFilesystemPathname(pathname) {
  return pathname.split('/').map(segment => encodeURIComponent(segment)).join('/');
}

function pathnameForHtmlFile(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');

  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) {
    return encodeFilesystemPathname(`/${normalized.slice(0, -'index.html'.length)}`);
  }
  return encodeFilesystemPathname(`/${normalized.slice(0, -'.html'.length)}`);
}

function pathnameForGeneratedFile(relativePath) {
  return encodeFilesystemPathname(`/${relativePath.split(path.sep).join('/')}`);
}

async function walkFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkFiles(file);
    return [file];
  }));

  return files.flat();
}

function getInternalUrl(href, sourcePathname) {
  const value = href?.trim();
  if (!value || value.startsWith('#')) return null;

  let url;
  try {
    url = new URL(value, new URL(sourcePathname, SITE_ORIGIN));
  } catch {
    return null;
  }

  return url.origin === SITE_ORIGIN ? url : null;
}

function languageFor(page) {
  const documentLanguage = page.$('html').attr('lang');
  if (documentLanguage) return documentLanguage;

  const canonical = page.$('link[rel~="canonical"]').first().attr('href');
  const canonicalUrl = getInternalUrl(canonical, page.pathname);
  const canonicalLanguage = canonicalUrl?.pathname.split('/').filter(Boolean)[0];
  return canonicalLanguage ?? page.pathname.split('/').filter(Boolean)[0];
}

function alternateLinks(page) {
  return page.$('link[rel~="alternate"][hreflang][href]').toArray().map(element => ({
    lang: page.$(element).attr('hreflang'),
    href: page.$(element).attr('href'),
  }));
}

export function createGeneratedPathIndex(generatedPathnames) {
  const foldedPathnames = new Map();
  for (const generatedPathname of generatedPathnames) {
    const caseFolded = generatedPathname.toLocaleLowerCase('en-US');
    const matches = foldedPathnames.get(caseFolded) ?? new Set();
    matches.add(generatedPathname);
    foldedPathnames.set(caseFolded, matches);
  }

  return { exactPathnames: generatedPathnames, foldedPathnames };
}

export function resolveGeneratedPath(pathname, pathIndex) {
  const normalized = normalizePathname(pathname);
  const candidates = [
    normalized,
    normalizePathname(`${normalized}/index.html`),
    normalizePathname(`${normalized}.html`),
  ];

  if (candidates.some(candidate => pathIndex.exactPathnames.has(candidate))) {
    return { status: 'found' };
  }

  for (const candidate of candidates) {
    const matches = pathIndex.foldedPathnames.get(candidate.toLocaleLowerCase('en-US'));
    if (!matches) continue;
    if (matches.size === 1) return { status: 'case-mismatch', matches: [...matches] };
    return { status: 'ambiguous', matches: [...matches].sort() };
  }

  return { status: 'missing' };
}

export async function validateSite(distDir) {
  const absoluteDistDir = path.resolve(distDir);
  const files = (await walkFiles(absoluteDistDir)).sort();
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  if (htmlFiles.length === 0) {
    return {
      pages: 0,
      errors: ['No generated HTML pages found in generated output'],
    };
  }

  const generatedFiles = new Set(files.map(file => pathnameForGeneratedFile(
    path.relative(absoluteDistDir, file),
  )));
  const pagesByPathname = new Map();
  const pages = [];

  for (const file of htmlFiles) {
    const relativePath = path.relative(absoluteDistDir, file).split(path.sep).join('/');
    const page = {
      relativePath,
      pathname: pathnameForHtmlFile(relativePath),
      $: cheerio.load(await readFile(file, 'utf8')),
    };
    pages.push(page);
    pagesByPathname.set(normalizePathname(page.pathname), page);
  }

  const generatedPathnames = new Set([
    ...generatedFiles,
    ...pagesByPathname.keys(),
  ]);
  const pathIndex = createGeneratedPathIndex(generatedPathnames);

  const errors = [];
  for (const page of pages) {
    const canonicals = page.$('link[rel~="canonical"][href]').toArray();
    if (canonicals.length !== 1) {
      errors.push(`${page.relativePath}: expected exactly one canonical link, found ${canonicals.length}`);
    }

    page.$('a[href]').each((_, element) => {
      const href = page.$(element).attr('href');
      const url = getInternalUrl(href, page.pathname);
      const target = url && resolveGeneratedPath(url.pathname, pathIndex);
      if (target?.status === 'missing') {
        errors.push(`${page.relativePath}: broken internal link ${href}`);
      }
      if (target?.status === 'ambiguous') {
        errors.push(
          `${page.relativePath}: ambiguous internal link ${href} (case-insensitive matches ${target.matches.join(', ')})`,
        );
      }
      if (target?.status === 'case-mismatch') {
        errors.push(
          `${page.relativePath}: internal link ${href} differs by case from generated path ${target.matches[0]}`,
        );
      }
    });

    page.$('meta[http-equiv]').each((_, element) => {
      if (page.$(element).attr('http-equiv')?.toLocaleLowerCase('en-US') !== 'refresh') return;

      const content = page.$(element).attr('content') ?? '';
      const refreshTarget = content.match(/(?:^|;)\s*url\s*=\s*(.+)\s*$/i)?.[1];
      const url = getInternalUrl(refreshTarget, page.pathname);
      const target = url && resolveGeneratedPath(url.pathname, pathIndex);

      if (target?.status === 'missing') {
        errors.push(`${page.relativePath}: broken redirect target ${refreshTarget}`);
      }
      if (target?.status === 'ambiguous') {
        errors.push(
          `${page.relativePath}: ambiguous redirect target ${refreshTarget} (case-insensitive matches ${target.matches.join(', ')})`,
        );
      }
      if (target?.status === 'case-mismatch') {
        errors.push(
          `${page.relativePath}: redirect target ${refreshTarget} differs by case from generated path ${target.matches[0]}`,
        );
      }
    });
  }

  for (const page of pages) {
    const sourceLanguage = languageFor(page);
    if (!sourceLanguage) continue;

    for (const alternate of alternateLinks(page)) {
      if (!alternate.lang || alternate.lang === 'x-default') continue;

      const targetUrl = getInternalUrl(alternate.href, page.pathname);
      if (!targetUrl) continue;

      const targetPage = pagesByPathname.get(normalizePathname(targetUrl.pathname));
      if (!targetPage) {
        errors.push(`${page.relativePath}: broken hreflang ${alternate.lang} link ${alternate.href}`);
        continue;
      }

      const targetAlternates = alternateLinks(targetPage);
      const linksBack = targetAlternates.some(targetAlternate => {
        if (targetAlternate.lang !== sourceLanguage) return false;
        const targetUrl = getInternalUrl(targetAlternate.href, targetPage.pathname);
        return targetUrl && normalizePathname(targetUrl.pathname) === normalizePathname(page.pathname);
      });

      if (!linksBack) {
        errors.push(
          `${page.relativePath}: hreflang ${alternate.lang} target does not link back with hreflang ${sourceLanguage}`,
        );
      }
    }
  }

  return { pages: pages.length, errors };
}

async function main() {
  const distDir = process.argv[2] ?? 'dist';
  const result = await validateSite(distDir);

  if (result.errors.length > 0) {
    console.error(`Site validation failed with ${result.errors.length} error(s):`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Site validation passed for ${result.pages} HTML page(s).`);
}

const isDirectInvocation = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectInvocation) {
  await main();
}
