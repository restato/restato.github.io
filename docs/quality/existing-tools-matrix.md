# Existing tools quality matrix

`✓` indicates an automated component or focused logic test exists at this revision. `—` means the behavior is not currently covered by an automated test; these gaps remain release concerns rather than implied coverage.

| Slug | Valid | Empty | Invalid | Boundary | Non-Latin | Repeat | Output | Mobile | Privacy |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| qr-code | — | — | — | — | — | — | — | — | — |
| password | ✓ | — | — | ✓ | — | ✓ | ✓ | — | — |
| uuid | ✓ | — | — | ✓ | — | ✓ | ✓ | — | — |
| lorem-ipsum | — | — | — | — | — | — | — | — | — |
| color-palette | — | — | — | — | — | — | ✓ | — | — |
| hash | ✓ | ✓ | — | — | — | ✓ | ✓ | — | — |
| color | ✓ | — | ✓ | — | — | ✓ | ✓ | — | — |
| unit | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | — | — |
| base64 | ✓ | — | ✓ | — | ✓ | ✓ | ✓ | — | — |
| image-converter | — | — | — | — | — | — | — | — | — |
| text-counter | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | — | — |
| markdown | — | — | — | — | — | — | — | — | — |
| diff | — | — | — | — | — | — | — | — | — |
| json | ✓ | — | ✓ | — | — | ✓ | ✓ | — | — |
| regex | ✓ | — | ✓ | — | — | ✓ | ✓ | — | — |
| url-encoder | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | — | — |
| jwt-decoder | — | — | — | — | — | — | — | — | — |
| cron | — | — | — | — | — | — | — | — | — |
| timestamp | — | — | — | — | — | — | — | — | — |
| llm-cost | — | — | — | — | — | — | — | — | ✓ |
| gradient | — | — | — | — | — | — | — | — | — |
| box-shadow | — | — | — | — | — | — | — | — | — |
| image-resizer | — | — | — | — | — | — | ✓ | — | ✓ |
| exif | — | — | — | — | — | — | — | — | — |
| background-remover | — | — | — | — | — | — | ✓ | — | ✓ |
| image-metadata | — | — | — | — | — | — | — | — | — |
| appstore-screenshot | — | — | — | — | — | — | ✓ | — | — |
| utm | — | — | — | — | — | — | — | — | — |
| timer | — | — | — | — | — | — | — | — | — |
| pomodoro | — | — | — | — | — | — | — | — | — |
| world-clock | — | — | — | — | — | — | — | — | — |
| percent | — | — | — | — | — | — | — | — | — |
| discount | ✓ | — | — | ✓ | — | ✓ | ✓ | — | — |
| bmi | ✓ | — | — | ✓ | — | ✓ | ✓ | — | — |
| age | — | — | — | — | — | — | — | — | — |
| dday | ✓ | — | — | — | — | ✓ | ✓ | — | — |
| dutch-pay | ✓ | ✓ | — | ✓ | — | ✓ | ✓ | — | — |
| coin-flip | — | — | — | — | — | ✓ | ✓ | — | — |
| dice | — | — | — | — | — | ✓ | ✓ | — | — |
| kor-eng | — | — | — | — | ✓ | — | ✓ | — | — |
| anonymous-chat | ✓ | ✓ | — | — | — | ✓ | ✓ | — | ✓ |

## Gaps and interpretation

- No existing suite exercises responsive viewport behavior, so the Mobile column is intentionally empty for all 41 tools.
- Privacy coverage is limited to the registry/page metadata checks for `llm-cost`, `image-resizer`, `background-remover`, and anonymous chat. The anonymous-chat suite also exercises its peer-room UI, while Firebase tests cover room lifecycle.
- File tools still need browser tests that prove selected bytes, names, and generated values are not uploaded. This matrix does not claim those guarantees from unit tests alone.
- Rows without a focused suite are not evidence that the tool lacks behavior; they identify the untested legacy backlog.
