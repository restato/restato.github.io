# Forest Café public-site verification — updated 2026-07-24

## Outcome

The Forest Café redesign passes the complete public-site verification ladder across the 18-route representative matrix, both themes, and the desktop and 390 px browser projects. The five remediated project pages and the not-found page now participate in the same route, accessibility, visual, and manual-review contracts. The build remains at the authorized 1,269-page baseline.

The root-approved Task 9 scope amendments also make article language selection metadata-driven, synchronize localized skip-link text after client locale changes, and reuse one normalized anonymous-chat canonical URL in page metadata and JSON-LD. No route slug, registry, analytics, ad, or tool-algorithm behavior was changed.

The production locale registry currently contains 12 left-to-right languages and no right-to-left locale. The direction audit therefore uses the real Hindi privacy route with a test-only `dir="rtl"` override. It checks logical alignment and overflow without inventing a public locale, route, or translated page.

## Representative route matrix

| Family | Route | Locale | Direction note |
| --- | --- | --- | --- |
| Home | `/ko/` | Korean | LTR |
| Home | `/en/` | English | LTR |
| Tool catalog | `/ko/tools/` | Korean | LTR |
| Text tool | `/en/tools/text-counter/` | English | LTR |
| File tool | `/ko/tools/pdf-merge/` | Korean | LTR |
| Game catalog | `/en/games/` | English | LTR |
| Game detail | `/ko/games/snake/` | Korean | LTR; canvas masked |
| Blog article | `/blog/safer-git-workflow-with-pr/` | English | LTR |
| Policy | `/ko/privacy/` | Korean | LTR |
| Dashboard | `/dashboard/` | Korean | LTR; deterministic live panel visible |
| Chat | `/en/anonymous-chat/` | English | LTR; dynamic message children masked |
| Direction audit | `/hi/privacy/` | Hindi | test-only RTL |
| Project | `/projects/gallery/` | Korean | LTR; accessible modal gallery |
| Project | `/projects/jobworld-kids/` | Korean | LTR; connector overflow audited |
| Project | `/projects/local-price-extractor/` | Korean | LTR |
| Project | `/projects/quick-issue/` | English | LTR |
| Project | `/projects/roomfit-3d/` | Korean | LTR |
| Not found | `/404/` | localized client content | LTR |

This matrix covers every required public page family, the remediated project surfaces, Korean, English, and a real localized page under the test-only direction override. The catalog suite separately verifies the complete 54-tool catalog and every supported locale's tool links.

## Automated verification

| Command | Result |
| --- | --- |
| `npm test -- --run` | PASS — 98 files, 986/986 tests |
| `npm run check` | PASS — 400 files, 0 errors, 0 warnings; 81 existing hints |
| `npm run build` | PASS — 1,269 pages |
| `node scripts/validate-site.mjs dist` | PASS — 1,276 HTML files validated |
| `node scripts/audit-content.mjs dist` | PASS — 1,121 indexable pages audited |
| `node scripts/check-bundles.mjs dist` | PASS — all four route budgets below limits |
| `npm run test:a11y` | PASS — 42/42 Playwright tests |
| `npx playwright test tests/e2e/catalog.spec.ts tests/e2e/forest-cafe-visual.spec.ts --project=desktop --project=mobile-390` | PASS — 68/68 Playwright tests |
| `npx playwright test tests/e2e/project-pages.spec.ts tests/e2e/localization-contract.spec.ts --project=desktop --project=mobile-390` | PASS — 28/28 Playwright tests |
| `npx playwright test tests/e2e/interactive-contrast.spec.ts tests/e2e/tool-item-keyboard.spec.ts --project=desktop --project=mobile-390` | PASS — 8/8 Playwright tests |

Bundle results:

| Route | Actual | Budget |
| --- | ---: | ---: |
| `/ko/tools` | 165.9 KB | 180 KB |
| `/ko/tools/text-counter` | 201.2 KB | 220 KB |
| `/ko/tools/json` | 201.2 KB | 400 KB |
| `/ko/tools/image-resizer` | 201.2 KB | 550 KB |

Focused regression checks also passed:

- localized blog-tag content: 21/21;
- project-page static contract: 16/16;
- baseline-to-evidence SHA-256 identity contract: 54/54 pairs;
- article-language and skip-link helpers: 9/9;
- dynamic game accessibility: 12/12;
- JSON formatter semantics and contrast classes: 11/11;
- Forest Café visual contract alone: 38/38;
- catalog coverage alone: 30/30.

## RED-to-GREEN regressions

The first visual run failed 19 of 26 tests. The failures exposed stale test assumptions, insufficient contrast, and unstable state rather than missing page functionality.

