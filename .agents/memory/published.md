# 발행 기록

이 파일은 중복 판단을 위한 간결한 발행 인덱스입니다. 상세 근거와 공식 출처는 각 글의 `공식 자료` 섹션과 Git history를 확인합니다.

## 2026-07-28 — GitHub Models 종료 전 마이그레이션 가이드
- type: new
- slug: /blog/github-models-retirement-migration-guide/
- score: 96
- commit: 987525b727f9e40c62c9b5f0ef0d6125d232ca75
- notes: 2026년 7월 30일 playground, catalog, inference API와 BYOK가 모두 종료되며, 종료 공지보다 의존성 탐색, provider adapter, 기능 회귀 테스트, 단계적 전환과 legacy 권한 제거를 연결한 실전 마이그레이션 공백이 큼

## 2026-07-28 — GitHub Copilot 앱과 Cloud Agent 정책 관리 가이드
- type: new
- slug: /blog/github-copilot-managed-settings-governance-guide/
- score: 94
- commit: 106222ce92f8f95e002a22fdac00111389d0a834
- notes: 2026년 7월 27일 Copilot 앱 접근 정책이 CLI에서 분리되고 managed settings가 앱과 Cloud Agent까지 확대되어, 접근 정책·공통 client 설정·repository 실행 권한을 구분한 운영 절차를 제공

## 2026-07-27 — Vercel Sandbox 대시보드 운영 가이드
- type: new
- slug: /blog/vercel-sandbox-dashboard-incident-response-guide/
- score: 94
- commit: 2e13beb2e3e70ff69499475da96b79deaad7b43e
- notes: 2026년 7월 23일 실행 중인 Sandbox의 터미널·파일·포트·lifecycle을 대시보드에서 관리할 수 있게 됐으며, 공식 소개와 기존 검색 결과가 기능 나열에 집중한 반면 증거 보존, 포트 노출, persistence, 중지 경쟁 상태와 안전한 복구를 연결하는 운영 공백이 큼

## 2026-07-27 — Vercel Flags 롤아웃 감사 가이드
- type: new
- slug: /blog/vercel-flags-rollout-audit-guide/
- score: 91
- commit: a8dee26c9d2d64aeb0c44af3c861d5669c959546
- notes: 2026년 7월 23일 평가 메트릭과 CLI revision·semantic diff가 함께 공개됐고, 기존 자료가 두 기능을 따로 설명하는 반면 변경 이력, 실제 variant·fallback, rollback과 제품 지표를 하나의 감사 절차로 연결하는 콘텐츠 공백이 확인됨

## 2026-07-26 — Vercel Workflow 30분 Step 운영 가이드
- type: new
- slug: /blog/vercel-workflow-30-minute-step-duration-guide/
- score: 95
- commit: d34d92c7d74cc6aa0bc018a31d6293278c0f30c8
- notes: 2026년 7월 24일 Pro·Enterprise Workflow step의 상한이 800초에서 1,800초로 늘어났으며, 공식 발표가 설정법에 집중한 반면 긴 step의 분리 기준, idempotency, 재시도, 취소, 비용과 관측성을 연결하는 운영 공백이 큼

## 2026-07-26 — Vercel Blob WAF 운영 가이드
- type: new
- slug: /blog/vercel-blob-waf-security-guide/
- score: 93
- commit: 3911fa70228644fc4732b9b8971b188df2d52dd4
- notes: 2026년 7월 24일 Blob WAF beta가 공개됐고, 기능 소개보다 WAF와 인증의 차이, challenge의 server-side 제약, 모든 보호 store가 공유하는 rule set과 단계적 rollout을 설명하는 실무 공백이 확인됨

## 2026-07-25 — Claude Opus 5 마이그레이션 가이드
- type: new
- slug: /blog/claude-opus-5-migration-copilot-guide/
- score: 98
- commit: d043ed9d4fee889911a90beca634a53c1bf6e1fa
- notes: 2026년 7월 24일 Opus 5가 GitHub Copilot에 추가됐고 Anthropic 공식 마이그레이션 문서에서 thinking 기본 활성화, max_tokens 재조정, effort 제한과 프롬프트 변화가 확인돼 단순 출시 요약보다 재현 가능한 전환 가이드를 제공할 수 있음

## 2026-07-25 — OpenAI API 지출 한도 운영 가이드
- type: new
- slug: /blog/openai-api-spend-limits-guide/
- score: 92
- commit: cc016b0a5889f736f62e37fdc7a38c1920e1f477
- notes: OpenAI가 조직과 프로젝트 수준에서 월간 지출 한도를 모니터링 전용 또는 hard limit으로 적용할 수 있게 했으며, 기존 자료가 UI 설명에 집중한 반면 프로젝트 격리, 단계별 감속, 재시도와 fallback 장애 대응을 연결하는 운영 공백이 큼

