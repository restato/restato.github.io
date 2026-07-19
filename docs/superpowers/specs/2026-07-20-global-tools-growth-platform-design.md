# Global Tools Growth Platform Design

**Date:** 2026-07-20<br>
**Status:** Approved<br>
**Primary objective:** Grow organic search traffic and qualify the site for Google AdSense approval and advertising revenue.

## 1. Product Direction

Restato will become a privacy-first collection of genuinely useful browser tools rather than a high-volume collection of thin landing pages. Existing tools must work reliably before the catalog expands. New pages are indexable only when the tool, localized interface, localized metadata, help content, and automated tests are complete.

The site will retain its current static Astro deployment on GitHub Pages. User-entered text and files are processed in the browser. No tool may require a runtime backend or transmit user content to a third-party API. Anonymous usage analytics may be enabled separately, subject to consent requirements, but must never contain tool inputs, file contents, file names, generated values, or stable personal identifiers.

### Success priorities

1. Restore a trustworthy, fully tested baseline for the existing 41 tools.
2. Remove technical and content-quality obstacles to AdSense approval.
3. Add 24 high-intent tools in coherent search clusters.
4. Support 12 priority languages without publishing low-quality fallback pages.
5. Use Search Console and privacy-safe analytics data to choose later additions.

### Non-goals

- Publishing hundreds of near-duplicate keyword pages.
- Runtime AI, OCR, translation, or conversion APIs.
- User accounts, cloud file storage, or server-side processing.
- Rendering empty advertising containers before AdSense approval.
- Guaranteeing AdSense approval, which remains a decision made by Google.

## 2. Delivery Phases

### Phase A: Quality foundation

- Repair the test runner and all failing existing tests.
- Exercise every existing tool with valid, empty, invalid, boundary, and representative localized input.
- Fix localized navigation, canonical URLs, hreflang annotations, sitemap entries, console errors, broken links, mobile overflow, keyboard access, and accessible names.
- Audit privacy claims tool by tool. Replace global claims with accurate per-tool disclosures when dependencies download model or library assets.
- Merge materially duplicate experiences where appropriate, preserving old URLs with deterministic redirects.
- Move catalog metadata into a typed, single-source tool registry.

Phase A is a release gate for the rest of the project. New tools are not shipped while the existing catalog has unexplained test failures.

### Phase B: AdSense readiness

- Publish substantial localized About, Contact, Privacy, Terms, and Disclaimer pages.
- Give every indexable tool unique help content and an accurate privacy statement.
- Add advertising components that render nothing until a valid publisher ID and feature flag are configured.
- Reserve ads only in placements that do not obscure inputs, results, downloads, navigation, or consent controls.
- Audit the blog and non-tool routes for duplicate, outdated, mass-generated, or low-value indexable content.
- Add clear authorship, editorial purpose, update dates, and correction/contact paths where relevant.

### Phase C: First expansion wave

Add the 24 tools defined in section 5. Each cluster ships independently after its own functionality, localization, accessibility, SEO, and performance gates pass.

### Phase D: Measurement-led expansion

After sufficient Search Console impressions accumulate, rank candidate tools by:

- impressions and average position of related queries;
- click-through opportunity;
- expected user value and repeat use;
- browser-only implementation reliability;
- competition and differentiation;
- localization cost;
- performance and bundle-size cost.

Potential second-wave clusters include date and workday calculators, compound-interest and loan calculators with appropriate disclaimers, margin and VAT calculators, Open Graph previews, metadata generators, and robots.txt generators.

## 3. Architecture

### 3.1 Typed tool registry

A single typed registry will become the source for tool catalog cards, routes, localized SEO metadata, category pages, related-tool links, sitemap eligibility, structured data, and test enumeration.

Each tool record must define:

- stable slug and component key;
- category and task cluster;
- supported languages and localization-completeness state;
- localized name, short description, title, meta description, and search intent;
- privacy mode and browser capabilities used;
- related tool slugs;
- content module containing overview, use cases, steps, examples, limitations, privacy notes, and visible FAQs;
- indexability state;
- analytics event identifier;
- release status.

The registry must reject duplicate slugs, unknown relations, missing required translations, and indexable pages with incomplete content during tests or build validation.

### 3.2 Route generation

The canonical route pattern remains `/{lang}/tools/{slug}/`. Catalog cards and related-tool links must point directly to the active language route rather than passing through unprefixed JavaScript redirects.

Legacy `/tools/{slug}` routes remain only as compatibility redirects. They are excluded from sitemaps and canonicalize to the matching localized route. Redirect behavior must not be the only way crawlers discover localized pages.

### 3.3 Browser processing boundary

Tool logic is separated from React presentation where practical:

