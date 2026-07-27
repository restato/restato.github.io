# 콘텐츠 아이디어 백로그

후보의 현재 상태와 발행·보류 이유를 기록합니다. 상세 점수는 `src/data/contentCandidates.json`이 최종 기준입니다.

## Vercel Sandbox 대시보드 운영 가이드
- status: published
- score: 94
- source: trend-watch
- topic: 브라우저 터미널·포트·스냅샷을 이용한 Sandbox 장애 조사
- action: new-post
- path: /blog/vercel-sandbox-dashboard-incident-response-guide/
- update-existing: false
- notes: 2026년 7월 23일 실행 중인 Sandbox의 터미널·파일·포트·lifecycle을 대시보드에서 관리할 수 있게 됐으며, 공식 소개와 기존 검색 결과가 기능 나열에 집중한 반면 증거 보존, 포트 노출, persistence, 중지 경쟁 상태와 안전한 복구를 연결하는 운영 공백이 큼

## Vercel Flags 롤아웃 감사 가이드
- status: published
- score: 91
- source: trend-watch
- topic: 평가 메트릭과 CLI version diff를 이용한 feature flag 검증
- action: new-post
- path: /blog/vercel-flags-rollout-audit-guide/
- update-existing: false
- notes: 2026년 7월 23일 평가 메트릭과 CLI revision·semantic diff가 함께 공개됐고, 기존 자료가 두 기능을 따로 설명하는 반면 변경 이력, 실제 variant·fallback, rollback과 제품 지표를 하나의 감사 절차로 연결하는 콘텐츠 공백이 확인됨

## Vercel Workflow 30분 Step 운영 가이드
- status: published
- score: 95
- source: trend-watch
- topic: Workflow extended function duration과 장기 실행 운영
- action: new-post
- path: /blog/vercel-workflow-30-minute-step-duration-guide/
- update-existing: false
- notes: 2026년 7월 24일 Pro·Enterprise Workflow step의 상한이 800초에서 1,800초로 늘어났으며, 공식 발표가 설정법에 집중한 반면 긴 step의 분리 기준, idempotency, 재시도, 취소, 비용과 관측성을 연결하는 운영 공백이 큼

## Vercel Blob WAF 운영 가이드
- status: published
- score: 93
- source: trend-watch
- topic: Blob WAF와 Public·Private Blob 보안 경계
- action: new-post
- path: /blog/vercel-blob-waf-security-guide/
- update-existing: false
- notes: 2026년 7월 24일 Blob WAF beta가 공개됐고, 기능 소개보다 WAF와 인증의 차이, challenge의 server-side 제약, 모든 보호 store가 공유하는 rule set과 단계적 rollout을 설명하는 실무 공백이 확인됨

## GitHub Tools eve extension 운영 예제
- status: hold
- score: 84
- source: trend-watch
- topic: Vercel Connect 기반 GitHub tools extension
- action: update-existing
- path:
- update-existing: true
- notes: short-lived scoped token, code-review preset과 입력 기반 approval은 유용하지만 기존 eve extension 글과 검색 의도가 같아 독립 글보다 실제 적용 검증 후 기존 글 업데이트가 적절함

## Claude Opus 5 AI Gateway 지원
- status: hold
- score: 78
- source: trend-watch
- topic: Claude Opus 5의 Vercel AI Gateway 제공
- action: update-existing
- path:
- update-existing: true
- notes: BYOK, 자동 failover와 여러 API 형식 지원은 확인됐지만 모델 마이그레이션 글이 이미 있고 제공 채널 추가만으로는 독립적인 실전 검색 의도가 부족함

## Claude Opus 5 마이그레이션 가이드
- status: published
- score: 98
- source: trend-watch
- topic: Claude Opus 5 API와 GitHub Copilot 전환
- action: new-post
- path: /blog/claude-opus-5-migration-copilot-guide/
- update-existing: false
- notes: 2026년 7월 24일 Opus 5가 GitHub Copilot에 추가됐고 Anthropic 공식 마이그레이션 문서에서 thinking 기본 활성화, max_tokens 재조정, effort 제한과 프롬프트 변화가 확인돼 단순 출시 요약보다 재현 가능한 전환 가이드를 제공할 수 있음

## OpenAI API 지출 한도 운영 가이드
- status: published
- score: 92
- source: trend-watch
- topic: 조직·프로젝트 spend limit과 hard enforcement
- action: new-post
- path: /blog/openai-api-spend-limits-guide/
- update-existing: false
- notes: OpenAI가 조직과 프로젝트 수준에서 월간 지출 한도를 모니터링 전용 또는 hard limit으로 적용할 수 있게 했으며, 기존 자료가 UI 설명에 집중한 반면 프로젝트 격리, 단계별 감속, 재시도와 fallback 장애 대응을 연결하는 운영 공백이 큼

## MCP 2026-07-28 마이그레이션 가이드
- status: published
- score: 97
- source: trend-watch
- topic: MCP stateless protocol과 conformance CI
- action: new-post
- path: /blog/mcp-2026-07-28-stateless-migration-guide/
- update-existing: false
- notes: 세션·initialize 제거, 요청별 capability, MRTR, cache metadata와 공식 conformance suite를 하나의 전환 절차로 제공

## GitHub Issues 에이전트 자동화 운영 가이드
- status: published
- score: 94
- source: trend-watch
- topic: Confidence, approvals, rationale와 safe outputs
- action: new-post
- path: /blog/github-issues-agent-automation-controls-guide/
- update-existing: false
- notes: read-only agent, safe outputs, staged mode와 action별 confidence calibration을 연결한 운영 가이드

