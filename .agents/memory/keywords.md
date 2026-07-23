# 키워드 메모리

```md
## 키워드
- intent: informational | tutorial | comparison | news
- related:
- existing-post:
- opportunity:
- notes:
```

실제 검색량을 확인하지 않았다면 수치를 추정하지 말고 정성적으로만 기록합니다.

## AI SDK streaming transcription
- intent: tutorial | informational
- related: streamTranscribe, experimental_streamTranscribe, AI Gateway, raw PCM, realtime whisper, Grok STT, voice agent, live caption
- existing-post: /blog/ai-gateway-streaming-transcription-guide/
- opportunity: API 호출 예제보다 24kHz PCM 입력, 서버 발급 임시 토큰, 부분·최종 전사 상태, 텍스트 에이전트 연결과 승인 경계를 함께 설명하는 실전 검색 의도
- notes: Vercel 2026-07-22 공식 발표와 AI Gateway Grok STT 공식 모델 페이지를 기준으로 작성했으며 기능은 beta이고 API 이름은 experimental 상태

## eve agent extensions
- intent: tutorial | informational | comparison
- related: defineExtension, eve extension build, agent/extensions, agent skills package, tools, connections, hooks, namespace, approval
- existing-post: /blog/eve-installable-agent-extensions-guide/
- opportunity: scaffold·install 설명보다 tools·skills·connections·hooks를 권한과 버전이 있는 능력 패키지로 운영하고, namespace·secret·approval·통합 테스트를 설계하는 검색 의도
- notes: Vercel 2026-07-22 공식 발표, eve 공식 사이트와 agent-browser 공식 extension 문서를 기준으로 작성했으며 검색량 수치는 확인하지 않음

## Gemini 3.6 Flash migration
- intent: tutorial | comparison | informational
- related: Gemini 3.5 Flash-Lite, sampling parameters, prefilled model turn, thinking_level, Interactions API, GitHub Copilot, Vercel AI Gateway
- existing-post: /blog/gemini-3-6-flash-migration-guide/
- opportunity: 출시 기능 요약보다 temperature·top_p·top_k 제거, model role 400 오류, 모델 역할 분리와 Copilot·AI Gateway 전환을 한 번에 해결하는 실전 검색 의도
- notes: Google 2026-07-21 최신 모델·사양 문서, GitHub와 Vercel 공식 발표를 기준으로 작성했으며 검색량 수치는 확인하지 않음

## AI Gateway service tiers
- intent: tutorial | comparison | informational
- related: priority, flex, default, providerMetadata, serviceTier, AI SDK, OpenAI, Gemini, latency, cost
- existing-post: /blog/vercel-ai-gateway-service-tiers-guide/
- opportunity: 티어 설정법보다 requested tier와 실제 applied tier 차이, best-effort downgrade, 실제 과금과 workload routing을 운영 코드로 연결하는 검색 의도
- notes: Vercel 2026-07-21 changelog와 AI Gateway 공식 service tiers 문서를 기준으로 작성했으며 모델·제공자별 가격은 변동 가능

## Astro 7 migration
- intent: tutorial | informational
- related: Astro 7.1, Astro 5 to 7, Content Layer, Node 22, post.id, render(), Tailwind 4, GitHub Pages
- existing-post: /blog/astro-5-to-7-1-migration-audit/
- opportunity: 릴리스 기능 요약보다 실제 Astro 5 저장소에서 빌드를 막는 Node·content config·slug·render API와 Tailwind 전환 순서를 연결하는 실전 검색 의도
- notes: Restato의 package.json, src/content/config.ts, blog route, RSS, deploy workflow와 Astro 공식 v6·v7 migration guide를 기준으로 작성했으며 검색량 수치는 확인하지 않음

## GitHub Copilot code review customization
- intent: tutorial | informational
- related: copilot-code-review.yml, REVIEW.md, AGENTS.md, CLAUDE.md, custom instructions, firewall, runner, agent skills
- existing-post: /blog/github-copilot-code-review-customization-guide/
- opportunity: 단순 리뷰 요청법보다 head 브랜치 지침 검증, 전용 setup 환경, setup 실패 처리, 네트워크·runner 권한 분리와 review skill 설계에 대한 지속 검색 가능성
- notes: GitHub 2026-07-17 changelog와 공식 Copilot code review·firewall·environment 문서를 기준으로 작성. 문서 일부의 base branch 설명과 최신 changelog의 head branch 설명 차이를 명시함

## AI SDK 7
- intent: tutorial | comparison | informational
- related: WorkflowAgent, HarnessAgent, ToolLoopAgent, tool approval, Vercel AI SDK migration, durable AI agent, AI SDK telemetry
- existing-post: /blog/ai-sdk-7-production-agent-guide/
- opportunity: 기능 소개보다 에이전트 실행 경계, 사람 승인, 중단 복구, 컨텍스트 직렬화, 타임아웃과 운영 체크리스트에 대한 지속 검색 가능성
- notes: Vercel의 2026-06-25 공식 발표와 AI SDK 공식 문서·Knowledge Base를 기준으로 작성했으며 검색량 수치는 확인하지 않음

## Content OS
- intent: tutorial | informational
- related: AI blog automation, GitHub agent memory, SKILL.md, content scoring, gap finder, automatic publishing, Astro content collection
- existing-post: /blog/github-content-os-agent-skills-workflow/
- opportunity: 단순 글 생성 프롬프트가 아니라 정책·memory·역할별 스킬·후보 상태·발행 중단 조건을 GitHub에서 버전 관리하는 재현 가능한 구조
- notes: 실제 restato/restato.github.io 저장소 구현을 기준으로 작성했으며 기존 `/blog/building-auto-dev-blog-generator/`와 검색 의도를 분리함

## GPT-5.6
- intent: informational | comparison | tutorial
- related: GPT-5.6 Sol, GPT-5.6 Terra, GPT-5.6 Luna, OpenAI API 가격, GPT-5.5 마이그레이션, prompt caching
- existing-post: /blog/gpt-5-6-sol-terra-luna-api-guide/
- opportunity: 출시 뉴스보다 실제 모델 라우팅, 272K 초과 요율, 캐시 비용과 평가 기반 마이그레이션에 대한 지속 검색 가능성
- notes: 검색량 수치는 확인하지 않았으며 공식 모델 문서와 출시 자료를 기준으로 작성함
