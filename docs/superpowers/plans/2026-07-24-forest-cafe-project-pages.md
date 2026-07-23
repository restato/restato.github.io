# Forest Café Project Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate five project pages and `/404` into the Forest Café public-page contract while correcting their accessibility, localization, SEO, automated visual coverage, and manual evidence.

**Architecture:** Keep each project page's content and behavior local, but express its presentation with existing `fc-*` tokens and primitives. Put language-selection and skip-link localization in focused shared modules/layout behavior, and keep `tests/e2e/forest-cafe-routes.ts` as the single route source for Axe and visual coverage.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, Vitest, Playwright, Axe, pixelmatch-based visual regression.

## Global Constraints

- Preserve all existing project-page content, data, links, media, and feature behavior.
- Do not introduce a new shared `ProjectPage` component or broad architecture refactor.
- Remove project-page gradients, glass effects, hover-lift transforms, and one-off color systems.
- The protected `.superpowers/sdd/rollout-task-1-report.md` file must never be touched or staged.
- Do not deploy or push commits.
- Finish with only the protected file's pre-existing modification in `git status --short`.

---

### Task 1: Public Route and Project Style RED Contracts

**Files:**
- Modify: `tests/e2e/forest-cafe-routes.ts`
- Modify: `tests/e2e/catalog.spec.ts`
- Create: `tests/project-pages-contract.test.ts`
- Test: `tests/e2e/accessibility.spec.ts`
- Test: `tests/e2e/forest-cafe-visual.spec.ts`

**Interfaces:**
- Consumes: `ForestCafeRoute` and the shared `forestCafeRoutes` array.
- Produces: `project` and `not-found` route families and six matrix entries consumed automatically by Axe and visual tests.

- [ ] **Step 1: Add the six required route entries and count assertions**

Add `'project'` and `'not-found'` to `forestCafeRequiredFamilies`, then add:

```ts
{ id: 'project-gallery', name: 'Project gallery', family: 'project', path: '/projects/gallery/', locale: 'ko' },
{ id: 'project-jobworld-kids', name: 'Jobworld Kids project', family: 'project', path: '/projects/jobworld-kids/', locale: 'ko' },
{ id: 'project-local-price-extractor', name: 'Local price extractor project', family: 'project', path: '/projects/local-price-extractor/', locale: 'ko' },
{ id: 'project-quick-issue', name: 'Quick Issue project', family: 'project', path: '/projects/quick-issue/', locale: 'ko' },
{ id: 'project-roomfit-3d', name: 'RoomFit 3D project', family: 'project', path: '/projects/roomfit-3d/', locale: 'ko' },
{ id: 'not-found', name: 'Not found page', family: 'not-found', path: '/404/', locale: 'ko' },
```

In `catalog.spec.ts`, assert `forestCafeRoutes` has 18 entries and the project
family has exactly five unique paths.

- [ ] **Step 2: Add static style and semantic source contracts**

Create a Vitest suite that reads the five Astro files and asserts:

```ts
const forbidden = [
  /\bbg-gradient-to-/,
  /\bfrom-(?:blue|cyan|indigo|orange|purple)-/,
  /\bbackdrop-blur/,
  /\bhover:-translate-y-/,
  /\bhover:scale-/,
];
for (const source of projectSources) {
  for (const pattern of forbidden) expect(source).not.toMatch(pattern);
  expect(source).toMatch(/\bfc-(?:page|content|surface|button|eyebrow)\b/);
}
expect(gallerySource).toMatch(/<button[^>]+data-gallery-item/s);
expect(gallerySource).toMatch(/role="dialog"/);
expect(gallerySource).toMatch(/aria-modal="true"/);
expect(gallerySource).toMatch(/aria-labelledby="gallery-dialog-title"/);
```

Also assert the jobworld connector's immediate container has `relative` and
`overflow-hidden`, and assert the local-price CTA and roomfit eyebrow use
Forest Café token classes rather than page-local orange/cyan foreground pairs.

- [ ] **Step 3: Run the focused tests and record RED**

Run:

```bash
npx vitest run tests/project-pages-contract.test.ts
npx playwright test tests/e2e/catalog.spec.ts --project=chromium-desktop
```

Expected: FAIL because legacy project styles/semantics remain and the route
matrix does not yet contain 18 entries.

- [ ] **Step 4: Commit the RED contracts**

```bash
git add tests/project-pages-contract.test.ts tests/e2e/forest-cafe-routes.ts tests/e2e/catalog.spec.ts
git commit -m "test: require project pages in forest cafe contract"
```

---

### Task 2: Forest Café Project Page Migration

