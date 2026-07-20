# Quality Foundation Task 5 Report

## Delivered

- Added `scripts/validate-site.mjs` with the `validateSite(distDir)` interface.
- Added generated-HTML fixture coverage for missing and duplicate canonicals, broken internal links, asymmetric hreflang, trailing slashes, query strings, fragments, redirects, static assets, encoded paths, case-mismatched output paths, and ambiguous case-folded paths.
- Added `@astrojs/check` and `cheerio` development dependencies.
- Added `check`, `validate:site`, and deterministic `verify` scripts. `test:browser-mobile` remains an explicit independent command, as the quality plan does not include browser automation in `verify`.
- Corrected localized tool breadcrumb and BreadcrumbList home targets to the existing `/{lang}/tools` static route.
- Consolidated blog-tag URLs to lowercase, URL-safe slugs. Generated paths and every blog tag link now use the same mapping; tags differing only by case share one canonical route.
- Preserved every distinct raw legacy blog-tag segment. Canonical pages embed their legacy aliases; the post-build redirect generator creates noindex/canonical/meta-refresh pages for aliases that can coexist as exact files.

## Path resolution policy

The validator strips query strings/fragments, preserves URL escapes, and maps physical output path segments to their percent-encoded URL forms. Therefore a raw `AI Agent` directory matches `/blog/tag/AI%20Agent`, while a literal `AI%20Agent` directory maps only to `/blog/tag/AI%2520Agent`. It precomputes exact and folded generated-path indexes once per run. Folded lookup is diagnostic-only: a case mismatch is an error, and a folded-key collision is reported as ambiguous rather than accepted. This matches GitHub Pages' case-sensitive deployment behavior.

Before rebuilding the tag routes, the strict validator measured the existing `dist` at **18.01 seconds real time** (`7.51s` user, `1.64s` system) and found **1,636** genuine tag-route case mismatches, such as `/blog/tag/AI` versus generated `/blog/tag/ai`. The indexed lookup prevents repeatedly scanning all generated paths for each link.

The redirect generator protects canonical files on a case-insensitive filesystem. Case-only aliases such as `/blog/tag/AI` cannot coexist with `/blog/tag/ai` on macOS, so they are injected into a `404.html` client redirect map there; on a case-sensitive filesystem they are emitted as exact static redirect pages. Non-colliding aliases such as `/blog/tag/AI%20Agent` are emitted as exact pages on both. This preserves canonical content rather than allowing a legacy alias to overwrite it during the build.

The P1 encoding fix keeps each legacy alias as a pair: its raw filesystem segment (`AI Agent`, `C++`, or Unicode text) and its encoded URL segment. The generator writes the raw segment to `dist`, while canonical links, refresh targets, and 404-map keys use the URL segment. This prevents the prior double-encoded artifact path.

## TDD evidence

- Initial focused RED: the validator test could not resolve `scripts/validate-site.mjs` because the module did not exist.
- Legacy alias RED: the new pure route-map test initially failed because the alias helper did not exist; the generated-redirect fixture initially failed because its module did not exist; the redirect-target fixture initially failed because the validator ignored meta refresh targets.
- P1 RED: replacing aliases with raw-filesystem/encoded-URL objects first failed in the route helper, generator fixtures, and source contract; the HTTP fixture also exposed a malformed double-encoded Unicode regression test before its request encoding was corrected.
- Focused GREEN: `npm test -- --run scripts/__tests__/validate-site.test.ts scripts/__tests__/generate-tag-redirects.test.ts src/lib/__tests__/blogTags.test.ts` reports **3 files / 22 passing tests**.
- The helper test covers `AI`, `ai`, `AI Agent`, `OpenAI`, Korean-space tags, percent encoding, deduplication, and self-redirect avoidance. Generator fixtures cover exact static redirects, case-sensitive classification, macOS collision protection, the 404 fallback map, and a real one-decode static HTTP server: encoded space, `C++`, and Korean requests return redirect pages; double-encoded variants return 404. Validator coverage checks a missing meta-refresh target and protects literal-percent filenames from being treated as raw-space paths.

## Verification status

After the controller reproduced 27 Astro type errors, the type boundary between the 12-language registry and the three published static routes was made explicit with `RouteLanguage` in the localized page routes. Literal state, translation-map, test-mock, and stale-prop errors were repaired without widening those routes. A fresh `npm run check` completed with **0 errors** (85 existing hints), and focused component coverage passed **5 files / 90 tests**.

`npm run check` reached Astro diagnostics and printed no error diagnostics before the execution cell was terminated. It printed three pre-existing warnings:

- `src/components/Chat.tsx:79:51`: deprecated `React.FormEvent`.
- `src/components/NumberGuess.tsx:159:15`: deprecated `onKeyPress`.
- `src/components/NumberGuess.tsx:104:9`: unused `getHintColor`.

`npm run verify` was invoked again after the type remediation, but its full Vitest child exceeded this worker's response window and was intentionally terminated so the controller can run the complete chain in a unified session. No successful full-verification claim is made here. No unrelated production source changes were made to work around that execution limitation.

The controller's subsequent build reached the localized tool-detail route and found that Astro hoists `getStaticPaths`, so it cannot close over a module-local route-language constant. The route list now lives inside `getStaticPaths`; no other route generator captures such a module-local list.

The post-build generator is now part of `npm run build` between `astro build` and sitemap generation. A monitored build completed with **7** raw-segment redirect pages and **16** case-only 404 fallbacks. The resulting `dist` was HTTP spot-checked with one-decode static serving: `/blog/tag/AI%20Agent/` and `/blog/tag/Claude%20Code/` returned `200` redirect pages, while `/blog/tag/AI%2520Agent/` returned `404`. `404.html` contained mappings such as `AI → ai` and `OpenAI → openai`.

The controller should still run `npm run validate:site` and `npm run verify` in one monitored session. This worker intentionally did not launch those final long-running checks after the focused suite; no full-verification success is claimed here.
