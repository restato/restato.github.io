# Modern Restato Final Fix Wave Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the six Important final-review findings and harden brand provenance without changing routes, dependencies, functionality, visual tolerance, or evidence integrity.

**Architecture:** Keep the existing Astro/React structure and repair the shared contracts at their source: semantic color tokens, deterministic tag helpers and localized content, the public-route matrix, the LLM Wiki stylesheet, and canonical brand assets. Tests exercise rendered/browser behavior where behavior is at issue, while exact asset provenance remains a byte-level Node test.

**Tech Stack:** Astro 5, React 19, TypeScript, Vitest 4, Testing Library/jsdom, Playwright 1.61, Axe 4.12, CSS custom properties, Node built-ins.

## Global Constraints

- Preserve every canonical and legacy blog-tag URL, redirect, SEO contract, localization path, search behavior, and tool behavior.
- Keep `maxDiffPixelRatio: 0.001`, exact SHA-256 baseline/evidence identity, all existing masks, focus checks, overflow checks, RTL checks, and theme-persistence checks.
- Do not add or update dependencies, deploy, or publish.
- Never edit, stage, or commit `.superpowers/sdd/rollout-task-1-report.md`; its pre-existing modification belongs to the user.
- Use the approved Modern Restato palette, Apple system typography, 6–10px page-chrome geometry, and WCAG AA normal-text contrast.

---

### Task 1: On-brand contrast

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/__tests__/design-system.test.ts`
- Modify: `src/components/HomeContent.tsx`
- Modify: `src/components/BlogTagNav.astro`
- Modify: `tests/e2e/accessibility.spec.ts`

**Interfaces:**
- Produces: `--on-brand`, `#F7F8F7` in light mode and `#111713` in dark mode.
- Consumes: the existing `--brand`/`--brand-hover` backgrounds.

- [x] **Step 1: Write the failing token and browser contrast tests**

Add literal token-pair assertions for `#F7F8F7/#19553C` and `#111713/#70A889`, then add a Playwright helper that computes rendered foreground/background contrast for `[data-project-feature]` on `/` and `[data-blog-tag-link][aria-current="page"]` on `/blog/tag/claude-code/` in light and dark themes.

- [x] **Step 2: Run RED**

Run: `npm test -- --run src/styles/__tests__/design-system.test.ts && npx playwright test tests/e2e/accessibility.spec.ts --project=desktop --grep "on-brand"`

Expected: Vitest and/or Playwright fails because `--on-brand` is absent and both reviewed components still use white/opacity text.

- [x] **Step 3: Implement the semantic foreground**

Define paired `--on-brand` values, use it for `.fc-button-primary`, the home project panel, and selected tag chips, and remove opacity from the project panel's normal-sized copy.

- [x] **Step 4: Run GREEN**

Run the same focused commands and require zero failures.

---

### Task 2: Localized, deterministic blog-tag navigation and disclosure boundaries

