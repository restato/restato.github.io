# Growth Verification Rollout — Task 2 Report

## Delivered

- Added `@axe-core/playwright` and `tests/e2e/accessibility.spec.ts`.
- Added `npm run test:a11y`, which builds the static site and runs only the
  accessibility contract on the desktop and 390×844 mobile projects.
- The axe contract covers `/ko/tools`, `/ko/tools/text-counter`,
  `/ko/tools/json`, and `/ko/tools/image-resizer` in both light and dark
  color schemes. It fails only on serious or critical findings and does not
  disable axe rules.
- The keyboard contract covers the responsive navigation disclosure (with the
  current no-dialog state explicitly asserted), image-file selection, a real
  download, and the JSON result announcement.
- Added the necessary semantic fixes: associated labels for text/JSON/image
  controls, a polite JSON validation status, an operable image picker, mobile
  menu disclosure state, and stronger muted/primary colors.

## Root cause and TDD evidence

Static review found that ImageResizer controls shown after selecting an image
had visible labels but no programmatic label association. The focused regression
test was added before the fix and failed with empty accessible names for the
width/height spinbuttons; the failure began at:

```text
Unable to find an accessible element with the role "spinbutton" and name "너비 (px)"
```

The implementation adds stable control IDs and matching `htmlFor` values for
width, height, preset, quality, and format. The focused GREEN command was:

```text
$ npm test -- --run src/components/tools/__tests__/ImageResizer.test.tsx

✓ src/components/tools/__tests__/ImageResizer.test.tsx (11 tests)
Test Files  1 passed (1)
Tests  11 passed (11)
```

## Browser verification status

The controller owns the final browser command:

```sh
npm run test:a11y
```

One controlled pre-handoff run was interrupted on controller direction. Before
interruption, it had started 20 browser checks and reached the first six axe
checks without a reported assertion failure; this partial output is not treated
as verification. The persisted result is `status: "interrupted"`, so the
complete serious/critical-violation outcome is **controller-pending**.

The interrupted Playwright/preview process tree was terminated and confirmed
absent. Generated `test-results/` artifacts were moved to Trash before handoff.

## Scope notes

- No axe rules are globally or locally disabled.
- The existing tool shell has no dialog; the test asserts that condition and
  tests its equivalent keyboard disclosure interaction instead.
- Desktop and mobile remain explicit Playwright projects; the accessibility
  script names both rather than relying on a broad test glob.

## Follow-up: dynamic-state and privacy coverage

- The interaction contract now installs the outbound-content collector before
  navigation, uses one sentinel in both the selected filename and formatted
  JSON value, and asserts the collector after all keyboard interactions. This
  fails on a sentinel in a request URL (including a GET query) or request body.
- Axe now also scans the post-upload image state and the rendered JSON result,
  rather than limiting coverage to each route's initial DOM.

## Follow-up: download contrast

The controller's dynamic-state axe run found the white download label on
`bg-green-500` at a 2.27:1 contrast ratio. A focused regression first required
the download button to use `bg-green-700 hover:bg-green-800`; it failed against
the previous `bg-green-500 hover:bg-green-600` classes and passed after the
token change:

```text
$ npm test -- --run src/components/tools/__tests__/ImageResizer.test.tsx

✓ src/components/tools/__tests__/ImageResizer.test.tsx (11 tests)
Test Files  1 passed (1)
Tests  11 passed (11)
```

`green-700` preserves the semantic success/download color while lifting white
text above the 4.5:1 normal-text threshold. The controller will rerun the full
browser contract.

## Follow-up: JSON result contrast

The controller found the valid JSON status's `text-green-600` on
`bg-green-100` at 3.0:1. The matching invalid status also used a light
`text-red-600` token on `bg-red-100`, so both light-mode status branches were
updated to `text-green-700` and `text-red-700`; their dark `*-400` tokens are
unchanged. A focused class regression was RED for both original tokens, then
GREEN after the update:

```text
$ npm test -- --run src/components/tools/__tests__/JsonFormatter.test.tsx

✓ src/components/tools/__tests__/JsonFormatter.test.tsx (11 tests)
Test Files  1 passed (1)
Tests  11 passed (11)
```

## Follow-up: JSON error-detail contrast

The reviewer found the detailed parse error (`text-red-600` on `bg-red-50`) at
approximately 4.415:1. The error-detail regression was RED against that class
and is GREEN with `text-red-700`; dark `text-red-400` remains unchanged. The
browser interaction also now fills invalid JSON after its valid-result scan,
asserts the invalid status, and runs axe on that dynamic error state. Focused
unit verification remains:

```text
$ npm test -- --run src/components/tools/__tests__/JsonFormatter.test.tsx

✓ src/components/tools/__tests__/JsonFormatter.test.tsx (11 tests)
Test Files  1 passed (1)
Tests  11 passed (11)
```
