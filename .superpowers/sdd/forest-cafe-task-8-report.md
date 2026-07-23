# Forest Café Task 8 Report

## Scope

Migrated the editorial, policy, discovery, dashboard, knowledge-workspace, anonymous-chat redirect, and PasteDock public surfaces from base `b900159`.

The localized anonymous-chat page already had the complete Forest Café tool shell from Task 6, so it was inspected and retained. Only the non-localized redirect surface changed.

## TDD record

### RED

Created `src/styles/__tests__/public-pages-contract.test.ts` before production changes.

Initial command:

```sh
npm test -- --run src/styles/__tests__/public-pages-contract.test.ts
```

Observed result: 1 failed file, 5 failed tests, with 27 scoped failures covering:

- shared layout routing;
- wide `PageShell` structure;
- element-scoped `fc-prose` reading regions;
- legacy gradient, glass, and hover-lift page chrome;
- shared controls and surfaces on dense application chrome.

### GREEN

Final contract result:

```text
Test Files  1 passed (1)
Tests       5 passed (5)
```

The contract enumerates the public templates and scopes the legacy-presentation ban to page chrome and relevant outer controls. Exchange-chart colors and the LLM knowledge graph are not scanned as presentation violations.

## Migration summary

### Editorial and policy

- Routed policy and blog surfaces through `PageShell`.
- Added 68ch `fc-prose` typography for long copy.
- Added forest links, cinnamon metadata/callouts, and espresso code blocks.
- Preserved blog bodies, tag routing, dates, reading-time behavior, share/copy behavior, and policy copy.

### Dashboard and discovery

- Moved articles, article admin, dashboard, and jobs to `PageShell size="wide"`.
- Replaced legacy gradients and hover shadows with shared surfaces, controls, fields, chips, and empty states.
- Preserved feed sources, storage keys, GitHub save behavior, job destinations, exchange calculations, history, and chart colors.

### LLM Wiki and Content OS

- Routed LLM Wiki through `MainLayout` and the wide page shell.
- Mapped outer shell and sticky journey controls to Forest Café semantic tokens.
- Removed glass and hover-lift from non-visual controls.
- Preserved graph transforms, visualization colors, scenario state, keyboard tabs, fullscreen presentation, terminal simulation, OKF explorer, metadata, and schemas.
- Migrated Content OS summary cards, candidate list, and callout to shared surfaces without changing candidate data or scoring.

### Specialized and PasteDock

- Kept the localized anonymous-chat tool shell, routing, ads, moderation copy, metadata, and Firebase behavior unchanged.
- Migrated the redirect status to a shared reading shell.
- Migrated PasteDock landing, pricing, privacy, refund, and terms pages to shared shells, buttons, surfaces, and policy prose.
- Preserved product links, price, download/checksum URLs, support address, policy text, canonicals, and structured data.

## Commits

1. `2fb4a5f feat: restyle editorial and policy pages`
2. `262abc1 feat: restyle dashboard and discovery pages`
3. `eb7090b feat: unify knowledge workspace shells`
4. `cf72230 feat: restyle chat and specialized experiences`

## Verification

Exact focused suite from the brief:

```sh
npm test -- --run src/components/articles src/components/dashboard src/components/llm-wiki \
  src/components/__tests__/Chat.test.tsx src/styles/__tests__/public-pages-contract.test.ts
```

Result: 8 test files passed, 53 tests passed.

Additional focused evidence:

- LLM Wiki plus data tests: 5 files passed, 16 tests passed.
- Chat and chat-service tests: 2 files passed, 28 tests passed.
- Forest Café design-system tests: 1 file passed, 5 tests passed.
- `npm run check`: 384 files checked, 0 errors; 81 pre-existing hints.
- `npm run build`: exit 0; 1,269 pages built; blog, tools, projects, and pages sitemaps regenerated.
- `git diff --check`: clean.

## Self-review

- Confirmed every enumerated public template imports `MainLayout` or delegates through `SitePolicyPage`.
- Confirmed data-heavy pages render the wide shared shell.
- Confirmed policy and article copy uses element-scoped `fc-prose`.
- Confirmed no legacy `gradient-text`, `gradient-bg`, `bg-gradient-*`, `backdrop-blur*`, hover translation, hover shadow, or hover scale remains in scoped page chrome.
- Audited the base-to-head diff for SEO metadata, routes, schemas, source constants, Firebase/chat behavior, article bodies, and data logic; no out-of-scope changes found.
- Preserved the unrelated pre-existing modification to `.superpowers/sdd/rollout-task-1-report.md`.
- No deployment, push, registry change, SEO-logic change, or protected report action was performed.

## Review remediation

Review found that the legacy `.prose` rules compiled after equal-specificity
`.fc-prose` rules, so blog links, code, pre blocks, and blockquotes did not
consistently receive the Forest Café treatment. It also found two non-visual
LLM Wiki gradients, two English eyebrows on Korean pages, and incorrect
blog-post breadcrumb current-page semantics.

The public-pages contract was strengthened before production changes. The RED
run failed 4 of 8 contract tests with 12 scoped assertions:

- eight computed-style failures from the compiled Tailwind prose cascade;
- the hero-grid and adoption-card outer gradients;
- the unlocalized article/jobs labels;
- the Blog ancestor/current article breadcrumb relationship.

The remediation:

- adds later, higher-specificity `.prose.fc-prose` editorial rules without
  `!important`;
- compiles `global.css` in the contract and checks computed styles for the
  reading measure, links, inline code, pre/code, and blockquotes;
- includes `llm-wiki.css` and all non-graph LLM Wiki experience/control
  components in the public-page contract;
- replaces the hero backdrop and adoption CTA gradient with quiet Forest Café
  solid surfaces and subtle borders while retaining visualization gradients;
- removes the English eyebrows from the Korean articles and jobs pages;
- keeps Blog as an ancestor link and marks the article title as
  `aria-current="page"`, while retaining article metadata inputs.

Fresh remediation verification:

- public-pages contract: 8 tests passed;
- exact focused suite: 8 files passed, 56 tests passed;
- `npm run check`: 384 files checked, 0 errors; 81 pre-existing hints;
- `npm run build`: exit 0; 1,269 pages built; four sitemap families regenerated;
- `git diff --check`: clean.

The unrelated pre-existing modification to
`.superpowers/sdd/rollout-task-1-report.md` remains untouched. No push, deploy,
protected-report edit, route change, schema change, or content-body rewrite was
performed.
