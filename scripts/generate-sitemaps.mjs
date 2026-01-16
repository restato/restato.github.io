/**
 * Generate separate sitemaps for different content types
 * Run after Astro build: node scripts/generate-sitemaps.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '../dist');
const SITE_URL = 'https://restato.github.io';

// URL patterns for categorization
const patterns = {
  blog: /^\/blog\//,
  tools: /^\/(ko|en|ja)?\/tools\//,
  toolsIndex: /^\/(ko|en|ja)?\/tools\/?$/,
  projects: /^\/projects\//,
  anonymousChat: /^\/(ko|en|ja)?\/anonymous-chat/,
};

/**
 * Categorize a URL based on its path
 */
function categorizeUrl(url) {
  const pathname = new URL(url).pathname;

  if (patterns.blog.test(pathname)) return 'blog';
  if (patterns.tools.test(pathname) || patterns.toolsIndex.test(pathname))
    return 'tools';
  if (patterns.projects.test(pathname)) return 'projects';
  if (patterns.anonymousChat.test(pathname)) return 'tools'; // Group with tools
  return 'pages';
}

/**
 * Get priority based on content type
 */
function getPriority(category, pathname) {
  if (category === 'tools') {
    // Tool index pages get higher priority
    if (pathname.match(/^\/(ko|en|ja)?\/tools\/?$/)) return 1.0;
    return 0.8;
  }
  if (category === 'blog') return 0.7;
  if (category === 'projects') return 0.6;
  // Home page
  if (pathname === '/' || pathname === '') return 1.0;
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
function generateSitemapIndex(sitemaps) {
  const lastmod = new Date().toISOString();
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
  console.log('Generating separate sitemaps...\n');

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

  console.log(`Found ${allUrls.length} URLs in existing sitemap(s)\n`);

  // Categorize URLs
  const categorized = {
    blog: [],
    tools: [],
    projects: [],
    pages: [],
  };

  const now = new Date().toISOString();

  for (const url of allUrls) {
    const category = categorizeUrl(url);
    const pathname = new URL(url).pathname;

    categorized[category].push({
      loc: url,
      lastmod: now,
      changefreq: getChangefreq(category),
      priority: getPriority(category, pathname),
    });
  }

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
  const indexXml = generateSitemapIndex(sitemapFilesList);
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
  console.log('\n--- Summary ---');
  console.log(`Blog URLs: ${categorized.blog.length}`);
  console.log(`Tools URLs: ${categorized.tools.length}`);
  console.log(`Projects URLs: ${categorized.projects.length}`);
  console.log(`Other Pages URLs: ${categorized.pages.length}`);
  console.log(`Total: ${allUrls.length}`);
  console.log('\nSitemap generation complete!');
}

main().catch(console.error);
