# Modern Restato Final Fix Report

Date: 2026-08-01

Branch: `growth/tool-platform`

Status: PASS

## Outcome

All six Important final-review findings and the Minor brand-provenance finding are resolved. The final source and evidence state passes the complete eight-gate sequence without Axe suppression, dependency changes, route changes, deployment, or publication.

The protected user-owned file `.superpowers/sdd/rollout-task-1-report.md` remained the sole unrelated worktree modification and was never edited, staged, or committed by this fix wave.

## Finding resolution

### 1. On-brand normal-text contrast

- Added the semantic `--on-brand` token: `#F7F8F7` for the light brand background and `#111713` for the dark brand background.
- Applied it to shared primary buttons, the root-home project feature, and selected blog-tag chips.
- Removed opacity from normal-sized project copy so the rendered foreground is not weakened by compositing.
- Added browser-computed contrast checks for both reviewed components in both themes.

### 2. Localized tag-count presentation

- Added visible spacing between each tag label and count.
- Replaced the English-only count accessibility label with `formatTagCount(count)` content in all 12 supported languages.
- Covered singular/plural English output exactly as `1 post` and `2 posts`.

### 3. Deterministic canonical tag labels

- Replaced first-input-wins casing with stable canonical-label selection.
- Canonical output is now independent of case-variant input order, with a stable `Intl.Collator` and code-point tie break.
- Preserved canonical and legacy URL generation, redirects, and per-post de-duplication.

### 4. Real 10/11 disclosure behavior

- Extracted an idempotent disclosure initializer used by the production Astro component.
- Rendered the real `.astro` component in Vitest through Astro's container integration.
- Verified that 10 tags render without a toggle and that an actual click reveals tag 11 while updating `aria-expanded` and `hidden`.
- Switched Vitest configuration to Astro's Vite configuration so `.astro` imports are tested directly; no dependency was added.

### 5. LLM Wiki Modern Restato conformance

- Replaced ornamental gradients with flat semantic surfaces and borders.
- Removed decorative keyframes and direct animation declarations.
- Replaced serif display typography with the inherited Apple/system stack.
- Brought surrounding chrome to 6–10px radii and removed circular branding treatments.
- Retained graph, workbench, terminal, and other geometry that communicates data relationships.
- Retokenized muted/accent text discovered by unsuppressed Axe so both themes meet contrast requirements.

### 6. Public-route and visual evidence coverage

- Added `/`, `/blog/tag/claude-code/`, and `/llm-wiki/` to the shared route matrix.
- Expanded the required family set to include `blog-tag` and `llm-wiki`.
- The matrix now contains 22 representative routes across 15 required families.
- Regenerated the complete baseline/evidence set and reran the normal comparison at the unchanged `0.001` tolerance.

### Minor. Exact brand geometry and raster provenance

- Added exact ordered geometry parity checks between `BrandMark.astro` and `public/favicon.svg`.
- Added PNG signature, IHDR dimension, and SHA-256 checks for the 180, 192, and 512px raster exports.
- Added `public/brand-icons.provenance.json`, recording the canonical source, source-geometry hash, native-size export method, dimensions, and output hashes.

## Focused RED/GREEN evidence

The reviewed behavior was reproduced before implementation:

- On-brand contracts: 2 design-token failures and 1 browser contrast failure.
- Tag ranking/localization: 15 focused failures across deterministic labels and missing localized count formatters.
- Disclosure boundary: 1 real rendered click-behavior failure.
- LLM Wiki contract: 1 failure beginning with decorative gradient usage.
- Evidence sync: failed closed because the matrix required 69 baseline images but only 60 existed.
- Brand provenance: failed because the manifest did not exist.

Focused GREEN results after implementation:

- Six relevant Vitest files: 66/66 tests passed.
- On-brand browser check: passed in light and dark themes.
- LLM Wiki focused Axe check: passed in light and dark themes after semantic retokenization.
- Brand geometry, dimensions, and hashes: passed exactly.
- Snapshot update run: 50/50 tests passed.
- Normal no-update visual run: 50/50 tests passed.
- Evidence SHA sync: 1/1 passed.

## Unsuppressed regression discoveries

The first full Axe run after the reviewed fixes passed 52/54 tests and exposed the same ImageResizer contrast defect on desktop and mobile. Its quick-scale buttons combined primary selection styling with explicit white/card colors. The repair moved the group onto the shared selection contract, added meaningful dimension-based `aria-pressed` state, and removed the conflicting explicit color classes. The focused interaction check then passed 2/2 and the full Axe gate passed 54/54. No Axe rule was disabled or suppressed.

