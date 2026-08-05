import {
  getBlogRoute,
  getStoredBlogLocale,
  groupBlogTranslations,
  type BlogLocale,
  type BlogTranslationPair,
  type BlogTranslationPost,
} from './blogTranslations';

export interface BlogRoute<Post extends BlogTranslationPost = BlogTranslationPost> {
  pathname: string;
  post: Post;
  pair?: BlogTranslationPair<Post>;
}

function projectPairedRoutes<Post extends BlogTranslationPost>(
  posts: readonly Post[],
  locale: BlogLocale,
): BlogRoute<Post>[] {
  const pairs = groupBlogTranslations(posts);

  return posts.flatMap((post) => {
    if (getStoredBlogLocale(post.slug, post.data) !== locale) return [];

    const translationKey = post.data.translationKey;
    const pair = translationKey ? pairs.get(translationKey) : undefined;
    if (!pair?.en || !pair.ko || pair[locale] !== post) return [];

    return [{
      pathname: getBlogRoute(locale, pair.slug),
      post,
      pair,
    }];
  });
}

export function projectEnglishRoutes<Post extends BlogTranslationPost>(
  posts: readonly Post[],
): BlogRoute<Post>[] {
  const pairedRoutes = projectPairedRoutes(posts, 'en');
  const pairedByPost = new Map(pairedRoutes.map(route => [route.post, route]));

  return posts.flatMap((post) => {
    const pairedRoute = pairedByPost.get(post);
    if (pairedRoute) return [pairedRoute];
    if (post.slug.includes('/')) return [];

    return [{
      pathname: getBlogRoute('en', post.slug),
      post,
    }];
  });
}

export function projectKoreanRoutes<Post extends BlogTranslationPost>(
  posts: readonly Post[],
): BlogRoute<Post>[] {
  return projectPairedRoutes(posts, 'ko');
}
