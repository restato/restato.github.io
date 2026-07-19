# Restato blog MDX contract

## Source of truth

Always read `src/content/config.ts` before creating or updating a post. If this reference and the schema disagree, the schema wins and this file must be updated in the same change.

Current blog schema:

```ts
z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  draft: z.boolean().default(false),
})
```

## File location and URL

- File: `src/content/blog/<english-kebab-case-slug>.mdx`
- Expected URL: `https://restato.github.io/blog/<english-kebab-case-slug>/`
- The slug must be lowercase ASCII words separated by single hyphens.
- Do not change an existing slug without adding and verifying an appropriate redirect.

## Frontmatter

Use this shape:

```mdx
---
title: "A specific English title"
description: "A concise English description of the reader benefit."
date: 2026-07-19
tags: ["AI", "Engineering"]
draft: false
---
```

Rules:

- Use `date`, never `pubDate`.
- `draft` may be omitted because it defaults to `false`; include it only when draft state needs to be explicit.
- `image` is optional and must point to a real asset or valid URL supported by the site.
- Reuse existing tag spelling and capitalization where practical.
- Prefer 2–5 focused tags.
- Do not add an H1 in the body; the page layout renders the title.
- Give fenced code blocks an accurate language identifier.
- Avoid unverified JSX components or imports.
- Put raw JSX-sensitive characters in code spans or fenced blocks when necessary.

## Internal and external links

- Internal blog links use root-relative canonical paths such as `/blog/example/`.
- Prefer canonical HTTPS URLs for external sources.
- Link to the exact model page, API reference, release note, repository file, or standard supporting the claim.
- Do not link a search result page when the original source is available.

## Validation

Run from the repository root:

```bash
npm run build
```

A valid change must satisfy all of the following:

- Astro content collection accepts the frontmatter.
- MDX compiles without JSX or syntax errors.
- The expected post route appears in `dist/blog/<slug>/index.html`.
- Sitemap generation completes.
- New or changed internal links target real routes.

Useful targeted checks:

```bash
test -f "dist/blog/<slug>/index.html"
```

When a post changes code samples but cannot call the live service due to unavailable credentials, separately validate syntax where practical and disclose the execution boundary in the editorial report.
