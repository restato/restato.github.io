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

## Review remediation — 2026-07-23

Commit `d425b9a` replaces the original source-token contract with a TypeScript-AST structural audit that evaluates every scoped `button`, `input`, and `textarea` element independently. It reports the component path and JSX line for each violation. Rendered Testing Library coverage now exercises accessible names, selected states, Korean/Japanese composition, live results, dynamic mole labels, keyboard flag mode, and fullscreen-region behavior.

### Remediation RED

```sh
npm test -- --run src/components/games/__tests__/game-theme-contract.test.ts src/components/games/__tests__/game-accessibility.test.tsx
```

Result before remediation: 17 expected failures and 1 passing baseline assertion. The failures individually identified:

- Eight raw native controls without a shared control or game-cell primitive.
- Eight placeholder-only inputs/textareas without accessible labels.
- Eight visual selectors without `aria-pressed`.
- Nested `<main>` landmarks from `PageShell`.
- Two remaining `transition-all` declarations.
- Missing narrow-board containment for Minesweeper.
- Missing IME guards, live announcements, dynamic mole labels, keyboard flagging, and correct fullscreen semantics.

### Remediation changes

- `PageShell` is now a neutral `div`; `MainLayout` remains the sole main landmark.
- The shared `fc-game-cell` primitive gives board controls consistent border, state, focus, disabled, and touch behavior.
- All scoped native controls pass an element-level primitive audit; all scoped inputs and textareas have associated accessible names.
- Difficulty, language, mode, and catalog selectors expose `aria-pressed`.
- Ladder, Team Randomizer, and legacy Roulette ignore Enter while IME composition is active.
- Reaction Test, Slot Machine, Minesweeper, Tic-Tac-Toe, Team Randomizer, and Whack-a-Mole expose appropriate status/live semantics for their dynamic results.
- Minesweeper retains right-click flagging and adds a keyboard/touch flag mode with `aria-pressed` and per-cell accessible state.
- Event Roulette fullscreen is an accessible named region, not a modal dialog claim; Escape and the visible exit control remain available.
- 2048, Tic-Tac-Toe, legacy Roulette, and Slot Machine use fluid boards. Hard Minesweeper uses intentional internal horizontal scrolling without page overflow.
- Remaining `transition-all` declarations were removed from 2048 and Tic-Tac-Toe.

The earlier statement that Event Roulette “exposes dialog semantics” is superseded by the named fullscreen-region behavior above.

### Remediation GREEN

Focused suite:

```sh
npm test -- --run src/components/games src/data/__tests__/games.test.ts src/data/__tests__/games-locales.test.ts
```

Result: 5 test files passed, 25 tests passed.

Built-page browser contract:

```sh
npx playwright test tests/e2e/games.spec.ts --project=desktop
```

Result: 2 tests passed. All migrated routes render exactly one `main`; 2048, Tic-Tac-Toe, hard Minesweeper, legacy Roulette, and Slot Machine have no document overflow at 320px or 390px.

Repository check:

```sh
npm run check
```

Result: 383 files checked, 0 errors, 0 warnings, 81 existing hints.

Production build:

```sh
npm run build
```

Result: exit 0; 1,269 pages built and split sitemap generation completed.

The first browser run also observed React hydration mismatch messages on routes whose initial game state is randomized. This is the inherited random-hydration risk called out in the review; the accessibility/mobile migration did not add random initialization, so it was recorded without broadening this task.
