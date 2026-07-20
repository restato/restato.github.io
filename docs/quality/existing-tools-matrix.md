# Existing tools quality matrix

`✓` indicates a focused test exercises that exact behavior; `—` means it is not covered. `N/A` is reserved for a behavior that cannot exist for that tool (for example, non-Latin text for a dice roll). A render/smoke test, SEO metadata assertion, or disclosure alone does not qualify.

| Slug | Valid | Empty | Invalid | Boundary | Non-Latin | Repeat | Output | Mobile | Privacy |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| qr-code | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| password | ✓ | ✓ | N/A | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| uuid | ✓ | N/A | N/A | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| lorem-ipsum | ✓ | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| color-palette | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| hash | ✓ | ✓ | N/A | N/A | ✓ | ✓ | ✓ | ✓ | N/A |
| color | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| unit | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| base64 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| image-converter | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | ✓ |
| text-counter | ✓ | ✓ | N/A | N/A | ✓ | ✓ | ✓ | ✓ | N/A |
| markdown | ✓ | ✓ | N/A | N/A | ✓ | ✓ | ✓ | ✓ | N/A |
| diff | ✓ | ✓ | N/A | N/A | ✓ | ✓ | ✓ | ✓ | N/A |
| json | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | N/A |
| regex | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | N/A |
| url-encoder | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | N/A |
| jwt-decoder | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | N/A |
| cron | ✓ | ✓ | N/A | N/A | N/A | ✓ | ✓ | ✓ | N/A |
| timestamp | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| llm-cost | ✓ | ✓ | N/A | N/A | ✓ | ✓ | ✓ | ✓ | ✓ |
| gradient | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| box-shadow | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| image-resizer | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | ✓ |
| exif | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | ✓ |
| background-remover | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | ✓ |
| image-metadata | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | ✓ |
| appstore-screenshot | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| utm | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | N/A |
| timer | ✓ | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| pomodoro | ✓ | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| world-clock | ✓ | ✓ | N/A | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| percent | ✓ | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| discount | ✓ | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| bmi | ✓ | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| age | ✓ | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| dday | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| dutch-pay | ✓ | ✓ | N/A | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| coin-flip | ✓ | N/A | N/A | N/A | N/A | ✓ | ✓ | ✓ | N/A |
| dice | ✓ | N/A | N/A | ✓ | N/A | ✓ | ✓ | ✓ | N/A |
| kor-eng | ✓ | ✓ | N/A | N/A | ✓ | ✓ | ✓ | ✓ | N/A |
| anonymous-chat | ✓ | ✓ | N/A | N/A | ✓ | ✓ | ✓ | ✓ | ✓ |

## Gaps and interpretation

- Every Mobile checkmark is an executable 375px viewport, coarse-pointer/touch contract that renders the tool and proves a named primary control accepts focus. CSS overflow and layout visuals require a browser E2E check and are intentionally not inferred from this contract.
- The Privacy checkmarks for six file tools come from `fileToolsPrivacy.test.tsx`, which selects a non-Latin filename and observes neither a `fetch` request nor `XMLHttpRequest.send`. They establish the current client-side selection boundary; external P2P/network disclosure remains separately documented for anonymous chat and is not represented as a no-upload checkmark.
- Rows without a focused suite are not evidence that the tool lacks behavior; they identify the untested legacy backlog.

### Audited N/A behaviors

- **Privacy — no transfer boundary:** `qr-code`, `password`, `uuid`, `lorem-ipsum`, `color-palette`, `hash`, `color`, `unit`, `base64`, `text-counter`, `markdown`, `diff`, `json`, `regex`, `url-encoder`, `jwt-decoder`, `cron`, `timestamp`, `gradient`, `box-shadow`, `utm`, `timer`, `pomodoro`, `world-clock`, `percent`, `discount`, `bmi`, `age`, `dday`, `dutch-pay`, `coin-flip`, `dice`, and `kor-eng` have no `fetch`, `XMLHttpRequest`, `WebSocket`, or `EventSource` use in their component source at this revision. Their inputs are calculated or stored only in browser state; clipboard/download output remains a user-initiated local browser action. A no-upload test is therefore logically inapplicable. The only tool components containing a transfer API match are `ImageConverter` (covered by the executable file-privacy contract) and `LlmCostCalculator` (its documented exchange-rate request is covered separately).
- **Boundary — unbounded text:** Hash, Text Counter, Markdown, Diff, JSON Formatter, Regex Tester, URL Encoder, JWT Decoder, UTM Builder, and Korean/English keyboard conversion use unrestricted text fields with no `minLength`, `maxLength`, or product-defined maximum. Since no input boundary exists in their source contract, a boundary behavior cannot be exercised; their explicit empty/invalid/non-Latin cases remain independently tested where meaningful.
- **Cron and Dutch Pay input domain:** Cron Generator only assembles five free-form expression fields; it deliberately has no syntax parser, field range, or non-Latin rejection state, so invalid/boundary/non-Latin behavior does not exist to test. Dutch Pay's participant count is a numeric control, so a non-Latin participant value cannot enter its calculation model.
- **No invalid state / maximum:** LLM Cost Calculator's numeric browser controls expose no product-defined maximum or validation state; the calculator intentionally parses a numeric draft directly, so distinct invalid/boundary behavior does not exist. Korean/English keyboard conversion accepts every string and passes unmapped characters through, so it has no invalid-input state. Dutch Pay coerces a numeric payment draft to its neutral zero value and likewise has no distinct invalid-input state.
- **Anonymous chat input domain:** connected-chat messages are arbitrary text trimmed only to prevent blank sends; there is no rejected-message state or maximum-length contract in the component, so invalid and boundary behaviors do not exist.
- **File selection boundaries:** Image Converter declares no file count or size maximum. Image Resizer, EXIF Viewer, Background Remover, and Image Metadata Viewer consume only the first selected file and likewise declare neither a size nor count limit. Those sources therefore have no selectable maximum boundary; App Store Screenshot Resizer is the exception, with its explicit ten-image limit retained as an executable boundary case.
- QR code text accepts arbitrary Unicode payloads, so it has no invalid-text state. Password and UUID generators expose only settings plus generated output; they do not accept user text whose emptiness, invalidity, or script could be exercised. Lorem Ipsum likewise has only numeric count and boolean settings, so a non-Latin text case does not exist.
- Hashing and text counting intentionally accept every string, including empty and non-Latin strings, so an invalid-text case does not exist.
- Percent, discount, and BMI accept numeric values only (`type="number"`), so a non-Latin value cannot enter their calculation model. Coin flip has no input; dice has a bounded range control with an always-present value, so neither has an empty-input state.
- Markdown and diff accept arbitrary text payloads; malformed syntax is rendered or compared as text rather than rejected, so neither exposes an invalid-input state.
- Timer, Pomodoro, and age calculation accept duration or date controls rather than free text, so non-Latin input cannot enter their calculation models.
