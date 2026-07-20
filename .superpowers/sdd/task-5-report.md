# Quality Foundation Task 5 Report

## Delivered

- Added `scripts/validate-site.mjs` with the `validateSite(distDir)` interface.
- Added generated-HTML fixture coverage for duplicate canonicals, broken internal links, asymmetric hreflang, trailing slashes, query strings, fragments, redirects, static assets, encoded paths, case-folded macOS output paths, and ambiguous case-folded paths.
- Added `@astrojs/check` and `cheerio` development dependencies.
- Added `check`, `validate:site`, and deterministic `verify` scripts. `test:browser-mobile` remains an explicit independent command, as the quality plan does not include browser automation in `verify`.
- Corrected localized tool breadcrumb and BreadcrumbList home targets to the existing `/{lang}/tools` static route.

## Path resolution policy

The validator tries exact generated paths first, after stripping query strings/fragments and decoding URL path escapes. It accepts static files, directory indexes, generated redirect pages, and trailing-slash variants. A case-folded fallback is used only to accommodate macOS output where `AI`/`ai` sibling directories collide. If multiple logical generated paths share that folded key, validation reports an ambiguity instead of accepting the link.

## TDD evidence

- Initial focused RED: the validator test could not resolve `scripts/validate-site.mjs` because the module did not exist.
- Focused GREEN: `npm test -- --run scripts/__tests__/validate-site.test.ts` reports 10 passing tests, including a successful CLI invocation against a temporary generated-output fixture.
- Additional URL-encoding, case-fold fallback, case-fold ambiguity, and localized breadcrumb tests each failed before their implementation change and passed afterward.

## Verification status

After the controller reproduced 27 Astro type errors, the type boundary between the 12-language registry and the three published static routes was made explicit with `RouteLanguage` in the localized page routes. Literal state, translation-map, test-mock, and stale-prop errors were repaired without widening those routes. A fresh `npm run check` completed with **0 errors** (85 existing hints), and focused component coverage passed **5 files / 90 tests**.

`npm run check` reached Astro diagnostics and printed no error diagnostics before the execution cell was terminated. It printed three pre-existing warnings:

- `src/components/Chat.tsx:79:51`: deprecated `React.FormEvent`.
- `src/components/NumberGuess.tsx:159:15`: deprecated `onKeyPress`.
- `src/components/NumberGuess.tsx:104:9`: unused `getHintColor`.

`npm run verify` was invoked once. Its full Vitest step discovered 48 files but did not complete before the controller session window ended, so it never reached check, build, or static validation. The controller will run the long verification flow through a unified session. No successful full-verification claim is made here. No unrelated production source changes were made to work around that execution limitation.
