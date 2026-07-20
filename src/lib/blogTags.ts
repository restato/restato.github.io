export interface BlogTagEntry {
  label: string;
  slug: string;
}

export function toBlogTagSlug(tag: string): string {
  return encodeURIComponent(tag.trim().toLocaleLowerCase('en-US')).replace(/%20/g, '-');
}

export function getBlogTagEntries(tags: string[]): BlogTagEntry[] {
  const entries = new Map<string, BlogTagEntry>();

  for (const tag of tags) {
    const slug = toBlogTagSlug(tag);
    if (!entries.has(slug)) entries.set(slug, { label: tag, slug });
  }

  return [...entries.values()].sort((a, b) => a.label.localeCompare(b.label));
}
