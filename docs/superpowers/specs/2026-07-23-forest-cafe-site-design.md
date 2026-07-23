# Restato Forest Café Site Design

## Objective

Unify every public Restato page—including tools, blog, games, projects, policies, and utility states—under one calm, warm, modern visual system. Preserve all current functionality, localization, SEO, privacy behavior, and dark-mode support.

## Design Direction

The approved direction is **Forest Café**: warm paper surfaces, deep forest green as the primary brand color, a green-tinted espresso dark mode, and a very small amount of cinnamon as a supporting accent. The visual language must feel hand-considered rather than generated: no decorative gradients, glassmorphism, oversized pill controls, floating card mosaics, or excessive motion.

### Color Tokens

Light mode:

- Page background: `#F3F0E8`
- Primary surface: `#FBF9F4`
- Primary text: `#26231F`
- Muted text: `#687269`
- Border: `#D5DAD4`
- Primary green: `#315B49`
- Soft green surface: `#DEE8E1`
- Cinnamon support: `#B96A4B`

Dark mode:

- Page background: `#131814`
- Primary surface: `#1C241F`
- Primary text: `#F1EDE4`
- Muted text: `#A7B0A8`
- Border: `#2E3A33`
- Primary green: `#78A98C`
- Soft green surface: `#23372D`
- Cinnamon support: `#D48261`

Green is used for primary actions, selected states, links, focus states, and tool identity. Cinnamon is limited to small editorial markers, warnings, and occasional highlights so the palette does not resemble a red-and-green seasonal theme.

## Typography

Use **D2Coding** as the site-wide primary typeface, self-hosted in WOFF2 form when licensing and distributable source are verified. The fallback stack is `D2Coding, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.

Because D2Coding is monospaced:

- Body text uses at least `16px` with `1.7` line height.
- Long-form reading columns are limited to approximately `68ch`.
- Headings use restrained sizes and negative tracking only where Korean glyph rendering remains clear.
- Buttons and navigation avoid all-uppercase labels except short English eyebrow text.
- Code blocks use the same family but remain visually distinct through surface and border tokens.

## Layout System

- Global content width: `1120px` for catalogs and dashboards.
- Reading width: `68ch` for articles and policy pages.
- Mobile page padding: `20px`; desktop page padding: `32px`.
- Section rhythm: 64–96px on desktop and 40–64px on mobile.
- Cards use 12–16px radii, thin borders, and little or no shadow.
- Inputs and primary buttons use consistent 12px radii and minimum 44px touch height.
- Spacing follows a 4px base scale with 8, 12, 16, 24, 32, 48, 64, and 96px steps.

## Shared Components

Create one reusable visual contract for:

- Header, mobile navigation, language selector, and theme control
- Footer and policy navigation
- Page hero and section headings
- Search input and search-results panel
- Tool, article, project, and game cards
- Buttons, icon buttons, fields, selects, textareas, tabs, chips, notices, and empty states
- Tool workspace shell, file dropzone, result panel, and privacy notice
- Article prose, tables, code, quotes, and media
- Loading, error, disabled, success, and focus states

Existing Astro and React components should consume shared CSS component classes or small shared primitives rather than maintaining separate visual rules per feature batch.

## Page Templates

### Home

Use a compact editorial hero, global tool search, a restrained popular-tool grid, and clear routes into tools, articles, and projects. Remove promotional gradients, bouncing emoji, inflated counters, and duplicated calls to action.

### Tool Catalog

Keep search first, category filtering second, and the tool grid third. Cards use consistent line icons or typographic marks instead of mixed emoji presentation. Filtering must retain keyboard access, visible selected state, and result count.

### Tool Detail

Use one tool workspace shell for all tools. The interactive area appears before explanatory content. Input, processing, result, privacy, related tools, examples, limitations, and FAQ follow a predictable order. Heavy PDF and media code remains route-lazy.

### Blog and Articles

Use a narrow reading column, calm metadata, consistent cards, restrained code treatment, and predictable previous/next navigation. Typography and surfaces must work in all 12 supported languages.

### Games and Projects

Retain each experience’s functional identity while wrapping controls, headings, cards, status panels, and navigation in the shared Forest Café system. Canvas/gameplay visuals may remain specialized, but surrounding chrome must be consistent.

### Policy and Utility Pages

Use the same reading template, breadcrumb, section rhythm, link treatment, and footer. Empty, error, 404, dashboard, chat, and admin pages receive the same tokens and controls.

## Interaction and Motion

- Default transitions: 120–180ms.
- Animate only opacity, color, border color, and transforms up to 2px.
- No looping decorative animation.
- Respect `prefers-reduced-motion` globally.
- Hover is supplemental; all actions work by keyboard and touch.
- Focus rings use the primary green and remain visible in both themes.
- Async actions disable repeated submission and expose clear progress or status text.

## Accessibility

- Normal text contrast must meet WCAG AA at minimum.
- Interactive targets are at least 44×44px where practical.
- Every input has a programmatic label.
- Icon-only controls have localized accessible names.
- Navigation, filters, tabs, dialogs, and search results are keyboard operable.
- Color is never the only state indicator.
- Light and dark themes receive separate contrast checks.

## Search and Discoverability

Visual refactoring must not change existing localized URLs, canonical tags, hreflang alternates, structured data, sitemap inclusion, tool registry records, or indexability rules. Global tool search continues to index all 54 published tools using localized names, descriptions, and keywords. Search results use the new shared card and focus styles without changing navigation behavior.

## Implementation Boundaries

- Preserve all existing business logic and file-processing behavior.
- Do not introduce a new component framework.
- Keep Astro, React, and Tailwind as the implementation stack.
- Prefer shared tokens and primitives over page-by-page duplicated classes.
- Do not load decorative web assets or third-party scripts solely for appearance.
- Self-host D2Coding only after its license and source are verified; otherwise use a local/system fallback until a compliant asset is available.
- Do not deploy or publish as part of the redesign implementation without separate authorization.

## Verification

The redesign is complete only when:

- All existing unit and integration tests pass.
- Astro type checking reports no errors.
- Production build, site validation, content audit, and bundle budgets pass.
- Desktop and mobile screenshots cover home, catalog, representative tool, article, game, project, policy, and 404 pages in light and dark themes.
- Keyboard navigation and focus are manually verified on shared controls.
- Automated accessibility checks pass on representative desktop and mobile routes.
- No horizontal overflow occurs at 320, 375, 768, 1024, and 1440px widths.
- Existing localized routes, search results, sitemap counts, and SEO metadata remain intact.
