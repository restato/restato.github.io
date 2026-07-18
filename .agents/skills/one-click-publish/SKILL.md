# One Click Publish

## 트리거 예시
- "이 주제로 글 써서 올려"
- "1, 3번 발행해"
- "최근 커밋으로 개발일지 올려"
- "기존 Claude Code 글 업데이트해"

## 실행 모드
사용자가 직접 주제를 지정하면 즉시 실행한다. 자동 탐색 모드의 85점 임계값은 적용하지 않지만 사실 검증, 중복 검사, 리뷰 기준은 생략하지 않는다.

## 파이프라인
1. `.agents/CONTENT_POLICY.md`와 `.agents/WORKFLOW.md`를 읽는다.
2. memory의 topics, published, ideas, style을 읽는다.
3. 기존 글과 검색 의도를 비교한다.
4. 공식 문서와 1차 자료를 조사한다.
5. gap-finder로 차별화 관점을 정한다.
6. planner → writer → seo-reviewer → reviewer 순서로 실행한다.
7. 새 글 또는 기존 글 업데이트를 선택한다.
8. MDX 스키마와 링크를 검사한다.
9. 가능한 환경에서는 `npm run build`를 실행한다. 실행할 수 없으면 검증하지 못했다고 명시한다.
10. 기본 브랜치에 커밋하고 결과를 보고한다.
11. `.agents/memory/published.md`와 `.agents/memory/ideas.md`를 갱신한다.

## MDX 규칙
경로: `src/content/blog/<english-kebab-case>.mdx`

```mdx
---
title: ""
description: ""
pubDate: 2026-07-18
tags: ["", ""]
---
```

실제 `src/content/config.ts` 스키마가 위와 다르면 스키마를 우선한다.

## 완료 보고
- 새 글/업데이트 여부
- 제목
- 파일 경로
- 핵심 근거
- 품질 점수
- 커밋 SHA
- 예상 게시 URL
- 빌드 검증 여부

## 실패 처리
근거가 부족하거나 사실 검증에 실패하면 억지로 발행하지 않는다. 어떤 정보가 부족했는지 명확히 보고한다.