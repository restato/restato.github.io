export interface BlogTagEntry {
  label: string;
  slug: string;
}

export interface BlogTagRouteEntry {
  kind: 'canonical' | 'redirect';
  filesystemSegment: string;
  urlSegment: string;
  label: string;
  canonicalSlug: string;
}

export function toBlogTagSlug(tag: string): string {
  return encodeURIComponent(tag.trim().toLocaleLowerCase('en-US')).replace(/%20/g, '-');
}

/**
 * The historical filesystem name and the URL segment are intentionally
 * separate: static hosts decode a request URL once before reading a file.
 */
export function toLegacyBlogTagPath(tag: string) {
  return {
    filesystemSegment: tag,
    urlSegment: encodeURIComponent(tag),
  };
}

export function getBlogTagEntries(tags: string[]): BlogTagEntry[] {
  const entries = new Map<string, BlogTagEntry>();

  for (const tag of tags) {
    const slug = toBlogTagSlug(tag);
    if (!entries.has(slug)) entries.set(slug, { label: tag, slug });
  }

  return [...entries.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function getBlogTagRouteEntries(tags: string[]): BlogTagRouteEntry[] {
  const canonicalRoutes = getBlogTagEntries(tags).map(({ label, slug }) => ({
    kind: 'canonical' as const,
    filesystemSegment: decodeURIComponent(slug),
    urlSegment: slug,
    label,
    canonicalSlug: slug,
  }));
  const emittedUrlSegments = new Set(canonicalRoutes.map(route => route.urlSegment));
  const redirectRoutes: BlogTagRouteEntry[] = [];

  for (const tag of tags) {
    const legacyPath = toLegacyBlogTagPath(tag);
    const canonicalSlug = toBlogTagSlug(tag);

    if (legacyPath.urlSegment === canonicalSlug || emittedUrlSegments.has(legacyPath.urlSegment)) continue;

    emittedUrlSegments.add(legacyPath.urlSegment);
    redirectRoutes.push({
      kind: 'redirect',
      ...legacyPath,
      label: tag,
      canonicalSlug,
    });
  }

  return [...canonicalRoutes, ...redirectRoutes];
}
