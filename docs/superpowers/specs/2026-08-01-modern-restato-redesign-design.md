# Modern Restato Redesign

## Objective

Replace the deployed site's dark terminal-like presentation and inconsistent branding with a simple, modern, slightly angular system. Apply the system consistently to every public page while preserving existing functionality, localization, search, SEO, privacy behavior, and light/dark theme support.

This design supersedes the visual direction in `2026-07-23-forest-cafe-site-design.md`. The earlier warm café palette, site-wide D2Coding typography, and rounded geometry are intentionally retired.

## Approved Direction

The approved direction is **Modern Restato**:

- Structured and functional like the reviewed “Modern Utility” option.
- Neutral rather than café-inspired, decorative, or rustic.
- Slightly angular, using restrained corner radii instead of pills and large rounded cards.
- White and charcoal surfaces with deep green used only for brand and interaction emphasis.
- A custom `R + leaf` vector mark replaces the rocket emoji and anonymous green dot.
- Apple system typography is the default. Monospace appears only where the content is genuinely code or machine data.

Avoid beige paper textures, brown accents, ornamental gradients, glassmorphism, oversized pills, floating card mosaics, AI sparkle motifs, emoji tool icons, and decorative animation.

## Brand Mark and Icons

Create one deterministic SVG brand mark that combines a compact `R` with a small leaf detail.

- Primary light-mode tile: deep green background, off-white `R`, muted green leaf.
- Primary dark-mode tile: muted green background, dark `R`, light neutral leaf.
- Base geometry: rounded square with a `7px` visual corner radius in the 32×32 source view box.
- The silhouette must remain recognizable at 16×16 and in monochrome.
- Keep the leaf secondary; the mark should read as an `R` first.
- Do not use raster generation, emoji, a rocket, coffee imagery, or AI sparkle symbols.

Use the same source geometry for the header mark, favicon, Apple touch icon, and web-app icons. Export or generate the required raster sizes from the canonical SVG so the shapes cannot drift.

Tool cards use a coherent family of simple line or typographic symbols. Existing text abbreviations such as `{ }`, `QR`, `Aa`, and `#` may remain when they communicate more clearly than a pictogram, but their container geometry, weight, and color must be consistent. Icon-only controls require localized accessible names.

## Color System

### Light mode

- Page background: `#F7F8F7`
- Raised surface: `#FFFFFF`
- Soft surface: `#EDF3EF`
- Primary text: `#15241D`
- Muted text: `#657169`
- Border: `#DCE3DF`
- Primary green: `#19553C`
- Primary hover: `#236B4C`
- Soft green detail: `#9CC4AD`
- Focus ring: `#2C7655`

### Dark mode

- Page background: `#111713`
- Raised surface: `#19211D`
- Soft surface: `#24342B`
- Primary text: `#F0F4F1`
- Muted text: `#9CA8A1`
- Border: `#303A34`
- Primary green: `#70A889`
- Primary hover: `#89B99D`
- Deep green feature surface: `#1D3D2F`
- Focus ring: `#8DC0A1`

Dark mode must not use pure black, neon green, or high-contrast terminal styling. The page, card, soft surface, and border colors form distinct but subtle layers. Text contrast must meet WCAG AA.

## Typography

Use the Apple system stack as the site-wide default:

```css
-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif
```

On Apple platforms this resolves to the native San Francisco family without downloading or redistributing font files. On other platforms it uses the closest native UI fallback.

- Body text uses `15–16px` with `1.65–1.75` line height.
- Korean headings use restrained negative letter spacing only where readability remains clear.
- Long-form reading columns remain near `68ch`.
- Navigation and buttons use sentence case, not forced uppercase.
- Use D2Coding or the existing monospace fallback only inside code blocks, editors, JSON values, encoders, hashes, and other machine-data fields.
- Remove D2Coding from global body, headings, navigation, buttons, and editorial copy.

## Geometry and Spacing

The visual system is deliberately more angular than the current deployment:

- Page-level framed previews and large shells: up to `10px` radius.
- Cards, panels, dialogs, menus, and tag chips: `8px` radius.
- Buttons, inputs, icon buttons, tool-symbol containers, and notices: `6px` radius.
- Brand mark: `7px` visual radius in its 32×32 source.
- Do not use pill shapes except where a binary/status token semantically benefits from one.
- Borders are the main separator; shadows are subtle and limited to floating layers.
- Maintain a 4px spacing base with practical steps of 8, 12, 16, 24, 32, 48, 64, and 96px.
- Interactive controls retain at least a 44×44px target even when their visible shape is smaller.

