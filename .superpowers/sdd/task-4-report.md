# Quality Foundation Task 4 Report

## Baseline

Before source or test edits, `npm test -- --run --reporter=verbose --reporter=json --outputFile.json=.superpowers/sdd/task-4-baseline.json` recorded 75 failed tests of 254. The machine-readable artifact is retained at `.superpowers/sdd/task-4-baseline.json`.

Root-cause classification:

- Stale tests: controlled React values read from static `value` attributes; obsolete textbox/output assumptions; ambiguous text/role selectors; incomplete i18n fixtures; raw DOM input events that did not update React state.
- Product defects: the unit swap control had no accessible name; UUID count could not be cleared and replaced; `joinRoom` returned state from before the guest write.
- Test infrastructure defects: the Firebase fake did not model hierarchical reads needed by room discovery and cleanup.

## RED/GREEN evidence

- RED: `allTools.test.tsx` initially failed four smoke renders because its i18n fixture lacked current Age/BMI/ColorPalette/Timestamp keys. GREEN: fixture completed; `allTools.test.tsx` passed 39/39. Commit `e26bd0d`.
- RED: UrlEncoder and Base64 Unicode tests read a static DOM attribute. GREEN: tests read the live controlled textarea value; focused UrlEncoder 7/7 and Base64 8/8 passed, with all-tools smoke green. Commits `ec1c261`, `be4d708`.
- RED: UnitConverter's swap control was unnamed, and stale output selectors hid the behavior. GREEN: added localized `aria-label`; focused UnitConverter 9/9 and all-tools smoke 39/39 passed. Commit `967d247`.
- RED: clearing UUID count immediately restored `1`, causing a requested `5` to become `15`. GREEN: preserve draft input text and normalize only on blur/generation; focused UUID 7/7 and all-tools smoke 39/39 passed. Commit `ed8ace8`.
- RED: anonymous-chat's 22 tests crashed because their fixture lacked the current security/quick-guide translations; three residual tests used an incomplete location mock, ambiguous status role, and non-React input event. GREEN: Chat 22/22 and all-tools smoke 39/39 passed. Commit `3320e92`.
- RED: Firebase room lifecycle tests could not discover child-room values and `joinRoom` returned a room without its guest. GREEN: Firebase fake reads hierarchy and `joinRoom` returns the persisted guest state; Firebase 12/12 and crop preset 5/5 passed. Commit `2f7ea2d`.
- Fresh focused LLM wiki run passed 2/2; its original baseline failures did not reproduce after shared test stabilization.

## Commands run

```sh
npm test -- --run src/components/tools/__tests__/allTools.test.tsx
npm test -- --run src/components/__tests__/Chat.test.tsx
npm test -- --run src/lib/__tests__/firebase.test.ts src/lib/__tests__/imageCropPresets.test.ts
npm test -- --run src/components/llm-wiki/__tests__/LlmWikiExperience.test.tsx
```

## Commits

- `e26bd0d` test: complete tool translation mock
- `ec1c261` test: read URL encoder controlled output
- `967d247` fix(tool): label unit swap control
- `ed8ace8` fix(tool): allow UUID count replacement
- `be4d708` test: read Base64 controlled output
- `3320e92` test: align chat interaction fixtures
- `2f7ea2d` fix(tool): preserve chat room state in Firebase mock
- `2f7e452` test: use Dutch pay quick-count controls

## Remaining concerns

- The matrix is deliberately conservative: mobile and file-privacy browser coverage are not present in the legacy suite and are not claimed.
- Full coverage verification is still required after the remaining legacy tool test suites are reconciled.

## Continued reconciliation

Dutch Pay's six failures were a single stale-interaction group: the component intentionally exposes quick 2/3/4/5/6/7/8/10 participant buttons, while tests attempted to edit a removed second spinbutton. The test now selects the real controls and verifies the documented upward rounding for uneven shares. Focused verification passed 6/6.
