# AdSense Content Quality Remediation Design

## Objective

Reduce the site's low-value and mass-produced content signals, make ownership and privacy information explicit, and prevent utility or archive pages from inflating Google's index. The change improves the site's eligibility for a future AdSense review but does not claim or guarantee approval, which remains Google's decision.

## Chosen Approach

Use a focused quality cleanup rather than rewriting the entire site or merely adding more text. Remove the confirmed templated series, keep useful navigation pages available while excluding them from search, add publisher trust pages, and add automated checks that prevent the same index-quality problems from returning.

Two alternatives were rejected:

- **Minimal cleanup:** deleting only the 100-post series leaves 240 thin tag archives, missing trust pages, and mixed-language controls.
- **Full editorial rewrite:** rewriting every article and utility description would be slow, subjective, and unnecessary for the confirmed causes.

## Content Removal

- Delete all `src/content/blog/ai-dev-playbook-*.mdx` files (100 posts).
- Deleted article URLs will naturally return the existing noindex 404 page. Do not create redirects to unrelated pages.
- Preserve the remaining long-form, project-backed, and experience-based articles.
- Do not manufacture replacement articles or expand pages to a target word count.

## Index Control and Sitemap Policy

- Keep tag archives usable for readers, but set them to `noindex, follow` because they are thin listing pages.
- Exclude every `/blog/tag/` URL from generated sitemaps.
- Exclude non-public or low-context surfaces from indexing and sitemaps: `/articles/admin/`, `/dashboard/`, and `/content-os/`.
- Continue indexing the home page, individual retained articles, localized tools, games, public project pages, and the main blog listing.
- Add tests for sitemap exclusions and rendered robots directives.

## Publisher Trust Pages

Add three first-party pages linked from the global footer:

- `/about/`: identifies Restato, the site's editorial focus, the author's development background, and how AI assistance is reviewed before publication.
- `/contact/`: provides the existing public support email and links to GitHub and LinkedIn.
- `/privacy/`: explains Google Analytics, prospective AdSense cookies and advertising, browser-local tool processing, external links, retention boundaries, and contact details.

Add `public/ads.txt` containing the existing AdSense publisher ID:

```text
google.com, pub-5341896100319873, DIRECT, f08c47fec0942fa0
```

The pages must use factual, restrained copy. They must not make unsupported claims about credentials, traffic, data handling, or AdSense approval.

## Localization Repair

Route language is the source of truth for server-rendered and hydrated controls. Pass `lang` explicitly into shared tool controls instead of allowing initial text to fall back to Korean from client storage.

Scope:

- Favorite button labels and accessibility text.
- Share button labels, copy-link status, and social actions.
- Bookmark prompt text where it appears on localized tool pages.
- Any directly adjacent shared control exposed by the same route and failing the localization regression test.

This change does not redesign or rewrite every tool. Existing localized SEO descriptions and functional tool implementations remain intact.

## Architecture and Components

- `src/pages/blog/tag/[tag].astro` owns archive robots policy.
- `scripts/generate-sitemaps.mjs` owns final sitemap inclusion and exclusion.
- `src/pages/about.astro`, `src/pages/contact.astro`, and `src/pages/privacy.astro` own trust content.
- `src/components/Footer.astro` owns persistent discovery links to trust pages.
- Shared React controls accept an explicit `lang` prop and resolve translations deterministically.
- A content-quality test script inspects source/build output for the removed series, required trust assets, sitemap exclusions, and localized rendered controls.

## Validation

The implementation is complete only when all of the following pass:

- The 100 playbook files are absent.
- `npm test -- --run` passes.
- `npm run test:coverage` passes.
- `npm run build` passes.
- Built tag, dashboard, content OS, and admin pages contain `noindex` and are absent from split sitemaps.
- Built `/about/`, `/contact/`, `/privacy/`, and `/ads.txt` exist.
- Built English and Japanese JSON tool pages do not render Korean favorite/share/bookmark control labels.
- The final diff contains no unrelated user changes or credentials.

## Rollout

Open a draft pull request against `master`. After merge and GitHub Pages deployment, submit the updated sitemap in Search Console and allow Google to recrawl removed and noindex URLs before requesting another AdSense review.