- pure conversion and calculation functions live in focused library modules;
- components manage validation, progress, cancellation, accessibility, and downloads;
- CPU-heavy PDF and image work uses web workers when it materially protects responsiveness;
- generated files use object URLs that are revoked when replaced or on unmount;
- file-size and memory limits are explicit before processing starts;
- failures produce actionable localized messages without exposing implementation traces.

No feature may silently upload content. Network behavior for each file-processing tool is covered by browser tests.

## 4. Priority Languages

The first global release supports:

1. Korean (`ko`)
2. English (`en`)
3. Japanese (`ja`)
4. Simplified Chinese (`zh-CN`)
5. Traditional Chinese (`zh-TW`)
6. Spanish (`es`)
7. Portuguese (`pt`)
8. German (`de`)
9. French (`fr`)
10. Italian (`it`)
11. Indonesian (`id`)
12. Hindi (`hi`)

English is the `x-default` version. A language page is indexable only when its interface, metadata, instructions, examples, FAQs, validation messages, and policy/navigation shell pass the localization completeness check. Incomplete languages may display an explicit English fallback for users, but the page receives `noindex, follow`, is omitted from language sitemaps, and is not referenced as a completed hreflang alternate.

Translations must be idiomatic rather than word-for-word keyword substitutions. Numbers, dates, separators, units, examples, and search phrases must follow locale conventions. Financial tools added later require locale-specific assumptions and disclaimers.

## 5. First-Wave Tool Portfolio

### PDF tools (8)

1. Merge PDF
2. Split PDF and extract pages
3. Reorder and delete PDF pages
4. Rotate PDF pages
5. Images to PDF
6. PDF pages to images
7. Add PDF watermark
8. Add PDF page numbers

### Developer and data tools (7)

9. SQL formatter
10. YAML to JSON and JSON to YAML
11. CSV to JSON and JSON to CSV
12. XML formatter and validator
13. HTML formatter and minifier
14. CSS minifier
15. URL parser and query inspector

### Image tools (4)

16. Image compressor
17. Rotate and flip image
18. Favicon generator
19. Image color extractor

### Text tools (5)

20. Text case converter
21. Whitespace cleaner
22. Duplicate-line remover
23. Line sorter
24. URL slug generator

Combined actions that share one input and mental model stay on one page, such as YAML/JSON conversion. Actions with distinct workflows and search intent remain separate. Every tool must provide immediate value without sign-in, artificial limits, or misleading paid gates.

## 6. Page and Content Design

### Tool page structure

1. Breadcrumb and clear H1.
2. Concise value proposition and truthful local-processing badge.
3. Primary tool interface above the fold.
4. Result, copy, reset, and download actions with accessible status feedback.
5. Visible privacy and file-handling explanation.
6. Unique use cases and step-by-step instructions.
7. A representative example that users can load without uploading a file where feasible.
8. Limitations and error guidance.
9. Visible frequently asked questions.
10. Related tools selected from the registry.
11. Share and bookmark affordances that do not interrupt the task.

Help content must be specific to the tool. Boilerplate sentences that merely swap a tool name do not satisfy the publication gate.

### Catalog and discovery

The tool hub and category pages include:

- prominent task-based search;
- popular tools based on privacy-safe usage counts when analytics is enabled;
- recently used and favorited tools stored locally;
- task clusters such as “prepare a PDF,” “clean developer data,” and “prepare an image”;
- clear category filters with visible result counts;
- crawlable server-rendered links for all published tools.

The visual design remains fast and restrained. Tool interfaces take priority over promotional content and advertisements.

## 7. Search Design

- Each completed language page has a self-referencing canonical URL.
- Hreflang relationships include only complete reciprocal translations plus English `x-default`.
- Split sitemaps list only canonical, indexable URLs and use meaningful last-modified dates rather than rewriting every date at every build.
- Category pages provide original task-oriented introductions and crawlable links.
- Tool pages use appropriate `WebApplication` or `SoftwareApplication` structured data only when the visible page supports every asserted field.
- Catalog pages may use `ItemList`; navigational trails use `BreadcrumbList`.
- Visible FAQs remain useful content, but FAQ structured data is not treated as a traffic tactic because Google limits FAQ rich results for most sites.
- Deprecated HowTo rich-result markup is not added.
- Titles and descriptions target the primary local search intent without keyword repetition.
- Thin query variants do not receive separate pages.
- Search-focused content is reviewed against Google’s people-first content and scaled-content-abuse guidance.

## 8. AdSense and Analytics

### AdSense preparation

The previous rejection reason is unknown, so the design addresses the common controllable factors without claiming a guaranteed outcome: site purpose, original value, functioning navigation, policy transparency, content depth, and a stable user experience.

Before approval:

- advertising scripts are absent;
- advertising components return no markup;
- no blank boxes imitate advertisements;
- policy and contact pages are complete;
- the site remains useful without advertising.

After approval, deployment configuration supplies the publisher ID and enables ads. Placements are centrally configured and testable. Ads never appear between an input and its result, over file controls, next to deceptive download buttons, or in a way that causes layout shift.

