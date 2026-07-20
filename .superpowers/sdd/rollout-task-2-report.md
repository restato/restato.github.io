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
