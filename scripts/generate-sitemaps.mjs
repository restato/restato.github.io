/**
 * Generate separate sitemaps for different content types
 * Run after Astro build: node scripts/generate-sitemaps.mjs
 *
 * Features:
 * - Excludes redirect URLs (legacy /tools/xxx, /anonymous-chat without lang prefix)
 * - Uses actual blog post dates for lastmod
 * - Proper URL categorization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '../dist');
const CONTENT_DIR = path.join(__dirname, '../src/content/blog');
const SITE_URL = 'https://restato.github.io';

/**
 * URLs to exclude from sitemap (redirect pages)
 * These pages redirect to language-prefixed versions
 */
const REDIRECT_PATTERNS = [
  /^\/tools\/[^/]+\/?$/, // /tools/xxx (without lang prefix)
  /^\/tools\/?$/, // /tools/ (without lang prefix)
  /^\/anonymous-chat\/?$/, // /anonymous-chat (without lang prefix)
];

/**
 * Check if URL is a redirect page that should be excluded
 */
function isRedirectUrl(pathname) {
  return REDIRECT_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * Categorize a URL based on its path
 */
function categorizeUrl(pathname) {
  // Blog posts
  if (pathname.startsWith('/blog/')) return 'blog';

  // Tools with language prefix (canonical URLs)
  if (pathname.match(/^\/(ko|en|ja)\/tools/)) return 'tools';

  // Anonymous chat with language prefix
  if (pathname.match(/^\/(ko|en|ja)\/anonymous-chat/)) return 'tools';

  // Projects
  if (pathname.startsWith('/projects/')) return 'projects';

  // Everything else goes to pages
  return 'pages';
}

/**
 * Get priority based on content type and path
 */
function getPriority(category, pathname) {
  // Home page
  if (pathname === '/' || pathname === '') return 1.0;

  if (category === 'tools') {
    // Tool index pages get highest priority
    if (pathname.match(/^\/(ko|en|ja)\/tools\/?$/)) return 1.0;
    return 0.8;
  }

  if (category === 'blog') {
    // Blog index
    if (pathname === '/blog/' || pathname === '/blog') return 0.8;
    return 0.7;
  }

  if (category === 'projects') {
    // Projects index
    if (pathname === '/projects/' || pathname === '/projects') return 0.7;
    return 0.6;
  }

  return 0.5;
}

/**
 * Get changefreq based on content type
 */
function getChangefreq(category) {
  if (category === 'blog') return 'weekly';
  if (category === 'tools') return 'monthly';
  if (category === 'projects') return 'monthly';
  return 'monthly';
}

/**
 * Extract blog post dates from MDX files
 * Returns a map of slug -> date
 */
function getBlogPostDates() {
  const dates = new Map();

  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn('Blog content directory not found');
    return dates;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const dateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);

    if (dateMatch) {
      const slug = file.replace('.mdx', '');
      // Convert to ISO format with time
      dates.set(slug, `${dateMatch[1]}T00:00:00.000Z`);
    }
  }

  return dates;
}

/**
 * Get lastmod date for a URL
 */
function getLastmod(pathname, blogDates, buildDate) {
  // For blog posts, use the actual post date
  if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
    const slug = pathname.replace('/blog/', '').replace(/\/$/, '');
    if (blogDates.has(slug)) {
      return blogDates.get(slug);
    }
  }

  // For everything else, use build date
  return buildDate;
}

/**
 * Generate XML for a sitemap
 */
