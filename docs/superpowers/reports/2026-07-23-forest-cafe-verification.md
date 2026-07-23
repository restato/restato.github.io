# Forest Café public-site verification — 2026-07-23

## Outcome

The Forest Café redesign passes the complete public-site verification ladder across the representative route matrix, both themes, and the desktop and 390 px browser projects. The build remains at the authorized 1,269-page baseline. The root-approved Task 9 scope amendment changes blog-tag language selection to derive from matching article metadata; no route slug, registry, analytics, ad, or tool-algorithm behavior was changed.

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

This matrix covers every required public page family, plus Korean, English, and a real localized page under the test-only direction override. The catalog suite separately verifies the complete 54-tool catalog and every supported locale's tool links.

## Automated verification

| Command | Result |
| --- | --- |
| `npm test -- --run` | PASS — 93 files, 950/950 tests |
| `npm run check` | PASS — 389 files, 0 errors, 0 warnings; 81 existing hints |
| `npm run build` | PASS — 1,269 pages |
| `node scripts/validate-site.mjs dist` | PASS — 1,276 HTML files validated |
| `node scripts/audit-content.mjs dist` | PASS — 1,121 indexable pages audited |
| `node scripts/check-bundles.mjs dist` | PASS — all four route budgets below limits |
| `npm run test:a11y` | PASS — 30/30 Playwright tests |
| `npx playwright test tests/e2e/catalog.spec.ts tests/e2e/forest-cafe-visual.spec.ts --project=desktop --project=mobile-390` | PASS — 56/56 Playwright tests |

Bundle results:

| Route | Actual | Budget |
| --- | ---: | ---: |
| `/ko/tools` | 165.9 KB | 180 KB |
| `/ko/tools/text-counter` | 201.1 KB | 220 KB |
| `/ko/tools/json` | 201.1 KB | 400 KB |
| `/ko/tools/image-resizer` | 201.1 KB | 550 KB |

Focused regression checks also passed:

- localized blog-tag content: 21/21;
- dynamic game accessibility: 12/12;
- JSON formatter semantics and contrast classes: 11/11;
- Forest Café visual contract alone: 26/26;
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
- a clock-controlled, visibly hydrated `client:idle` bookmark prompt that passes Axe, exposes a visible focused close button, dismisses by keyboard, and remains dismissed after reload;
- fail-closed console and page-error collection across every accessibility interaction and every visual/theme test.

Manual review covered 42 combinations: seven representative routes × three widths (390, 768, and 1,440 px) × light and dark themes.

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

## Screenshot evidence and masking

The automated run saves 36 documentation references in [`assets/forest-cafe/`](./assets/forest-cafe/): desktop light, desktop dark, and mobile-390 dark for each of the 12 matrix routes. The exact same screenshot buffers are also compared against 36 committed Darwin Playwright baselines with `maxDiffPixelRatio: 0.001` (0.1%). Both evidence projects declare the `Asia/Seoul` timezone, and the visual suite fixes `Date` at 2026-07-20 12:00 KST with `page.clock.setFixedTime` before navigation. This keeps dashboard labels and footer years independent of the host timezone and calendar year without intercepting timers. A missing-baseline RED run failed as required, and an arbitrary visual change failed by 20,739 pixels (7%); neither can silently bless a new image.

Stable masking is intentionally limited to:

- all routes: `[data-ad-placement]`, `ins.adsbygoogle`, and `[data-consent-banner]`;
- Snake: `canvas`, because the requirement explicitly excludes pixel-identity checks for canvas games;
- anonymous chat: only `.chat-container [role="status"] > *` and `.chat-container [role="log"] > *`, whose child content is nondeterministic.

The dashboard has no route-specific mask: its API response and seven absolute UTC history days are seeded deterministically, leaving the complete rate cards, refresh controls, and sparklines visible. The chat container, status/log geometry, surrounding page shell, headings, navigation, controls, theme, spacing, and responsive layout remain unmasked and asserted. The visual matrix suppresses the delayed bookmark prompt through its documented session state; the separate clock-controlled accessibility test covers the prompt's visible hydrated state.

## Scope

No deployment or push was performed. AdSense and ad environment variables were not enabled or modified. Route slugs, registry data, analytics behavior, lazy tool imports, and tool algorithms remain unchanged.