## Layout and Shared Components

Keep the existing Astro, React, and Tailwind stack. Consolidate visual rules into shared tokens and primitives rather than styling individual pages independently.

Unify:

- Header, mobile navigation, language selector, theme control, and footer.
- Page hero, section heading, breadcrumb, and reading container.
- Tool, article, project, and game cards.
- Buttons, icon buttons, inputs, selects, textareas, tabs, tag controls, notices, and empty states.
- Tool workspace, dropzone, result area, privacy notice, loading, success, error, and disabled states.
- Article prose, code, tables, quotes, previous/next navigation, and related content.

The home page uses a compact hero, two restrained calls to action, a four-column popular-tool grid, recent posts, and one deep-green feature panel for projects. The hero relies on typography and spacing, not illustration or ornamental decoration.

Tool catalog and detail pages keep search and primary interaction first. Games and projects may retain specialized content visuals, but their surrounding navigation, controls, cards, and status surfaces use the shared system.

## Blog Tag Navigation

The tag list at the top of the blog must be compact and deterministic.

- Count published posts for every tag in the current locale/content collection.
- Sort tags by descending published-post count.
- Break equal-count ties with English collation in ascending order for a stable Latin-first sequence across every locale.
- Show only the first 10 tags on initial render.
- Display each tag's post count next to its name.
- When more than 10 tags exist, show a localized `더보기` control after the visible list.
- Activating it reveals all remaining tags in place and changes the control to localized `접기`.
- Collapsing returns to the top 10 without navigation or page reload.
- The control exposes `aria-expanded` and references the expandable region.
- The expanded state does not need to persist across page navigation; every page load starts collapsed.
- With 10 or fewer tags, render no expand/collapse control.
- Existing tag URLs, selected-tag behavior, indexing, canonical metadata, and localization remain unchanged.

## Interaction and Accessibility

- Default transitions are `120–180ms` and limited to color, border color, opacity, and transforms of at most 2px.
- Respect `prefers-reduced-motion` globally.
- Hover is supplemental; every action works with keyboard and touch.
- Focus rings use the theme-specific focus token and remain clearly visible.
- Theme selection continues to honor saved preference and system preference without a flash of the wrong theme.
- Color is never the only state indicator.
- Labels and interactive status text are localized in all supported languages.
- Normal text, controls, and focus states meet WCAG AA.

## Search, Localization, and SEO

The redesign must not change existing localized routes, canonical tags, hreflang alternates, structured data, sitemap inclusion, tool registry records, or indexability rules. Global tool search continues to index all published tools with localized names, descriptions, and keywords. Search results receive the new shared visual treatment without behavior changes.

All layouts must tolerate long translated labels and right-to-left content where currently supported. Avoid fixed-height text containers that clip translations.

## Implementation Boundaries

- Preserve existing tool, content, game, and file-processing behavior.
- Do not introduce another component framework.
- Do not load third-party font or decoration scripts.
- Do not redistribute Apple's font files; use the native system stack.
- Prefer canonical SVG source plus deterministic icon exports.
- Keep heavy media/PDF code route-lazy.
- Do not deploy or publish without separate authorization.
- Preserve the unrelated working-tree change in `.superpowers/sdd/rollout-task-1-report.md`.

## Verification

The redesign is complete only when:

- Existing unit and integration tests pass.
- New tests cover tag ranking, the 10-tag collapsed limit, equal-count ordering, expansion, collapse, and the 10-or-fewer boundary.
- Astro type checking, production build, site validation, content audit, and bundle budgets pass.
- The canonical SVG renders legibly at 16, 32, 180, 192, and 512px.
- Desktop and mobile screenshots cover home, blog index with collapsed and expanded tags, article, tool catalog, representative tool, project/game, policy, and 404 pages in both themes.
- Keyboard navigation and focus are verified on shared controls and tag expansion.
- Automated accessibility checks pass on representative routes.
- No horizontal overflow appears at 320, 375, 768, 1024, and 1440px widths.
- Localized routes, search results, sitemap counts, metadata, and functional outputs remain unchanged.
