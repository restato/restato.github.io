# Modern Restato Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the deployed Forest Café/terminal presentation with the approved angular Modern Restato system, add a canonical `R + leaf` brand icon, and limit blog tag navigation to the ten most-used tags with an accessible disclosure.

**Architecture:** Preserve the existing Astro/React/Tailwind application and its `fc-*` shared UI contract. Implement tag ranking as a pure library function and render it through one reusable Astro disclosure component; apply visual changes through semantic CSS tokens and shared chrome/home components so all existing routes inherit the redesign without duplicating page-specific rules.

**Tech Stack:** Astro 5, React 19, TypeScript 5.7, Tailwind CSS 3.4, Vitest 4, Testing Library, Playwright 1.61.

## Global Constraints

- Preserve existing tool, content, game, file-processing, localization, search, and SEO behavior.
- Do not introduce another component framework or any new runtime dependency.
- Use `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif` globally; D2Coding is limited to code and machine-data fields.
- Use exact light tokens `#F7F8F7`, `#FFFFFF`, `#EDF3EF`, `#15241D`, `#657169`, `#DCE3DF`, `#19553C`, `#236B4C`, `#9CC4AD`, and `#2C7655`.
- Use exact dark tokens `#111713`, `#19211D`, `#24342B`, `#F0F4F1`, `#9CA8A1`, `#303A34`, `#70A889`, `#89B99D`, `#1D3D2F`, and `#8DC0A1`.
- Use radii of `10px` for large shells, `8px` for cards/panels/dialogs/menus/tags, `6px` for controls and tool icons, and `7px` for the 32×32 brand mark.
- Do not add beige, brown, café imagery, rockets, emoji branding, AI sparkles, glassmorphism, decorative gradients, large pill shapes, or looping animation.
- Do not redistribute Apple font files; use the operating-system font stack only.
- Preserve the unrelated working-tree change in `.superpowers/sdd/rollout-task-1-report.md`; never stage it.
- Do not deploy or publish as part of this plan.

---

### Task 1: Ranked Blog Tags and Accessible Disclosure

**Files:**
- Modify: `src/lib/blogTags.ts`
- Modify: `src/lib/__tests__/blogTags.test.ts`
- Create: `src/components/BlogTagNav.astro`
- Create: `src/components/__tests__/BlogTagNav.test.ts`
- Modify: `src/data/blog-tag-content.ts`
- Modify: `src/data/__tests__/blog-tag-content.test.ts`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/tag/[tag].astro`

**Interfaces:**
- Produces: `BlogTagCountEntry extends BlogTagEntry { count: number }`.
- Produces: `getRankedBlogTagEntries(postTags: readonly string[][], locale?: string): BlogTagCountEntry[]`; each canonical tag is counted at most once per post.
- Produces: `BlogTagNav.astro` props `{ entries, label, showMoreLabel, showLessLabel, currentSlug?, includeAllLink?, allLabel? }`.
- Preserves: `getBlogTagEntries`, `getBlogTagRouteEntries`, `toBlogTagSlug`, and all canonical/legacy tag URL behavior.

- [ ] **Step 1: Add failing ranking tests**

Add focused assertions to `src/lib/__tests__/blogTags.test.ts`:

```ts
it('ranks canonical tags by post count and breaks ties by localized label', () => {
  expect(getRankedBlogTagEntries(
    [['Astro', 'AI'], ['astro', '도구'], ['AI', 'Blog']],
    'ko',
  )).toEqual([
    { label: 'AI', slug: 'ai', count: 2 },
    { label: 'Astro', slug: 'astro', count: 2 },
    { label: 'Blog', slug: 'blog', count: 1 },
    { label: '도구', slug: '%EB%8F%84%EA%B5%AC', count: 1 },
  ]);
});

