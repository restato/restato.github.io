export type SchemaType = 'WebPage' | 'Article' | 'Product' | 'Organization';

export interface SeoInput {
  title: string;
  description: string;
  canonicalUrl: string;
  siteName?: string;
  imageUrl?: string;
  schemaType?: SchemaType;
  allowIndex?: boolean;
  allowFollow?: boolean;
  sitemapUrl?: string;
}

export interface SeoBundle {
  metaTags: string;
  robotsTxt: string;
  jsonLd: string;
}

function validateAbsoluteUrl(value: string, label: string): void {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
  } catch {
    throw new Error(`${label} must be an absolute HTTP or HTTPS URL.`);
  }
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function generateSeoBundle(input: SeoInput): SeoBundle {
  const title = input.title.trim();
  const description = input.description.trim();
  const canonicalUrl = input.canonicalUrl.trim();
  if (!title) throw new Error('Title is required.');
  if (!description) throw new Error('Meta description is required.');
  if (title.length > 60) throw new Error('Title must be 60 characters or fewer.');
  if (description.length > 160) throw new Error('Meta description must be 160 characters or fewer.');
  validateAbsoluteUrl(canonicalUrl, 'Canonical URL');
  if (input.imageUrl?.trim()) validateAbsoluteUrl(input.imageUrl.trim(), 'Image URL');
  if (input.sitemapUrl?.trim()) validateAbsoluteUrl(input.sitemapUrl.trim(), 'Sitemap URL');

  const allowIndex = input.allowIndex ?? true;
  const allowFollow = input.allowFollow ?? true;
  const robots = `${allowIndex ? 'index' : 'noindex'}, ${allowFollow ? 'follow' : 'nofollow'}`;
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<meta name="robots" content="${robots}">`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
    '<meta property="og:type" content="website">',
  ];
  if (input.siteName?.trim()) tags.push(`<meta property="og:site_name" content="${escapeHtml(input.siteName.trim())}">`);
  if (input.imageUrl?.trim()) tags.push(`<meta property="og:image" content="${escapeHtml(input.imageUrl.trim())}">`);

  const schema: Record<string, string> = {
    '@context': 'https://schema.org',
    '@type': input.schemaType ?? 'WebPage',
    url: canonicalUrl,
    description,
  };
  if ((input.schemaType ?? 'WebPage') === 'Article') schema.headline = title;
  else schema.name = title;
  if (input.siteName?.trim()) schema.publisher = input.siteName.trim();
  if (input.imageUrl?.trim()) schema.image = input.imageUrl.trim();

  return {
    metaTags: tags.join('\n'),
    robotsTxt: `User-agent: *\n${allowIndex ? 'Allow' : 'Disallow'}: /${input.sitemapUrl?.trim() ? `\n\nSitemap: ${input.sitemapUrl.trim()}` : ''}`,
    jsonLd: JSON.stringify(schema, null, 2).replace(/</g, '\\u003c'),
  };
}
