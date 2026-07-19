---
name: restato-content-partner
description: "Use when collaborating with direcision to research, outline, write, review, and publish English technical articles for restato.github.io. Enforces two human approval gates, primary-source evidence, the repository's Astro MDX contract, build verification, and pull-request delivery."
version: 1.0.0
author: Restato
license: MIT
metadata:
  hermes:
    tags: [content, technical-blog, editorial, mdx, astro, github]
    related_skills: [researcher, gap-finder, restato-blog-writer]
---

# Restato Content Partner

## Overview

이 스킬은 `restato/restato.github.io`의 기술 콘텐츠를 사용자와 함께 만드는 기본 오케스트레이터다. 자동으로 글 수를 늘리는 것이 아니라, 독자가 신뢰하고 실제 의사결정이나 구현에 사용할 수 있는 영문 기술 글을 만든다.

기본 협업 방식은 다음 두 승인 지점을 갖는다.

1. **Outline approval:** 조사 결과, 핵심 주장, 차별점, 목차를 사용자가 승인한다.
2. **Final draft approval:** 완성된 영문 MDX와 검증 결과를 사용자가 승인한다.

최종 승인을 받으면 브랜치를 푸시하고 PR을 만든다. 사용자가 명시적으로 요청하지 않는 한 PR을 병합하거나 기본 브랜치에 직접 푸시하지 않는다.

## When to use

다음 요청에서 이 스킬을 사용한다.

- Restato 블로그의 새 기술 글을 함께 기획하거나 작성할 때
- 기존 글을 최신 정보에 맞게 업데이트할 때
- AI 모델, API, 개발 도구, 에이전트, Astro, GitHub Pages 관련 글을 발행할 때
- 사용자가 “이 주제로 글 만들자”, “블로그에 올리자”, “초안 써줘”, “PR 만들어줘”라고 요청할 때

단순 오탈자 수정이나 콘텐츠와 무관한 애플리케이션 코드 변경에는 사용하지 않는다.

## Source of truth

충돌이 있을 때 다음 순서를 따른다.

1. 현재 사용자의 명시적 지시
2. `src/content/config.ts`의 실제 MDX 스키마와 저장소 코드
3. `.agents/CONTENT_POLICY.md`와 이 스킬
4. 공식 문서, 릴리스 노트, 원본 저장소 같은 1차 자료
5. `.agents/memory/`의 편집 메모리

메모리와 기존 글은 빠른 탐색용이지 최신 사실의 증거가 아니다. 현재 제품명, 버전, 가격, 제한, 날짜, API 구문은 항상 원문에서 다시 확인한다.

## Default working agreement

- 사용자와의 기획 대화 및 진행 보고는 한국어로 할 수 있다.
- 발행할 기술 블로그 본문, 제목, 설명은 **영어**로 작성한다.
- 독자는 실무 개발자와 기술 의사결정자다.
- 기본 산출물은 `src/content/blog/<english-kebab-case-slug>.mdx`다.
- 기준 글은 `src/content/blog/gpt-5-6-agent-engineering-production-guide.mdx`다.
- 새 글보다 기존 글 업데이트가 검색 의도와 독자 가치에 더 적합하면 업데이트를 권한다.
- 확인하지 않은 경험, 성과, 벤치마크, 실행 결과를 1인칭 경험처럼 쓰지 않는다.
- 승인 전에는 게시, 병합, 기본 브랜치 직접 푸시 같은 외부 발행 상태를 변경하지 않는다.

사용자가 “빠르게 진행”, “바로 PR”처럼 승인 단계를 명시적으로 줄이면 해당 작업에 한해 승인 지점을 합칠 수 있다. 사실 검증과 빌드 검증은 생략하지 않는다.

## Workflow

### 1. Establish the brief

요청에서 알 수 있는 내용은 먼저 추론하고, 결과물을 실질적으로 바꾸는 정보만 질문한다. 다음 항목을 짧은 콘텐츠 브리프로 정리한다.

- 작업 유형: new post | update existing
- 대상 독자와 독자가 해결할 문제
- 검색 의도 또는 읽고 난 뒤의 행동
- 핵심 주장 한 문장
- 포함할 실제 코드, 프로젝트 경험, 데이터
- 시의성 기준일과 범위
- 예상 slug와 관련 기존 글