**Files:**
- Modify: `src/pages/projects/gallery.astro`
- Modify: `src/pages/projects/jobworld-kids.astro`
- Modify: `src/pages/projects/local-price-extractor.astro`
- Modify: `src/pages/projects/quick-issue.astro`
- Modify: `src/pages/projects/roomfit-3d.astro`
- Test: `tests/project-pages-contract.test.ts`

**Interfaces:**
- Consumes: existing `fc-page`, `fc-content`, `fc-surface`, `fc-surface-soft`, `fc-eyebrow`, `fc-button-primary`, `fc-button-secondary`, and token variables.
- Produces: five content-preserving project routes with consistent Forest Café surfaces and responsive containment.

- [ ] **Step 1: Migrate the shared page shells and sections**

For every project page, replace custom full-page color/gradient wrappers with:

```astro
<div class="fc-page fc-content">
  <header class="fc-page-header">
    <p class="fc-eyebrow">...</p>
    <h1>...</h1>
    <p class="fc-page-description">...</p>
  </header>
  <section class="fc-surface fc-surface-padding-md">...</section>
</div>
```

Use only Forest Café token values such as `text-[var(--text-muted)]`,
`border-[var(--border-subtle)]`, `bg-[var(--surface-soft)]`, and the existing
button classes. Remove gradient, backdrop blur, scale, and translate hover
effects while retaining color/border focus states.

- [ ] **Step 2: Fix the jobworld process connector containment**

Make each connector-owning step wrapper an explicit containing block and clip
the desktop-only absolute connector:

```astro
<div class="relative min-w-0 overflow-hidden">
  <!-- existing step content -->
  <span
    aria-hidden="true"
    class="pointer-events-none absolute right-0 top-1/2 hidden max-w-full -translate-y-1/2 md:block"
  >
    <!-- existing arrow -->
  </span>
</div>
```

Keep the arrow hidden at 390 and ensure its transformed box cannot extend the
document scroll width at 768, 1024, or 1440.

- [ ] **Step 3: Correct the two identified contrast pairs**

Render the local-price primary CTA with `fc-button fc-button-primary`. Render
the roomfit eyebrow with `fc-eyebrow` and no cyan foreground override. Add a
unit assertion using the final token RGB values and:

```ts
expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
```

- [ ] **Step 4: Run focused source and build checks**

Run:

```bash
npx vitest run tests/project-pages-contract.test.ts
npx astro check
npm run build
```

Expected: all three commands PASS.

- [ ] **Step 5: Commit the visual-system migration**

```bash
git add src/pages/projects tests/project-pages-contract.test.ts
git commit -m "feat: migrate project pages to forest cafe"
```

---

### Task 3: Gallery Dialog Keyboard and Focus Lifecycle

**Files:**
- Modify: `src/pages/projects/gallery.astro`
- Modify: `tests/e2e/catalog.spec.ts`

**Interfaces:**
- Consumes: gallery image data already present in `gallery.astro`.
- Produces: `[data-gallery-item]` native buttons and `#gallery-dialog` with close, previous, and next controls.

- [ ] **Step 1: Add failing browser coverage**

Add a test that visits `/projects/gallery/`, focuses the first
`[data-gallery-item]`, presses Enter, and asserts:

```ts
await expect(dialog).toHaveAttribute('role', 'dialog');
await expect(dialog).toHaveAttribute('aria-modal', 'true');
await expect(dialog).toHaveAccessibleName('이미지 크게 보기');
await expect(closeButton).toBeFocused();
```

Then press Shift+Tab from the first focusable control and assert focus wraps to
the last; press Tab from the last and assert it wraps to the first; press Escape
and assert the dialog is hidden and the opener is focused. Repeat opening with
Space to prove native button keyboard activation.

- [ ] **Step 2: Run the browser test and record RED**

Run:

```bash
npx playwright test tests/e2e/catalog.spec.ts --project=chromium-desktop --grep "gallery dialog"
```

Expected: FAIL because the current cards are not native controls and the
lightbox lacks dialog naming and focus management.

- [ ] **Step 3: Implement semantic markup**

Use:

```astro
<button type="button" data-gallery-item data-index={index} aria-label={`${image.alt} 크게 보기`}>
  <img src={image.src} alt={image.alt} />
</button>

<div id="gallery-dialog" role="dialog" aria-modal="true"
     aria-labelledby="gallery-dialog-title" hidden>
  <h2 id="gallery-dialog-title" class="sr-only">이미지 크게 보기</h2>
  <button type="button" data-gallery-close aria-label="닫기">...</button>
  <button type="button" data-gallery-previous aria-label="이전 이미지">...</button>
  <button type="button" data-gallery-next aria-label="다음 이미지">...</button>
</div>
```

