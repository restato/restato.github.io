import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { projectEnglishRoutes } from '../lib/blogRoutes';

export async function GET(context: APIContext) {
  const routes = projectEnglishRoutes(
    await getCollection('blog', ({ data }) => !data.draft),
  );

  return rss({
    title: 'Restato Blog',
    description: 'Development logs, learnings, and thoughts.',
    site: context.site!,
    items: routes.map(route => ({
      title: route.post.data.title,
      pubDate: route.post.data.date,
      description: route.post.data.description,
      link: route.pathname,
    })),
    customData: `<language>en-us</language>`,
  });
}
