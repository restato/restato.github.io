# Forest Café Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign every public Restato surface into one restrained, warm, deep-green “Forest Café” system with D2Coding typography, complete dark mode, responsive behavior, and unchanged SEO/tool functionality.

**Architecture:** Define the visual language once in CSS custom properties and Tailwind aliases, expose a small set of Astro/React UI primitives, then migrate page families onto those primitives. Keep route data, localized copy, structured data, lazy-loading boundaries, and browser-local tool logic unchanged. Specialized apps and games retain their functional identity but inherit the same page shell, controls, states, and palette.

**Tech Stack:** Astro 5, React 19 islands, Tailwind CSS 3, TypeScript, Vitest/Testing Library, Playwright, self-hosted D2Coding WOFF2.

---

## Design contract

- Light surfaces: paper `#f4efe5`, raised paper `#fffaf0`, ink `#203027`, muted ink `#667168`.
- Dark surfaces: green-tinted espresso `#111814`, raised `#18221c`, ink `#edf2ea`, muted ink `#a7b0a8`.
- Brand: forest `#174a35`, active forest `#236345`; supporting cinnamon `#a7663b` only for small highlights.
- Typography: `D2Coding` first, followed by language-capable system fallbacks. Body is at least `16px/1.7`; long-form copy is capped at `68ch`.
- Shape: 10–14px radii, 1px low-contrast borders, almost no shadow, no gradients, glass, floating-card transforms, or decorative motion.
- Interaction: 44px minimum hit targets, visible forest focus ring, explicit hover/pressed/disabled/error/success states, reduced-motion support.
- Existing canonical URLs, hreflang, JSON-LD, localized text, route generation, ad gating, and client-only processing guarantees remain unchanged.

## Task 1: Lock the font, tokens, and visual contract with tests

**Files:**
- Create: `src/styles/__tests__/design-system.test.ts`
- Modify: `src/styles/global.css`
- Modify: `tailwind.config.mjs`
- Modify: `src/layouts/BaseLayout.astro`
- Create: `public/fonts/D2Coding.woff2`
- Create: `public/fonts/D2Coding-Bold.woff2`
- Create: `public/fonts/OFL.txt`

**Step 1: Write the failing contract test**

Add a test that reads the three source files and makes the non-negotiable contract executable:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/styles/global.css', 'utf8');
const config = readFileSync('tailwind.config.mjs', 'utf8');
const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');

