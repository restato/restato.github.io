---
name: restato-blog-writer
description: "Use after a Restato article brief and outline are approved to turn verified research into an English MDX technical-blog draft. This is the drafting stage only; collaboration, approval, verification, and PR delivery are controlled by restato-content-partner."
version: 2.0.0
author: Restato
license: MIT
metadata:
  hermes:
    tags: [writing, technical-blog, english, mdx]
    related_skills: [restato-content-partner, researcher]
---

# Restato Blog Writer

## Overview

이 스킬은 승인된 콘텐츠 브리프, 목차, 연구 자료를 영문 MDX 초안으로 바꾸는 writer 단계다. 전체 제작 흐름은 `restato-content-partner`가 제어한다. 이 스킬은 주제를 자율 선정하거나, 출처가 없는 내용을 채우거나, 게시·커밋·PR을 수행하지 않는다.

## Required inputs

작성을 시작하기 전에 다음 입력이 있어야 한다.

- 승인된 핵심 주장과 목차
- 대상 독자와 독자가 얻을 결과
- 출처가 연결된 핵심 사실
- 사용할 코드·명령어의 검증 범위
- 새 글 또는 기존 글 업데이트 결정
- 예상 slug와 관련 내부 링크

입력이 부족하면 추측으로 채우지 않고 `restato-content-partner`의 research 또는 outline 단계로 돌아간다.

## Language and voice

- 제목, description, 본문은 영어로 작성한다.
- 사용자와의 작업 대화는 한국어로 할 수 있다.
- 실무 개발자와 기술 의사결정자를 대상으로 한다.
- 직접적이고 구체적이며 약간의 기술적 판단이 있는 문체를 사용한다.
- 첫 문단에서 문제와 핵심 결론을 제시한다.
- 기능 소개보다 구현, 운영, 권한, 비용, 보안, 실패 조건, 평가 방법을 우선한다.
- 저장소나 실행 결과로 확인되지 않은 1인칭 경험을 사용하지 않는다.
- “revolutionary”, “game-changing”, “seamless” 같은 홍보 표현과 AI 상투어를 피한다.

세부 문체는 `../restato-content-partner/references/editorial-style.md`를 따른다.

## Drafting process

1. 승인된 목차의 각 섹션이 답할 질문을 한 문장으로 확인한다.
2. 연구 ledger의 사실, 계산, 분석을 섞지 않고 배치한다.
3. 도입부에서 독자의 문제와 글의 thesis를 바로 제시한다.
4. 실제 결정을 돕는 코드, 표, 절차, 체크리스트만 추가한다.
5. 중요한 외부 사실에 가장 구체적인 1차 출처를 연결한다.
6. 관련 Restato 글을 1~3개 자연스럽게 연결한다.
7. 결론에서 적용 대상, 제외 대상, 다음 행동을 구체적으로 제시한다.
8. TODO, placeholder, 임시 출처 표기를 제거한다.

각 섹션이 새로운 근거, 메커니즘, 판단 기준, 또는 실행 절차를 제공하면 초안이 완료된다.

## MDX contract

실제 계약은 `src/content/config.ts`이며, 작성 전 다시 확인한다. 현재 기본 형식은 다음과 같다.

```mdx
---
title: "A specific English title"
description: "A concise English description of the reader benefit."
date: 2026-07-19
tags: ["AI", "Engineering"]
---
```

규칙:

- 경로: `src/content/blog/<english-kebab-case-slug>.mdx`
- 날짜 필드는 `date`다. `pubDate`를 사용하지 않는다.
- 본문 H1은 추가하지 않는다.
- 코드 블록에는 정확한 언어를 지정한다.
- 존재하지 않는 컴포넌트나 import를 만들지 않는다.
- 태그는 기존 표기와 맞춘 2~5개를 우선한다.
- 내부 링크는 `/blog/<slug>/` 형식을 사용한다.

세부 계약과 검증 명령은 `../restato-content-partner/references/mdx-contract.md`를 따른다.

## Evidence discipline

모든 중요한 문장은 다음 세 범주 중 하나여야 한다.

- **Documented fact:** 출처가 직접 뒷받침한다.
- **Derived value:** 확인된 입력으로 도구를 사용해 계산했다.
- **Engineering interpretation:** 실무 해석이며 측정 사실처럼 표현하지 않는다.

공식 제품 설명의 “best”, “frontier”, “most capable” 같은 표현은 공급자의 분류로 귀속한다. 컨텍스트 한도, 벤치마크, 가격, 출시일을 근거 없이 효과나 품질 결론으로 확장하지 않는다.

## Code examples

- 현재 공식 SDK와 API 문법을 사용한다.
- 자격 증명은 환경 변수로 읽는다.
- 실행하지 못한 예제를 실행했다고 말하지 않는다.
- 선택적이거나 버전 민감한 매개변수는 검증되지 않았으면 생략한다.
- 짧고 정확한 예제를 우선한다.
- 비밀키, 토큰, 개인 데이터, 실제 고객 정보를 포함하지 않는다.

## Output

이 단계의 산출물은 다음뿐이다.

- 완성된 영문 MDX 초안
- 사용한 주요 출처 목록
- 실행 또는 검증하지 못한 항목 목록

작성 후 `restato-content-partner`의 editorial gate로 넘긴다. writer가 자신의 글을 최종 승인하거나 게시 완료라고 선언하지 않는다.
