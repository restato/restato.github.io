# Global Tools Program Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the approved global tools growth design through independently verifiable plans.

**Architecture:** Plans are dependency-ordered. Quality foundation is mandatory; localization and rollout infrastructure follow; tool clusters then ship independently behind the same registry and verification contracts.

**Tech Stack:** Astro, React, TypeScript, Vitest, Playwright, Lighthouse CI.

## Global Constraints

- Work in `/Users/direcision/Workspace/restato-growth-platform` on `growth/tool-platform`.
- Use TDD for every behavior change.
- Do not deploy, enable advertisements, or submit AdSense without a separate explicit request.
- Keep all tool processing in the browser.

---

### Execution order

- [ ] 1. Execute `2026-07-20-tools-quality-foundation.md` completely.
- [ ] 2. Execute Tasks 1–3 of `2026-07-20-growth-verification-rollout.md` so later clusters inherit browser, accessibility, and performance gates.
- [ ] 3. Execute `2026-07-20-global-localization-adsense.md` completely.
- [ ] 4. Execute `2026-07-20-image-text-tools-wave-one.md` completely.
- [ ] 5. Execute `2026-07-20-developer-data-tools-wave-one.md` completely.
- [ ] 6. Execute `2026-07-20-pdf-tools-wave-one.md` completely.
- [ ] 7. Execute Tasks 4–6 of `2026-07-20-growth-verification-rollout.md`.

### Program checkpoints

- [ ] After each numbered plan, run `npm run verify` and review `git diff` before moving on.
- [ ] Keep each cluster independently revertible.
- [ ] Update the design only through an explicit design amendment if a browser-only constraint cannot be met.
- [ ] Finish with a release report and AdSense-readiness evidence; do not infer approval.
