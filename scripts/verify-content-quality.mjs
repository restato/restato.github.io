import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function read(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
}

function findFiles(directory, predicate) {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findFiles(entryPath, predicate);
    return predicate(entryPath) ? [entryPath] : [];
  });
}

const blogDir = path.join(rootDir, 'src/content/blog');
const playbookFiles = findFiles(
  blogDir,
  (filePath) => /^ai-dev-playbook-\d{3}-.+\.mdx$/.test(path.basename(filePath))
);
check(playbookFiles.length === 0, `Remove ${playbookFiles.length} AI Dev Playbook source files`);

check(fs.existsSync(distDir), 'Build output is missing; run npm run build:astro first');

for (const route of ['about', 'contact', 'privacy']) {
  check(
    fs.existsSync(path.join(distDir, route, 'index.html')),
    `Missing built trust page: /${route}/`
  );
}
check(fs.existsSync(path.join(distDir, 'ads.txt')), 'Missing built /ads.txt');

const noindexRoutes = ['dashboard', 'content-os', 'articles/admin'];
for (const route of noindexRoutes) {
  const html = read(`dist/${route}/index.html`);
  check(
    /<meta name="robots" content="noindex, (?:follow|nofollow)"/.test(html),
    `Missing noindex robots directive on /${route}/`
  );
}

const tagPages = findFiles(
  path.join(distDir, 'blog/tag'),
  (filePath) => path.basename(filePath) === 'index.html'
);
check(tagPages.length > 0, 'No built tag archive was found for robots verification');
if (tagPages.length > 0) {
  const tagHtml = fs.readFileSync(tagPages[0], 'utf8');
  check(
    /<meta name="robots" content="noindex, follow"/.test(tagHtml),
    'Tag archives must render noindex, follow'
  );
}

const sitemapFiles = findFiles(
  distDir,
  (filePath) => /^sitemap(?:-[^.]+)?\.xml$/.test(path.basename(filePath))
);
const sitemapXml = sitemapFiles.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n');
check(sitemapFiles.length > 0, 'No generated sitemap files were found');
for (const excludedPath of ['/blog/tag/', '/dashboard/', '/content-os/', '/articles/admin/']) {
  check(!sitemapXml.includes(excludedPath), `Sitemaps must exclude ${excludedPath}`);
}
for (const excludedPath of ['/en/tools/', '/ja/tools/', '/en/games/', '/ja/games/']) {
  check(!sitemapXml.includes(excludedPath), `Sitemaps must exclude incomplete locale section ${excludedPath}`);
}
check(sitemapXml.includes('/ko/tools/json/'), 'Sitemaps must retain canonical Korean tools');
check(sitemapXml.includes('/ko/games/snake/'), 'Sitemaps must retain canonical Korean games');

const englishTool = read('dist/en/tools/json/index.html');
const japaneseTool = read('dist/ja/tools/json/index.html');
const englishGame = read('dist/en/games/snake/index.html');
check(/<meta name="robots" content="noindex, follow"/.test(englishTool), 'English tools must be noindex until fully localized');
check(/<meta name="robots" content="noindex, follow"/.test(japaneseTool), 'Japanese tools must be noindex until fully localized');
check(/<meta name="robots" content="noindex, follow"/.test(englishGame), 'English games must be noindex until fully localized');
check(englishTool.includes('Favorite'), 'English tool controls must render in English');
check(englishTool.includes('Share'), 'English share control must render in English');
check(!/[즐겨찾기공유]/.test(englishTool), 'English JSON tool page contains Korean control labels');
check(japaneseTool.includes('お気に入り'), 'Japanese tool controls must render in Japanese');
check(japaneseTool.includes('共有'), 'Japanese share control must render in Japanese');
check(!/[즐겨찾기공유]/.test(japaneseTool), 'Japanese JSON tool page contains Korean control labels');

if (failures.length > 0) {
  console.error('Content quality verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Content quality verification passed.');
