# Existing tools quality matrix

`✓` indicates a focused test exercises that exact behavior; `—` means it is not covered. `N/A` is reserved for a behavior that cannot exist for that tool (for example, non-Latin text for a dice roll). A render/smoke test, SEO metadata assertion, or disclosure alone does not qualify.

| Slug | Valid | Empty | Invalid | Boundary | Non-Latin | Repeat | Output | Mobile | Privacy |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| qr-code | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| password | ✓ | ✓ | N/A | ✓ | N/A | ✓ | ✓ | ✓ | — |
| uuid | ✓ | N/A | N/A | ✓ | N/A | ✓ | ✓ | ✓ | — |
| lorem-ipsum | ✓ | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | — |
| color-palette | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| hash | ✓ | ✓ | N/A | — | ✓ | ✓ | ✓ | ✓ | — |
| color | ✓ | — | ✓ | — | — | ✓ | ✓ | ✓ | — |
| unit | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| base64 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| image-converter | ✓ | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| text-counter | ✓ | ✓ | N/A | — | ✓ | ✓ | ✓ | ✓ | — |
| markdown | ✓ | ✓ | N/A | — | ✓ | ✓ | ✓ | ✓ | — |
| diff | ✓ | — | N/A | — | — | ✓ | ✓ | ✓ | — |
| json | ✓ | — | ✓ | — | — | ✓ | ✓ | ✓ | — |
| regex | ✓ | — | ✓ | — | — | ✓ | ✓ | ✓ | — |
| url-encoder | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | — |
| jwt-decoder | ✓ | — | ✓ | — | — | ✓ | ✓ | ✓ | — |
| cron | ✓ | — | — | — | — | ✓ | ✓ | ✓ | — |
| timestamp | ✓ | — | — | — | — | — | ✓ | ✓ | — |
| llm-cost | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| gradient | ✓ | — | — | ✓ | — | ✓ | ✓ | ✓ | — |
| box-shadow | ✓ | — | — | — | — | — | ✓ | ✓ | — |
| image-resizer | ✓ | — | — | — | — | ✓ | ✓ | ✓ | ✓ |
| exif | ✓ | — | — | — | ✓ | — | ✓ | ✓ | ✓ |
| background-remover | ✓ | — | — | — | ✓ | — | ✓ | ✓ | ✓ |
| image-metadata | ✓ | — | — | — | ✓ | — | ✓ | ✓ | ✓ |
| appstore-screenshot | ✓ | — | — | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| utm | ✓ | ✓ | — | — | — | ✓ | ✓ | ✓ | — |
| timer | ✓ | — | — | ✓ | — | ✓ | ✓ | ✓ | — |
| pomodoro | ✓ | — | — | — | — | ✓ | ✓ | ✓ | — |
| world-clock | ✓ | — | N/A | — | N/A | — | ✓ | ✓ | — |
| percent | ✓ | ✓ | ✓ | — | N/A | — | ✓ | ✓ | — |
| discount | ✓ | — | — | ✓ | N/A | ✓ | ✓ | ✓ | — |
| bmi | ✓ | — | — | ✓ | N/A | ✓ | ✓ | ✓ | — |
| age | ✓ | — | — | ✓ | — | — | ✓ | ✓ | — |
| dday | ✓ | — | — | — | — | ✓ | ✓ | ✓ | — |
| dutch-pay | ✓ | ✓ | — | ✓ | — | ✓ | ✓ | ✓ | — |
| coin-flip | ✓ | N/A | N/A | N/A | N/A | ✓ | ✓ | ✓ | — |
| dice | ✓ | N/A | N/A | ✓ | N/A | — | ✓ | ✓ | — |
| kor-eng | ✓ | — | — | — | ✓ | ✓ | ✓ | ✓ | — |
| anonymous-chat | ✓ | ✓ | — | — | — | ✓ | ✓ | ✓ | ✓ |

## Gaps and interpretation

- Every Mobile checkmark is an executable 375px viewport, coarse-pointer/touch contract that renders the tool and proves a named primary control accepts focus. CSS overflow and layout visuals require a browser E2E check and are intentionally not inferred from this contract.
- The Privacy checkmarks for six file tools come from `fileToolsPrivacy.test.tsx`, which selects a non-Latin filename and observes neither a `fetch` request nor `XMLHttpRequest.send`. They establish the current client-side selection boundary; external P2P/network disclosure remains separately documented for anonymous chat and is not represented as a no-upload checkmark.
- Rows without a focused suite are not evidence that the tool lacks behavior; they identify the untested legacy backlog.

### Audited N/A behaviors

- QR code text accepts arbitrary Unicode payloads, so it has no invalid-text state. Password and UUID generators expose only settings plus generated output; they do not accept user text whose emptiness, invalidity, or script could be exercised. Lorem Ipsum likewise has only numeric count and boolean settings, so a non-Latin text case does not exist.
- Hashing and text counting intentionally accept every string, including empty and non-Latin strings, so an invalid-text case does not exist.
- Percent, discount, and BMI accept numeric values only (`type="number"`), so a non-Latin value cannot enter their calculation model. Coin flip has no input; dice has a bounded range control with an always-present value, so neither has an empty-input state.
- Markdown and diff accept arbitrary text payloads; malformed syntax is rendered or compared as text rather than rejected, so neither exposes an invalid-input state.