- [ ] **Step 4: Implement the focus lifecycle**

Track `HTMLElement | null` as the opener. On open, remove `hidden`, update the
image, and focus the close control. On close, set `hidden`, then call
`opener?.focus()`. Handle Escape and cycle Tab/Shift+Tab across enabled links,
buttons, and form controls inside the dialog. Keep previous/next behavior and
button click activation.

- [ ] **Step 5: Run focused GREEN checks and commit**

Run:

```bash
npx playwright test tests/e2e/catalog.spec.ts --project=chromium-desktop --grep "gallery dialog"
npx vitest run tests/project-pages-contract.test.ts
```

Expected: PASS.

```bash
git add src/pages/projects/gallery.astro tests/e2e/catalog.spec.ts
git commit -m "fix: make gallery lightbox an accessible dialog"
```

---

### Task 4: Article Language, Skip-Link Synchronization, and Canonical Equality

**Files:**
- Create: `src/i18n/article-language.ts`
- Create: `src/i18n/skip-link.ts`
- Create: `src/i18n/__tests__/article-language.test.ts`
- Create: `src/i18n/__tests__/skip-link.test.ts`
- Modify: `src/layouts/MainLayout.astro`
- Modify: `src/pages/blog/[...slug].astro`
- Modify: `src/pages/[lang]/anonymous-chat.astro`
- Modify: `tests/e2e/catalog.spec.ts`

**Interfaces:**
- Produces: `selectArticleLanguage(data: { lang?: Language; title: string; description: string }): Language`.
- Produces: `skipLinkLabels: Record<Language, string>` and `getSkipLinkLabel(language: string): string`.
- Consumes: `languageChange` custom events whose `detail` is a supported language code.

- [ ] **Step 1: Add failing unit and browser tests**

Unit-test explicit language, Hangul/Japanese/Devanagari/traditional-Chinese/
simplified-Chinese inference, and the terminal English fallback:

```ts
expect(selectArticleLanguage({ lang: 'fr', title: '한국어', description: '' })).toBe('fr');
expect(selectArticleLanguage({ title: '테스트', description: '' })).toBe('ko');
expect(selectArticleLanguage({ title: 'Plain Latin title', description: '' })).toBe('en');
```

Test every supported locale has a non-empty skip-link label and unsupported
input falls back to Korean.

Browser-test a known non-English blog article: assert `html[lang]`, dispatch
`languageChange` with a different locale, and assert the article language does
not change. On `/` and `/404/`, dispatch `languageChange` with `detail: 'fr'`
and assert the skip link changes to `Aller au contenu principal`.

Parse the anonymous-chat canonical link and all JSON-LD objects, and assert the
application and final breadcrumb URLs exactly equal the trailing-slash
canonical.

- [ ] **Step 2: Run focused tests and record RED**

Run:

```bash
npx vitest run src/i18n/__tests__/article-language.test.ts src/i18n/__tests__/skip-link.test.ts
npx playwright test tests/e2e/catalog.spec.ts --project=chromium-desktop --grep "article language|skip link|anonymous chat canonical"
```

Expected: FAIL because the helpers do not exist, articles hardcode English,
skip-link text is server-static, and anonymous-chat JSON-LD omits the trailing
slash.

- [ ] **Step 3: Implement deterministic article language selection**

Export the selector with explicit supported `data.lang` first, stable Unicode
script checks over `${title} ${description}` second, and `'en'` last. In the
blog article page:

```astro
const articleLanguage = selectArticleLanguage(post.data);
...
<MainLayout lang={articleLanguage} lockLanguage={true} ...>
```

- [ ] **Step 4: Implement shared live skip-link synchronization**

Move the 12-label record to `src/i18n/skip-link.ts`. Give the MainLayout link
`data-skip-link`, serialize the labels on it, and install an inline listener:

```js
window.addEventListener('languageChange', (event) => {
  const label = labels[event.detail] || labels.ko;
  skipLink.textContent = label;
});
```

Because both `/` and `/404` use unlocked `MainLayout`, this one shared listener
must serve both routes.

- [ ] **Step 5: Reuse one trailing-slash anonymous-chat canonical**

Change the single value to:

