# Forest Café Review Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the screenshot evidence-only harness with a fail-closed visual regression oracle, make hydration/error/focus coverage deterministic, and select blog-tag language from matching article metadata.

**Architecture:** Keep stable documentation screenshots as human-readable evidence, while comparing the same screenshot buffers to Playwright-managed committed snapshots. Resolve tag language in a pure data helper using explicit article metadata first and deterministic metadata-language inference second, then validate the built route in Playwright. Stabilize client islands in the test harness through storage/clock state rather than production-only switches.

**Tech Stack:** Astro 5, TypeScript, React 19, Vitest 4, Playwright 1.61, Axe 4.12.

## Global Constraints

- Do not touch or stage `.superpowers/sdd/rollout-task-1-report.md`.
- Do not deploy, push, enable AdSense, or change ad environment variables.
- Use RED → GREEN for every behavioral fix.
- Preserve 1,269 built pages and existing route slugs.
- Run the exact full verification ladder after focused checks.

---

### Task 1: Durable scope approval and article-derived tag language

**Files:**
- Modify: `.superpowers/sdd/task-9-brief.md`
- Modify: `src/content/config.ts`
- Modify: `src/data/blog-tag-content.ts`
- Modify: `src/data/__tests__/blog-tag-content.test.ts`
- Modify: `src/pages/blog/tag/[tag].astro`
- Modify: `tests/e2e/catalog.spec.ts`

**Interfaces:**
- Produces: `selectBlogTagLanguage(tag, posts)` returning a supported `Language`.
- Consumes: matching content entries with `data.lang?`, `data.title`, `data.description`, and `data.date`.

- [x] **Step 1: Write failing policy tests**

Add cases proving explicit `lang` reaches every Latin locale and `zh-TW`, metadata inference distinguishes Korean/Japanese/Simplified Chinese, `/jekyll/` resolves Korean from its matching article, and mixed-language ties resolve by newest article then stable language order.

- [x] **Step 2: Verify RED**

Run:

```sh
npx vitest run src/data/__tests__/blog-tag-content.test.ts
```

Expected: FAIL because `selectBlogTagLanguage` does not exist.

- [x] **Step 3: Implement the minimal policy**

Add optional supported `lang` metadata to the blog schema. Count the resolved language of matching posts; choose the plurality, then the newest matching post’s language, then supported-language order. Use tag-script inference only when there are no matching posts. Pass the result and `lockLanguage={true}` to `MainLayout`.

- [x] **Step 4: Add built-route integration coverage**

Add a Playwright assertion for `/blog/tag/jekyll/` that checks `html[lang="ko"]`, Korean discovery copy/meta, and the locked absence of language selectors.

- [x] **Step 5: Verify GREEN**

Run the focused Vitest command, then build and run the catalog integration test for both projects.

### Task 2: Real visual snapshot oracle and precise masking

**Files:**
- Modify: `tests/e2e/forest-cafe-routes.ts`
- Modify: `tests/e2e/forest-cafe-visual.spec.ts`
- Create: `tests/e2e/forest-cafe-visual.spec.ts-snapshots/*.png`
- Regenerate: `docs/superpowers/reports/assets/forest-cafe/*.png`

**Interfaces:**
- Produces: one committed Playwright baseline for each of the 36 evidence variants.
- Consumes: the exact masked screenshot buffer also written to documentation evidence.

- [x] **Step 1: Write the failing oracle**

Compare every evidence screenshot buffer with `expect(buffer).toMatchSnapshot(...)` using a small documented pixel tolerance. Keep the 36 documentation screenshots.

- [x] **Step 2: Verify RED**

Run the exact visual command without snapshot updates.

Expected: FAIL because committed Playwright baselines are missing.

- [x] **Step 3: Stabilize route state and narrow masks**

Seed deterministic seven-day dashboard history and mocked Frankfurter data. Replace whole dashboard/chat masks with selectors limited to dynamic timestamps/status/log content, leaving surfaces, controls, and layout visible. Set the bookmark-dismissed session key before navigation.

- [x] **Step 4: Generate baselines**

Run the visual command once with `--update-snapshots`, inspect all generated variants, then rerun the normal exact command and require a clean pass.

### Task 3: Hydrated prompt, fail-closed browser errors, WCAG 2.2, and two-theme focus

**Files:**
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/forest-cafe-visual.spec.ts`

**Interfaces:**
- Consumes: `assertNoUnexpectedConsoleErrors(page)` as both collector installer and final assertion.
- Produces: deterministic bookmark-prompt visibility through Playwright clock.

- [x] **Step 1: Write failing assertions**

Add WCAG 2.2 tags, install collectors before every navigation in interaction/visual/theme tests, assert after each state, and require focus visibility in light and dark. Add a dedicated prompt test that installs the clock, hydrates `client:idle`, advances five seconds, runs Axe, focuses/dismisses the prompt, and verifies session persistence.

- [x] **Step 2: Verify RED**

Run the focused accessibility and visual commands. Expected failures are the previously absent light-focus and prompt-state contracts.

- [x] **Step 3: Implement deterministic harness state**

Use session storage for matrix suppression and Playwright clock for the dedicated visible state. Do not add five-second sleeps.

- [x] **Step 4: Verify GREEN**

Run exact accessibility and visual commands for desktop and mobile-390.

### Task 4: Report, full gates, and bounded commits

**Files:**
- Modify: `docs/superpowers/reports/2026-07-23-forest-cafe-verification.md`

- [x] **Step 1: Update evidence claims**

Record snapshot baseline counts/tolerance, precise masks, prompt state, WCAG 2.2, light/dark focus, route-integration policy, and updated test counts.

- [x] **Step 2: Run the exact ladder**

```sh
npm test -- --run
npm run check
npm run build
node scripts/validate-site.mjs dist
node scripts/audit-content.mjs dist
node scripts/check-bundles.mjs dist
npm run test:a11y
npx playwright test tests/e2e/catalog.spec.ts tests/e2e/forest-cafe-visual.spec.ts --project=desktop --project=mobile-390
```

- [x] **Step 3: Verify repository scope**

Run `git diff --check`, confirm the protected rollout report is neither staged nor altered by this work, and remove ephemeral Playwright output.

- [x] **Step 4: Commit bounded changes**

Commit the locale policy separately from the browser-oracle/report remediation and return both SHAs with exact pass counts.

## Self-review

- All eight review directives map to an explicit task.
- The oracle covers all 36 evidence variants, not merely file existence.
- Masks are narrowed before baseline generation.
- Prompt timing uses the browser clock, not sleeps.
- Locale tests cover factories, policy, and built-route behavior.
- The protected rollout report is excluded from every stage command.
