---
name: one-click-publish
description: "Use when the user explicitly asks to turn a specified Restato topic or approved draft into a pull request with minimal coordination. Preserves evidence and build checks; never treats one-click as permission to push directly to the default branch or merge without approval."
version: 2.0.0
author: Restato
license: MIT
metadata:
  hermes:
    tags: [content, publishing, pull-request]
    related_skills: [restato-content-partner]
---

# One Click Publish

## Purpose

이 스킬은 “이 주제로 글 써서 PR 만들어줘”, “이 초안 바로 올릴 준비해줘” 같은 빠른 실행 요청의 호환 진입점이다. 실제 정책과 파이프라인은 `restato-content-partner`를 따른다.

“One click”은 조사와 검증을 생략한다는 뜻이 아니다. 사용자가 원하는 방향이 이미 명확할 때 질문과 중간 보고를 줄인다는 뜻이다.

## Fast-track rules

- 사용자가 주제만 지정하면 brief와 outline을 한 번에 제안하고 outline 승인을 받는다.
- 사용자가 승인된 outline 또는 완성 초안을 제공하면 첫 승인 지점을 충족한 것으로 볼 수 있다.
- 사용자가 “중간 승인 없이 PR까지”라고 명시하면 outline과 final draft 승인을 합칠 수 있다.
- 사실 검증, 중복 검사, MDX 계약, editorial hard blockers, `npm run build`는 생략할 수 없다.
- 기본 브랜치 직접 푸시와 자동 병합은 허용하지 않는다.

## Pipeline

1. `.agents/skills/restato-content-partner/SKILL.md`를 읽는다.
2. 현재 `src/content/config.ts`와 관련 기존 글을 확인한다.
3. 공식 자료와 실제 저장소를 조사한다.
4. 사용자 지시에 맞는 승인 지점을 적용한다.
5. 영문 MDX를 작성하거나 수정한다.
6. editorial rubric과 `npm run build`를 통과한다.
7. 승인 후 콘텐츠 브랜치에 커밋하고 PR을 만든다.
8. CI와 예상 게시 URL을 보고한다.

## Delivery report

- 작업 유형: new | update
- 제목과 파일 경로
- 핵심 주장과 주요 출처
- 실행한 검증과 실제 결과
- 커밋 SHA
- PR URL
- 예상 게시 URL
- 남은 불확실성

## Failure handling

근거 부족, 스키마 오류, 새 빌드 실패, 중요한 미확인 주장 중 하나라도 있으면 PR을 만들지 않는다. 실패 원인과 필요한 다음 입력을 정확히 보고한다.

PR 생성은 게시 완료가 아니다. 병합과 실제 URL 확인 전에는 `.agents/memory/published.md`에 발행 완료로 기록하지 않는다.