- Light-theme cinnamon accent and muted text did not meet the intended contrast on warm surfaces; Shiki comment tokens were also too faint. Shared semantic values were corrected to `#935832` for the accent, `#5e6960` for muted light text, and `#a7b0a8` for dark code comments.
- The JSON formatter's valid-result text measured 3.96:1 on the Forest Café result surface. Its success classes now use `text-green-800 dark:text-green-300`; the component test locks the accessible classes.
- The full content audit found only three previously thin Korean tag pages (`명언`, `생각`, and `영감`, each 113 characters). With explicit Task 9 scope approval, the shared tag template now supplies substantive localized discovery context for all 12 registered languages. The audit then passed all 1,121 indexable pages.
- The Minesweeper accessibility fixture could exhaust an insufficient set of pseudo-random cells and then time out under load. Its test data now enumerates all 64 cells deterministically, and the interaction-only test uses synchronous `fireEvent`; the production game algorithm was not changed.
- Browser tests now wait for client-load hydration, use the current localized accessible names, assert the invalid JSON alert role, and deterministically mock Frankfurter responses. These changes make the checks observe the hydrated application rather than race SSR or external network state.
- Blog-tag language selection now prefers an explicit article `lang`, otherwise infers from title and description metadata, resolves plurality ties by the newest matching article and then the supported-language registry order, and uses tag-script inference only for the no-post fallback. `/blog/tag/jekyll/` is locked to Korean, while explicit Japanese and Traditional Chinese metadata and all Latin-script locales remain reachable.
- Enabling the WCAG 2.2 Axe tags exposed 12 px keyboard crop handles. They now meet the 24 px target-size requirement, and the interaction audit uses a deterministic 240 × 240 valid PNG so the eight handles exercise usable, non-overlapping crop geometry.
- The first project-page contract run failed 8/8 checks against the legacy sources. Shared Forest Café page, surface, button, eyebrow, and semantic color primitives replaced gradients, glass effects, hover lifts, and one-off palette classes; the resulting static project contract passed all checks.
- The first gallery dialog browser check exposed missing initial focus. The gallery openers are now native buttons and the named modal dialog sets initial focus, traps forward and reverse Tab, supports Escape and arrow navigation, and restores focus to its opener.
- Localization browser RED checks reproduced stale article-language and skip-link behavior, a canonical/JSON-LD trailing-slash mismatch, incomplete trust-family routing, and English-only project pages that still reacted to stored or dispatched locale changes. Metadata-first language inference, all 12 localized skip-link labels, one shared route-family predicate, explicit page locks, and one reused canonical URL made all 22 dedicated localization browser cases pass across desktop and mobile.
- The missing-baseline run passed 26 existing cases and failed the 12 new route/project cases because 18 references were absent. After reviewing the intended pages, the update run and an unchanged normal run both passed 38/38.
- A final combined run exposed that the gallery's external `picsum.photos` placeholders could load after one baseline had captured their empty surfaces. A first attempted stabilization substituted unrelated project images and therefore did not preserve the original content. The corrected contract now locks all six original `Sample n` alt strings, `Sample Image n` titles, and seeded media order. Exact 800 × 600 JPEG responses from `https://picsum.photos/seed/1..6/800/600` are vendored under `public/images/gallery/`, so the original content is preserved without a runtime network dependency.
- Review found inconsistent vertical rhythm between project sections. Five static RED cases now require the shared `fc-section-flow` primitive, whose responsive `clamp(2rem, 5vw, 4rem)` grid gap and direct-child margin normalization are defined once in the Forest Café component layer. A computed browser contract verifies every direct-child gap is at least 32 px on all five pages at 390, 768, 1,024, and 1,440 px.
- Review also found four baseline/documentation-image mismatches. A new fail-closed test reproduced the mismatch, maps all 54 evidence names to all 54 Darwin baselines, and compares exact SHA-256 hashes. An explicit `--update-snapshots=all` run regenerated all 54 baseline/evidence pairs from the same returned screenshot buffers. Normal visual runs no longer rewrite documentation images, and both the subsequent 38/38 normal run and the 54-pair identity test pass.

## Browser and manual review

The browser suites verify:

- D2Coding is the first computed family and `/fonts/D2Coding.woff2` is loaded;
- the named warm-light and espresso-dark semantic page/text/focus tokens;
- no horizontal overflow at 390 px;
- exactly one `h1`, valid banner/main/navigation/contentinfo landmarks, and no serious or critical Axe violations under WCAG 2.0, 2.1, and 2.2 A/AA tags;
- visible keyboard focus and functional skip-to-main behavior in both light and dark themes, plus theme persistence through navigation and reload;
- logical RTL alignment on the direction-audit route;
- hover geometry changes by less than one pixel so controls do not shift;
- dynamic file selection, JSON status announcement, focused downloads, and responsive disclosure interaction.
- the gallery dialog's initial focus, bidirectional focus trap, Escape close, opener focus restoration, next/previous button round-trip, and ArrowRight/ArrowLeft round-trip;
- project CTA/eyebrow live contrast in both themes and Jobworld connector overflow at 390, 768, 1,024, and 1,440 px;
- desktop and mobile language-control switching for `/about`, `/contact`, `/privacy`, `/terms`, and `/disclaimer`, including the resulting URL, document language, and localized page heading;
- article document-language locking, localized skip-link synchronization on `/` and `/404/`, exact anonymous-chat canonical/JSON-LD agreement, and storage/event resistance for Quick Issue plus all five PasteDock English routes, including English skip-link and Open Graph locale metadata;
- live AA contrast in both themes for Timer start/pause, Bingo, Ladder, Roulette history and all 16 participant palette variants, and App Store processing states;
- separate native screenshot select/remove and D-Day load/delete controls operated with Space, Tab, and Enter, with screenshot action names verified in Korean, English, and Japanese;
- a clock-controlled, visibly hydrated `client:idle` bookmark prompt that passes Axe, exposes a visible focused close button, dismisses by keyboard, and remains dismissed after reload;
- fail-closed console and page-error collection across every accessibility interaction and every visual/theme test.

