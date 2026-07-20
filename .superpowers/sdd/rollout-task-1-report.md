# Growth Verification Rollout — Task 1 Report

## Delivered

- Added a Playwright catalog contract under `tests/e2e/` for direct `/ko/tools`,
  `/en/tools`, and `/ja/tools` entry points.
- The contract derives the expected published-tool paths from the registry, checks
  the rendered catalog is complete, fetches every rendered destination and fails
  on any non-OK response, and checks horizontal overflow.
- Added reusable browser assertions in `tests/e2e/fixtures.ts`:
  `assertNoHorizontalOverflow(page)`, `assertNoUnexpectedConsoleErrors(page)`,
  and `assertNoContentUpload(page, secrets)`.
- Console and request capture is bounded at 200 events. The sole noise exception
  is a documented `chrome-extension://` or `moz-extension://` source URL; generic
  console, network, and page errors remain failures. Any request with a body, or
  a request containing the supplied sentinel, is treated as an outbound content
  upload and fails the catalog test.
- Playwright now has `desktop` (1440x1000) and `mobile-390` (390x844) catalog
  projects. Its `mobile` project stays 375x812 and is restricted to the existing
  independent `e2e/mobile-tools.spec.ts` suite (with an explicit
  `tests/e2e/**` ignore because the legacy glob otherwise matches that nested
  path). `test:browser-mobile` explicitly targets that legacy path, preserving
  its former contract.
- Added `test:e2e` (`npm run build && playwright test`), kept the own static-site
  preview server at `127.0.0.1:4321`, and retained `reuseExistingServer: false`.
- Vitest excludes both `e2e/**` and `tests/e2e/**` via `configDefaults.exclude`.

## TDD evidence

### RED

Command:

```sh
npx playwright test tests/e2e/catalog.spec.ts --project=mobile
```

Status: failed (exit 1) before the runner migration, with:

```text
Error: No tests found.
```

This was the expected harness failure: the prior Playwright configuration only
discovered `./e2e`, so it could not discover the newly written direct-localized
catalog/mobile-overflow test.

### GREEN

```sh
npm run build
```

Status: passed.

```sh
npx playwright test tests/e2e/catalog.spec.ts --project=desktop --reporter=line
```

Status: passed — 3/3 localized catalog tests in 20.5 seconds.

```sh
npx playwright test tests/e2e/catalog.spec.ts --project=mobile-390 --reporter=line
```

Status: passed — 3/3 localized catalog tests in 8.2 seconds.

After the final legacy-project path-boundary correction, the same mobile-390
command was re-run and passed 3/3 in 16.0 seconds. `npx playwright test --list`
then listed 47 tests: six new catalog runs (desktop and mobile-390 only) and 41
legacy 375x812 runs.

```sh
npm run test:browser-mobile -- --reporter=line
```

Status: passed. The Playwright result file recorded `status: "passed"` with no
failed tests for the preserved 375x812 legacy suite.

## Verification status

`npm run verify` was started. Its Vitest phase completed successfully with 50
test files and 410 tests passing. Per controller direction, the command was
terminated while `astro check` was still running because it exceeded the
30-second response window. Therefore full `npm run verify` completion is
**controller-pending**, not claimed as passed. No deployment, ad, or external
integration action was performed.

## Review

`git diff --check` completed without whitespace errors. Generated Playwright
artifacts were moved to Trash rather than retained in the worktree.
