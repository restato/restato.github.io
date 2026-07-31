export interface BlogTagEntry {
  label: string;
  slug: string;
}

export interface BlogTagCountEntry extends BlogTagEntry {
  count: number;
}

export interface BlogTagRouteEntry {
  kind: 'canonical' | 'redirect';
  filesystemSegment: string;
  urlSegment: string;
  label: string;
  canonicalSlug: string;
}

const blogTagLabelCollator = new Intl.Collator('en', { sensitivity: 'base' });

function compareCodePoints(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function naturalLabelRank(label: string) {
  const letters = [...label].filter(character => /\p{L}/u.test(character));
  const hasUppercase = letters.some(character => /\p{Lu}/u.test(character));
  const hasLowercase = letters.some(character => /\p{Ll}/u.test(character));
  const isShortAcronym = hasUppercase && !hasLowercase && letters.length <= 4;

  if ((hasUppercase && hasLowercase) || isShortAcronym) return 0;
  if (hasLowercase) return 1;
  if (hasUppercase) return 2;
  return 3;
}

function selectCanonicalBlogTagLabel(left: string, right: string) {
  const leftLabel = left.trim();
  const rightLabel = right.trim();
  const comparison = naturalLabelRank(leftLabel) - naturalLabelRank(rightLabel)
    || compareCodePoints(leftLabel, rightLabel);

  return comparison <= 0 ? leftLabel : rightLabel;
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
    const existing = entries.get(slug);
    if (existing) existing.label = selectCanonicalBlogTagLabel(existing.label, tag);
    else entries.set(slug, { label: tag.trim(), slug });
  }

  return [...entries.values()].sort((a, b) => (
    blogTagLabelCollator.compare(a.label, b.label)
    || compareCodePoints(a.label, b.label)
  ));
}

export function getRankedBlogTagEntries(
  postTags: readonly string[][],
): BlogTagCountEntry[] {
  const entries = new Map<string, BlogTagCountEntry>();

  for (const tags of postTags) {
    const seenInPost = new Set<string>();
    for (const tag of tags) {
      const slug = toBlogTagSlug(tag);
      if (seenInPost.has(slug)) continue;
      seenInPost.add(slug);

      const existing = entries.get(slug);
      if (existing) {
        existing.count += 1;
        existing.label = selectCanonicalBlogTagLabel(existing.label, tag);
      } else {
        entries.set(slug, { label: tag.trim(), slug, count: 1 });
      }
    }
  }

  return [...entries.values()].sort((a, b) => (
    b.count - a.count
    || blogTagLabelCollator.compare(a.label, b.label)
    || compareCodePoints(a.label, b.label)
  ));
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