The Roulette participant-chip appearance changed, but Roulette is not one of the 18 visual-baseline routes (the game-detail baseline uses Snake). The unchanged 68/68 visual run and 54/54 SHA-256 identity contract therefore required no baseline or evidence-image update.

The original manual review covered 42 combinations: seven representative routes × three widths (390, 768, and 1,440 px) × light and dark themes.

| Manual page family | Route |
| --- | --- |
| Home | `/ko/` |
| Tool catalog | `/ko/tools/` |
| PDF tool | `/ko/tools/pdf-merge/` |
| Calculator | `/ko/tools/loan-calculator/` |
| Game | `/ko/games/snake/` |
| Article | `/blog/safer-git-workflow-with-pr/` |
| Direction audit | `/hi/privacy/` with test-only RTL |

All 42 combinations retained obvious primary actions, direction-safe alignment, stable hover geometry, and readable light/dark surfaces without overflow. D2Coding loaded from the local font resource. Korean, English, and Devanagari text rendered without tofu; unsupported glyphs fell through the declared font stack.

The remediation added 36 reviewed combinations: the five project routes plus `/404/`, at the same three widths and two themes. All 36 had zero horizontal overflow, one visible page heading, valid main landmarks, readable body contrast, a visible 2 px solid focus indicator, working theme state, and no console errors. After adding the shared flow and restoring the seeded gallery media, all five project pages were re-captured and inspected together at 390, 768, and 1,440 px. No clipping, overlap, illegible surface, horizontal scrolling, or broken hierarchy was found. At 390 px, the gallery additionally demonstrated button and keyboard image round-trips, close-button initial focus, reverse and forward focus wrapping, Escape close, and opener focus restoration. The cumulative manual review remains 78 combinations. The refreshed screenshots and machine-readable measurements live in [`assets/forest-cafe-manual/`](./assets/forest-cafe-manual/).

## Screenshot evidence and masking

The explicit all-update run saves 54 documentation references in [`assets/forest-cafe/`](./assets/forest-cafe/): desktop light, desktop dark, and mobile-390 dark for each of the 18 matrix routes. Each returned screenshot buffer is written as documentation evidence and passed directly to Playwright's snapshot matcher in the same call. The committed pairs are byte-identical, enforced by exact SHA-256 rather than the visual tolerance. Normal runs capture and compare fresh buffers without rewriting the documentation directory. The `maxDiffPixelRatio: 0.001` (0.1%) threshold remains only the normal visual-regression threshold, not an evidence-synchronization substitute.

Both evidence projects declare the `Asia/Seoul` timezone, and the visual suite fixes the client-side `Date` at 2026-07-20 12:00 KST with `page.clock.setFixedTime` before navigation. This keeps client-rendered dashboard labels independent of the host timezone without intercepting timers. The production footer continues to render the real server year; only its narrow `[data-current-year]` leaf is masked in visual comparisons. Missing baselines, mismatched evidence, and arbitrary visual changes cannot silently bless new images.

Stable masking is intentionally limited to:

- all routes: `[data-ad-placement]`, `ins.adsbygoogle`, `[data-consent-banner]`, and the year-only `[data-current-year]` leaf;
- Snake: `canvas`, because the requirement explicitly excludes pixel-identity checks for canvas games;
- anonymous chat: only `.chat-container [role="status"] > *` and `.chat-container [role="log"] > *`, whose child content is nondeterministic.

The six newly added routes require no additional visual masks.

The dashboard has no route-specific mask: its API response and seven absolute UTC history days are seeded deterministically, leaving the complete rate cards, refresh controls, and sparklines visible. The chat container, status/log geometry, surrounding page shell, headings, navigation, controls, theme, spacing, and responsive layout remain unmasked and asserted. The visual matrix suppresses the delayed bookmark prompt through its documented session state; the separate clock-controlled accessibility test covers the prompt's visible hydrated state.

## Scope

No deployment or push was performed. AdSense and ad environment variables were not enabled or modified. Route slugs, registry data, analytics behavior, lazy tool imports, and tool algorithms remain unchanged.
