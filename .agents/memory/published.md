# 발행 기록

새 글을 발행하거나 기존 글을 크게 업데이트한 뒤 아래 형식으로 기록합니다.

```md
## YYYY-MM-DD — 제목
- type: new | update | digest
- slug: /blog/example
- file: src/content/blog/example.mdx
- topics: [topic]
- sources: [official source]
- commit: SHA
- notes: 새로 제공한 핵심 가치
```

기존 `src/content/blog/`가 현재 발행 상태의 원본이며, 이 파일은 에이전트의 빠른 중복 판단용 인덱스입니다.

## 2026-07-22 — Gemini 3.6 Flash 마이그레이션 가이드: 가격, API 변경, Copilot·AI Gateway
- type: new
- slug: /blog/gemini-3-6-flash-migration-guide/
- file: src/content/blog/gemini-3-6-flash-migration-guide.mdx
- topics: [Gemini 3.6 Flash, Gemini 3.5 Flash-Lite, Google AI, GitHub Copilot, AI Gateway]
- sources: [https://ai.google.dev/gemini-api/docs/latest-model, https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash, https://github.blog/changelog/2026-07-21-gemini-3-6-flash-is-now-available-in-github-copilot/, https://vercel.com/changelog/gemini-3-6-flash-3-5-flash-lite-on-ai-gateway]
- commit: 3eac961c8dcd2e6df9c99a356f079cd788529195
- notes: 신모델 발표 요약이 아니라 sampling parameter 제거, prefilled model turn 400 오류, thinking 설정, Copilot 교체 일정과 AI Gateway 비교 코드를 하나의 마이그레이션 절차로 제공함

## 2026-07-22 — Vercel AI Gateway Service Tiers 운영 가이드: priority·flex 비용과 fallback 검증
- type: new
- slug: /blog/vercel-ai-gateway-service-tiers-guide/
- file: src/content/blog/vercel-ai-gateway-service-tiers-guide.mdx
- topics: [Vercel AI Gateway, AI SDK, Service Tier, OpenAI, Gemini]
- sources: [https://vercel.com/changelog/service-tiers-now-available-on-ai-gateway, https://vercel.com/docs/ai-gateway/models-and-providers/service-tiers]
- commit: 4dd0d54660fcd45e5844947c28c9f01e16178fe7
- notes: 티어 목록보다 requested tier와 실제 applied tier를 분리 기록하고, priority downgrade를 실패로 처리하지 않으며, 모델 선택과 지연·비용 최적화를 별도 축으로 운영하는 코드를 제공함

## 2026-07-21 — Astro 5에서 7.1로 올리기 전 점검할 것: Content Layer, Node 22, Tailwind
- type: new
- slug: /blog/astro-5-to-7-1-migration-audit/
- file: src/content/blog/astro-5-to-7-1-migration-audit.mdx
- topics: [Astro 7.1, GitHub Pages, Content Layer, Node 22, Tailwind CSS]
- sources: [https://astro.build/blog/astro-710/, https://astro.build/blog/astro-7/, https://docs.astro.build/en/guides/upgrade-to/v6/, https://docs.astro.build/en/guides/upgrade-to/v7/, https://docs.astro.build/en/guides/styling/]
- commit: 2ef62dc83b147656d9cb6189abe1ba3e5b839578
- notes: 일반 릴리스 요약이 아니라 실제 Restato의 Astro 5, Node 20, src/content/config.ts, post.slug, post.render(), Tailwind 3 구성을 기준으로 빌드를 막는 항목과 단계별 전환 순서를 제시함

## 2026-07-21 — GitHub Copilot 코드 리뷰를 저장소 규칙에 맞추는 방법: 지침, Setup, Firewall
- type: new
- slug: /blog/github-copilot-code-review-customization-guide/
- file: src/content/blog/github-copilot-code-review-customization-guide.mdx
- topics: [GitHub Copilot, Code Review, GitHub Actions, Agent Skills, Firewall]
- sources: [https://github.blog/changelog/2026-07-17-copilot-code-review-customization-and-configurability-improvements/, https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review, https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall, https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment]
- commit: 290fef4566cb26d99db850ef102070203403c567
- notes: 새 기능 목록보다 REVIEW.md, head 브랜치 지침 검증, 전용 copilot-code-review.yml, setup 실패 처리, 독립 firewall·runner와 리뷰용 skill 설계를 제공함

## 2026-07-20 — AI SDK 7 프로덕션 에이전트 가이드: 승인, WorkflowAgent, HarnessAgent
- type: new
- slug: /blog/ai-sdk-7-production-agent-guide/
- file: src/content/blog/ai-sdk-7-production-agent-guide.mdx
- topics: [Vercel AI SDK, WorkflowAgent, HarnessAgent, AI Agent, TypeScript]
- sources: [https://vercel.com/blog/ai-sdk-7, https://vercel.com/changelog/program-agent-harnesses-with-ai-sdk, https://vercel.com/kb/guide/durableagent-to-workflowagent, https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling, https://ai-sdk.dev/docs/migration-guides/versioning]
- commit: d65fb623f80f4fe69dc969c0fcc2fc8bbda861bf
- notes: 기능 나열 대신 ToolLoopAgent·WorkflowAgent·HarnessAgent 선택 기준, 쓰기 도구 승인, durable 실행, 컨텍스트 직렬화, 타임아웃, 관측성과 AI SDK 6→7 마이그레이션 체크리스트를 제공함

## 2026-07-20 — GitHub를 기억으로 쓰는 Content OS 구축기: 스킬, 점수, 자동 발행
- type: new
- slug: /blog/github-content-os-agent-skills-workflow/
- file: src/content/blog/github-content-os-agent-skills-workflow.mdx
- topics: [Content OS, GitHub, AI Agent, Automation, Astro]
- sources: [.agents/CONTENT_POLICY.md, .agents/WORKFLOW.md, .agents/memory/*, .agents/skills/*/SKILL.md, src/data/contentCandidates.json, src/pages/content-os.astro, src/content/config.ts]
- commit: 99a04abacba4fc3e59c9467c952baf0b3e4fc7a2
- notes: 기존 자동 글 생성기와 달리 GitHub 기반 장기 기억, 역할별 스킬, Gap Finder, 100점 점수 기준, 후보 JSON과 읽기 전용 대시보드, 실제 Astro 스키마 검증 구조를 설명함

## 2026-07-19 — GPT-5.6 Sol·Terra·Luna 선택 가이드: API 가격, 컨텍스트, 마이그레이션
- type: new
- slug: /blog/gpt-5-6-sol-terra-luna-api-guide/
- file: src/content/blog/gpt-5-6-sol-terra-luna-api-guide.mdx
- topics: [OpenAI API, GPT-5.6, Codex, AI 에이전트]
- sources: [https://openai.com/ko-KR/index/gpt-5-6/, https://developers.openai.com/api/docs/models, https://developers.openai.com/api/docs/models/gpt-5.6-sol, https://developers.openai.com/api/docs/models/gpt-5.6-terra, https://developers.openai.com/api/docs/models/gpt-5.6-luna]
- commit: cd48aa8353d3584c1f0a16061f4d393d6117fbbf
- notes: 출시 요약이 아니라 Sol·Terra·Luna 선택 기준, 27만 2천 토큰 초과 요율, 캐시 비용, Responses API 예제와 GPT-5.5 마이그레이션 절차를 제공함
