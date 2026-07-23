# Merge Review Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct locale routing and language locking, remove legacy low-contrast interactive colors, and make image/D-Day item actions natively keyboard accessible without changing published content or visual baselines unnecessarily.

**Architecture:** `src/i18n/urlUtils.ts` remains the single source for localized-route families and supplies serialized runtime routing data to `Header.astro`. Locked language is resolved once by the Astro layouts and passed to client scripts; unlocked root and 404 routes continue to follow storage and `languageChange`. Shared Forest Café button/surface classes replace one-off state colors, while item selection and deletion use separate native buttons.

**Tech Stack:** Astro 5, React 19, Tailwind/Forest Café semantic classes, Vitest, Testing Library, Playwright.

## Global Constraints

- Never edit or stage `.superpowers/sdd/rollout-task-1-report.md`.
- Do not push, deploy, alter ads, or update visual baselines unless a visible change explicitly requires a reviewed update and SHA synchronization.
- Preserve localized URL, SEO, and browser-local privacy contracts.
- Verify desktop and `mobile-390`; verify stateful keyboard behavior in both Playwright projects.

---

### Task 1: Shared header locale routing

**Files:**
- Modify: `src/i18n/urlUtils.ts`
- Modify: `src/components/Header.astro`
- Modify: `tests/e2e/localization-contract.spec.ts`
- Test: `src/i18n/__tests__/urlUtils.test.ts`

**Interfaces:**
- Produces: exported localized route families/runtime data used by both `supportsLanguageRouting()` and `Header.astro`.
- Preserves: `buildLanguageUrl(pathname, lang)` including English fallback for unsupported game locales.

- [ ] **Step 1: Add failing unit/browser cases**

Assert `/about`, `/contact`, `/privacy`, `/terms`, and `/disclaimer` route through every supported locale, then select French through desktop and mobile header controls and assert URL, `<html lang>`, and H1 agree.

- [ ] **Step 2: Verify RED**

Run `npm test -- --run src/i18n/__tests__/urlUtils.test.ts` and `npx playwright test tests/e2e/localization-contract.spec.ts --project=desktop --project=mobile-390 --reporter=line`; expect the stale header runtime allowlist cases to fail.

- [ ] **Step 3: Implement one shared routing source**

Export the localized route families/runtime configuration from `urlUtils.ts`, derive `supportsLanguageRouting()` from it, serialize that exact configuration through Astro `define:vars`, and remove the header’s independent `langSupportedPaths`.

- [ ] **Step 4: Verify GREEN**

Re-run both focused commands and expect zero failures.

### Task 2: Locked English project pages and layout state

**Files:**
- Modify: `src/pages/projects/quick-issue.astro`
- Modify: `src/pages/projects/pastedock.astro`
- Modify: `src/pages/projects/pastedock/pricing.astro`
- Modify: `src/pages/projects/pastedock/privacy.astro`
- Modify: `src/pages/projects/pastedock/refund.astro`
- Modify: `src/pages/projects/pastedock/terms.astro`
- Modify: `src/layouts/MainLayout.astro`
- Modify: `tests/e2e/forest-cafe-routes.ts`
- Modify: `tests/e2e/localization-contract.spec.ts`

**Interfaces:**
- Consumes: `MainLayout lang="en" lockLanguage={true}`.
- Produces: stable English HTML language, skip link, and OG locale regardless of stored locale or synthetic locale events.

- [ ] **Step 1: Add failing lock tests**

For all six English routes, seed Korean storage, navigate, assert `lang="en"`, English skip link, `og:locale=en_US`, then dispatch French and assert all remain English. Add the same event-resistance assertion to a locked Korean article and retain live root/404 synchronization.

- [ ] **Step 2: Verify RED**

Run the focused localization Playwright matrix; expect current project pages and MainLayout skip-link initialization/listener behavior to fail.

- [ ] **Step 3: Lock the pages and gate client synchronization**

Pass `lang="en" lockLanguage={true}` from all six pages, change Quick Issue’s route-matrix locale to `en`, and serialize resolved language/lock state into MainLayout so locked pages ignore storage/events while unlocked pages continue syncing.

