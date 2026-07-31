# Modern Restato Verification

Verified on 2026-08-01 against commit `a789d08`.

## Automated gates

- `npm test -- --run`: PASS — 101 test files and 1,011 tests.
- `npm run check`: PASS — 0 errors, 0 warnings, and 81 existing hints.
- `npm run build`: PASS — 1,250 static pages; tag redirects and four sitemaps generated.
- `npm run validate:site`: PASS — 1,305 HTML pages.
- `npm run audit:content`: PASS — 1,199 indexable pages.
- `node scripts/check-bundles.mjs dist`: PASS — all four budgets remained below their limits (`165.9/180`, `201.6/220`, `201.6/400`, and `201.6/550` KB gzip).
- `npx playwright test tests/e2e/accessibility.spec.ts --project=desktop --project=mobile-390`: PASS — 46 tests. The unsuppressed Shiki comment check passes WCAG AA in both themes with `#A7B0A8` on `#24292e` (6.58:1).
- `npx playwright test tests/e2e/modern-restato-visual.spec.ts --project=desktop --project=mobile-390`: PASS — 44 tests across the desktop and mobile projects.
- `rg -n "Forest Café|Forest Cafe|f4efe5|fffaf0|ebe4d7|935832|cf936a|🚀" src public tests tailwind.config.mjs`: PASS — no matches.
- Modern Restato evidence synchronization: PASS — SHA-256 equality covers the complete 60-image theme/viewport matrix and the five named aliases.

## Manual checks

- Brand mark: PASS — the R-and-leaf mark was rendered and inspected at 16, 32, 180, 192, and 512px; all sizes remain legible.
- Semantic themes: PASS — light uses `#F7F8F7` / `#15241D`; dark uses `#111713` / `#F0F4F1`, with the approved theme-specific focus colors.
- Blog tags: PASS — counts are non-increasing, exactly 10 of 251 canonical unique links show initially, all 251 show after expansion, collapse returns to 10, and the disclosure has a visible solid 2px keyboard outline.
- Responsive layout: PASS — all 19 representative routes have no horizontal overflow at 320, 375, 768, 1024, or 1440px (95 route/width checks). The 320px Jobworld Kids regression is also covered in Playwright.
- Worktree protection: PASS — `.superpowers/sdd/rollout-task-1-report.md` remained the only unrelated modification and was neither edited by this task nor staged.

## Evidence

- [Home, desktop light](assets/modern-restato/home-light.png) — 1440×1000.
- [Home, desktop dark](assets/modern-restato/home-dark.png) — 1440×1000.
- [Blog tags, collapsed](assets/modern-restato/blog-tags-collapsed.png) — 1440×1000.
- [Blog tags, expanded](assets/modern-restato/blog-tags-expanded.png) — 1440×16555, full page.
- [Text tool, mobile dark](assets/modern-restato/tool-mobile-dark.png) — 390×844.

## Exceptions and follow-up

- `astro check` still reports 81 non-blocking existing hints, while its final result is 0 errors and 0 warnings.
- The build emits a stale `caniuse-lite` notice; it does not affect the successful build or bundle budgets.
- Exact SVG path parity between `BrandMark.astro` and the exported public icon family is intentionally deferred for final brand review; the current assets passed the required legibility inspection.
- No deployment was performed.