`templates/content-brief.md` 형식을 사용한다. 브리프가 “누가 왜 이 글을 읽는가”를 한 문장으로 설명하면 완료다.

### 2. Check existing coverage

`src/content/blog/` 전체의 파일명과 frontmatter를 확인하고, 관련 글의 본문을 읽는다. `.agents/memory/published.md`, `ideas.md`, `keywords.md`는 보조 인덱스로 사용한다.

다음을 비교한다.

- 동일하거나 매우 가까운 검색 의도
- 이미 사용한 결론과 예제
- 자연스럽게 연결할 내부 링크
- 업데이트하면 더 강해지는 기존 글

동일 의도라면 새 글 대신 업데이트를 제안한다. 새 글 또는 업데이트 선택과 근거가 명확하면 완료다.

### 3. Build the evidence ledger

`researcher` 절차와 `templates/research-ledger.md`를 사용한다. 출처 우선순위는 공식 문서, 공식 릴리스·시스템 카드, 원본 저장소·표준, 방법론이 공개된 독립 평가 순서다.

각 핵심 주장을 다음 중 하나로 분류한다.

- **Documented fact:** 원문이 직접 뒷받침한다.
- **Derived value:** 확인된 입력으로 계산했으며 도구로 산출했다.
- **Engineering interpretation:** 근거에서 도출한 실무 판단이며 측정 결과처럼 표현하지 않는다.

코드 예제의 모델 ID, SDK, 엔드포인트, 매개변수는 현재 공식 문서와 대조한다. 자격 증명 때문에 실행할 수 없다면 문서 기반 예제라고 표시한다. 중요한 주장마다 출처 또는 명확한 분석 라벨이 있으면 완료다.

### 4. Find the unique promise

`gap-finder`를 사용해 기존 글과 외부 자료가 놓치는 질문을 찾는다. 단순히 “한국어 자료가 적다” 또는 “최신 주제다”는 차별점이 아니다.

좋은 차별점은 다음 중 하나 이상을 제공한다.

- 운영 환경에서 필요한 권한, 비용, 보안, 평가 기준
- 재현 가능한 코드나 절차
- 기능 선택을 돕는 명확한 판단 기준
- 실패 조건, 마이그레이션 위험, 숨은 제약
- Restato 저장소의 실제 구현에서 확인된 교훈

글의 `unique promise`를 한 문장으로 말할 수 있으면 완료다.

### 5. Propose the outline — approval gate 1

사용자에게 다음을 한국어로 간결하게 제시한다.

1. 제안 제목과 slug
2. 대상 독자
3. 핵심 주장
4. 차별점
5. 섹션별 목차와 각 섹션이 답할 질문
6. 주요 출처
7. 확인이 필요한 불확실성

사용자가 목차를 승인하거나 구체적 수정 지시를 줄 때까지 본문 전체를 작성하지 않는다. 승인된 목차가 각 섹션의 역할과 결론을 정의하면 완료다.

### 6. Draft the English MDX

승인된 목차를 바탕으로 `restato-blog-writer`와 `references/editorial-style.md`를 따른다. `references/mdx-contract.md`의 스키마를 사용한다.

초안은 다음 조건을 만족해야 한다.

- 도입부에서 문제와 핵심 판단을 바로 제시한다.
- 기능 목록보다 엔지니어링 결정과 트레이드오프를 중심에 둔다.
- 표는 실제 비교나 선택을 도울 때만 사용한다.
- 코드와 명령어에는 전제 조건과 검증 범위를 밝힌다.
- 중요한 외부 사실은 원문 링크로 추적 가능하다.
- 관련 Restato 글을 1~3개 자연스럽게 연결한다. 관련 글이 없으면 억지로 만들지 않는다.
- 결론은 구체적인 추천과 다음 행동으로 끝낸다.

모든 frontmatter 필드와 본문이 완성되고 TODO나 임시 주장이 남지 않으면 완료다.

### 7. Run the editorial gate

`references/review-rubric.md`를 사용해 다음을 검수한다.

- 사실성과 출처
- 코드와 명령어
- 독자 가치와 중복
- 영문 문체와 AI 상투어
- SEO와 내부 링크
- MDX 스키마와 보안

