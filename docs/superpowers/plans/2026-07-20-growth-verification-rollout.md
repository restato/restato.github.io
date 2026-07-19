# Growth Verification and Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add repeatable browser, accessibility, privacy, SEO, performance, and rollout gates for the complete tool platform.

**Architecture:** Playwright covers generated-site behavior, axe covers automated accessibility, Lighthouse CI guards representative route budgets, and a release script assembles evidence without deploying automatically.

**Tech Stack:** Playwright, axe-core, Lighthouse CI, Astro preview, GitHub Actions.

## Global Constraints

- Desktop and 390×844 mobile flows are required.
- Lighthouse minimums are 90 for Performance, Accessibility, Best Practices, and SEO.
- Core Web Vitals targets are LCP ≤2.5 s, INP ≤200 ms, and CLS ≤0.1 at the 75th percentile when field data exists.
- Verification does not publish, enable ads, or resubmit AdSense.
- Fail closed on broken links, console errors, content uploads, or incomplete localized index pages.

---

### Task 1: Browser test harness

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/fixtures.ts`
- Create: `tests/e2e/catalog.spec.ts`
- Modify: `package.json`

**Interfaces:**
- `assertNoHorizontalOverflow(page)`
- `assertNoUnexpectedConsoleErrors(page)`
- `assertNoContentUpload(page, secrets: string[])`

- [ ] Write a failing catalog test for direct localized links and mobile overflow.
- [ ] Install Playwright, configure `npm run build && npm run preview -- --host 127.0.0.1`, and add desktop/mobile projects.
- [ ] Implement bounded request and console collectors; ignore only documented browser-extension noise.
- [ ] Add `test:e2e` script and run catalog tests to PASS.
- [ ] Commit with `test: add tool browser verification`.

### Task 2: Accessibility gates

**Files:**
- Create: `tests/e2e/accessibility.spec.ts`
- Modify: `package.json`

- [ ] Add failing checks for hub, representative text, developer, PDF, and image routes in light/dark modes.
- [ ] Install `@axe-core/playwright` and fail on serious or critical violations.
- [ ] Add manual keyboard assertions for navigation, dialogs, file inputs, result announcements, and download buttons.
- [ ] Fix violations through test-first feature commits, rerun to zero serious/critical findings, and commit with `test: enforce tool accessibility`.

### Task 3: Lighthouse and bundle budgets

**Files:**
- Create: `lighthouserc.cjs`
- Create: `scripts/check-bundles.mjs`
- Modify: `package.json`

**Interfaces:**
- Hub JS budget: 180 KB gzip.
- Text tool JS budget: 220 KB gzip.
- Developer tool JS budget: 400 KB gzip.
- Image tool JS budget: 550 KB gzip.
- PDF tool JS budget: 900 KB gzip, lazy route only.

- [ ] Add a failing bundle fixture proving a heavy PDF chunk on the hub is rejected.
- [ ] Implement manifest-based route/chunk checks.
- [ ] Configure Lighthouse assertions at 0.90 for all four categories and CLS at 0.1.
- [ ] Add `lighthouse` and `check:bundles` scripts, optimize until all representative routes pass, and commit with `perf: enforce route budgets`.

### Task 4: Search and localization matrix

**Files:**
- Create: `tests/e2e/seo-locales.spec.ts`
- Create: `docs/quality/localization-release-matrix.md`

- [ ] Enumerate every released tool and 12 languages from the registry rather than hard-coding routes.
- [ ] Assert one H1, unique title/description, self-canonical, correct robots, reciprocal completed hreflang, English x-default, crawlable direct internal links, and sitemap membership matching indexability.
- [ ] Record each locale as `complete/indexable` or `fallback/noindex`; no third state is allowed.
- [ ] Run the full matrix and commit with `test(seo): verify localized publication state`.

### Task 5: CI and release evidence

**Files:**
- Create: `.github/workflows/tool-platform-ci.yml`
- Create: `scripts/release-report.mjs`
- Create: `docs/quality/adsense-readiness-checklist.md`
- Modify: `package.json`

- [ ] Add CI jobs for unit/component tests, Astro check/build/site validation, browser matrix, accessibility, bundles, and Lighthouse.
- [ ] Cache npm and Playwright browsers without caching generated test results.
- [ ] Generate a Markdown report containing commit SHA, test counts, build result, route counts by locale, link/SEO errors, accessibility violations, Lighthouse scores, bundle sizes, and privacy test result.
- [ ] Add exact AdSense checklist items: working navigation, unique value, trust pages, contact route, privacy disclosure, no broken pages, no deceptive downloads, ads disabled, and reviewed indexation audit.
- [ ] Run `npm run release:report`; verify it makes no network write and performs no deployment.
- [ ] Commit with `ci: add growth platform release gates`.

### Task 6: Staged rollout

**Files:**
- Modify: `docs/quality/adsense-readiness-checklist.md`
- Create: `docs/quality/rollout-log.md`

- [ ] Merge and deploy quality foundation first; record Search Console coverage and runtime errors for seven days.
- [ ] Deploy localization/trust pages; submit updated sitemap and record indexed/valid counts without forcing indexation of fallback pages.
- [ ] Deploy one tool cluster at a time in this order: text, developer/data, image, PDF.
- [ ] After each deployment, rerun production smoke checks and record actual regressions before continuing.
- [ ] Reapply to AdSense only after every checklist item has evidence and at least one stable observation window has passed.
- [ ] Do not enable ad rendering until approval and a valid slot configuration are available.
