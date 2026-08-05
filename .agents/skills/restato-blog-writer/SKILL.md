---
name: restato-blog-writer
description: Compatibility router for Restato technical blog publication
version: 3.0.0
---

# Restato Blog Writer

This compatibility router delegates every article plan, research task, draft,
review, update, or publication request to the globally installed
`restato-content-partner` skill. Load and follow that skill as the sole workflow.
If it is unavailable, stop and report the blocker rather than
recreating a local publishing process.

Default publication is an English source plus a reviewed Korean alternate
sharing one `translationKey`. A user may explicitly request a single language
only when the canonical workflow records the override.

Public MDX is created only after the canonical private editorial handoff and
safety gates pass. Do not copy private knowledge or credentials into public
MDX.

Never use a direct commit to `master` or another default branch; never use a
direct push there either. The canonical workflow owns isolated worktrees, PR
review, merge, deployment, and live-page verification.

## Completion reporting

Defer completion to the canonical workflow's publication evidence. Report:

- English/Korean URLs, or the recorded single-language override URL
- PR/merge/deployment status
- live verification result
- any canonical blocker or incomplete verification