The first full unit run after that late source repair passed 1,017/1,018 tests and exposed a test-only race: a canvas call could occur before React rendered the download-ready preview. The upload helper now waits for the actual `Resized` image. The focused file then passed 12/12 and the restarted full unit gate passed 1,018/1,018.

## Final eight gates

All gates were restarted from the final source state and run in this order:

| # | Command | Result |
|---|---|---|
| 1 | `npm test -- --run` | PASS — 101 files, 1,018 tests |
| 2 | `npm run check` | PASS — 411 files, 0 errors, 0 warnings, 81 existing hints |
| 3 | `npm run build` | PASS — 1,250 pages, 55 tag redirects, four sitemaps with 948 URLs |
| 4 | `npm run validate:site` | PASS — 1,305 HTML pages |
| 5 | `npm run audit:content` | PASS — 1,199 indexable pages |
| 6 | `node scripts/check-bundles.mjs dist` | PASS — `165.9/180`, `201.6/220`, `201.6/400`, `201.6/550` KB gzip |
| 7 | `npx playwright test tests/e2e/accessibility.spec.ts --project=desktop --project=mobile-390` | PASS — 54/54 |
| 8 | `npx playwright test tests/e2e/modern-restato-visual.spec.ts --project=desktop --project=mobile-390` | PASS — 50/50 at `0.001` |

The 22 route tests in the Axe suite each exercise both themes in both desktop and mobile projects, yielding 88 route/theme scans. Ten additional Playwright cases cover contrast, Shiki comments, keyboard disclosure navigation, keyboard file selection/results/download, and the hydrated bookmark prompt.

## Evidence integrity

- Canonical Playwright baselines: 69 PNGs.
- Documentation evidence: 74 PNGs — the 69 byte-identical pairs plus five named aliases.
- Evidence sync: all 69 canonical pairs have exact SHA-256 equality.
- Visual states: 22 route states plus expanded blog tags, each represented by desktop light, desktop dark, and mobile dark evidence.
- Visual masks, focus checks, overflow checks, RTL checks, and theme-persistence checks remain enabled.
- `maxDiffPixelRatio` remains exactly `0.001`.

## Brand hashes

- Source geometry: `25d91434d623eb22fd80b7abbd5aa7707018e6abffb30e0cbb41efdc867f24d9`.
- Apple touch icon, 180px: `c77a1200da0d223c142c708212c891809da9192d149a53c24fbc7ad162592733`.
- PWA icon, 192px: `080742058d3f14649e7108f4974e14556d9ecc41437b5d87e382acd79baf2e96`.
- PWA icon, 512px: `9f0dcb20b9e70082a040863dda7c83c36659d6d88c56c5f43ca548adc45bb56d`.

## Additional audits

- Evidence SHA test: PASS, 1/1.
- Banned-remnant scan for the legacy Forest Café name, palette literals, and rocket glyph: PASS, no matches.
- `git diff --check`: PASS.
- Screenshot counts: PASS, 69 baseline PNGs and 74 documentation PNGs.
- Protected-file staging audit: PASS, no staged entry for `.superpowers/sdd/rollout-task-1-report.md` in any commit.

## Commits

- `93290e39b9cf4594c580072e0db6fcf7193828b0` — `fix: resolve Modern Restato final review` (implementation and tests).
- `c5854030ffb6acc0587c126ca4a9bfb384359c09` — `test: expand Modern Restato evidence matrix` (regenerated baselines and evidence).
- The report-only commit is the commit containing this document and `docs/superpowers/reports/2026-08-01-modern-restato-verification.md`.

## Self-review

- Scope: every Important finding and the Minor provenance finding has an implementation and a focused regression test.
- Compatibility: production URLs, legacy redirects, SEO output, localization paths, and existing tool behavior remain intact; the full build and existing test suite pass.
- Accessibility: no Axe suppression was introduced; the late browser-reported defect was fixed at the semantic component boundary.
- Visual integrity: all new and changed evidence was blessed once, then independently checked in a normal no-update run and SHA audit.
- Worktree safety: the user-owned rollout report was explicitly excluded from every staging command.

## Remaining concerns

- `astro check` has 81 pre-existing non-blocking hints while reporting 0 errors and 0 warnings.
- Browserslist reports stale `caniuse-lite` data. Updating it would change dependencies and was intentionally outside this task.
- No deployment or publication was performed.