describe('Forest Café design system', () => {
  it('self-hosts D2Coding and uses language-capable fallbacks', () => {
    expect(css).toContain("font-family: 'D2Coding'");
    expect(css).toContain("url('/fonts/D2Coding.woff2') format('woff2')");
    expect(css).toContain("url('/fonts/D2Coding-Bold.woff2') format('woff2')");
    expect(config).toContain("'D2Coding'");
    expect(config).toContain("'Noto Sans'");
  });

  it('defines paired light and dark semantic tokens', () => {
    for (const token of ['--surface-page', '--surface-raised', '--text-primary', '--text-muted', '--border-subtle', '--brand', '--accent']) {
      expect(css.match(new RegExp(token, 'g'))?.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('prevents theme flash and exposes the browser color scheme', () => {
    expect(layout).toContain("document.documentElement.classList.add('dark')");
    expect(css).toContain('color-scheme: light');
    expect(css).toContain('color-scheme: dark');
  });
});
```

**Step 2: Run the test and confirm RED**

Run: `npm test -- --run src/styles/__tests__/design-system.test.ts`

Expected: FAIL because the Forest Café variables, D2Coding face, and Tailwind family do not exist.

**Step 3: Add the licensed font asset**

Download the official Naver D2Coding v1.3.2 release archive, verify it contains the OFL license, extract its regular and bold D2Coding TTF files, and convert them with `woff2_compress` to `public/fonts/D2Coding.woff2` and `public/fonts/D2Coding-Bold.woff2`. Copy the release’s OFL text verbatim to `public/fonts/OFL.txt`. If `woff2_compress` is unavailable, install/use a local converter that preserves the original font tables; do not use an unofficial CDN or substitute font.

Verify:

```sh
file public/fonts/D2Coding.woff2
file public/fonts/D2Coding-Bold.woff2
test -s public/fonts/OFL.txt
```

Expected: a WOFF2 font file and non-empty license file.

**Step 4: Implement semantic tokens and Tailwind aliases**

Replace the current purple/orange variables in `global.css` with the design contract. Keep backwards-compatible aliases (`--color-bg`, `--color-card`, etc.) during migration, but point them at the new semantic tokens. Add:

```css
@font-face {
  font-family: 'D2Coding';
  src: url('/fonts/D2Coding.woff2') format('woff2');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'D2Coding';
  src: url('/fonts/D2Coding-Bold.woff2') format('woff2');
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}

:root {
  color-scheme: light;
  --surface-page: #f4efe5;
  --surface-raised: #fffaf0;
  --surface-soft: #ebe4d7;
  --text-primary: #203027;
  --text-muted: #667168;
  --border-subtle: #d9d1c4;
  --brand: #174a35;
  --brand-hover: #236345;
  --accent: #a7663b;
  --focus: #2f7658;
}

.dark {
  color-scheme: dark;
  --surface-page: #111814;
  --surface-raised: #18221c;
  --surface-soft: #202c25;
  --text-primary: #edf2ea;
  --text-muted: #a7b0a8;
  --border-subtle: #344139;
  --brand: #6fa989;
  --brand-hover: #8ab99d;
  --accent: #cf936a;
  --focus: #8ab99d;
}
```

In `tailwind.config.mjs`, map `primary` to forest shades, `accent` to cinnamon shades, and set:

```js
fontFamily: {
  sans: ['D2Coding', 'Noto Sans', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans Arabic', 'ui-monospace', 'monospace'],
}
```

Add body typography, `text-rendering`, `font-synthesis: none`, logical direction-safe spacing, `prefers-reduced-motion`, semantic selection/scrollbar/focus styles, and the compatibility aliases.

**Step 5: Run tests and type checks**

Run: `npm test -- --run src/styles/__tests__/design-system.test.ts && npm run check`

Expected: PASS; no Astro/TypeScript errors.

**Step 6: Commit**

```sh
git add public/fonts src/styles/global.css src/styles/__tests__/design-system.test.ts tailwind.config.mjs src/layouts/BaseLayout.astro
git commit -m "feat: establish forest cafe design system"
```

## Task 2: Create shared page and control primitives

**Files:**
- Create: `src/components/ui/PageShell.astro`
- Create: `src/components/ui/PageHeader.astro`
- Create: `src/components/ui/Surface.astro`
- Create: `src/components/ui/EmptyState.astro`
- Create: `src/components/ui/ToolControl.tsx`
- Create: `src/components/ui/__tests__/ToolControl.test.tsx`
- Modify: `src/styles/global.css`

**Step 1: Write failing interaction tests**

Test `ToolControl` for label association, hint/error linkage, disabled state, and shared class names:

```tsx
render(<ToolControl id="amount" label="Amount" hint="Numbers only" error="Required" />);
expect(screen.getByLabelText('Amount')).toHaveAttribute('aria-describedby', 'amount-hint amount-error');
expect(screen.getByRole('alert')).toHaveTextContent('Required');
expect(screen.getByLabelText('Amount')).toHaveClass('fc-input');
```

Run: `npm test -- --run src/components/ui/__tests__/ToolControl.test.tsx`

Expected: FAIL because the component does not exist.

**Step 2: Implement the minimal primitive API**

- `PageShell`: props `size?: 'reading' | 'content' | 'wide'`, `class?: string`; renders `fc-page` and the appropriate max width.
- `PageHeader`: props `eyebrow?`, `title`, `description?`, `align?: 'start' | 'center'`; exposes an `actions` slot.
- `Surface`: props `as?: 'section' | 'article' | 'div'`, `tone?: 'raised' | 'soft'`, `padding?: 'none' | 'sm' | 'md'`.
- `EmptyState`: props `title`, `description?`; exposes an `action` slot.
- `ToolControl`: `InputHTMLAttributes<HTMLInputElement>` plus `id`, `label`, `hint?`, `error?`.

Add stable global classes: `.fc-page`, `.fc-reading`, `.fc-surface`, `.fc-surface-soft`, `.fc-button`, `.fc-button-primary`, `.fc-button-secondary`, `.fc-button-quiet`, `.fc-input`, `.fc-select`, `.fc-textarea`, `.fc-label`, `.fc-help`, `.fc-error`, `.fc-chip`, `.fc-divider`, `.fc-prose`. Buttons/controls must be 44px high and must not translate or scale on hover.

**Step 3: Run focused tests**

Run: `npm test -- --run src/components/ui/__tests__/ToolControl.test.tsx`

Expected: PASS.

**Step 4: Commit**

```sh
git add src/components/ui src/styles/global.css
git commit -m "feat: add shared forest cafe ui primitives"
```

## Task 3: Redesign global chrome and theme behavior

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/ConsentBanner.astro`
- Modify: `src/layouts/MainLayout.astro`
- Create: `src/components/__tests__/site-chrome.test.ts`

**Step 1: Write a failing source contract test**

Assert the header has a labeled primary navigation, theme control, language control, mobile menu button with `aria-expanded`; the footer has a labeled footer nav; the consent banner uses shared button/surface classes. Also assert old `gradient-*`, `backdrop-blur`, and hover translation classes are absent in these files.

Run: `npm test -- --run src/components/__tests__/site-chrome.test.ts`

Expected: FAIL on the new semantic markup/classes.

**Step 2: Implement the chrome**

- Header: 64px quiet paper bar, hairline border, text wordmark with one forest mark, current-route state, compact desktop nav, accessible disclosure menu on mobile, language and dark-mode controls grouped at the end.
- Theme toggle: preserve existing `localStorage.theme`; set icon and accessible label after load; react to system theme only when no explicit choice exists.
- Language menu: retain the existing 12-language routing and lock behavior; do not change hreflang or stored-language semantics.
- Footer: one calm multi-column area, no card grid, localized links retained, one cinnamon micro-accent.
- Consent: bottom inline paper notice, no floating/glass styling, focus trapped only if modal semantics are actually used.
- Main layout: add skip link and `id="main-content"`; preserve header/main/footer order.

**Step 3: Run tests and a small build**

Run: `npm test -- --run src/components/__tests__/site-chrome.test.ts && npm run check && npm run build:astro`

Expected: PASS and all routes compile.

**Step 4: Commit**

```sh
git add src/components/Header.astro src/components/Footer.astro src/components/ConsentBanner.astro src/components/__tests__/site-chrome.test.ts src/layouts/MainLayout.astro
git commit -m "feat: unify site chrome with forest cafe styling"
```

## Task 4: Rebuild home, cards, and core landing pages

**Files:**
- Modify: `src/components/HomeContent.tsx`
- Modify: `src/components/BlogCard.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/[lang]/index.astro`
- Modify: `src/pages/404.astro`
- Modify: `src/components/NotFoundContent.tsx`
- Create: `src/components/__tests__/HomeContent.test.tsx`

**Step 1: Write failing home-page tests**

Assert exactly one `h1`, prominent tool-search navigation, meaningful section headings, localized link prefixes, and absence of gradient/floating-card classes.

Run: `npm test -- --run src/components/__tests__/HomeContent.test.tsx`

Expected: FAIL until the new hierarchy is rendered.

**Step 2: Implement the warm editorial home hierarchy**

- Hero: left-aligned concise promise, search/tool CTA, small cinnamon annotation; no oversized gradient headline.
- Utility strip: latest/high-value tools as compact rows, not repeated feature cards.
- Content: restrained two-column desktop rhythm, single column mobile; shared `fc-surface` and `BlogCard` treatments.
- Root and localized entry pages must render the same visual system while preserving redirects, language selection, titles, descriptions, and structured data.
- 404 uses the same page header, one primary return action, and useful tool links.

**Step 3: Verify**

Run: `npm test -- --run src/components/__tests__/HomeContent.test.tsx src/data/__tests__/site-content.test.ts && npm run check`

Expected: PASS.

**Step 4: Commit**

```sh
git add src/components/HomeContent.tsx src/components/BlogCard.astro src/components/NotFoundContent.tsx src/components/__tests__/HomeContent.test.tsx src/pages/index.astro 'src/pages/[lang]/index.astro' src/pages/404.astro
git commit -m "feat: redesign home and core landing pages"
```

## Task 5: Unify tool discovery, filtering, and catalog SEO

**Files:**
- Modify: `src/components/tools/ToolsPageHeader.tsx`
- Modify: `src/components/tools/ToolSearch.tsx`
- Modify: `src/components/tools/ToolsGrid.tsx`
- Modify: `src/components/tools/ToolsPageInfo.tsx`
- Modify: `src/components/tools/RecentTools.tsx`
- Modify: `src/components/tools/RelatedTools.astro`
- Modify: `src/pages/tools/index.astro`
- Modify: `src/pages/[lang]/tools/index.astro`
- Modify: `src/components/tools/__tests__/ToolsGrid.test.tsx`
- Create: `src/components/tools/__tests__/ToolSearch.a11y.test.tsx`

**Step 1: Extend tests before changing markup**

Cover keyboard-accessible search, clear button labeling, result count announced through `aria-live`, category chips using buttons with `aria-pressed`, empty results, and locale-preserving hrefs. Add a class contract asserting `fc-input`, `fc-chip`, and calm list/card styling.

Run: `npm test -- --run src/components/tools/__tests__/ToolsGrid.test.tsx src/components/tools/__tests__/ToolSearch.a11y.test.tsx`

Expected: FAIL on missing live region/semantic classes.

**Step 2: Implement catalog UI without changing the registry**

- Search is the strongest object on the page, with a visible label and shortcut hint.
- Categories are horizontally scrollable chips on mobile and wrap on desktop.
- Tool items use icon, title, one-line description, and quiet arrow; no lift/scale.
- Recent and related tools use the same item grammar.
- Preserve all registry filtering, translations, link construction, metadata, canonical URLs, and catalog ad slots.

**Step 3: Verify catalog behavior**

Run: `npm test -- --run src/components/tools/__tests__/ToolsGrid.test.tsx src/components/tools/__tests__/LocalizedCatalogLinks.test.tsx src/components/tools/__tests__/ToolSearch.a11y.test.tsx && npm run check`

Expected: PASS.

**Step 4: Commit**

```sh
git add src/components/tools/ToolsPageHeader.tsx src/components/tools/ToolSearch.tsx src/components/tools/ToolsGrid.tsx src/components/tools/ToolsPageInfo.tsx src/components/tools/RecentTools.tsx src/components/tools/RelatedTools.astro src/components/tools/__tests__ src/pages/tools/index.astro 'src/pages/[lang]/tools/index.astro'
git commit -m "feat: unify tool search and catalog design"
```

## Task 6: Standardize every tool detail screen and all 54 tool controls

**Files:**
- Create: `src/components/tools/ui/ToolPanel.tsx`
- Create: `src/components/tools/ui/ToolField.tsx`
- Create: `src/components/tools/ui/ToolActions.tsx`
- Create: `src/components/tools/ui/ToolResult.tsx`
- Create: `src/components/tools/ui/__tests__/tool-ui.test.tsx`
- Modify: `src/layouts/ToolLayout.astro`
- Modify: `src/pages/[lang]/tools/[slug].astro`
- Modify: `src/components/tools/AdditionalToolIsland.tsx`
- Modify: `src/components/tools/data-text/ui.ts`
- Modify: `src/components/tools/media-calc/ToolShell.tsx`
- Modify: `src/components/tools/pdf/shared.tsx`
- Modify: all direct children matching `src/components/tools/*.tsx` that render tool controls
- Modify: `src/components/tools/data-text/*.tsx`
- Modify: `src/components/tools/media-calc/*.tsx`
- Modify: `src/components/tools/pdf/*.tsx`

**Step 1: Write primitive and representative regression tests**

In `tool-ui.test.tsx`, verify labeled fields, description/error linkage, primary/secondary action order, result `aria-live`, progress state, drop-zone keyboard handling, and disabled styling. Extend representative existing tests for text (`JsonFormatter`), image (`ImageConverter`), calculator (`BmiCalculator`), PDF (`PdfMergeTool` through `AdditionalToolIsland`), and media (`AudioTrimmerTool`) to assert the shared semantic classes without altering outputs.

Run:

```sh
npm test -- --run src/components/tools/ui/__tests__/tool-ui.test.tsx \
  src/components/tools/__tests__/JsonFormatter.test.tsx \
  src/components/tools/__tests__/ImageConverter.test.tsx \
  src/components/tools/__tests__/BmiCalculator.test.tsx \
  src/data/tools/__tests__/additionalToolsIntegration.test.ts
```

Expected: FAIL because shared primitives are absent.

**Step 2: Implement the shared tool API**

Use these stable interfaces:

```ts
export interface ToolFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export interface ToolResultProps {
  title?: string;
  status?: 'idle' | 'working' | 'success' | 'error';
  children: React.ReactNode;
}
```

`ToolPanel` owns only visual framing; it must not own business state. `ToolActions` renders primary then secondary actions and stacks them full-width below 480px. `ToolResult` uses `role="status"` for non-error updates and `role="alert"` only for errors.

**Step 3: Redesign the route shell**

`ToolLayout.astro` and localized `[slug].astro` must share: compact breadcrumb, editorial title/description, favorite/share actions, one raised work surface, privacy reassurance row, related tools, and instruction copy. Preserve current canonical/robots decisions, FAQ/WebApplication JSON-LD, ad slots, lazy island selection, bookmark prompt, and recent-tool tracking.

**Step 4: Migrate tool families in bounded batches**

1. Shared/additional tools: `data-text/ui.ts`, `media-calc/ToolShell.tsx`, `pdf/shared.tsx` and their 13 consumers.
2. Text/developer tools: JSON, Base64, hash, regex, URL, UTM, JWT, UUID, cron, Markdown, text counter, lorem, Korean/English converter.
3. Calculator/time tools: age, BMI, D-day, discount, Dutch pay, percent, unit, LLM cost, timestamp, timer, world clock, pomodoro, dice/coin.
4. Image/color tools: converters, resizers, cropper, metadata/EXIF/background, QR, gradients, palette, box shadow, screenshots.

For each batch, replace local button/input/card class strings with shared primitives while leaving parsing, workers, downloads, file privacy, object URL cleanup, and error messages untouched.

After each batch run:

```sh
npm test -- --run src/components/tools/__tests__/allTools.test.tsx \
  src/components/tools/__tests__/fileSelectionBehavior.test.tsx \
  src/components/tools/__tests__/fileToolsPrivacy.test.tsx \
  src/components/tools/__tests__/mobileRemainingTools.test.tsx
```

Expected: PASS after every batch.

**Step 5: Run the complete tool suite and bundle guard**

Run: `npm test -- --run src/components/tools src/lib/pdf src/lib/data-text src/lib/media-calc && npm run check && npm run build && node scripts/check-bundles.mjs dist`

Expected: all tool tests PASS, build succeeds, route bundle budgets stay within limits.

**Step 6: Commit each batch, then the route shell**

Use commits:

```sh
git commit -m "feat: add shared tool interface primitives"
git commit -m "refactor: unify additional tool interfaces"
git commit -m "refactor: unify text and developer tools"
git commit -m "refactor: unify calculator and time tools"
git commit -m "refactor: unify image and color tools"
git commit -m "feat: redesign localized tool detail shell"
```

Stage only files touched by the current batch.

## Task 7: Unify games and project experiences

**Files:**
- Modify: `src/pages/[lang]/games/index.astro`
- Modify: `src/pages/[lang]/games/[slug].astro`
- Modify: `src/pages/games/index.astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/projects/games.astro`
- Modify: `src/pages/projects/memory-game.astro`
- Modify: `src/pages/projects/number-guess.astro`
- Modify: `src/pages/projects/reaction-test.astro`
- Modify: `src/pages/projects/rock-paper-scissors.astro`
- Modify: `src/pages/projects/roulette.astro`
- Modify: `src/pages/projects/slot-machine.astro`
- Modify: `src/components/games/*.tsx`
- Modify: `src/components/games/roulette/*.tsx`
- Modify: `src/components/MemoryGame.tsx`
- Modify: `src/components/NumberGuess.tsx`
- Modify: `src/components/ReactionTest.tsx`
- Modify: `src/components/RockPaperScissors.tsx`
- Modify: `src/components/Roulette.tsx`
- Modify: `src/components/SlotMachine.tsx`
- Create: `src/components/games/__tests__/game-theme-contract.test.ts`

**Step 1: Write the failing game contract test**

Read all game component sources and reject purple gradient/glass/translate-on-hover patterns. Assert shared game root classes and accessible restart/action controls. Keep existing gameplay tests as functional baselines.

Run: `npm test -- --run src/components/games/__tests__/game-theme-contract.test.ts src/components/games/__tests__/HangmanGame.test.ts`

Expected: FAIL on legacy styling.

**Step 2: Migrate catalog and game shells**

- Game catalog uses the same filter/list grammar as tools.
- Game detail pages use `PageShell`, `PageHeader`, and one focused play surface.
- Scores/status use forest/cinnamon tokens; game boards may retain necessary semantic colors for success/danger/teams.
- Inputs/buttons/modals follow the shared state system; all canvas/SVG/game mechanics remain untouched.
- Legacy `/projects/*` game routes and localized routes receive matching surrounding chrome without changing their URLs or share metadata.

**Step 3: Verify gameplay and mobile sizing**

Run: `npm test -- --run src/components/games src/data/__tests__/games.test.ts src/data/__tests__/games-locales.test.ts && npm run check`

Expected: PASS.

**Step 4: Commit**

```sh
git add src/components/games src/components/MemoryGame.tsx src/components/NumberGuess.tsx src/components/ReactionTest.tsx src/components/RockPaperScissors.tsx src/components/Roulette.tsx src/components/SlotMachine.tsx 'src/pages/[lang]/games' src/pages/games src/pages/projects
git commit -m "feat: unify games and project experiences"
```

## Task 8: Migrate editorial, policy, and specialized public pages

**Files:**
- Modify: `src/components/SitePolicyPage.astro`
- Modify: `src/pages/[lang]/about.astro`
- Modify: `src/pages/[lang]/contact.astro`
- Modify: `src/pages/[lang]/privacy.astro`
- Modify: `src/pages/[lang]/terms.astro`
- Modify: `src/pages/[lang]/disclaimer.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[...slug].astro`
- Modify: `src/pages/blog/tag/[tag].astro`
- Modify: `src/pages/articles/index.astro`
- Modify: `src/pages/articles/admin.astro`
- Modify: `src/pages/dashboard.astro`
- Modify: `src/pages/jobs/index.astro`
- Modify: `src/pages/llm-wiki/index.astro`
- Modify: `src/pages/content-os.astro`
- Modify: `src/pages/anonymous-chat.astro`
- Modify: `src/pages/[lang]/anonymous-chat.astro`
- Modify: `src/pages/projects/pastedock*.astro`
- Modify: `src/pages/projects/pastedock/*.astro`
- Modify: relevant children in `src/components/articles`, `dashboard`, `jobs`, and `llm-wiki`
- Create: `src/styles/__tests__/public-pages-contract.test.ts`

**Step 1: Write a route/template source contract**

Enumerate the public page templates above and assert each imports `MainLayout` or a shared page primitive, uses `fc-prose` for long copy where applicable, and contains no old `gradient-text`, `gradient-bg`, `backdrop-blur`, or hover translation. Explicitly exempt visualization-internal colors in charts and the LLM knowledge graph.

Run: `npm test -- --run src/styles/__tests__/public-pages-contract.test.ts`

Expected: FAIL until templates migrate.

**Step 2: Migrate by page family**

- Blog/article/policy: 68ch reading column, calm metadata, forest links, cinnamon callouts, code blocks with espresso background.
- Dashboard/jobs/articles: wide shell, shared filters/inputs/cards/tables, data semantics retained.
- LLM wiki/content OS: unify outer shell and controls; preserve dense visualization-specific layouts and state logic.
- Anonymous chat: shared controls and surfaces; preserve Firebase behavior, moderation copy, and localized routing.
- PasteDock policy/pricing and remaining project pages: shared headings, pricing surfaces, buttons, and dark mode.

Do not edit article bodies merely to force visual conformance; typography belongs in `.fc-prose`.

**Step 3: Run focused and integration tests**

Run:

```sh
npm test -- --run src/components/articles src/components/dashboard src/components/llm-wiki \
  src/components/__tests__/Chat.test.tsx src/styles/__tests__/public-pages-contract.test.ts
npm run check
```

Expected: PASS.

**Step 4: Commit by family**

```sh
git commit -m "feat: restyle editorial and policy pages"
git commit -m "feat: restyle dashboard and discovery pages"
git commit -m "feat: restyle chat and specialized experiences"
```

## Task 9: Verify accessibility, responsive behavior, dark mode, SEO, and performance

**Files:**
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/catalog.spec.ts`
- Create: `tests/e2e/forest-cafe-visual.spec.ts`
- Create: `tests/e2e/forest-cafe-routes.ts`
- Create: `docs/superpowers/reports/2026-07-23-forest-cafe-verification.md`

**Step 1: Add failing end-to-end assertions**

Define a representative route matrix covering home, catalog, text tool, file tool, game catalog, game detail, blog article, policy, dashboard, and chat in Korean/English plus one RTL locale. For each route assert:

- no horizontal overflow at 390px;
- D2Coding is the first computed family;
- light/dark backgrounds and text meet the named semantic tokens;
- theme persists across navigation/reload;
- keyboard focus is visible;
- skip link reaches main;
- one `h1`, valid landmarks, and no serious Axe violations.

Visual screenshots should use stable viewport/content, mask ads/time-dependent areas, and save light/mobile-dark references. Do not assert pixel identity for canvas games.

Run: `npm run build && npx playwright test tests/e2e/forest-cafe-visual.spec.ts --project=desktop --project=mobile-390`

Expected: initially FAIL wherever a page family still violates the contract.

**Step 2: Fix only verified regressions**

Address overflow, contrast, focus order, truncation, RTL alignment, or theme-state issues at the shared primitive/token level first. Add route-local fixes only where the layout is genuinely unique. Never remove content, headings, metadata, or functionality to make screenshots pass.

**Step 3: Run the complete verification ladder**

Run in this order:

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

Expected:

- all Vitest files pass;
- Astro check has zero errors;
- all localized routes build (baseline: 1,269 pages unless intentional route data changed, which this plan does not authorize);
- site validation and content audit pass;
- all bundle budgets pass;
- Axe reports no serious/critical violations;
- desktop/mobile light/dark visual checks pass.

**Step 4: Perform a manual browser review**

At 390, 768, and 1440 widths, inspect at least home, tools, one PDF tool, one calculator, one game, one article, and one RTL page in both themes. Confirm D2Coding loads from `/fonts/D2Coding.woff2`, unsupported scripts fall back without tofu, hover does not shift layout, and all primary actions remain obvious.

Record commands, pass counts, built page count, representative routes, and any intentional visual-test masking in `docs/superpowers/reports/2026-07-23-forest-cafe-verification.md`.

**Step 5: Final commit**

```sh
git add tests/e2e docs/superpowers/reports/2026-07-23-forest-cafe-verification.md
git commit -m "test: verify forest cafe redesign across public site"
```

## Completion guardrails

- Do not deploy, push, enable AdSense, or modify ad environment variables as part of this plan.
- Do not stage or alter `.superpowers/sdd/rollout-task-1-report.md`.
- Do not change registry content, route slugs, localized copy, SEO policy, analytics behavior, or tool algorithms unless a failing regression test proves the redesign broke them.
- Keep route-specific lazy imports in `AdditionalToolIsland.tsx`; visual unification must not collapse tools into one large client bundle.
- Every task ends with focused tests and a small commit; Task 9 is the only completion claim.

## Plan self-review checklist

- Spec coverage: D2Coding, forest/cinnamon palette, warm light theme, espresso dark theme, every public page family, 54 tools, games, responsive, RTL, accessibility, SEO, and bundle budgets are mapped to tasks.
- Interface consistency: `PageShell`, `PageHeader`, `Surface`, `ToolField`, `ToolActions`, and `ToolResult` have one stable responsibility each; Astro shells do not own React tool state.
- Verification: every implementation task begins with a failing test or contract and ends with an explicit command and expected result.
- Scope safety: no deployment, ad activation, content rewrite, route change, or unrelated worktree mutation is authorized.
