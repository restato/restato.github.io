# One Click Publish

## 트리거 예시

- "이 주제로 글 써서 올려"
- "1, 3번 발행해"
- "최근 커밋으로 개발일지 올려"
- "기존 Claude Code 글 업데이트해"

## 실행 모드

사용자가 직접 주제를 지정하면 즉시 실행합니다. 자동 탐색 모드의 85점 임계값은 적용하지 않지만 사실 검증, 중복 검사, 콘텐츠 공백, 리뷰와 빌드 기준은 생략하지 않습니다.

## 규칙 우선순위

1. 사용자의 현재 명시적 요청
2. 실제 `src/content/config.ts`와 저장소 구현
3. `.agents/CONTENT_POLICY.md`
4. `.agents/WORKFLOW.md`
5. 관련 `.agents/skills/*/SKILL.md`
6. memory 기록

## 파이프라인

1. 정책, workflow와 memory의 topics·published·ideas·keywords·style을 읽습니다.
2. 기존 글과 검색 의도를 비교해 새 글과 업데이트 중 하나를 선택합니다.
3. 공식 문서, 릴리스 노트와 원본 저장소를 조사합니다.
4. gap-finder로 독자가 얻을 고유한 결과를 정합니다.
5. scoring-engine으로 품질과 공백을 기록합니다. 사용자 지정 주제는 낮은 점수만으로 거절하지 않습니다.
6. planner → writer → seo-reviewer → reviewer 순서의 기준을 적용합니다.
7. 실제 content schema, MDX, 코드 fence, 표와 링크를 검사합니다.
8. 가능한 환경에서는 `npm run build`를 실행합니다. 실행할 수 없으면 미검증이라고 명시합니다.
9. 기본 브랜치에 커밋합니다.
10. `contentCandidates.json`, `published.md`, `ideas.md`와 필요한 keyword memory를 갱신합니다.

## 현재 MDX 형식

실제 `src/content/config.ts`가 항상 최종 기준입니다. 2026-07-24 기준:

```mdx
---
title: ""
description: ""
date: 2026-07-24
verifiedAt: 2026-07-24
tags: ["", ""]
---
```

- `pubDate`가 아니라 `date`를 사용합니다.
- 시의성이 높은 글은 `verifiedAt`을 사용합니다.
- 경로는 `src/content/blog/<english-kebab-case>.mdx`입니다.
- 한 요청에 독립적인 주제가 여러 개면 각각 품질 기준을 통과한 여러 편을 발행할 수 있습니다.
- 같은 검색 의도의 유사 글은 나누지 않습니다.

## 완료 보고

- 새 글 또는 업데이트 여부
- 제목
- 파일 경로
- 핵심 공식 근거와 검증 날짜
- 품질 점수
- 글 커밋 SHA
- 후보·memory 갱신 커밋
- 예상 게시 URL
- 빌드 검증 여부

## 실패 처리

공식 근거가 부족하거나, 기존 글과 실질적으로 중복되거나, MDX·build 검증에 실패하면 억지로 발행하지 않습니다. 확인하지 못한 부분을 명확히 보고합니다.