## Copilot cloud agent for Linear 운영 가이드
- status: hold
- score: 82
- source: trend-watch
- topic: Linear issue에서 Copilot coding agent 위임
- action: digest
- path:
- update-existing: false
- notes: 관리자 권한과 실제 workspace 데이터 없이 독립 실습을 재현하기 어려워 통합 운영 사례가 확보될 때까지 보류

## Vercel MCP 코드 배포
- status: hold
- score: 83
- source: trend-watch
- topic: MCP client에서 git 없이 Vercel 배포
- action: digest
- path:
- update-existing: false
- notes: 권한, 파일 제한, dry-run, rollback에 관한 공식 운영 자료가 충분하지 않아 보류

## AI Gateway 실시간 전사 가이드
- status: published
- score: 94
- source: trend-watch
- topic: AI SDK streamTranscribe와 음성 에이전트 입력
- action: new-post
- path: /blog/ai-gateway-streaming-transcription-guide/
- update-existing: false
- notes: PCM 형식, 임시 토큰, 부분·최종 전사와 에이전트 승인 경계를 하나의 구현 절차로 제공

## eve 에이전트 확장 패키지 만들기
- status: published
- score: 92
- source: trend-watch
- topic: tools·skills·hooks를 installable extension으로 배포
- action: new-post
- path: /blog/eve-installable-agent-extensions-guide/
- update-existing: false
- notes: namespace, 승인, secret, 버전과 통합 테스트를 에이전트 확장의 운영 계약으로 설명

## Gemini 3.6 Flash 마이그레이션 가이드
- status: published
- score: 97
- source: trend-watch
- topic: Gemini 3.6 Flash API 마이그레이션
- action: new-post
- path: /blog/gemini-3-6-flash-migration-guide/
- update-existing: false
- notes: sampling parameter와 prefilled turn 호환성, thinking 설정과 플랫폼 전환을 하나의 절차로 제공

## Vercel AI Gateway Service Tiers 운영 가이드
- status: published
- score: 92
- source: trend-watch
- topic: AI Gateway priority·flex 라우팅
- action: new-post
- path: /blog/vercel-ai-gateway-service-tiers-guide/
- update-existing: false
- notes: requested tier와 실제 applied tier, downgrade와 비용 집계를 운영 코드로 연결

## Vercel Workflows 지역별 run state
- status: hold
- score: 79
- source: trend-watch
- topic: Vercel Workflows 지역 실행 상태
- action: digest
- path:
- update-existing: false
- notes: beta 기능이며 직접 구현·검증 사례가 없어 보류

## Astro 5에서 7.1로 올리기 전 점검할 것
- status: published
- score: 96
- source: trend-watch
- topic: Astro 7.1과 GitHub Pages 마이그레이션
- action: new-post
- path: /blog/astro-5-to-7-1-migration-audit/
- update-existing: false
- notes: 실제 Restato 구성에서 Node, Content Layer, slug, render와 Tailwind 전환 순서를 점검

## GitHub Copilot 코드 리뷰를 저장소 규칙에 맞추는 방법
- status: published
- score: 89
- source: trend-watch
- topic: GitHub Copilot code review 운영
- action: new-post
- path: /blog/github-copilot-code-review-customization-guide/
- update-existing: false
- notes: 저장소 지침, setup workflow, firewall과 runner 권한을 연결한 코드 리뷰 운영 가이드

## GitHub Copilot 영향 대시보드와 저장소별 사용량 지표
- status: hold
- score: 80
- source: trend-watch
- topic: Copilot usage metrics와 AI adoption phase
- action: digest
- path:
- update-existing: false
- notes: Enterprise 관리자 권한과 실제 조직 데이터가 필요한 주제라 성과 측정 digest까지 보류

## AI SDK 7 프로덕션 에이전트 가이드
- status: published
- score: 93
- source: trend-watch
- topic: Vercel AI SDK와 프로덕션 에이전트
- action: new-post
- path: /blog/ai-sdk-7-production-agent-guide/
- update-existing: false
- notes: ToolLoopAgent·WorkflowAgent·HarnessAgent 선택과 승인, 복구, 관측성의 운영 기준을 제공

## GPT-5.6 Sol·Terra·Luna 선택 가이드
- status: published
- score: 95
- source: user-request
- topic: OpenAI API와 GPT-5.6
- action: new-post
- path: /blog/gpt-5-6-sol-terra-luna-api-guide/
- update-existing: false
- notes: 모델 라우팅, 장문 요율, 캐싱과 평가 기반 마이그레이션을 실제 API 기준으로 설명

## GitHub를 기억으로 쓰는 Content OS 구축기
- status: published
- score: 88
- source: project
- topic: AI 콘텐츠 자동화
- action: new-post
- path: /blog/github-content-os-agent-skills-workflow/
- update-existing: false
- notes: 정책, memory, 역할별 스킬, 후보 상태와 발행 중단 조건을 실제 저장소로 설명

## ChatGPT 커스텀 지침 5,000자 확대
- status: rejected
- score: 61
- source: trend-watch
- topic: OpenAI와 ChatGPT
- action: skip
- path:
- update-existing: false
- notes: 독립 개발 글로 제공할 코드·마이그레이션·운영 판단이 부족해 제외

## Codex iOS 인라인 시각화와 작업 제어 업데이트
- status: rejected
- score: 64
- source: trend-watch
- topic: Codex
- action: skip
- path:
- update-existing: false
- notes: UI 개선 중심으로 독립 실습과 장기 검색 가치가 부족해 제외