```ts
const canonicalUrl = `https://restato.github.io/${lang}/anonymous-chat/`;
```

Pass it to `MainLayout canonical={canonicalUrl}` and reuse it unchanged in
application and breadcrumb JSON-LD.

- [ ] **Step 6: Run focused GREEN checks and commit**

Run the two commands from Step 2. Expected: PASS.

```bash
git add src/i18n src/layouts/MainLayout.astro src/pages/blog/'[...slug].astro' src/pages/'[lang]'/anonymous-chat.astro tests/e2e/catalog.spec.ts
git commit -m "fix: synchronize page language and canonical metadata"
```

---

### Task 5: Visual Baselines and 36-Combination Manual Evidence

**Files:**
- Modify: `tests/e2e/forest-cafe-visual.spec.ts-snapshots/*.png`
- Create: `artifacts/forest-cafe-task-9/manual-audit.json`
- Create: `artifacts/forest-cafe-task-9/manual/*.png`
- Modify: `docs/superpowers/reports/2026-07-23-forest-cafe-verification.md`

**Interfaces:**
- Consumes: 18-route `forestCafeRoutes` and `forestCafeAlwaysMaskedSelectors`.
- Produces: 54 current baselines and 36 newly audited route/width/theme evidence records.

- [ ] **Step 1: Prove missing-baseline RED**

Run the normal visual command without update mode:

```bash
npx playwright test tests/e2e/forest-cafe-visual.spec.ts --project=visual-desktop --project=visual-mobile
```

Expected: FAIL only for the 18 missing screenshots belonging to the six new
routes (desktop light, desktop dark, mobile dark).

- [ ] **Step 2: Generate and verify the 54-baseline set**

Run:

```bash
npx playwright test tests/e2e/forest-cafe-visual.spec.ts --project=visual-desktop --project=visual-mobile --update-snapshots
npx playwright test tests/e2e/forest-cafe-visual.spec.ts --project=visual-desktop --project=visual-mobile
```

Expected: the update run writes 18 new baselines; the normal run reports 38
tests passed.

- [ ] **Step 3: Capture the approved manual matrix**

For each of the six new routes, capture light and dark at 390, 768, and 1440
CSS pixels. In each combination record route, width, theme, screenshot path,
horizontal overflow delta, console errors, and focus-visible result. Add gallery
dialog open/close/focus-trap/restore results and jobworld 1024 overflow as
explicit supplemental checks. Expected: 36 matrix entries, zero overflow, zero
unexpected console errors, and all interaction checks true.

- [ ] **Step 4: Document masks and exact evidence counts**

Record that the shared masks remain ads, consent banner, and the live footer
year, plus any route-specific masks already present in the route matrix. Do not
add a broad page mask. Update the non-protected report with 18 routes, 54
baselines, 38 visual tests, 68 combined tests, and 36 new manual combinations.

- [ ] **Step 5: Commit baselines and evidence**

```bash
git add tests/e2e/forest-cafe-visual.spec.ts-snapshots artifacts/forest-cafe-task-9
git add docs/superpowers/reports/2026-07-23-forest-cafe-verification.md
git commit -m "test: baseline project pages across forest cafe"
```

Before committing, run `git diff --cached --name-only` and abort if the protected
`.superpowers/sdd/rollout-task-1-report.md` appears.

---

### Task 6: Complete Validation Ladder and Workspace Cleanup

**Files:**
- Modify: non-protected Task 9 remediation report only if observed counts differ from its provisional entries.

**Interfaces:**
- Consumes: all implementation, tests, baselines, and manual evidence.
- Produces: exact final verification record and a clean workspace except for the protected file.

- [ ] **Step 1: Run the full unit, type, build, and artifact ladder**

Run:

```bash
npm test -- --run
npm run check
npm run build
node scripts/validate-site.mjs dist
node scripts/audit-content.mjs dist
node scripts/check-bundles.mjs dist
```

Expected: every command exits 0. Record exact test and page counts.

- [ ] **Step 2: Run full Axe coverage**

Run:

```bash
npm run test:a11y
```

Expected: PASS with the expanded 18-route matrix under both themes.

- [ ] **Step 3: Run the exact combined catalog and visual command**

Run:

```bash
npx playwright test tests/e2e/catalog.spec.ts tests/e2e/forest-cafe-visual.spec.ts --project=chromium-desktop --project=mobile-390 --project=visual-desktop --project=visual-mobile
```

Expected: exactly 68 tests passed.

- [ ] **Step 4: Update observed report values and commit**

If exact observed values differ from provisional report prose, update the
non-protected report to the observed passing values. Commit only that report:

```bash
git add docs/superpowers/reports/2026-07-23-forest-cafe-verification.md
git commit -m "docs: record project page remediation evidence"
```

- [ ] **Step 5: Remove ephemeral outputs and verify protected-file isolation**

Remove only generated output already designated ephemeral by repository policy
(for example Playwright `test-results/` and HTML report directories), then run:

```bash
git status --short
git diff --check
git log --oneline --decorate -12
```

Expected: `git status --short` shows only:

```text
 M .superpowers/sdd/rollout-task-1-report.md
```