## 2026-07-24 — MCP 2026-07-28 마이그레이션 가이드
- type: new
- slug: /blog/mcp-2026-07-28-stateless-migration-guide/
- score: 97
- commit: 85fb29ffe4d31d0380ecab7750a37c6fb97d2025
- notes: 세션·initialize 제거, 요청별 capability, MRTR, cache metadata와 공식 conformance suite를 하나의 전환 절차로 제공

## 2026-07-24 — GitHub Issues 에이전트 자동화 운영 가이드
- type: new
- slug: /blog/github-issues-agent-automation-controls-guide/
- score: 94
- commit: 918c8270abcf923c80523355d7e51d3920c97fcd
- notes: read-only agent, safe outputs, staged mode와 action별 confidence calibration을 연결한 운영 가이드

## 2026-07-23 — AI Gateway 실시간 전사 가이드
- type: new
- slug: /blog/ai-gateway-streaming-transcription-guide/
- score: 94
- commit: 47ab504724d4f43a9d1806a95605d9c5add7b210
- notes: PCM 형식, 임시 토큰, 부분·최종 전사와 에이전트 승인 경계를 하나의 구현 절차로 제공

## 2026-07-23 — eve 에이전트 확장 패키지 만들기
- type: new
- slug: /blog/eve-installable-agent-extensions-guide/
- score: 92
- commit: ec869740a2d449e453f37ea586f68e0222a0c879
- notes: namespace, 승인, secret, 버전과 통합 테스트를 에이전트 확장의 운영 계약으로 설명

## 2026-07-22 — Gemini 3.6 Flash 마이그레이션 가이드
- type: new
- slug: /blog/gemini-3-6-flash-migration-guide/
- score: 97
- commit: 3eac961c8dcd2e6df9c99a356f079cd788529195
- notes: sampling parameter와 prefilled turn 호환성, thinking 설정과 플랫폼 전환을 하나의 절차로 제공

## 2026-07-22 — Vercel AI Gateway Service Tiers 운영 가이드
- type: new
- slug: /blog/vercel-ai-gateway-service-tiers-guide/
- score: 92
- commit: 4dd0d54660fcd45e5844947c28c9f01e16178fe7
- notes: requested tier와 실제 applied tier, downgrade와 비용 집계를 운영 코드로 연결

## 2026-07-21 — Astro 5에서 7.1로 올리기 전 점검할 것
- type: new
- slug: /blog/astro-5-to-7-1-migration-audit/
- score: 96
- commit: 2ef62dc83b147656d9cb6189abe1ba3e5b839578
- notes: 실제 Restato 구성에서 Node, Content Layer, slug, render와 Tailwind 전환 순서를 점검

## 2026-07-21 — GitHub Copilot 코드 리뷰를 저장소 규칙에 맞추는 방법
- type: new
- slug: /blog/github-copilot-code-review-customization-guide/
- score: 89
- commit: 290fef4566cb26d99db850ef102070203403c567
- notes: 저장소 지침, setup workflow, firewall과 runner 권한을 연결한 코드 리뷰 운영 가이드

## 2026-07-20 — AI SDK 7 프로덕션 에이전트 가이드
- type: new
- slug: /blog/ai-sdk-7-production-agent-guide/
- score: 93
- commit: d65fb623f80f4fe69dc969c0fcc2fc8bbda861bf
- notes: ToolLoopAgent·WorkflowAgent·HarnessAgent 선택과 승인, 복구, 관측성의 운영 기준을 제공

## 2026-07-19 — GPT-5.6 Sol·Terra·Luna 선택 가이드
- type: new
- slug: /blog/gpt-5-6-sol-terra-luna-api-guide/
- score: 95
- commit: cd48aa8353d3584c1f0a16061f4d393d6117fbbf
- notes: 모델 라우팅, 장문 요율, 캐싱과 평가 기반 마이그레이션을 실제 API 기준으로 설명

## 2026-07-20 — GitHub를 기억으로 쓰는 Content OS 구축기
- type: new
- slug: /blog/github-content-os-agent-skills-workflow/
- score: 88
- commit: 99a04abacba4fc3e59c9467c952baf0b3e4fc7a2
- notes: 정책, memory, 역할별 스킬, 후보 상태와 발행 중단 조건을 실제 저장소로 설명
