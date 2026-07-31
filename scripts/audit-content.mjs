import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }))).flat();
}

const normalize = value => value.replace(/\s+/g, ' ').trim();
const normalizedKey = value => normalize(value).toLocaleLowerCase('en-US');

function addDuplicateFindings(findings, pages, field, code) {
  const groups = new Map();
  for (const page of pages) {
    const value = `${page.language}:${normalizedKey(page[field])}`;
    if (!value) continue;
    const routes = groups.get(value) ?? [];
    routes.push(page.route);
    groups.set(value, routes);
  }
  for (const routes of groups.values()) {
    if (routes.length > 1) findings.push({ code, routes: routes.sort() });
  }
}

export async function auditContent(distDir, options = {}) {
  const minimumTextLength = options.minimumTextLength ?? 120;
  const repeatedParagraphMinimum = options.repeatedParagraphMinimum ?? 180;
  const absolute = path.resolve(distDir);
  const htmlFiles = (await walk(absolute)).filter(file => file.endsWith('.html')).sort();
  const pages = [];

  for (const file of htmlFiles) {
    const $ = cheerio.load(await readFile(file, 'utf8'));
    const robots = $('meta[name="robots"]').attr('content')?.toLocaleLowerCase('en-US') ?? '';
    if (robots.includes('noindex') || $('meta[http-equiv="refresh" i]').length > 0) continue;

    const main = $('main').first().clone();
    main.find('script,style,noscript,nav,footer,[aria-hidden="true"]').remove();
    const route = path.relative(absolute, file).split(path.sep).join('/');
    pages.push({
      route,
      language: normalize($('html').attr('lang') ?? 'unknown'),
      title: normalize($('title').first().text()),
      description: normalize($('meta[name="description"]').first().attr('content') ?? ''),
      text: normalize(main.text()),
      hasAuthor: normalize($('meta[name="author"]').first().attr('content') ?? '').length > 0,
      hasContact: $('a[href^="mailto:"],a[href*="/contact/"]').length > 0,
      paragraphs: main.find('p').toArray().map(element => normalize($(element).text())).filter(Boolean),
    });
  }

  const findings = [];
  addDuplicateFindings(findings, pages, 'title', 'duplicate-title');
  addDuplicateFindings(findings, pages, 'description', 'duplicate-description');

  const paragraphRoutes = new Map();
  const descriptions = new Set(pages.map(page => normalizedKey(page.description)).filter(Boolean));
  for (const page of pages) {
    if (page.text.length < minimumTextLength) findings.push({ code: 'thin-content', routes: [page.route], detail: `${page.text.length} characters` });
    if (!page.hasAuthor) findings.push({ code: 'missing-author', routes: [page.route] });
    if (!page.hasContact) findings.push({ code: 'missing-contact', routes: [page.route] });
    for (const paragraph of new Set(page.paragraphs)) {
      if (paragraph.length < repeatedParagraphMinimum) continue;
      const key = normalizedKey(paragraph);
      if (descriptions.has(key)) continue;
      const routes = paragraphRoutes.get(key) ?? [];
      routes.push(page.route);
      paragraphRoutes.set(key, routes);
    }
  }
  for (const [paragraph, routes] of paragraphRoutes) {
    if (routes.length > 1) findings.push({ code: 'repeated-paragraph', routes: routes.sort(), detail: paragraph.slice(0, 100) });
  }

  return { pages: pages.length, findings };
}

async function main() {
  const result = await auditContent(process.argv[2] ?? 'dist');
  if (result.findings.length) {
    console.error(`Content audit found ${result.findings.length} issue(s) across ${result.pages} indexable page(s):`);
    for (const finding of result.findings) console.error(`- ${finding.code}: ${finding.routes.join(', ')}${finding.detail ? ` (${finding.detail})` : ''}`);
    process.exitCode = 1;
  } else {
    console.log(`Content audit passed for ${result.pages} indexable page(s).`);
  }
}

const direct = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (direct) await main();
