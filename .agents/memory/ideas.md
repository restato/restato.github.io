# 콘텐츠 아이디어 백로그

```md
## 아이디어 제목
- status: new | researching | ready | hold | rejected | published
- source:
- why-now:
- target-reader:
- search-intent:
- update-existing:
- notes:
```

트렌드 조사에서 가치가 있지만 당장 발행하지 않는 주제를 저장합니다. 이미 발행한 주제도 빠른 중복 판단을 위해 남깁니다.

## MCP 2026-07-28 Stateless 마이그레이션
- status: published
- source: GitHub 2026-07-23 GitHub MCP Server 발표, MCP 2026-07-28 release candidate·draft specification·conformance repository
- why-now: 세션과 initialize 제거, 요청별 capability 협상, MRTR, cache metadata, resumability 제거와 공식 conformance test가 한 번에 도입됨
- target-reader: 직접 MCP 서버·클라이언트·Streamable HTTP transport를 운영하는 개발자
- search-intent: MCP 2026-07-28 migration, stateless MCP, server/discover, MRTR, MCP conformance test
- update-existing: false
- notes: 97점. 2026-07-24 `/blog/mcp-2026-07-28-stateless-migration-guide/`로 발행. 최종 명세 전 release candidate임을 명시하고 migration checklist와 CI 예제를 제공함

## GitHub Issues 에이전트 자동화 통제
- status: published
- source: GitHub 2026-07-23 Issues agent automation controls 발표, GitHub Agentic Workflows safe outputs·staged mode·safe rollout 공식 문서
- why-now: action별 confidence, approvals, rationale와 `has:suggestions` 검토 흐름이 public preview로 추가됨
- target-reader: GitHub Issues triage와 metadata enrichment를 AI agent로 자동화하려는 저장소 관리자
- search-intent: GitHub Issues agent automation, issue intents, confidence approvals rationale, safe outputs, staged mode
- update-existing: false
- notes: 94점. 2026-07-24 `/blog/github-issues-agent-automation-controls-guide/`로 발행. approvals를 security boundary로 오해하지 않도록 권한 분리와 action별 calibration을 중심으로 설명함

## Copilot cloud agent for Linear
- status: hold
- source: GitHub 2026-07-23 GA 발표와 Linear integration 공식 문서
- why-now: Linear issue에서 모델·custom agent·base/working branch를 선택하고 comment로 session을 steering할 수 있게 됨
- target-reader: Linear와 GitHub를 함께 사용하는 개발 팀
- search-intent: GitHub Copilot Linear, Copilot coding agent Linear, custom agent branch guidance
- update-existing: false
- notes: 82점. organization owner와 Linear workspace admin 권한이 필요하며 실제 workspace 데이터 없이 독립 실습을 재현하기 어려워 integration digest까지 보류

## Vercel MCP 코드 배포
- status: hold
- source: Vercel 2026-07-23 changelog
- why-now: 지원 MCP client에서 git repository나 CLI 없이 파일을 새 프로젝트 또는 기존 프로젝트에 배포할 수 있게 됨
- target-reader: AI assistant에서 Vercel 배포를 수행하려는 개발자
- search-intent: Vercel MCP deploy code, deploy files without git, AI agent Vercel deployment
- update-existing: false
- notes: 83점. 공개 자료에 권한 범위, 파일 제한, dry-run, rollback과 실패 복구가 충분히 설명되지 않아 추가 문서나 재현 가능한 테스트가 나올 때까지 보류

## AI Gateway 스트리밍 전사
- status: published
- source: Vercel 2026-07-22 AI Gateway streaming transcription 발표
- why-now: live audio stream과 transcript delta를 주고받는 beta 기능으로 확장됨
- target-reader: AI SDK로 실시간 자막·음성 입력·text agent를 만드는 TypeScript 개발자
- search-intent: AI SDK streamTranscribe, realtime transcription PCM, voice agent token
- update-existing: false
- notes: 94점. `/blog/ai-gateway-streaming-transcription-guide/`로 발행

## eve installable agent extensions
- status: published
- source: Vercel 2026-07-22 eve extensions 발표
- why-now: tools, connections, skills, instructions, hooks를 설치·버전 관리 가능한 패키지로 묶을 수 있게 됨
- target-reader: 여러 에이전트에서 능력과 정책을 재사용하려는 TypeScript 개발자
- search-intent: eve extension, defineExtension, agent skills package
- update-existing: false
- notes: 92점. `/blog/eve-installable-agent-extensions-guide/`로 발행

## GitHub Copilot 영향 대시보드와 저장소 지표
- status: hold
- source: GitHub 2026-07-22 impact dashboard, 2026-07-17 repository metrics API
- why-now: adoption phase별 merge throughput·velocity·LOC와 권장 행동이 추가됨
- target-reader: Copilot Business·Enterprise 도입 성과를 측정하는 관리자
- search-intent: GitHub Copilot impact dashboard, repository usage metrics
- update-existing: false
- notes: 80점. 관리자 권한과 실제 조직 데이터가 필요한 주제라 성과 측정 digest까지 보류