it('counts tags case-insensitively without changing the first display label', () => {
  expect(getRankedBlogTagEntries([
    ['OpenAI', 'openai'],
    ['OPENAI'],
  ])).toEqual([
    { label: 'OpenAI', slug: 'openai', count: 2 },
  ]);
});
```

- [ ] **Step 2: Run the ranking test and verify it fails**

Run: `npm test -- --run src/lib/__tests__/blogTags.test.ts`

Expected: FAIL because `getRankedBlogTagEntries` is not exported.

- [ ] **Step 3: Implement the pure ranking function**

Add to `src/lib/blogTags.ts` without changing the existing route helpers:

```ts
export interface BlogTagCountEntry extends BlogTagEntry {
  count: number;
}

export function getRankedBlogTagEntries(
  postTags: readonly string[][],
  locale = 'en',
): BlogTagCountEntry[] {
  const entries = new Map<string, BlogTagCountEntry>();

  for (const tags of postTags) {
    const seenInPost = new Set<string>();
    for (const tag of tags) {
      const slug = toBlogTagSlug(tag);
      if (seenInPost.has(slug)) continue;
      seenInPost.add(slug);

      const existing = entries.get(slug);
      if (existing) existing.count += 1;
      else entries.set(slug, { label: tag, slug, count: 1 });
    }
  }

  return [...entries.values()].sort((a, b) =>
    b.count - a.count || a.label.localeCompare(b.label, locale, { sensitivity: 'base' })
  );
}
```

- [ ] **Step 4: Add failing disclosure and localization contract tests**

Create `src/components/__tests__/BlogTagNav.test.ts` as a source-level Astro contract test. Verify that the component:

```ts
expect(source).toContain('entries.slice(0, 10)');
expect(source).toContain('entries.slice(10)');
expect(source).toContain('aria-expanded="false"');
expect(source).toContain('aria-controls={overflowId}');
expect(source).toContain('data-blog-tag-overflow');
expect(source).toContain('data-show-more-label={showMoreLabel}');
expect(source).toContain('data-show-less-label={showLessLabel}');
expect(source).toContain('{entry.count}');
expect(source).toContain('if (entries.length > 10)');
```

Extend `src/data/__tests__/blog-tag-content.test.ts` to assert every supported language returns non-empty `showMoreLabel` and `showLessLabel` values.

- [ ] **Step 5: Run the disclosure tests and verify they fail**

Run: `npm test -- --run src/components/__tests__/BlogTagNav.test.ts src/data/__tests__/blog-tag-content.test.ts`

Expected: FAIL because the shared component and disclosure labels do not exist.

- [ ] **Step 6: Implement the shared tag disclosure**

Create `src/components/BlogTagNav.astro` with the first ten entries visible and the remaining entries in a hidden sibling region. Use one scoped inline script that supports multiple component instances:

```astro
<nav class="blog-tag-nav" aria-label={label} data-blog-tag-nav>
  <div class="blog-tag-list">
    {entries.slice(0, 10).map(entry => (
      <a data-blog-tag-link href={`/blog/tag/${entry.slug}`}>
        <span>{entry.label}</span><span aria-label={`${entry.count} posts`}>{entry.count}</span>
      </a>
    ))}
    {entries.length > 10 && (
      <span id={overflowId} data-blog-tag-overflow hidden>
        {entries.slice(10).map(entry => (
          <a data-blog-tag-link href={`/blog/tag/${entry.slug}`}>
            <span>{entry.label}</span><span aria-label={`${entry.count} posts`}>{entry.count}</span>
          </a>
        ))}
      </span>
    )}
    {entries.length > 10 && (
      <button
        type="button"
        class="fc-button fc-button-quiet blog-tag-toggle"
        aria-expanded="false"
        aria-controls={overflowId}
        data-show-more-label={showMoreLabel}
        data-show-less-label={showLessLabel}
      >{showMoreLabel}</button>
    )}
  </div>
