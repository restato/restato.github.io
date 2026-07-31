# 콘텐츠 아이디어 백로그

이 파일은 현재 조사·보류·업데이트 대상을 관리합니다. 발행 완료 이력은 `published.md`, 전체 후보 점수와 상태는 `src/data/contentCandidates.json`을 최종 기준으로 사용합니다.

## GitHub Models 종료 전 마이그레이션 가이드
- status: published
- score: 96
- source: trend-watch
- topic: GitHub Models inference API·BYOK 종료와 provider 전환
- action: new-post
- path: /blog/github-models-retirement-migration-guide/
- update-existing: false
- notes: 2026년 7월 30일 playground, catalog, inference API와 BYOK가 모두 종료되며, 코드 의존성 탐색, provider adapter, 기능 회귀 테스트, 단계적 전환과 legacy 권한 제거를 연결한 실전 공백을 해결함

## GitHub Copilot 앱과 Cloud Agent 정책 관리 가이드
- status: published
- score: 94
- source: trend-watch
- topic: Copilot 앱 접근 정책과 enterprise managed settings
- action: new-post
- path: /blog/github-copilot-managed-settings-governance-guide/
- update-existing: false
- notes: 2026년 7월 27일 Copilot 앱 접근 정책 분리와 managed settings 확대를 접근 정책·공통 client 동작·repository 실행 권한의 세 계층으로 정리함

## MCP 2026-07-28 최종 명세 검증
- status: hold
- score: 84
- source: trend-watch
- topic: MCP 2026-07-28 RC와 최종 명세 차이
- action: update-existing
- path: /blog/mcp-2026-07-28-stateless-migration-guide/
- update-existing: true
- notes: 2026년 7월 28일 오전 기준 공식 releases에는 RC만 표시되고 final milestone도 완료되지 않음. 최종 명세와 conformance suite가 공개되면 RC 기준 문구를 검토해 기존 글을 업데이트

## GitHub Tools eve extension 운영 예제
- status: hold
- score: 84
- source: trend-watch
- topic: Vercel Connect 기반 GitHub tools extension
- action: update-existing
- path: /blog/eve-installable-agent-extensions-guide/
- update-existing: true
- notes: 기존 eve extension 글과 검색 의도가 같아 실제 적용과 권한 검증 후 업데이트가 적절함

## Vercel MCP 코드 배포
- status: hold
- score: 83
- source: trend-watch
- topic: MCP client에서 git 없이 Vercel 배포
- action: digest
- path:
- update-existing: false
- notes: 권한, 파일 제한, dry-run과 rollback에 관한 공식 운영 자료가 충분해질 때 재평가

## Copilot cloud agent for Linear 운영 가이드
- status: hold
- score: 82
- source: trend-watch
- topic: Linear issue에서 Copilot coding agent 위임
- action: digest
- path:
- update-existing: false
- notes: 관리자 권한과 실제 workspace 데이터 없이 독립 실습을 재현하기 어려워 통합 운영 사례가 확보될 때까지 보류

## GitHub Copilot 영향 대시보드와 저장소별 사용량 지표
- status: hold
- score: 80
- source: trend-watch
- topic: Copilot usage metrics와 AI adoption phase
- action: digest
- path:
- update-existing: false
- notes: Enterprise 관리자 권한과 실제 조직 데이터가 필요한 주제라 성과 측정 digest까지 보류

## Vercel Workflows 지역별 run state
- status: hold
- score: 79
- source: trend-watch
- topic: Vercel Workflows 지역 실행 상태
- action: digest
- path:
- update-existing: false
- notes: beta 기능이며 직접 구현·검증 사례가 없어 보류

## Claude Opus 5 AI Gateway 지원
- status: hold
- score: 78
- source: trend-watch
- topic: Claude Opus 5의 Vercel AI Gateway 제공
- action: update-existing
- path: /blog/claude-opus-5-migration-copilot-guide/
- update-existing: true
- notes: 제공 채널 추가만으로는 독립 검색 의도가 부족하며 실제 failover·비용 검증 후 기존 글 업데이트가 적절함

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
