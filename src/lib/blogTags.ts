export interface BlogTagEntry {
  label: string;
  slug: string;
}

export interface BlogTagRouteEntry {
  kind: 'canonical' | 'redirect';
  param: string;
  label: string;
  canonicalSlug: string;
}

export function toBlogTagSlug(tag: string): string {
  return encodeURIComponent(tag.trim().toLocaleLowerCase('en-US')).replace(/%20/g, '-');
}

/**
 * The segment Astro emitted before canonical tag routing. It intentionally
 * preserves the source tag's spelling and spaces so old inbound URLs resolve.
 */
export function toLegacyBlogTagSegment(tag: string): string {
  return encodeURIComponent(tag);
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
    param: slug,
    label,
    canonicalSlug: slug,
  }));
  const emittedParams = new Set(canonicalRoutes.map(route => route.param));
  const redirectRoutes: BlogTagRouteEntry[] = [];

  for (const tag of tags) {
    const param = toLegacyBlogTagSegment(tag);
    const canonicalSlug = toBlogTagSlug(tag);

    if (param === canonicalSlug || emittedParams.has(param)) continue;

    emittedParams.add(param);
    redirectRoutes.push({
      kind: 'redirect',
      param,
      label: tag,
      canonicalSlug,
    });
  }

  return [...canonicalRoutes, ...redirectRoutes];
}
