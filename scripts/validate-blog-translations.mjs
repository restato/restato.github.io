import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const blogDirectoryParts = ['src', 'content', 'blog'];
const pairedDocumentPattern = /^(en|ko)\/([a-z0-9]+(?:-[a-z0-9]+)*)\.mdx$/u;
const scalarPattern = /^(lang|translationKey):[\t ]*(.*)$/u;

function listBlogDocuments(directory) {
  if (!existsSync(directory)) return [];

  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listBlogDocuments(path));
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      files.push(path);
    }
  }

  return files;
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (!trimmed || /^[\[{|>&*!]/u.test(trimmed)) return { valid: false };

  if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
    const quote = trimmed[0];
    if (trimmed.length < 2 || !trimmed.endsWith(quote)) return { valid: false };
    return { valid: true, value: trimmed.slice(1, -1) };
  }

  if (/[\t ]#|[\r\n]/u.test(trimmed)) return { valid: false };
  return { valid: true, value: trimmed };
}

function parseFrontmatter(path) {
  const source = readFileSync(path, 'utf8').replace(/^\uFEFF/u, '');
  const lines = source.split(/\r?\n/u);
  if (lines[0] !== '---') return { malformed: true, data: {} };

  const closingIndex = lines.indexOf('---', 1);
  if (closingIndex === -1) return { malformed: true, data: {} };

  const data = {};
  for (const line of lines.slice(1, closingIndex)) {
    const field = scalarPattern.exec(line);
    if (!field) continue;

    const parsed = parseScalar(field[2]);
    if (!parsed.valid || Object.hasOwn(data, field[1])) {
      return { malformed: true, data: {} };
    }
    data[field[1]] = parsed.value;
  }

  return { malformed: false, data };
}

function addError(errors, message) {
  errors.add(message);
}

/**
 * Validates the bilingual blog document layout without loading MDX modules.
 *
 * @param {string} root Repository root.
 * @returns {string[]} Deterministic, human-readable validation errors.
 */
export function validateBlogTranslations(root) {
  const blogDirectory = join(root, ...blogDirectoryParts);
  const errors = new Set();
  const pairs = new Map();

  for (const path of listBlogDocuments(blogDirectory)) {
    const id = relative(blogDirectory, path).split('\\').join('/');
    const frontmatter = parseFrontmatter(path);
    if (frontmatter.malformed) {
      addError(errors, `blog document ${id} has malformed frontmatter`);
      continue;
    }

    const { lang, translationKey } = frontmatter.data;
    const pairedPath = pairedDocumentPattern.exec(id);
    if (!pairedPath) {
      if (translationKey) {
        addError(errors, 'paired document must live under src/content/blog/en or src/content/blog/ko');
      }
      continue;
    }

    const [, storageLocale, leaf] = pairedPath;
    if (!translationKey) {
      addError(errors, `paired document ${id} is missing translationKey`);
      continue;
    }

    if (lang !== storageLocale) {
      const state = lang ? 'invalid' : 'missing';
      addError(errors, `translation pair ${translationKey} has ${state} ${storageLocale} lang`);
    }

    if (translationKey !== leaf || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(translationKey)) {
      addError(errors, `translation pair ${translationKey} uses inconsistent public slugs`);
    }

    const pair = pairs.get(translationKey) ?? {};
    if (pair[storageLocale]) {
      addError(errors, `translation pair ${translationKey} has duplicate ${storageLocale} documents`);
    } else {
      pair[storageLocale] = true;
    }
    pairs.set(translationKey, pair);
  }

  for (const translationKey of [...pairs.keys()].sort((left, right) => left.localeCompare(right))) {
    const pair = pairs.get(translationKey);
    for (const locale of ['en', 'ko']) {
      if (!pair[locale]) addError(errors, `translation pair ${translationKey} is missing ${locale}`);
    }
  }

  return [...errors].sort((left, right) => left.localeCompare(right));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const errors = validateBlogTranslations(process.cwd());
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  }
}
