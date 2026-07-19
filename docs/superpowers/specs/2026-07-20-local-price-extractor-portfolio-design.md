# Local Price Extractor Portfolio Design

## Goal

Add Local Price Extractor to the public Restato project portfolio so visitors can understand the experiment, install it from GitHub, and evaluate its local-first privacy model without implying that it is a production Chrome Web Store release.

## Product Positioning

Local Price Extractor is an **Experimental Prototype**. It demonstrates that Chrome's built-in on-device Language Model API can turn bounded shopping-page content into structured product and price data while deterministic validation rejects values that are not grounded in the captured page.

The primary message is:

> Extract product prices from the page you are viewing with Chrome's built-in AI, without sending the page to a backend.

The page must explicitly state that Korean extraction worked in the tested environment but is experimental because Korean is not currently an officially supported Prompt API language.

## Considered Approaches

### 1. Project card linking directly to GitHub

This is the smallest change, but it gives visitors little context about the privacy boundary, experimental status, installation flow, or validation strategy. It is not sufficient as a portfolio case study.

### 2. Project card and dedicated detail page — selected

Add a catalog card and a purpose-built Astro page at `/projects/local-price-extractor`. This follows the existing RoomFit 3D portfolio pattern, preserves the site's current project architecture, and provides enough space for positioning, workflow, installation, limitations, and GitHub access.

### 3. Refactor the entire catalog to Astro content collections

This would improve long-term project authoring, but it expands the task into an unrelated portfolio architecture migration. The current `src/data/projects.ts` catalog and file-based detail pages already meet this feature's needs.

## Information Architecture

### Project catalog card

The card appears near the top of the existing projects list and contains:

- Title: `Local Price Extractor`
- Description: `Extract product prices locally with Chrome's built-in AI—no shopping-page backend required.`
- Icon: `🏷️`
- Gradient: amber to orange, distinguishing commerce tooling from the cyan/indigo RoomFit card
- Badge: `EXPERIMENTAL`
- Destination: `/projects/local-price-extractor`

The projects page metadata description is updated to include Local Price Extractor.

### Detail page

The page uses the site's existing English, language-locked project-page convention and contains these sections:

1. **Hero**
   - Experimental Prototype status
   - Chrome Extension, On-Device AI, and No Backend chips
   - One-sentence product promise
   - Primary `View on GitHub` action
   - Summary cards for platform, processing boundary, and tested result

2. **How it works**
   - Capture a bounded representation of the active page
   - Ask Chrome's built-in model for schema-constrained product JSON
   - Validate titles, prices, and URLs against the captured source

3. **Install and try it**
   - Download or clone the public repository
   - Enable Chrome extension developer mode
   - Load the unpacked repository directory
   - Open a shopping page and select `현재 페이지 분석`
   - Explain that the first run may download the on-device model

4. **Privacy and limits**
   - No backend and no remote scripts in the prototype
   - Active page content stays inside the user's Chrome environment
   - Korean result is experimental, not a production reliability claim
   - Requires a desktop Chrome environment that exposes the built-in Prompt API and meets model hardware/storage requirements

5. **Evidence and implementation**
   - Display the verified fixture result as `2 accepted / 0 rejected`
   - Summarize Manifest V3, JavaScript, Chrome LanguageModel API, JSON Schema, and Vitest
   - End with a GitHub call to action rather than a live-app button because there is no hosted product or Chrome Web Store listing

## Visual Direction

The page reuses `MainLayout`, CSS variables, spacing, rounded cards, and responsive grids already used by RoomFit 3D. Amber and orange accents evoke price tags and commerce while remaining readable in light and dark themes.

The hero includes a lightweight CSS-only extraction preview rather than a fabricated product screenshot. It shows a simplified shopping-page input flowing through an on-device AI stage into validated structured results. This communicates the architecture without claiming support for a specific retailer or introducing an image asset that can become stale.

No new JavaScript runtime, component framework, icon package, or remote asset is added.

## Data and Routing

- Add the card metadata to `src/data/projects.ts`.
- Add a static file-based Astro route at `src/pages/projects/local-price-extractor.astro`.
- Keep the repository URL as a page-level constant: `https://github.com/restato/local-price-extractor`.
- Add `SoftwareApplication` and `BreadcrumbList` structured data using the existing RoomFit 3D pattern.
- Keep all content static so GitHub Pages can publish it through the existing build.

## Testing and Verification

- Extend `src/data/projects.test.ts` to assert the exact catalog metadata and detail-page source requirements.
- Run the focused project data test.
- Run `npm run build` and confirm `/projects/local-price-extractor/index.html` is generated and included in the projects sitemap.
- Preview the built page at desktop and mobile widths and capture screenshots for the pull request.
- Check the page for keyboard-visible links, semantic heading order, readable color contrast, reduced motion compatibility, and no horizontal overflow.
- Record the existing unrelated test baseline separately: before this change, `npm run test:coverage -- --run` reports 131 failures out of 242 tests, while `npm run build` passes.

## Non-Goals

- Publishing the extension to the Chrome Web Store
- Adding a hosted extraction service or cloud fallback
- Claiming production support for Naver or any retailer
- Refactoring the full project catalog into content collections
- Repairing unrelated pre-existing test failures
