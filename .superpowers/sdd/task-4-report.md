# Quality Foundation Task 4 Report

## Baseline

Before source or test edits, `npm test -- --run --reporter=verbose --reporter=json --outputFile.json=.superpowers/sdd/task-4-baseline.json` recorded 76 failed tests of 254. The machine-readable artifact is generated locally and is ignored by Git; this report retains the count and commands rather than claiming that JSON is versioned.

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
- Full coverage verification is complete; the remaining concerns are coverage gaps, not failing verification.

## Continued reconciliation

Dutch Pay's six failures were a single stale-interaction group: the component intentionally exposes quick 2/3/4/5/6/7/8/10 participant buttons, while tests attempted to edit a removed second spinbutton. The test now selects the real controls and verifies the documented upward rounding for uneven shares. Focused verification passed 6/6.

## Final legacy-suite reconciliation

- ColorConverter 8/8, DiscountCalculator 6/6, and DdayCalculator 5/5 passed after their selectors were aligned with the rendered cards/results. The D-day reconciliation also exposed and fixed the product case for a same-day target: it now displays `D-Day` rather than `D+0` (`9b0023f`).
- HashGenerator 6/6 now verifies its rendered five-algorithm card set and live hash output instead of a removed selector (`380a973`).
- RegexTester 6/6 now exercises the current pattern, flags, match, invalid-pattern, and capture-group controls (`9354f81`).
- BmiCalculator 6/6 now submits the calculator before asserting precise BMI/category output (`775a121`).
- The aggregate `allTools.test.tsx` smoke/accessibility suite passed 39/39 after the final three groups.
- The LLM wiki hook suite was rerun in isolation after a transient parallel-run observation and passed 3/3.

Focused commands used for the final groups:

```sh
npx vitest run src/components/tools/__tests__/HashGenerator.test.tsx --reporter=verbose
npx vitest run src/components/tools/__tests__/RegexTester.test.tsx --reporter=verbose
npx vitest run src/components/tools/__tests__/BmiCalculator.test.tsx --reporter=verbose
npx vitest run src/components/tools/__tests__/allTools.test.tsx --reporter=verbose
npx vitest run src/components/llm-wiki/__tests__/useLlmWikiExperience.test.tsx --reporter=verbose
```

All five focused commands exited 0.

## Earlier coverage gate (superseded by later remediation)

The exact required command was re-verified in normal parallel configuration:

```sh
npm run test:coverage -- --run
```

The matching machine-readable audit (`--reporter=json --outputFile=.superpowers/sdd/task-4-final-coverage.json`) recorded **37 files, 268 tests, 0 failed files, and 0 failed tests** at that point in time. The JSON is ignored by Git; it is not retained evidence for the later remediation work below.

The earlier read-only URL errors came from module-level mutation in image tests, not an inherent need to serialize the suite. Scoped stubs fixed that root cause, so global serialization, worker limits, and the 15-second default timeout were removed. The comprehensive LLM-workbench journey retains its local 30-second allowance because it deliberately drives scenario, compilation, terminal, graph, format, and reset interactions. Normal-parallel V8 coverage was checked with `--fileParallelism --maxWorkers=4 --testTimeout=5000`.

Review remediation added standard MD5 vectors (empty, ASCII, non-Latin, repeated UI input, and copy), local-calendar D-Day parsing under both Los Angeles and Seoul timezones, hierarchical Firebase fake reads/writes/removes with subscription notifications, atomic one-guest Firebase transactions, and named Base64/UUID controls.

Final commits added during reconciliation:

- `f295906` test: allow repeated text counter values
- `6310183` test: inspect color converter preview
- `3db7f26` test: allow repeated discount results
- `9b0023f` fix(tool): label same-day countdowns
- `380a973` test: cover rendered hash algorithms
- `9354f81` test: target regex tester controls
- `775a121` test: submit BMI calculator inputs
- `7cdf72e` test: allow complete LLM wiki interaction flow
- `e777d46` test: isolate image URL mocks
- `0a3e29b` test: allow repeated UUID generation flow
- `9fc2464` test: allow covered interaction flows to complete
- `e5d914c` test: budget the complete wiki simulation flow
- `c8aaf6a` test: serialize shared browser coverage suites

## Post-review remediation

- MD5 now has standard empty, ASCII, non-Latin, repeat-input, and clipboard vectors; SHA-1/256/384/512 also render their standard `Test` vectors through the Web Crypto path (`57e27f1`).
- D-Day parses `YYYY-MM-DD` as a local calendar date and its focused suite passed in both Los Angeles and Seoul time zones (`d613966`).
- The Firebase fake now models nested paths, subscriptions, and transactional room reservations. The focused suite verifies an occupied room and concurrent joins admit exactly one guest (`a4cfc5a`).
- Mobile coverage is an executable 375px/coarse-pointer contract for all 41 tools: a named primary control is rendered and accepts focus. The six image tools additionally select a non-Latin filename and prove neither `fetch` nor `XMLHttpRequest.send` was called (`0fb6f76`, `ae612f1`, `2bfd48a`).
- The conservative behavior matrix now includes deterministic coin/dice, percent empty handling, lorem generation, keyboard conversion, age calculation, and UTM generation/clear tests (`58da05f`, `a915b32`). It still has documented uncovered behavior cells; this report does not treat the earlier coverage count as final completion evidence.
