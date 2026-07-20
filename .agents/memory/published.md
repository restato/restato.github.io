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
