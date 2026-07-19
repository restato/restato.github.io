# Existing tools quality matrix

`✓` indicates a focused test exercises that exact behavior; `—` means it is not covered. `N/A` is reserved for a behavior that cannot exist for that tool (for example, non-Latin text for a dice roll). A render/smoke test, SEO metadata assertion, or disclosure alone does not qualify.

| Slug | Valid | Empty | Invalid | Boundary | Non-Latin | Repeat | Output | Mobile | Privacy |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| qr-code | ✓ | — | — | ✓ | ✓ | — | ✓ | ✓ | — |
| password | ✓ | — | — | ✓ | — | ✓ | ✓ | ✓ | — |
| uuid | ✓ | — | — | ✓ | — | ✓ | ✓ | ✓ | — |
| lorem-ipsum | ✓ | — | — | — | — | — | ✓ | ✓ | — |
| color-palette | ✓ | — | — | — | — | — | ✓ | ✓ | — |
| hash | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | — |
| color | ✓ | — | ✓ | — | — | ✓ | ✓ | ✓ | — |
| unit | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| base64 | ✓ | — | ✓ | — | ✓ | ✓ | ✓ | ✓ | — |
| image-converter | ✓ | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| text-counter | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | — |
| markdown | ✓ | ✓ | — | — | ✓ | — | ✓ | ✓ | — |
| diff | ✓ | — | — | — | — | ✓ | ✓ | ✓ | — |
| json | ✓ | — | ✓ | — | — | ✓ | ✓ | ✓ | — |
| regex | ✓ | — | ✓ | — | — | ✓ | ✓ | ✓ | — |
| url-encoder | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | — |
| jwt-decoder | ✓ | — | ✓ | — | — | ✓ | ✓ | ✓ | — |
| cron | ✓ | — | — | — | — | ✓ | ✓ | ✓ | — |
| timestamp | ✓ | — | — | — | — | — | ✓ | ✓ | — |
| llm-cost | — | — | — | — | — | — | — | ✓ | ✓ |
| gradient | ✓ | — | — | — | — | — | ✓ | ✓ | — |
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
| percent | ✓ | ✓ | — | — | — | — | ✓ | ✓ | — |
| discount | ✓ | — | — | ✓ | — | ✓ | ✓ | ✓ | — |
| bmi | ✓ | — | — | ✓ | — | ✓ | ✓ | ✓ | — |
| age | ✓ | — | — | ✓ | — | — | ✓ | ✓ | — |
| dday | ✓ | — | — | — | — | ✓ | ✓ | ✓ | — |
| dutch-pay | ✓ | ✓ | — | ✓ | — | ✓ | ✓ | ✓ | — |
| coin-flip | ✓ | — | N/A | N/A | N/A | ✓ | ✓ | ✓ | — |
| dice | ✓ | — | N/A | ✓ | N/A | — | ✓ | ✓ | — |
| kor-eng | ✓ | — | — | — | ✓ | ✓ | ✓ | ✓ | — |
| anonymous-chat | ✓ | ✓ | — | — | — | ✓ | ✓ | ✓ | ✓ |

## Gaps and interpretation

- Every Mobile checkmark is an executable 375px viewport, coarse-pointer/touch contract that renders the tool and proves a named primary control accepts focus. CSS overflow and layout visuals require a browser E2E check and are intentionally not inferred from this contract.
- The Privacy checkmarks for six file tools come from `fileToolsPrivacy.test.tsx`, which selects a non-Latin filename and observes neither a `fetch` request nor `XMLHttpRequest.send`. They establish the current client-side selection boundary; external P2P/network disclosure remains separately documented for anonymous chat and is not represented as a no-upload checkmark.
- Rows without a focused suite are not evidence that the tool lacks behavior; they identify the untested legacy backlog.
