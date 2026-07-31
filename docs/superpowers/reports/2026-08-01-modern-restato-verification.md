# Modern Restato Verification

Verified on 2026-08-01 against implementation commit `93290e3` and evidence commit `c585403`.

## Automated gates

- `npm test -- --run`: PASS — 101 test files and 1,018 tests.
- `npm run check`: PASS — 411 files, 0 errors, 0 warnings, and 81 existing hints.
- `npm run build`: PASS — 1,250 static pages, 55 blog-tag redirects, and four sitemaps containing 948 URLs.
- `npm run validate:site`: PASS — 1,305 HTML pages.
- `npm run audit:content`: PASS — 1,199 indexable pages.
- `node scripts/check-bundles.mjs dist`: PASS — all four budgets remained below their limits (`165.9/180`, `201.6/220`, `201.6/400`, and `201.6/550` KB gzip).
- `npx playwright test tests/e2e/accessibility.spec.ts --project=desktop --project=mobile-390`: PASS — 54 tests. The 22-route matrix ran unsuppressed Axe checks in both themes and both browser projects, alongside contrast and keyboard interaction checks.
- `npx playwright test tests/e2e/modern-restato-visual.spec.ts --project=desktop --project=mobile-390`: PASS — 50 tests at `maxDiffPixelRatio: 0.001`.
- `npx vitest run tests/modern-restato-evidence-sync.test.ts`: PASS — all 69 canonical baseline PNGs match their documentation evidence by SHA-256. The documentation directory contains those 69 pairs plus five named aliases, for 74 PNGs total.
- `rg -n "Forest Café|Forest Cafe|f4efe5|fffaf0|ebe4d7|935832|cf936a|🚀" src public tests tailwind.config.mjs`: PASS — no matches.

## Review checks

- Route coverage: PASS — 22 representative public routes cover all 15 required families, including `/`, `/blog/tag/claude-code/`, and `/llm-wiki/`.
- Brand mark: PASS — `BrandMark.astro` and `favicon.svg` have exact ordered geometry parity. The provenance manifest verifies 180, 192, and 512px PNG dimensions and hashes.
- Semantic themes: PASS — light uses `#F7F8F7` on `#19553C`; dark uses `#111713` on `#70A889`. Browser-computed normal-text contrast meets WCAG AA for the home project feature and selected tag.
- Blog tags: PASS — canonical labels are deterministic across case-variant input order, count labels are localized for all 12 supported languages, and the real Astro component exposes no toggle at 10 tags but reveals tag 11 after a click.
- LLM Wiki: PASS — page chrome uses semantic flat surfaces, Apple/system typography, and 6–10px geometry without decorative gradients, keyframes, direct animation declarations, serif display stacks, or circular branding.
- Responsive evidence: PASS — automated desktop/mobile visual contracts cover overflow and interaction behavior; the dedicated Jobworld Kids regression also passes at 320px.
- Worktree protection: PASS — `.superpowers/sdd/rollout-task-1-report.md` remains the sole unrelated modification and was never edited, staged, or committed by this fix wave.

## Brand provenance

- Approved source geometry SHA-256: `25d91434d623eb22fd80b7abbd5aa7707018e6abffb30e0cbb41efdc867f24d9`.
- `public/apple-touch-icon.png`: `c77a1200da0d223c142c708212c891809da9192d149a53c24fbc7ad162592733`.
- `public/icon-192x192.png`: `080742058d3f14649e7108f4974e14556d9ecc41437b5d87e382acd79baf2e96`.
- `public/icon-512x512.png`: `9f0dcb20b9e70082a040863dda7c83c36659d6d88c56c5f43ca548adc45bb56d`.

## Evidence examples

- [Root home, desktop light](assets/modern-restato/home-root-desktop-light.png) — 1440×1000.
- [Selected blog tag, desktop dark](assets/modern-restato/blog-tag-selected-desktop-dark.png) — 1440×1000.
- [LLM Wiki, desktop light](assets/modern-restato/llm-wiki-desktop-light.png) — 1440×1000.
- [LLM Wiki, mobile dark](assets/modern-restato/llm-wiki-mobile-390-dark.png) — 390×844.
- [Blog tags, expanded](assets/modern-restato/blog-tags-expanded.png) — full-page evidence alias.

## Non-blocking concerns

- `astro check` still reports 81 pre-existing hints, while its final result is 0 errors and 0 warnings.
- The toolchain emits a stale `caniuse-lite` notice; it did not affect the successful build, browser tests, or bundle budgets.
- No dependency was added or updated, and no deployment or publication was performed.