</nav>
```

The script toggles `hidden`, updates `aria-expanded`, and swaps `textContent` between the two data labels. Do not store disclosure state.

Extend every locale factory in `src/data/blog-tag-content.ts` with localized `showMoreLabel` and `showLessLabel`. English must use `Show more`/`Show less`; Korean must use `더보기`/`접기`.

- [ ] **Step 7: Replace duplicated tag markup on both blog routes**

On `/blog/`, derive entries with:

```ts
const rankedTags = getRankedBlogTagEntries(
  posts.map(post => post.data.tags),
  'en',
);
```

On `/blog/tag/[tag]/`, use `allPosts.map(post => post.data.tags)` and `tagLanguage` as the locale.

Render `BlogTagNav` on `/blog/` and every `/blog/tag/[tag]/` route. On tag pages pass `currentSlug={toBlogTagSlug(tag)}`, `includeAllLink={true}`, and localized labels; do not modify tag route generation or canonical URLs.

- [ ] **Step 8: Run unit tests and commit**

Run:

```bash
npm test -- --run src/lib/__tests__/blogTags.test.ts src/components/__tests__/BlogTagNav.test.ts src/data/__tests__/blog-tag-content.test.ts
git add src/lib/blogTags.ts src/lib/__tests__/blogTags.test.ts src/components/BlogTagNav.astro src/components/__tests__/BlogTagNav.test.ts src/data/blog-tag-content.ts src/data/__tests__/blog-tag-content.test.ts src/pages/blog/index.astro 'src/pages/blog/tag/[tag].astro'
git commit -m "feat: rank and collapse blog tags"
```

Expected: all selected tests PASS; the commit contains only tag navigation behavior.

---

### Task 2: Modern Restato Tokens, Typography, and Geometry

**Files:**
- Modify: `src/styles/__tests__/design-system.test.ts`
- Modify: `src/components/ui/__tests__/PageShell.test.ts`
- Modify: `src/styles/global.css`
- Modify: `tailwind.config.mjs`

**Interfaces:**
- Produces: semantic variables already consumed by all `fc-*` classes: `--surface-page`, `--surface-raised`, `--surface-soft`, `--text-primary`, `--text-muted`, `--border-subtle`, `--brand`, `--brand-hover`, `--accent`, and `--focus`.
- Preserves: all existing `fc-*` class names so tools, games, projects, policies, chat, dashboard, articles, and utility states inherit the redesign.

- [ ] **Step 1: Rewrite design-system expectations first**

Change the suite name to `Modern Restato design system`. Replace D2Coding-global assertions with:

```ts
expect(config).toContain("'-apple-system'");
expect(config).toContain("'BlinkMacSystemFont'");
expect(css).toMatch(/body\s*\{[^}]*font-size:\s*1rem;[^}]*line-height:\s*1\.7;/s);
expect(css).toMatch(/\.fc-input[\s\S]*font-family:\s*'D2Coding'/);
```

Assert every approved token exactly, plus geometry contracts:

```ts
expect(css).toMatch(/\.fc-surface\s*\{[^}]*border-radius:\s*0\.5rem;/s);
expect(css).toMatch(/\.fc-button\s*\{[^}]*border-radius:\s*0\.375rem;/s);
expect(css).toMatch(/\.fc-chip\s*\{[^}]*border-radius:\s*0\.5rem;/s);
expect(css).not.toMatch(/border-radius:\s*9999px/);
```

- [ ] **Step 2: Run design-system tests and verify they fail**

Run: `npm test -- --run src/styles/__tests__/design-system.test.ts src/components/ui/__tests__/PageShell.test.ts`

Expected: FAIL on old warm tokens, D2Coding global font, 16px surfaces, 10px controls, and pill chips.

- [ ] **Step 3: Replace semantic tokens and global type stack**

In `src/styles/global.css`, replace the root and dark variables with the exact values in Global Constraints. Keep `--accent` as an alias to `--brand` so legacy consumers remain coherent. Remove D2Coding `@font-face` from global text flow, but keep the declarations available for explicit code/machine-data use.

In `tailwind.config.mjs`, set:

```js
fontFamily: {
  sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Segoe UI', 'sans-serif'],
  mono: ['D2Coding', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
},
```

- [ ] **Step 4: Apply the shared radius and surface contract**

Update `global.css` so shared primitives use:

```css
.fc-surface { border-radius: 0.5rem; }
.fc-button,
.fc-input,
.fc-select,
.fc-textarea,
.fc-file-input,
.fc-color-input { border-radius: 0.375rem; }
.fc-chip,
.fc-tool-result,
.fc-tool-privacy,
.fc-tool-drop-zone,
.card { border-radius: 0.5rem; }
.fc-input,
.fc-select,
.fc-textarea,
.fc-file-input,
.fc-prose code,
.fc-prose pre { font-family: 'D2Coding', SFMono-Regular, Menlo, Consolas, monospace; }
```

Retain 44px minimum targets, focus outlines, logical-direction CSS, `prefers-reduced-motion`, and the no-decorative-gradient/no-layout-shift contract.

- [ ] **Step 5: Run focused tests and commit**

Run:

```bash
npm test -- --run src/styles/__tests__/design-system.test.ts src/components/ui/__tests__/PageShell.test.ts src/components/tools/ui/__tests__/tool-actions-css.test.ts
git add src/styles/global.css tailwind.config.mjs src/styles/__tests__/design-system.test.ts src/components/ui/__tests__/PageShell.test.ts
git commit -m "style: establish modern Restato design tokens"
```

Expected: selected suites PASS and all routes still consume the same semantic variable/class names.

---

### Task 3: Canonical Brand Assets and Site Chrome

**Files:**
- Create: `src/components/BrandMark.astro`
- Create: `src/components/__tests__/BrandMark.test.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/__tests__/site-chrome.test.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `public/favicon.svg`
- Create: `public/apple-touch-icon.png`
- Create: `public/icon-192x192.png`
- Create: `public/icon-512x512.png`

**Interfaces:**
- Produces: `BrandMark.astro` props `{ size?: number; title?: string; class?: string }` with decorative-by-default SVG behavior.
- Produces: canonical public `/favicon.svg` with the same view-box geometry.
- Preserves: existing theme, locale, menu, active-route, skip-link, and metadata scripts.

- [ ] **Step 1: Add failing brand/chrome contracts**

Create `BrandMark.test.ts` to assert the component source contains `viewBox="0 0 32 32"`, a `rect` with `rx="7"`, the approved green fills, and no `🚀`, `✨`, or remote asset URL. Update `site-chrome.test.ts` to assert Header and Footer import/render `BrandMark`, and BaseLayout includes:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

- [ ] **Step 2: Run chrome tests and verify they fail**

Run: `npm test -- --run src/components/__tests__/BrandMark.test.ts src/components/__tests__/site-chrome.test.ts`

Expected: FAIL because the reusable mark and touch icon metadata do not exist.

- [ ] **Step 3: Create the deterministic SVG mark**

Use this canonical geometry in `BrandMark.astro` and `public/favicon.svg`:

```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="7" fill="var(--brand-icon-bg, #19553C)"/>
  <path d="M9 22V10h7.2c4.2 0 6.8 2.1 6.8 5.5 0 2.4-1.3 4.2-3.6 5.1L23 25h-4l-3-4.1h-3.4V22H9Z" fill="var(--brand-icon-r, #F7F8F7)"/>
  <path d="M13 13.4v4.2h3c2 0 3-.7 3-2.1s-1-2.1-3-2.1h-3Z" fill="var(--brand-icon-bg, #19553C)"/>
  <path d="M20.5 7.5c1.7.1 3.1.7 4 1.9-1.7.7-3.3.6-4.8-.4.1-.6.4-1.1.8-1.5Z" fill="var(--brand-icon-leaf, #9CC4AD)"/>
</svg>
```

The component sets `aria-hidden="true"` when no title is supplied and uses `<title>` plus `role="img"` only when a title is supplied. Define component variables as `#19553C/#F7F8F7/#9CC4AD` in light mode and `#70A889/#111713/#F0F4F1` under `.dark`. In `public/favicon.svg`, define the same dark triplet in an embedded `@media (prefers-color-scheme: dark)` rule so the browser favicon follows system theme without JavaScript.

- [ ] **Step 4: Generate and inspect raster icon exports**

On macOS, render the canonical SVG at 180, 192, and 512px using the installed system image tools, then inspect dimensions:

```bash
sips -s format png public/favicon.svg --out /tmp/restato-icon.png
sips -z 180 180 /tmp/restato-icon.png --out public/apple-touch-icon.png
sips -z 192 192 /tmp/restato-icon.png --out public/icon-192x192.png
sips -z 512 512 /tmp/restato-icon.png --out public/icon-512x512.png
sips -g pixelWidth -g pixelHeight public/apple-touch-icon.png public/icon-192x192.png public/icon-512x512.png
```

Expected dimensions: 180×180, 192×192, and 512×512. Visually inspect the 16px SVG and all raster sizes; the `R` must remain dominant and the leaf must not merge into noise.

- [ ] **Step 5: Replace dot branding and align chrome geometry**

Render `<BrandMark size={32} />` beside the Restato wordmark in Header and Footer. Replace header/menu `rounded-[0.625rem]` classes with `rounded-md`, keep all controls at 44px minimum, and preserve every existing ID/data attribute used by the scripts and tests.

Add Apple touch icon metadata to BaseLayout and keep article publisher schema pointing at `/favicon.svg`.

- [ ] **Step 6: Run chrome tests and commit**

Run:

```bash
npm test -- --run src/components/__tests__/BrandMark.test.ts src/components/__tests__/site-chrome.test.ts
git add src/components/BrandMark.astro src/components/__tests__/BrandMark.test.ts src/components/Header.astro src/components/Footer.astro src/components/__tests__/site-chrome.test.ts src/layouts/BaseLayout.astro public/favicon.svg public/apple-touch-icon.png public/icon-192x192.png public/icon-512x512.png
git commit -m "feat: add Restato brand mark and icons"
```

Expected: selected tests PASS; the rocket favicon and header/footer dots no longer exist.

---

### Task 4: Home, Blog Cards, and Editorial Hierarchy

**Files:**
- Modify: `src/components/HomeContent.tsx`
- Modify: `src/components/__tests__/HomeContent.test.tsx`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/[lang]/index.astro`
- Modify: `src/components/BlogCard.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/tag/[tag].astro`

**Interfaces:**
- Preserves: exported `HeroSection`, `PopularToolsSection`, `RecentPostsHeader`, `ProjectsSection`, and `NoPostsMessage` APIs.
- Preserves: localized tool routes and all existing blog/article links.
- Consumes: Modern Restato tokens and shared primitives from Task 2; `BlogTagNav` from Task 1.

- [ ] **Step 1: Update home behavior/presentation contracts first**

Rename the suite to `Modern Restato home content` and assert:

```ts
expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
  'Small web tasks, faster and simpler.',
);
expect(container.querySelector('[data-home-tool-grid]')).toHaveClass('lg:grid-cols-4');
expect(container.querySelectorAll('[data-home-tool-card]')).toHaveLength(4);
expect(container.querySelector('[data-project-feature]')).toBeInTheDocument();
expect(container.innerHTML).not.toMatch(/D2Coding|rounded-full|gradient-|shadow-(?:lg|xl|2xl)/);
```

Keep the existing locale-route assertions for all supported languages.

- [ ] **Step 2: Run the home test and verify it fails**

Run: `npm test -- --run src/components/__tests__/HomeContent.test.tsx`

Expected: FAIL on old heading copy, six-row popular tools, and missing Modern Restato data hooks.

- [ ] **Step 3: Implement the approved home composition**

Update localized hero copy so Korean uses `작은 웹 작업을 더 빠르고 간단하게.` and English uses `Small web tasks, faster and simpler.`. Keep Japanese meaning equivalent.

Make the hero single-column and typography-led. Remove the café annotation block. Keep exactly two CTAs.

Render four primary tool cards (`json`, `qr-code`, `text-counter`, `color`) in a responsive `sm:grid-cols-2 lg:grid-cols-4` grid. Each card has a consistent 34px symbol box, title, one-line description, and localized route. Render recent posts in the existing blog-card grid and projects as one deep-green feature panel plus restrained links.

- [ ] **Step 4: Align BlogCard and tag pages**

Use the shared 8px surface geometry, reduce visual noise in metadata, and retain a maximum of three article tags. Tag counts belong only in `BlogTagNav`, not inside each BlogCard. Remove accent-brown usage and ensure selected tags use `--brand` plus a non-color current-state indicator (`aria-current="page"`).

- [ ] **Step 5: Run focused tests and commit**

Run:

```bash
npm test -- --run src/components/__tests__/HomeContent.test.tsx src/lib/__tests__/blogTags.test.ts src/styles/__tests__/public-pages-contract.test.ts
git add src/components/HomeContent.tsx src/components/__tests__/HomeContent.test.tsx src/pages/index.astro 'src/pages/[lang]/index.astro' src/components/BlogCard.astro src/pages/blog/index.astro 'src/pages/blog/tag/[tag].astro'
git commit -m "style: modernize home and blog hierarchy"
```

Expected: selected tests PASS, with all route and article behavior unchanged.

---

### Task 5: Public-Site Consistency and Visual Contract Migration

**Files:**
- Modify: `src/components/__tests__/site-chrome.test.ts`
- Modify: `src/components/games/__tests__/game-theme-contract.test.ts`
- Modify: `src/styles/__tests__/public-pages-contract.test.ts`
- Rename: `tests/e2e/forest-cafe-routes.ts` → `tests/e2e/modern-restato-routes.ts`
- Rename: `tests/e2e/forest-cafe-visual.spec.ts` → `tests/e2e/modern-restato-visual.spec.ts`
- Replace: `tests/e2e/forest-cafe-visual.spec.ts-snapshots/*` with `tests/e2e/modern-restato-visual.spec.ts-snapshots/*`

**Interfaces:**
- Consumes: semantic tokens and shared component styles from Tasks 2–4.
- Preserves: the same route family coverage for home, catalog, text tool, file tool, game catalog/detail, blog, policy, dashboard, chat, projects, RTL audit, and 404.

- [ ] **Step 1: Rename the visual contract vocabulary**

Rename exported identifiers to `modernRestatoRoutes`, `ModernRestatoRoute`, `modernRestatoRequiredFamilies`, and `modernRestatoAlwaysMaskedSelectors`. Change test titles from `Forest Cafe` to `Modern Restato` without dropping any route.

- [ ] **Step 2: Update exact theme and font assertions**

Set Playwright expectations to:

```ts
const semanticThemes = {
  light: {
    surfacePage: '#f7f8f7',
    textPrimary: '#15241d',
    bodyBackground: 'rgb(247, 248, 247)',
    bodyText: 'rgb(21, 36, 29)',
    focus: 'rgb(44, 118, 85)',
  },
  dark: {
    surfacePage: '#111713',
    textPrimary: '#f0f4f1',
    bodyBackground: 'rgb(17, 23, 19)',
    bodyText: 'rgb(240, 244, 241)',
    focus: 'rgb(141, 192, 161)',
  },
} as const;
```

Replace the D2Coding webfont load assertion with a computed body-font assertion that accepts the configured system stack. Monospace scope remains covered by the unit-level design-system test because not every visual route contains a code or machine-data field.

- [ ] **Step 3: Add blog tag interaction coverage**

Add `/blog/` as a `blog-index` route family. In the visual spec:

```ts
const tagNav = page.locator('[data-blog-tag-nav]');
await expect(tagNav.locator('a:visible')).toHaveCount(10);
const toggle = tagNav.locator('button[aria-expanded="false"]');
await toggle.click();
await expect(toggle).toHaveAttribute('aria-expanded', 'true');
await expect(tagNav.locator('[data-blog-tag-overflow]')).toBeVisible();
await toggle.click();
await expect(toggle).toHaveAttribute('aria-expanded', 'false');
```

If the first ten count includes an “All” link on a tag page, scope the assertion to links with `data-blog-tag-link` so exactly ten ranked tag links are counted.

- [ ] **Step 4: Run non-snapshot visual contracts first**

Run:

```bash
npm test -- --run src/components/__tests__/site-chrome.test.ts src/components/games/__tests__/game-theme-contract.test.ts src/styles/__tests__/public-pages-contract.test.ts
npm run build
npx playwright test tests/e2e/modern-restato-visual.spec.ts --project=desktop --grep "explicit theme choice|blog tag"
```

Expected: all contract checks PASS before snapshot updates.

- [ ] **Step 5: Regenerate and inspect visual baselines**

Run:

```bash
npx playwright test tests/e2e/modern-restato-visual.spec.ts --project=desktop --project=mobile-390 --update-snapshots
```

Inspect home, blog index collapsed/expanded, article, catalog, representative tool, game, project, policy, and 404 screenshots in light and dark. Reject any screenshot with clipped translation, hidden focus, terminal-like all-monospace text, beige/brown remnants, excessive rounding, or horizontal overflow.

- [ ] **Step 6: Commit the migrated visual contract**

Run:

```bash
git add src/components/__tests__/site-chrome.test.ts src/components/games/__tests__/game-theme-contract.test.ts src/styles/__tests__/public-pages-contract.test.ts tests/e2e/modern-restato-routes.ts tests/e2e/modern-restato-visual.spec.ts tests/e2e/modern-restato-visual.spec.ts-snapshots
git rm tests/e2e/forest-cafe-routes.ts tests/e2e/forest-cafe-visual.spec.ts
git commit -m "test: migrate visual contract to Modern Restato"
```

Expected: all old Forest Café test source names are removed and equivalent Modern Restato coverage is committed.

---

### Task 6: Full Verification and Design Evidence

**Files:**
- Create: `docs/superpowers/reports/2026-08-01-modern-restato-verification.md`
- Create: `docs/superpowers/reports/assets/modern-restato/home-light.png`
- Create: `docs/superpowers/reports/assets/modern-restato/home-dark.png`
- Create: `docs/superpowers/reports/assets/modern-restato/blog-tags-collapsed.png`
- Create: `docs/superpowers/reports/assets/modern-restato/blog-tags-expanded.png`
- Create: `docs/superpowers/reports/assets/modern-restato/tool-mobile-dark.png`

**Interfaces:**
- Consumes: the completed implementation and all test suites.
- Produces: a concise verification report with commands, results, exceptions, and screenshot paths.

- [ ] **Step 1: Run the complete automated verification gate**

Run:

```bash
npm test -- --run
npm run check
npm run build
npm run validate:site
npm run audit:content
node scripts/check-bundles.mjs dist
npx playwright test tests/e2e/accessibility.spec.ts --project=desktop --project=mobile-390
npx playwright test tests/e2e/modern-restato-visual.spec.ts --project=desktop --project=mobile-390
```

Expected: every command exits `0`. Record an exact failing command and output if any gate fails; fix the cause before continuing.

- [ ] **Step 2: Check banned visual remnants and protected worktree state**

Run:

```bash
rg -n "Forest Café|Forest Cafe|f4efe5|fffaf0|ebe4d7|935832|cf936a|🚀" src public tests tailwind.config.mjs
git status --short
```

Expected: no old visual-system or rocket matches remain in active source/tests; `.superpowers/sdd/rollout-task-1-report.md` remains the only unrelated modification.

- [ ] **Step 3: Capture final evidence**

Using the built preview and Playwright, capture the five named report images at desktop 1440px and mobile 390px. The blog evidence must show exactly ten ranked tag links before expansion, every remaining link after expansion, visible counts, and a keyboard-visible disclosure control.

- [ ] **Step 4: Write the verification report**

Document:

```md
# Modern Restato Verification

## Automated gates
- `npm test -- --run`: PASS
- `npm run check`: PASS
- `npm run build`: PASS
- `npm run validate:site`: PASS
- `npm run audit:content`: PASS
- bundle check: PASS
- accessibility: PASS
- desktop/mobile visual suite: PASS

## Manual checks
- Brand mark legible at 16/32/180/192/512px.
- Light and dark themes use approved semantic tokens.
- Blog tags rank by count, show ten initially, expand/collapse in place, and retain canonical links.
- No horizontal overflow at 320, 375, 768, 1024, or 1440px.
```

Replace `PASS` only with verified command results; do not claim unrun checks.

- [ ] **Step 5: Commit evidence and report**

Run:

```bash
git add docs/superpowers/reports/2026-08-01-modern-restato-verification.md docs/superpowers/reports/assets/modern-restato
git commit -m "docs: record Modern Restato verification"
```

Expected: the commit contains only the verification report and its final evidence images.
