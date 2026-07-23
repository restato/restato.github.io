# Forest Café Project Pages and Localization Contract Design

**Date:** 2026-07-24  
**Status:** Approved  
**Scope:** Five project pages, `/404`, shared public-page verification, and the
specified localization/SEO contracts.

## Goals

- Bring the five project pages into the existing Forest Café design language
  without changing their content, data, links, or product behavior.
- Remove page-local gradients, glass effects, hover-lift transforms, and
  one-off color systems in favor of the existing `fc-*` tokens and primitives.
- Correct the identified accessibility defects in the jobworld diagram,
  local-price call to action, roomfit eyebrow, and gallery lightbox.
- Make all five project routes and `/404` first-class members of the public-page
  accessibility and visual contracts.
- Make article language, client-localized skip-link text, and anonymous-chat
  canonical metadata deterministic and browser-verifiable.
- Leave durable RED/GREEN evidence and an exact, reproducible validation ladder.

## Non-goals

- A new shared `ProjectPage` component or a large project-page architecture
  refactor.
- Copy, data, routing, or feature changes unrelated to the contracts above.
- Deployment or pushing commits.

## Chosen Approach

Use a shared-contract migration: keep each project page's current content and
page-specific structure, but express its UI through the established Forest Café
tokens and primitives. Shared behavior belongs in existing shared layers or a
small focused helper where that prevents contract drift. The representative
route matrix remains the single source of truth for automated accessibility and
visual coverage.

This is preferred over isolated page-by-page fixes, which would duplicate
behavior and styling rules, and over a new common project-page component, which
would expand the change surface and risk functional regressions.

## UI Migration

The five pages are:

- `/projects/gallery`
- `/projects/jobworld-kids`
- `/projects/local-price-extractor`
- `/projects/quick-issue`
- `/projects/roomfit-3d`

Each page will retain its text, media, links, and feature behavior. Page-local
gradient backgrounds, translucent/glass panels, arbitrary color utilities,
hover elevation/translation, and competing visual primitives will be replaced
with the existing Forest Café surfaces, borders, typography, controls, and
state tokens.

The jobworld process connector will receive an explicit positioned containing
block and responsive containment so its absolute arrow cannot create horizontal
overflow at 390, 768, 1024, or 1440 CSS pixels.

The local-price primary call to action and roomfit eyebrow will use token pairs
that meet WCAG AA contrast. Contrast tests will assert the chosen foreground
and background values rather than relying on a visual judgment alone.

## Gallery Interaction Contract

Every gallery card that opens the lightbox will be a semantic native button.
It will expose an accessible name and remain usable through Tab, Shift+Tab,
Enter, and Space without a separate custom keyboard emulation path.

The lightbox will:

- have `role="dialog"` and `aria-modal="true"`;
- have an accessible name associated through `aria-labelledby`;
- expose an explicit close button;
- close through that button and Escape;
- move focus inside when opened;
- trap forward and reverse Tab navigation while open;
- restore focus to the card that opened it when closed;
- hide its inactive state from both layout and the accessibility tree; and
- preserve previous/next image behavior with named controls.

## Localization and SEO Contracts

### Blog article language

`src/pages/blog/[...slug].astro` will pass the article's optional supported
12-locale `data.lang` to the layout. When it is absent, a centralized,
deterministic fallback will infer a supported locale from stable article
content signals and otherwise use the defined site fallback. The selected
language will be locked for an article so client locale code cannot overwrite
the document language. Unit coverage will exercise explicit, inferred, and
terminal fallback cases; browser coverage will load a non-English article and
verify the rendered language remains locked.

### Root and 404 skip links

The root page and `/404` will use the same client locale synchronization
contract for their skip-link label. The label must update when the active
locale changes in the browser, including the site's locale-change event path,
and must not require a reload. Browser tests will verify actual DOM behavior on
both routes.

### Anonymous-chat structured data

The anonymous-chat route will construct one trailing-slash canonical URL and
reuse that exact value for the canonical link and every relevant JSON-LD URL.
Tests will compare parsed values for exact equality.

## Verification Architecture

The representative route matrix will add the five project routes and `/404`,
growing from 12 to 18 routes. Existing accessibility and visual specifications
will consume that matrix directly:

- Axe coverage: 18 routes × 2 themes = 36 route/theme checks, plus existing
  non-matrix checks.
- Visual coverage: 18 desktop-light, 18 desktop-dark, and 18 mobile-dark
  screenshots = 54 baselines; with the two existing theme-transition checks,
  the visual spec contains 38 tests.
- Exact combined catalog plus visual run: 30 catalog tests + 38 visual tests =
  68 tests.

The first normal visual run after matrix expansion must fail because the 18 new
project/404 baselines do not exist. Baselines will then be generated deliberately
and the same normal run must pass.

Manual browser evidence will add all six new routes at 390, 768, and 1440 CSS
pixels in light and dark themes: 6 × 3 × 2 = 36 new combinations. Existing
manual evidence remains retained. The audit will cover overflow, focus
visibility, keyboard operation, dialog focus containment/restoration, contrast,
and obvious responsive layout regressions. Dynamic regions will use narrowly
scoped masks only; masks and their reason will be reported.

## Test-Driven Sequence

1. Add failing route-matrix, static style-contract, contrast, interaction,
   language, skip-link, canonical-equality, and browser tests.
2. Run the smallest relevant suites and record the expected RED causes.
3. Migrate the five project pages and implement the shared localization/SEO
   contracts in small bounded changes.
4. Run focused GREEN tests, then update missing visual baselines and rerun the
   normal visual command.
5. Perform the approved 36-combination manual audit and retain evidence.
6. Update the durable remediation report with exact counts, routes, masks,
   commands, RED/GREEN results, and evidence paths.
7. Run the complete validation ladder:
   - `npm test -- --run`
   - `npm run check`
   - `npm run build`
   - `node scripts/validate-site.mjs dist`
   - `node scripts/audit-content.mjs dist`
   - `node scripts/check-bundles.mjs dist`
   - `npm run test:a11y`
   - the exact combined catalog plus visual command
   - manual browser checks

## Commit and Workspace Discipline

Changes will be divided into bounded test, implementation, baseline/evidence,
and report commits. The protected
`.superpowers/sdd/rollout-task-1-report.md` file will never be touched or
staged. No deployment or push will occur. Ephemeral outputs will be removed so
that the protected file's pre-existing modification is the only final working
tree status.