- [ ] **Step 4: Verify GREEN**

Re-run the focused localization matrix in both projects.

### Task 3: Semantic interactive colors

**Files:**
- Modify: `src/components/tools/TimerStopwatch.tsx`
- Modify: `src/components/games/roulette/EventRoulette.tsx`
- Modify: `src/components/games/BingoGame.tsx`
- Modify: `src/components/games/LadderGame.tsx`
- Modify: `src/components/tools/AppStoreScreenshotResizer.tsx`
- Create: `tests/interactive-color-contract.test.ts`
- Create: `tests/e2e/interactive-contrast.spec.ts`

**Interfaces:**
- Produces: state controls/statuses using `fc-button-*`, semantic surfaces, or explicit AA-safe foreground/background pairs.

- [ ] **Step 1: Add failing static and computed contrast tests**

Reject the listed legacy green/yellow/blue/red plus white interactive combinations. In Playwright, exercise timer running/paused/lap, roulette winner history, bingo marked state, ladder invalid/result state, and screenshot processed/disabled state in light/dark themes; compute contrast and require at least 4.5:1 for normal text.

- [ ] **Step 2: Verify RED**

Run the focused Vitest and Playwright files; expect legacy classes and at least one computed contrast state to fail.

- [ ] **Step 3: Replace only unsafe state styling**

Use `fc-button-primary`, `fc-button-secondary`, `fc-button-quiet`, `fc-surface-soft`, and semantic text/border tokens; preserve game/tool behavior and state meaning.

- [ ] **Step 4: Verify GREEN**

Re-run focused static and computed checks in both themes/projects.

### Task 4: Native keyboard item actions

**Files:**
- Modify: `src/components/tools/AppStoreScreenshotResizer.tsx`
- Modify: `src/components/tools/DdayCalculator.tsx`
- Modify: `src/components/tools/__tests__/AppStoreScreenshotResizer.test.tsx`
- Modify: `src/components/tools/__tests__/DdayCalculator.test.tsx`
- Create: `tests/e2e/tool-item-keyboard.spec.ts`

**Interfaces:**
- Produces: separate native select/load and remove/delete buttons with localized accessible names and no nested interactive elements.

- [ ] **Step 1: Add failing DOM and keyboard tests**

Assert thumbnails expose separate select/remove buttons, saved D-Days expose separate load/delete buttons, and Tab plus Enter/Space deterministically performs each action without triggering its sibling.

- [ ] **Step 2: Verify RED**

Run the two component test files and new Playwright file; expect non-button clickable containers and nested buttons to fail.

- [ ] **Step 3: Implement native controls**

Render sibling buttons around non-interactive preview/content, give each action a stable accessible name, and keep selection/loading/removal state transitions unchanged.

- [ ] **Step 4: Verify GREEN**

Re-run focused component and stateful browser checks in both projects.

### Task 5: Documentation hygiene and final verification

**Files:**
- Modify: non-license Markdown files containing trailing spaces
- Do not modify: `public/fonts/OFL.txt`
- Do not modify/stage: `.superpowers/sdd/rollout-task-1-report.md`

- [ ] **Step 1: Remove only Markdown trailing spaces**

Use a bounded Markdown scan excluding license text and remove reported trailing whitespace without rewriting prose.

- [ ] **Step 2: Run full gates**

Run exact full Vitest, Astro check, build, site validation, content audit, bundle checks, full accessibility, combined 68 visual cases, separate existing/stateful cases in both projects, and manual route checks. Clean generated outputs/previews afterward.

- [ ] **Step 3: Protect baselines and report**

Confirm the 54 baseline/evidence SHA pairs are unchanged unless an explicit reviewed visual update was required. Confirm the only pre-existing dirty protected file remains `.superpowers/sdd/rollout-task-1-report.md`.

- [ ] **Step 4: Commit bounded changes**

Stage explicit remediation paths only, verify the protected report is absent from the index, and commit with a merge-review remediation message.
