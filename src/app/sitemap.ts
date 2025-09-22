import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://restato.github.io';
  
  // 기본 페이지들
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: {
        languages: {
          ko: `${baseUrl}/ko`,
          en: `${baseUrl}/en`,
          ja: `${baseUrl}/ja`,
          zh: `${baseUrl}/zh`,
          es: `${baseUrl}/es`,
          fr: `${baseUrl}/fr`,
          de: `${baseUrl}/de`,
          ru: `${baseUrl}/ru`,
          hi: `${baseUrl}/hi`,
        },
      },
    },
  ];

  // 게임 페이지들
  const games = [
    'wheel-of-fortune',
    'lottery',
    'coinFlip',
    'dice',
  ];

  const gameRoutes = games.flatMap(game => [
    {
      url: `${baseUrl}/games/${game}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          ko: `${baseUrl}/ko/games/${game}`,
          en: `${baseUrl}/en/games/${game}`,
          ja: `${baseUrl}/ja/games/${game}`,
          zh: `${baseUrl}/zh/games/${game}`,
          es: `${baseUrl}/es/games/${game}`,
          fr: `${baseUrl}/fr/games/${game}`,
          de: `${baseUrl}/de/games/${game}`,
          ru: `${baseUrl}/ru/games/${game}`,
          hi: `${baseUrl}/hi/games/${game}`,
        },
      },
    },
  ]);

  return [...routes, ...gameRoutes];
}