## Gemini 3.6 Flash API 마이그레이션
- status: published
- source: Google Gemini 공식 문서, GitHub·Vercel 2026-07-21 발표
- why-now: 신규 모델 GA와 sampling parameter·prefilled turn 호환성 변화가 발생함
- target-reader: Gemini API·Copilot·AI Gateway 사용자
- search-intent: Gemini 3.6 Flash migration
- update-existing: false
- notes: 97점. `/blog/gemini-3-6-flash-migration-guide/`로 발행

## Vercel AI Gateway Service Tiers
- status: published
- source: Vercel 2026-07-21 changelog와 공식 문서
- why-now: default·priority·flex 처리 티어와 실제 적용 티어 기반 과금이 추가됨
- target-reader: AI workload의 비용과 지연을 분리하려는 개발자
- search-intent: AI Gateway service tier, priority flex
- update-existing: false
- notes: 92점. `/blog/vercel-ai-gateway-service-tiers-guide/`로 발행

## Vercel Workflows 지역별 run state
- status: hold
- source: Vercel 2026-07-20 regional workflow run state 발표
- why-now: run state, queue, output을 프로젝트 home region에 유지할 수 있게 됨
- target-reader: 데이터 위치와 장기 실행 상태를 관리하는 Workflow SDK 사용자
- search-intent: Vercel Workflows region, home region state
- update-existing: false
- notes: 79점. beta이며 실제 운영 사례가 없어 digest까지 보류

## Astro 5에서 7.1로 올리기 전 점검
- status: published
- source: Astro 7.1·7.0 발표와 v6·v7 upgrade guide, Restato 실제 저장소
- why-now: Restato가 Astro 5와 제거 예정 API를 사용 중임
- target-reader: Astro 기반 MDX·GitHub Pages 운영자
- search-intent: Astro 5 to 7 migration
- update-existing: false
- notes: 96점. `/blog/astro-5-to-7-1-migration-audit/`로 발행

## GitHub Copilot 코드 리뷰 커스터마이징
- status: published
- source: GitHub 2026-07-17 공식 발표와 code review·firewall 문서
- why-now: REVIEW.md, head branch instructions, setup workflow와 독립 firewall 지원이 추가됨
- target-reader: Copilot code review를 팀 규칙에 맞추는 관리자
- search-intent: Copilot code review instructions
- update-existing: false
- notes: 89점. `/blog/github-copilot-code-review-customization-guide/`로 발행

## AI SDK 7 프로덕션 에이전트
- status: published
- source: Vercel 2026-06-25 AI SDK 7 발표와 공식 문서
- why-now: WorkflowAgent, HarnessAgent, 승인·durable 실행 계층이 추가됨
- target-reader: TypeScript로 production agent를 만드는 개발자
- search-intent: AI SDK 7 WorkflowAgent HarnessAgent
- update-existing: false
- notes: 93점. `/blog/ai-sdk-7-production-agent-guide/`로 발행

## Restato Content OS 구축기
- status: published
- source: 실제 `.agents/`와 Content OS dashboard 구현
- why-now: 정책·memory·skills·scoring·gap finder가 저장소에 구현됨
- target-reader: GitHub 기반 콘텐츠 자동화를 만드는 개발자
- search-intent: Content OS, AI blog automation, SKILL.md
- update-existing: false
- notes: 88점. `/blog/github-content-os-agent-skills-workflow/`로 발행

## ChatGPT 커스텀 지침 5,000자 확대
- status: rejected
- source: OpenAI 2026-07-15 공식 릴리스 노트
- why-now: custom instructions 제한 확대
- target-reader: ChatGPT 사용자
- search-intent: custom instructions 5000
- update-existing: false
- notes: 61점. 코드·마이그레이션·운영 판단이 부족해 제외

## Codex iOS 인라인 시각화와 작업 제어
- status: rejected
- source: OpenAI 2026-07-13 공식 릴리스 노트
- why-now: 모바일 작업 제어 개선
- target-reader: iOS Codex 사용자
- search-intent: Codex iOS visualization
- update-existing: false
- notes: 64점. UI 개선 중심으로 독립 실습과 장기 검색 가치가 부족해 제외

## GPT-5.6 Sol·Terra·Luna 선택 가이드
- status: published
- source: OpenAI 2026-07-09 발표와 공식 API 모델 문서
- why-now: 세 모델 계층과 장문·캐시 가격 규칙 도입
- target-reader: OpenAI API로 AI 기능을 운영하는 개발자
- search-intent: GPT-5.6 model comparison, pricing, migration
- update-existing: false
- notes: 95점. `/blog/gpt-5-6-sol-terra-luna-api-guide/`로 발행
