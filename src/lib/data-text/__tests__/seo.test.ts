import { describe, expect, it } from 'vitest';
import { generateSeoBundle } from '../seo';

describe('SEO bundle generator', () => {
  it('generates escaped meta tags, robots.txt, and valid JSON-LD', () => {
    const result = generateSeoBundle({
      title: 'Tea & "Cake"',
      description: 'A <useful> guide',
      canonicalUrl: 'https://example.com/tea?x=1&y=2',
      siteName: 'Example',
      imageUrl: 'https://example.com/card.png',
      schemaType: 'Article',
      allowIndex: true,
      allowFollow: false,
      sitemapUrl: 'https://example.com/sitemap.xml',
    });

    expect(result.metaTags).toContain('content="Tea &amp; &quot;Cake&quot;"');
    expect(result.metaTags).toContain('href="https://example.com/tea?x=1&amp;y=2"');
    expect(result.metaTags).toContain('content="index, nofollow"');
    expect(result.robotsTxt).toBe('User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml');
    expect(JSON.parse(result.jsonLd)).toMatchObject({ '@type': 'Article', headline: 'Tea & "Cake"' });
  });

  it('validates required values, absolute URLs, and length guidance', () => {
    expect(() => generateSeoBundle({ title: '', description: 'x', canonicalUrl: 'https://example.com' })).toThrow('Title');
    expect(() => generateSeoBundle({ title: 'x', description: 'x', canonicalUrl: '/relative' })).toThrow('absolute');
    expect(() => generateSeoBundle({ title: 'x'.repeat(61), description: 'x', canonicalUrl: 'https://example.com' })).toThrow('60');
    expect(() => generateSeoBundle({ title: 'x', description: 'x'.repeat(161), canonicalUrl: 'https://example.com' })).toThrow('160');
  });

  it('prevents script termination inside JSON-LD', () => {
    const result = generateSeoBundle({
      title: '</script><script>alert(1)</script>',
      description: 'Safe JSON-LD',
      canonicalUrl: 'https://example.com',
    });
    expect(result.jsonLd).not.toContain('</script>');
    expect(result.jsonLd).toContain('\\u003c/script>');
  });
});