**Files:**
- Modify: `src/lib/blogTags.ts`
- Modify: `src/lib/__tests__/blogTags.test.ts`
- Modify: `src/data/blog-tag-content.ts`
- Modify: `src/data/__tests__/blog-tag-content.test.ts`
- Modify: `src/components/BlogTagNav.astro`
- Modify: `src/components/__tests__/BlogTagNav.test.ts`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/tag/[tag].astro`
- Modify: `vitest.config.ts` only if required to render the Astro component directly in Vitest.

**Interfaces:**
- Produces: deterministic canonical labels selected with a stable English `Intl.Collator` independent of input order.
- Produces: localized `formatTagCount(count)` content for all 12 supported languages.
- Consumes: `BlogTagCountEntry` plus a localized count formatter in `BlogTagNav`.

- [x] **Step 1: Write failing ranking and localization tests**

Use literal permutations containing `['Claude Code', 'AI']` and `['claude-code', 'ai']`; require identical ranked output and canonical labels from both input orders. For every supported language, require non-empty natural count labels at `1` and `2`, with English exactly `1 post` and `2 posts`.

- [x] **Step 2: Write failing rendered disclosure tests**

Render the real Astro component with 10 entries and require no toggle; render it with 11 entries and require one toggle, 10 initially visible links, then dispatch a click and require the 11th link to become visible.

- [x] **Step 3: Run RED**

Run: `npm test -- --run src/lib/__tests__/blogTags.test.ts src/data/__tests__/blog-tag-content.test.ts src/components/__tests__/BlogTagNav.test.ts`

Expected: failures show first-input-wins labels, absent localized count formatters, fused name/count markup, and no behavioral 10/11 boundary coverage.

- [x] **Step 4: Implement deterministic labels and localized count output**

Choose the best canonical label by the same stable comparator whenever a slug repeats, increment each slug only once per post, pass the route language's formatter into `BlogTagNav`, render a visible gap between label and count, and set `aria-label` from localized content.

- [x] **Step 5: Run GREEN**

Run the same focused command and require zero failures.

---

### Task 3: LLM Wiki Modern Restato chrome

**Files:**
- Modify: `src/styles/__tests__/public-pages-contract.test.ts`
- Modify: `src/styles/llm-wiki.css`
- Modify: `src/pages/llm-wiki/index.astro` only if the decorative hero structure must be simplified.
- Modify: `src/components/llm-wiki/PresentationControls.tsx` only if the mini-brand/control markup needs a semantic class adjustment.

**Interfaces:**
- Produces: semantic page surfaces, inherited Apple typography, 6–10px surrounding-chrome radii, and `--on-brand` control text.
- Preserves: graph nodes, source/workbench data structures, terminal/code semantics, interaction state, and scenario data.

- [x] **Step 1: Strengthen the failing page contract**

Require the LLM Wiki stylesheet to contain no serif display stack, decorative gradient, `@keyframes`, animation declaration, white-on-brand control, or circular brand-mark geometry. Require topbar, hero instrument, presentation controls, adoption card, and footer mark to use semantic surfaces and 6–10px radii.

- [x] **Step 2: Run RED**

Run: `npm test -- --run src/styles/__tests__/public-pages-contract.test.ts`

Expected: failures enumerate the current gradients, Georgia typography, orbit/float/pulse motion, circular branding, and white control foregrounds.

- [x] **Step 3: Remediate the stylesheet**

Replace ornamental gradients with flat semantic surfaces/borders, remove decorative animation declarations/keyframes, inherit the Apple system stack for display copy, square circular brand treatments to 6–8px, use `var(--on-brand)` on light/dark brand controls, and retain only visualization geometry that communicates graph/data relationships.

- [x] **Step 4: Run GREEN and focused component tests**

Run: `npm test -- --run src/styles/__tests__/public-pages-contract.test.ts src/components/llm-wiki/__tests__`

Expected: zero failures with existing LLM Wiki behavior intact.

---

### Task 4: Public route matrix and evidence contract

**Files:**
- Modify: `tests/e2e/modern-restato-routes.ts`
- Modify: `tests/modern-restato-evidence-sync.test.ts` only if alias mapping changes.
- Create/modify: `tests/e2e/modern-restato-visual.spec.ts-snapshots/*.png`
- Create/modify: `docs/superpowers/reports/assets/modern-restato/*.png`

**Interfaces:**
- Produces: three new route records for `/`, `/blog/tag/claude-code/`, and `/llm-wiki/`.
- Produces: 22 route states plus expanded blog tags, each with desktop light/dark and mobile dark evidence.

- [x] **Step 1: Add the missing route records and run RED**

Run: `npm test -- --run tests/modern-restato-evidence-sync.test.ts`

Expected: fail closed because the new matrix expects nine missing baselines/evidence images.

- [x] **Step 2: Build and run Axe before blessing screenshots**

Run: `npm run build && npx playwright test tests/e2e/accessibility.spec.ts --project=desktop --project=mobile-390`

Expected: all route/theme checks pass, including `/llm-wiki/` after Task 3.

- [x] **Step 3: Regenerate baseline/evidence images atomically**

Run: `npx playwright test tests/e2e/modern-restato-visual.spec.ts --project=desktop --project=mobile-390 --update-snapshots=all`

Expected: generated baseline PNGs and documentation PNGs are byte-identical by construction.

- [x] **Step 4: Run normal visual GREEN and SHA contract**

Run: `npx playwright test tests/e2e/modern-restato-visual.spec.ts --project=desktop --project=mobile-390 && npm test -- --run tests/modern-restato-evidence-sync.test.ts`

Expected: visual tolerance remains `0.001`; all route tests and all SHA pairs pass.

---

### Task 5: Brand geometry and raster provenance

**Files:**
- Modify: `src/components/__tests__/BrandMark.test.ts`
- Create: `public/brand-icons.provenance.json`

**Interfaces:**
- Consumes: `src/components/BrandMark.astro`, `public/favicon.svg`, and the three tracked PNGs.
- Produces: exact ordered geometry, source SHA-256, output SHA-256, and IHDR dimension contracts using only Node built-ins.

- [x] **Step 1: Write and run the failing provenance test**

Run: `npm test -- --run src/components/__tests__/BrandMark.test.ts`

Expected: fail because no provenance manifest exists and the existing test does not compare exact rect/path order or raster headers.

- [x] **Step 2: Record verified provenance**

Add a committed manifest naming `public/favicon.svg` as the canonical source, the native-size `sips` export method, source geometry SHA-256, and each raster's exact dimensions and SHA-256.

- [x] **Step 3: Run GREEN**

Run the same focused command and require exact geometry equality and all three provenance entries to pass.

---

### Task 6: Final verification, reporting, and commits

**Files:**
- Modify: `docs/superpowers/reports/2026-08-01-modern-restato-verification.md`
- Create: `.superpowers/sdd/2026-08-01-modern-restato-redesign/final-fix-report.md`

**Interfaces:**
- Produces: exact current counts, commit references, RED/GREEN evidence, snapshot/evidence totals, self-review, and concerns.

- [x] **Step 1: Run the eight fresh gates**

Run in order:

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

- [x] **Step 2: Run evidence, banned-remnant, and protection audits**

Run:

```bash
npm test -- --run tests/modern-restato-evidence-sync.test.ts
rg -n "Forest Café|Forest Cafe|f4efe5|fffaf0|ebe4d7|935832|cf936a|🚀" src public tests tailwind.config.mjs
git diff -- .superpowers/sdd/rollout-task-1-report.md
git status --short
```

Expected: exact evidence SHA identity, no banned matches, and the protected report diff is unchanged from the starting worktree.

- [x] **Step 3: Update reports with exact observed output**

Record no unrun or inferred result. Include all focused RED/GREEN commands, eight gate counts, image totals, tolerance, SHA pairs, files, commits, self-review, and any concern.

- [x] **Step 4: Commit logical groups**

Commit implementation/tests first, regenerated visual evidence second, and final reports last. Explicitly exclude `.superpowers/sdd/rollout-task-1-report.md` from every staging command.

## Self-review

- Spec coverage: all six Important findings and the Minor provenance finding map to Tasks 1–5; Task 6 covers all eight required gates and reporting.
- Placeholder scan: no deferred implementation or unspecified test step remains.
- Type consistency: localized count formatting flows from `BlogTagContent` to `BlogTagNav`; route records continue to satisfy `ModernRestatoRoute`; provenance uses Node `Buffer`/`crypto` only.
- Boundary check: no dependency, deployment, canonical URL, mask, tolerance, SHA, or protected-file change is authorized.
