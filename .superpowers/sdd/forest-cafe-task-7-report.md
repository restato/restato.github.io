# Forest Café Task 7 — Games and Project Experiences

## Delivery

- Base: `bf3579f0f91a795dec3f030ca58e2ae4d51d4cc3`
- Implementation tip: `7081c32`
- Scope: localized game catalog/detail routes, legacy game/project routes, six legacy React games, all localized React games, and the event roulette controls

The localized catalog now uses a compact searchable/filterable list while retaining the existing game configuration, translated SEO content, locale-aware links, and structured data. All scoped routes use `PageShell` and `PageHeader`, and playable components use the Forest Café game root, surface, input, action, and status primitives.

Legacy purple gradients, glass decoration, and hover-lift treatments were removed from the scoped production sources. Game-specific drawing colors and wheel segment colors remain because they communicate game state or are required by the canvas experience.

## TDD evidence

The contract was added before the implementation at:

`src/components/games/__tests__/game-theme-contract.test.ts`

Initial RED command:

```sh
npm test -- --run src/components/games/__tests__/game-theme-contract.test.ts src/components/games/__tests__/HangmanGame.test.ts
```

Initial result:

- Theme contract: 5 expected failures
- Existing Hangman baseline: 2 tests passed
- Core contract evidence included 33 legacy-decoration violations, 64 missing shared-primitive violations, and 72 explicit-button/keyboard-semantics violations; route shell and catalog grammar assertions also failed.

During the final mobile audit, the roulette viewport assertion was added before the correction:

```sh
npm test -- --run src/components/games/__tests__/game-theme-contract.test.ts -t 'keeps action controls'
```

That focused RED reported one expected failure: the fullscreen roulette canvas could overflow a narrow viewport. Adding responsive canvas sizing made the same contract green.

## Verification

Focused suite:

```sh
npm test -- --run src/components/games src/data/__tests__/games.test.ts src/data/__tests__/games-locales.test.ts
```

Result: 4 test files passed, 12 tests passed.

Repository check:

```sh
npm run check
```

Result: 381 files checked, 0 errors, 0 warnings, 81 existing hints.

Production build:

```sh
npm run build
```

Result: exit 0; 1,269 pages built. Sitemap generation completed with 1,121 indexed URLs across blog, tools, projects, and pages sitemaps.

Diff hygiene:

```sh
git diff --check bf3579f0f91a795dec3f030ca58e2ae4d51d4cc3..7081c32
```

Result: exit 0 with no whitespace errors.

## Preservation review

- Existing score, timer, randomization, drawing, and game-state mechanics remain intact.
- Existing canvas/SVG game rendering remains intact; responsive wrappers/sizing were added where needed.
- Localized route generation, fallback language behavior, game URLs, SEO strings, JSON-LD, and share metadata remain wired to the existing data.
- All scoped buttons have explicit types; clickable Flappy Bird, Dino Runner, and roulette play surfaces expose keyboard semantics.
- Event roulette fullscreen mode supports Escape, exposes dialog semantics, and scales its canvas on narrow screens.
- The visible event-roulette draw button now delegates to the existing wheel spin routine; canvas activation continues to use the same routine.
- No deploy, push, registry, content, ads, or protected-report changes were made.
- The pre-existing modification to `.superpowers/sdd/rollout-task-1-report.md` was preserved and not staged.

## Commits

- `bbd7447` — `feat: unify game catalog and shells`
- `0f6eb9e` — `feat: restyle legacy game controls`
- `2def913` — `feat: unify localized game controls`
- `7081c32` — `fix: keep roulette canvas mobile safe`