function generateSitemapXml(entries) {
  const urlElements = entries
    .map((entry) => {
      let xml = `  <url>\n`;
      xml += `    <loc>${entry.loc}</loc>\n`;
      if (entry.lastmod) xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      if (entry.changefreq)
        xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      if (entry.priority !== undefined)
        xml += `    <priority>${entry.priority}</priority>\n`;
      xml += `  </url>`;
      return xml;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

/**
 * Generate sitemap index XML
 */
function generateSitemapIndex(sitemaps, lastmod) {
  const sitemapElements = sitemaps
    .map(
      (name) => `  <sitemap>
    <loc>${SITE_URL}/${name}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
}

/**
 * Parse URLs from existing sitemap
 */
function parseExistingSitemap(sitemapPath) {
  if (!fs.existsSync(sitemapPath)) {
    console.error(`Sitemap not found: ${sitemapPath}`);
    return [];
  }

  const content = fs.readFileSync(sitemapPath, 'utf-8');
  const urlMatches = content.matchAll(/<loc>([^<]+)<\/loc>/g);
  return Array.from(urlMatches).map((m) => m[1]);
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(50));
  console.log('Generating separate sitemaps...');
  console.log('='.repeat(50));

  // Find existing sitemap (could be sitemap-0.xml or similar)
  const sitemapFiles = fs
    .readdirSync(DIST_DIR)
    .filter((f) => f.match(/^sitemap-\d+\.xml$/));

  if (sitemapFiles.length === 0) {
    console.error(
      'No sitemap found in dist directory. Run astro build first.'
    );
    process.exit(1);
  }

  // Collect all URLs from all sitemap files
  const allUrls = [];
  for (const file of sitemapFiles) {
    const urls = parseExistingSitemap(path.join(DIST_DIR, file));
    allUrls.push(...urls);
  }

  console.log(`\nFound ${allUrls.length} URLs in existing sitemap(s)`);

  // Get blog post dates
  const blogDates = getBlogPostDates();
  console.log(`Found ${blogDates.size} blog post dates`);

  const buildDate = new Date().toISOString();

  // Categorize URLs and filter out redirects
  const categorized = {
    blog: [],
    tools: [],
    projects: [],
    pages: [],
  };

  let excludedCount = 0;

  for (const url of allUrls) {
    const pathname = new URL(url).pathname;

    // Skip redirect URLs
    if (isRedirectUrl(pathname)) {
      excludedCount++;
      continue;
    }

    const category = categorizeUrl(pathname);
    const lastmod = getLastmod(pathname, blogDates, buildDate);

    categorized[category].push({
      loc: url,
      lastmod: lastmod,
      changefreq: getChangefreq(category),
      priority: getPriority(category, pathname),
    });
  }

  console.log(`Excluded ${excludedCount} redirect URLs`);

  // Sort entries by priority (highest first)
  for (const category of Object.keys(categorized)) {
    categorized[category].sort((a, b) => b.priority - a.priority);
  }

  // Write individual sitemaps
  const sitemapFilesList = [];

  for (const [category, entries] of Object.entries(categorized)) {
    if (entries.length > 0) {
      const filename = `sitemap-${category}.xml`;
      const xml = generateSitemapXml(entries);
      fs.writeFileSync(path.join(DIST_DIR, filename), xml);
      sitemapFilesList.push(filename);
      console.log(`Generated ${filename} with ${entries.length} URLs`);
    }
  }

  // Write sitemap index
  const indexXml = generateSitemapIndex(sitemapFilesList, buildDate);
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-index.xml'), indexXml);
  console.log(
    `\nGenerated sitemap-index.xml referencing ${sitemapFilesList.length} sitemaps`
  );

  // Remove old sitemap files
  for (const file of sitemapFiles) {
    fs.unlinkSync(path.join(DIST_DIR, file));
    console.log(`Removed old ${file}`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Summary');
  console.log('='.repeat(50));
  console.log(`Blog URLs:     ${categorized.blog.length}`);
  console.log(`Tools URLs:    ${categorized.tools.length}`);
  console.log(`Projects URLs: ${categorized.projects.length}`);
  console.log(`Other Pages:   ${categorized.pages.length}`);
  console.log(`Excluded:      ${excludedCount} (redirect pages)`);
  console.log('-'.repeat(50));
  console.log(
    `Total:         ${allUrls.length - excludedCount} (of ${allUrls.length} original)`
  );
  console.log('\nSitemap generation complete!');
}

main().catch(console.error);
