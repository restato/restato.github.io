# Quality Foundation Task 5 Report

## Delivered

- Added `scripts/validate-site.mjs` with the `validateSite(distDir)` interface.
- Added generated-HTML fixture coverage for missing and duplicate canonicals, broken internal links, asymmetric hreflang, trailing slashes, query strings, fragments, redirects, static assets, encoded paths, case-mismatched output paths, and ambiguous case-folded paths.
- Added `@astrojs/check` and `cheerio` development dependencies.
- Added `check`, `validate:site`, and deterministic `verify` scripts. `test:browser-mobile` remains an explicit independent command, as the quality plan does not include browser automation in `verify`.
- Corrected localized tool breadcrumb and BreadcrumbList home targets to the existing `/{lang}/tools` static route.
- Consolidated blog-tag URLs to lowercase, URL-safe slugs. Generated paths and every blog tag link now use the same mapping; tags differing only by case share one canonical route.

## Path resolution policy

The validator strips query strings/fragments and decodes URL path escapes, then accepts only exact generated static files, directory indexes, generated redirect pages, or trailing-slash variants. It precomputes exact and folded generated-path indexes once per run. Folded lookup is diagnostic-only: a case mismatch is an error, and a folded-key collision is reported as ambiguous rather than accepted. This matches GitHub Pages' case-sensitive deployment behavior.

Before rebuilding the tag routes, the strict validator measured the existing `dist` at **18.01 seconds real time** (`7.51s` user, `1.64s` system) and found **1,636** genuine tag-route case mismatches, such as `/blog/tag/AI` versus generated `/blog/tag/ai`. The indexed lookup prevents repeatedly scanning all generated paths for each link.

## TDD evidence

- Initial focused RED: the validator test could not resolve `scripts/validate-site.mjs` because the module did not exist.
- Focused GREEN: `npm test -- --run scripts/__tests__/validate-site.test.ts src/lib/__tests__/blogTags.test.ts` reports **2 files / 15 passing tests**, including a successful CLI invocation against a temporary generated-output fixture.
- Additional URL-encoding, strict case-mismatch, case-fold ambiguity, canonical-count, tag-slug deduplication, and static-path/source-contract tests each cover the corresponding behavior.

## Verification status

After the controller reproduced 27 Astro type errors, the type boundary between the 12-language registry and the three published static routes was made explicit with `RouteLanguage` in the localized page routes. Literal state, translation-map, test-mock, and stale-prop errors were repaired without widening those routes. A fresh `npm run check` completed with **0 errors** (85 existing hints), and focused component coverage passed **5 files / 90 tests**.

`npm run check` reached Astro diagnostics and printed no error diagnostics before the execution cell was terminated. It printed three pre-existing warnings:

- `src/components/Chat.tsx:79:51`: deprecated `React.FormEvent`.
- `src/components/NumberGuess.tsx:159:15`: deprecated `onKeyPress`.
- `src/components/NumberGuess.tsx:104:9`: unused `getHintColor`.

`npm run verify` was invoked again after the type remediation, but its full Vitest child exceeded this worker's response window and was intentionally terminated so the controller can run the complete chain in a unified session. No successful full-verification claim is made here. No unrelated production source changes were made to work around that execution limitation.

The controller's subsequent build reached the localized tool-detail route and found that Astro hoists `getStaticPaths`, so it cannot close over a module-local route-language constant. The route list now lives inside `getStaticPaths`; no other route generator captures such a module-local list.

For the strict path and tag consolidation changes, the controller must run `npm run build`, `npm run validate:site`, and `npm run verify` in one monitored session. This worker intentionally did not launch those long-running commands; therefore no post-consolidation build or full-verification success is claimed here.
