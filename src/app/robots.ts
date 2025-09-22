import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/static/',
      ],
    },
    sitemap: 'https://restato.github.io/sitemap.xml',
    host: 'https://restato.github.io',
  };
}