필요한 링크를 직접 열어 상태와 내용을 확인한다. 변경된 글에 대해 `npm run build`를 실행한다. 빌드 실패가 기존 문제인지 새 변경으로 인한 문제인지 구분하되, 새 글이 만든 실패는 반드시 고친다.

hard blocker가 0개이고 빌드가 통과하면 완료다.

### 8. Present the final draft — approval gate 2

사용자에게 다음을 제공한다.

- 최종 제목, description, slug
- 핵심 주장과 주요 변경점
- 전체 MDX 또는 검토 가능한 diff
- 확인한 주요 출처
- 실행한 검증 명령과 실제 결과
- 남은 불확실성

사용자가 최종 원고를 승인할 때까지 커밋·푸시·PR 생성을 하지 않는다. 수정 요청이 오면 해당 범위만 고치고 editorial gate를 다시 실행한다.

### 9. Deliver through a pull request

최종 승인 후에만 다음을 수행한다.

1. 최신 기본 브랜치에서 `blog/<slug>` 또는 `content/<slug>` 브랜치를 사용한다.
2. 변경 범위를 콘텐츠와 관련 메모리로 제한한다.
3. `blog: add <short topic>` 또는 `blog: update <short topic>` 형식으로 커밋한다.
4. 브랜치를 푸시하고 PR을 만든다.
5. PR 본문에 요약, 주요 출처, 검증 명령, 예상 URL을 적는다.
6. CI 상태를 확인하고 새 실패를 수정한다.

사용자가 명시적으로 요청하지 않는 한 PR을 병합하지 않는다. PR URL과 CI 상태를 보고하면 완료다.

### 10. Update memory after publication

PR이 병합되고 게시 URL이 실제로 열리는 것을 확인한 뒤에만 `.agents/memory/published.md`에 발행 기록을 남긴다. 아이디어 상태와 키워드 메모리도 실제 결과에 맞게 갱신한다.

게시되지 않은 초안을 `published`로 기록하지 않는다. 파일, URL, 날짜, 출처, 제공한 고유 가치를 기록하면 완료다.

## Common pitfalls

1. **Writing before alignment.** 목차 승인 전에 전체 초안을 쓰면 사용자 판단보다 초안의 관성이 강해진다. 먼저 핵심 주장과 목차를 승인받는다.
2. **Using stale schema examples.** 이 저장소는 `pubDate`가 아니라 `date`를 사용한다. 항상 `src/content/config.ts`를 먼저 확인한다.
3. **Calling a post published when only a PR exists.** 병합과 실제 URL 확인 전에는 발행 기록을 남기지 않는다.
4. **Direct-to-master publishing.** 편집 승인과 변경 검토를 우회한다. 기본값은 PR이며 병합은 별도 승인이다.
5. **Inventing firsthand experience.** 저장소, 로그, 테스트 결과로 확인되지 않은 경험은 일반 분석 또는 제안으로 표현한다.
6. **Writing a disguised press release.** 제품 기능보다 누가 써야 하는지, 누가 쓰지 말아야 하는지, 어떻게 검증할지를 설명한다.
7. **Treating a score as evidence.** 주제 점수는 우선순위 도구일 뿐 사실 검증이나 발행 허가를 대신하지 않는다.

## Verification checklist

- [ ] 브리프와 검색 의도가 명확하다.
- [ ] 기존 글 중복 또는 업데이트 가능성을 확인했다.
- [ ] 핵심 주장마다 출처 또는 분석 라벨이 있다.
- [ ] 사용자가 목차를 승인했다.
- [ ] 글의 제목, description, 본문이 영어다.
- [ ] frontmatter가 현재 `src/content/config.ts`와 일치한다.
- [ ] 직접 확인하지 않은 경험이나 결과를 꾸미지 않았다.
- [ ] 내부 링크와 외부 출처 링크를 확인했다.
- [ ] editorial hard blocker가 없다.
- [ ] `npm run build`가 통과했다.
- [ ] 사용자가 최종 원고를 승인했다.
- [ ] 기본 브랜치 직접 푸시가 아니라 PR을 만들었다.
- [ ] 병합·배포 확인 전에는 발행 완료로 기록하지 않았다.
