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

## 2026-07-24 — MCP 2026-07-28 마이그레이션 가이드: 세션 제거, Stateless 요청, Conformance CI
- type: new
- slug: /blog/mcp-2026-07-28-stateless-migration-guide/
- file: src/content/blog/mcp-2026-07-28-stateless-migration-guide.mdx
- topics: [MCP, Model Context Protocol, Stateless, Conformance Test, AI Agent]
- sources: [https://github.blog/changelog/2026-07-23-github-mcp-server-supports-the-next-mcp-specification/, https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/, https://modelcontextprotocol.io/specification/draft/changelog, https://github.com/modelcontextprotocol/conformance]
- commit: 85fb29ffe4d31d0380ecab7750a37c6fb97d2025
- notes: release candidate 요약보다 initialize·세션 제거, 요청별 capability, server/discover, MRTR, cache metadata, idempotency와 draft conformance CI를 단계별 마이그레이션 절차로 제공함

## 2026-07-24 — GitHub Issues 에이전트 자동화 운영 가이드: Confidence, Approvals, Safe Outputs
- type: new
- slug: /blog/github-issues-agent-automation-controls-guide/
- file: src/content/blog/github-issues-agent-automation-controls-guide.mdx
- topics: [GitHub Issues, Agentic Workflows, Copilot, Confidence, Approvals, Safe Outputs]
- sources: [https://github.blog/changelog/2026-07-23-agent-automation-controls-in-github-issues-in-public-preview/, https://github.github.com/gh-aw/reference/safe-outputs/, https://github.github.com/gh-aw/reference/staged-mode/, https://github.github.com/gh-aw/guides/organization-practices/safe-rollout/]
- commit: 918c8270abcf923c80523355d7e51d3920c97fcd
- notes: UI 기능 소개보다 approval이 보안 경계가 아니라는 제한, read-only agent와 safe output 분리, staged rollout, action별 confidence calibration과 suggestion queue 운영을 설명함

## 2026-07-23 — AI Gateway 실시간 전사 가이드: streamTranscribe, PCM, 임시 토큰
- type: new
- slug: /blog/ai-gateway-streaming-transcription-guide/
- file: src/content/blog/ai-gateway-streaming-transcription-guide.mdx
- topics: [Vercel AI Gateway, AI SDK, streamTranscribe, Speech to Text, Voice Agent]
- sources: [https://vercel.com/changelog/ai-gateway-now-supports-streaming-transcription, https://vercel.com/ai-gateway/models/grok-stt/about]
- commit: 47ab504724d4f43a9d1806a95605d9c5add7b210
- notes: raw PCM 형식, 서버 발급 임시 토큰, 부분·최종 전사 상태 분리, 텍스트 에이전트 연결과 쓰기 도구 승인 경계를 하나의 운영 절차로 제공함

## 2026-07-23 — eve 에이전트 확장 패키지 만들기: tools·skills·hooks를 npm으로 배포하기
- type: new
- slug: /blog/eve-installable-agent-extensions-guide/
- file: src/content/blog/eve-installable-agent-extensions-guide.mdx
- topics: [eve, AI Agent, Agent Skills, Extensions, TypeScript]
- sources: [https://vercel.com/changelog/eve-extensions, https://eve.dev/, https://eve.dev/integrations]
- commit: ec869740a2d449e453f37ea586f68e0222a0c879
- notes: tool namespace, config schema, secret 분리, approval·disable 정책, package version과 소비 에이전트 통합 테스트를 운영 계약으로 정리함

## 2026-07-22 — Gemini 3.6 Flash 마이그레이션 가이드: 가격, API 변경, Copilot·AI Gateway
- type: new
- slug: /blog/gemini-3-6-flash-migration-guide/
- file: src/content/blog/gemini-3-6-flash-migration-guide.mdx
- topics: [Gemini 3.6 Flash, Gemini 3.5 Flash-Lite, Google AI, GitHub Copilot, AI Gateway]
- sources: [https://ai.google.dev/gemini-api/docs/latest-model, https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash, https://github.blog/changelog/2026-07-21-gemini-3-6-flash-is-now-available-in-github-copilot/, https://vercel.com/changelog/gemini-3-6-flash-3-5-flash-lite-on-ai-gateway]
- commit: 3eac961c8dcd2e6df9c99a356f079cd788529195
- notes: sampling parameter 제거, prefilled model turn 400 오류, thinking 설정, Copilot 교체 일정과 AI Gateway 비교 코드를 하나의 마이그레이션 절차로 제공함

## 2026-07-22 — Vercel AI Gateway Service Tiers 운영 가이드: priority·flex 비용과 fallback 검증
- type: new
- slug: /blog/vercel-ai-gateway-service-tiers-guide/
- file: src/content/blog/vercel-ai-gateway-service-tiers-guide.mdx
- topics: [Vercel AI Gateway, AI SDK, Service Tier, OpenAI, Gemini]
- sources: [https://vercel.com/changelog/service-tiers-now-available-on-ai-gateway, https://vercel.com/docs/ai-gateway/models-and-providers/service-tiers]
- commit: 4dd0d54660fcd45e5844947c28c9f01e16178fe7
- notes: requested tier와 실제 applied tier를 분리 기록하고, priority downgrade와 실제 과금을 운영하는 코드를 제공함

## 2026-07-21 — Astro 5에서 7.1로 올리기 전 점검할 것: Content Layer, Node 22, Tailwind
- type: new
- slug: /blog/astro-5-to-7-1-migration-audit/
- file: src/content/blog/astro-5-to-7-1-migration-audit.mdx
- topics: [Astro 7.1, GitHub Pages, Content Layer, Node 22, Tailwind CSS]
- sources: [https://astro.build/blog/astro-710/, https://astro.build/blog/astro-7/, https://docs.astro.build/en/guides/upgrade-to/v6/, https://docs.astro.build/en/guides/upgrade-to/v7/]
- commit: 2ef62dc83b147656d9cb6189abe1ba3e5b839578
- notes: 실제 Restato 구성에서 빌드를 막는 Node·content config·slug·render API와 단계별 전환 순서를 제시함

## 2026-07-21 — GitHub Copilot 코드 리뷰를 저장소 규칙에 맞추는 방법: 지침, Setup, Firewall
- type: new
- slug: /blog/github-copilot-code-review-customization-guide/
- file: src/content/blog/github-copilot-code-review-customization-guide.mdx
- topics: [GitHub Copilot, Code Review, GitHub Actions, Agent Skills, Firewall]
- sources: [https://github.blog/changelog/2026-07-17-copilot-code-review-customization-and-configurability-improvements/, https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review]
- commit: 290fef4566cb26d99db850ef102070203403c567
- notes: REVIEW.md, head 브랜치 지침 검증, 전용 setup workflow, firewall·runner와 리뷰용 skill 설계를 제공함

## 2026-07-20 — AI SDK 7 프로덕션 에이전트 가이드: 승인, WorkflowAgent, HarnessAgent
- type: new
- slug: /blog/ai-sdk-7-production-agent-guide/
- file: src/content/blog/ai-sdk-7-production-agent-guide.mdx
- topics: [Vercel AI SDK, WorkflowAgent, HarnessAgent, AI Agent, TypeScript]
- sources: [https://vercel.com/blog/ai-sdk-7, https://vercel.com/changelog/program-agent-harnesses-with-ai-sdk, https://vercel.com/kb/guide/durableagent-to-workflowagent]
- commit: d65fb623f80f4fe69dc969c0fcc2fc8bbda861bf
- notes: ToolLoopAgent·WorkflowAgent·HarnessAgent 선택 기준, 쓰기 도구 승인, durable 실행, 타임아웃과 관측성을 제공함

## 2026-07-20 — GitHub를 기억으로 쓰는 Content OS 구축기: 스킬, 점수, 자동 발행
- type: new
- slug: /blog/github-content-os-agent-skills-workflow/
- file: src/content/blog/github-content-os-agent-skills-workflow.mdx
- topics: [Content OS, GitHub, AI Agent, Automation, Astro]
- sources: [.agents/CONTENT_POLICY.md, .agents/WORKFLOW.md, .agents/memory/*, .agents/skills/*/SKILL.md, src/data/contentCandidates.json]
- commit: 99a04abacba4fc3e59c9467c952baf0b3e4fc7a2
- notes: GitHub 기반 장기 기억, 역할별 스킬, Gap Finder, 점수 기준, 후보 JSON과 발행 중단 조건을 설명함

## 2026-07-19 — GPT-5.6 Sol·Terra·Luna 선택 가이드: API 가격, 컨텍스트, 마이그레이션
- type: new
- slug: /blog/gpt-5-6-sol-terra-luna-api-guide/
- file: src/content/blog/gpt-5-6-sol-terra-luna-api-guide.mdx
- topics: [OpenAI API, GPT-5.6, Codex, AI 에이전트]
- sources: [https://openai.com/ko-KR/index/gpt-5-6/, https://developers.openai.com/api/docs/models]
- commit: cd48aa8353d3584c1f0a16061f4d393d6117fbbf
- notes: Sol·Terra·Luna 선택 기준, 장문 요율, 캐시 비용, Responses API 예제와 GPT-5.5 마이그레이션 절차를 제공함