### Analytics

When a GA4 measurement ID is configured, the site may emit events for catalog search, tool open, processing start, successful completion, failure category, download, copy, favorite, and share. Event payloads contain only the stable tool identifier, locale, action, coarse performance duration, and non-sensitive error category.

Consent controls are shown where applicable. Tool functionality is never conditional on analytics consent.

## 9. Error Handling and Performance

- Validate file type, signature where feasible, size, page count, dimensions, and empty content before expensive work.
- State browser memory limits honestly; do not promise unlimited processing.
- Provide progress and cancellation for operations that can take more than a brief interaction.
- Keep the main thread responsive for heavy PDF and image operations.
- Recover from malformed inputs without losing the user’s source data.
- Never include user content in console logs or analytics.
- Lazy-load large libraries only on the tools that require them.
- Track per-route JavaScript budgets and prevent the PDF/image toolchain from inflating unrelated pages.

Core Web Vitals targets at the 75th percentile are LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1. Lab gates use Lighthouse scores of at least 90 for Performance, Accessibility, Best Practices, and SEO on representative desktop and mobile pages.

## 10. Test Strategy and Release Gates

### Automated layers

1. **Pure logic tests:** conversions, calculations, parsing, PDF page selection, locale formatting, and invalid inputs.
2. **Component tests:** user flows, validation, copy, reset, download preparation, keyboard behavior, accessible names, and localized feedback.
3. **Registry tests:** unique slugs, valid relations, translation completeness, index eligibility, category coverage, and expected route counts.
4. **Build tests:** Astro type checking, production build, sitemap generation, canonical URLs, reciprocal hreflang, structured-data parsing, and absence of broken internal links.
5. **Browser tests:** critical tool flows at desktop and mobile widths, downloads, console errors, horizontal overflow, network privacy boundaries, dark mode, and all 12 navigation shells.
6. **Accessibility tests:** automated axe checks plus keyboard-only checks of representative tools in every interaction family.
7. **Performance tests:** Lighthouse CI on the hub and representative text, developer, PDF, and image tools.

### Input matrix

Every tool covers:

- a representative successful input;
- empty input;
- malformed or unsupported input;
- minimum and maximum supported values;
- non-Latin text where applicable;
- large but supported input;
- copy or download output verification;
- reset and repeated-operation behavior.

PDF and image downloads are reopened or decoded in tests to validate the generated artifact rather than merely asserting that a download function ran.

### Release conditions

A cluster is deployable only when:

- the full test suite passes with zero unexplained failures;
- the production build and link/SEO validator pass;
- all promised languages for its indexable pages pass completeness checks;
- browser privacy tests observe no user-content uploads;
- accessibility and Lighthouse thresholds pass on representative routes;
- no new console errors are present;
- the requirements checklist for the cluster is complete.

## 11. Risks and Mitigations

### Translation scale

Twelve complete languages multiply content and QA work. Mitigation: release languages behind completeness gates, keep fallbacks out of the index, and prioritize reusable interface vocabulary without duplicating tool-specific prose.

### Client-side PDF and image limits

Large documents can exhaust mobile memory. Mitigation: explicit limits, lazy-loaded libraries, workers, cancellation, cleanup of object URLs and buffers, and device-realistic fixtures.

### Search quality risk

Many superficially different pages can look mass-produced. Mitigation: one page per distinct task, working interactive value, original examples and limitations, content audits, and no keyword-variant pages.

### Unknown AdSense rejection reason

The site cannot optimize against an unavailable exact reason. Mitigation: build a verifiable readiness checklist, preserve screenshots and audit evidence, and review the next AdSense response before changing strategy.

### Analytics and privacy tension

Growth measurement can contradict a privacy-first promise. Mitigation: separate anonymous product events from tool content, honor consent requirements, publish exact collection behavior, and keep tools functional without analytics.

## 12. Evidence-Informed Decisions

- Google recommends people-first content and warns against scaled pages created primarily to manipulate rankings: <https://developers.google.com/search/docs/fundamentals/creating-helpful-content> and <https://developers.google.com/search/docs/essentials/spam-policies>.
- Google recommends separate URLs and hreflang annotations for multilingual versions: <https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites>.
- Current Core Web Vitals targets are documented at <https://web.dev/articles/vitals>.
- Large tool competitors emphasize PDF, image, file, and conversion clusters, supporting the chosen initial portfolio: <https://tinywow.com/>.

## 13. Completion Definition

The program is complete only when the existing catalog has a clean verified baseline, AdSense-readiness requirements are implemented, all 24 first-wave tools meet the release gates, and all 12 priority languages either pass the indexability gate or remain explicitly excluded from indexing. Deployment and AdSense activation remain separate actions and require fresh verification and, for activation, a valid approved publisher account.
