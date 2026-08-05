# One Click Publish

## 트리거 예시

- "이 주제로 글 써서 올려"
- "1, 3번 발행해"
- "최근 커밋으로 개발일지 올려"
- "기존 Claude Code 글 업데이트해"

## Canonical workflow

This is a compatibility router. For every planning, research, writing, review,
publication, or update request, load the globally installed
`restato-content-partner` skill and follow it as the sole workflow. If that skill
is unavailable, stop and report the blocker; do not revive local
publishing instructions.

Default publication is an English source plus a reviewed Korean alternate that
share one `translationKey`. A user may explicitly request a single language
only when the canonical workflow records the override.

Public MDX is created only after the canonical private editorial handoff and
safety gates pass. Do not copy private knowledge or credentials into public
MDX.

Never use a direct commit to `master` or another default branch; never use a
direct push there either. The canonical workflow owns isolated worktrees, PR
review, merge, deployment, and live-page verification.

## 완료 보고

Report the canonical workflow's publication evidence, not local-build success:

- English/Korean URLs, or the recorded single-language override URL
- PR/merge/deployment status
- live verification result
- any canonical blocker or incomplete verification
