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

트렌드 조사에서 가치가 있지만 당장 발행하지 않는 주제를 저장합니다.

## Astro 5에서 7.1로 올리기 전 점검할 것
- status: published
- source: Astro 7.1·7.0 공식 발표, Astro 6·7 업그레이드 가이드, Restato package.json·content config·blog route·RSS·deploy workflow
- why-now: Astro 7.1이 2026-07-16 공개됐고 Restato는 Astro 5, Node 20, 레거시 Content Collections와 제거 예정 API를 실제 사용 중임
- target-reader: Astro 5 기반 MDX 블로그와 GitHub Pages 사이트를 운영하는 개발자
- search-intent: Astro 7 migration, Astro 5 to 7, Content Layer migration, Node 22, post.slug render
- update-existing: false
- notes: 96점. 2026-07-21 `/blog/astro-5-to-7-1-migration-audit/`로 발행. 단순 릴리스 소개가 아니라 현재 저장소에서 실제 빌드를 막는 위치와 전환 순서를 제시함

## GitHub Copilot 코드 리뷰 커스터마이징
- status: published
- source: GitHub 2026-07-17 changelog, Copilot code review·firewall·development environment 공식 문서
- why-now: head 브랜치 지침 검증, REVIEW.md·CLAUDE.md 지원, 전용 setup workflow, 독립 firewall과 runner 설정이 추가됨
- target-reader: GitHub Copilot 코드 리뷰를 팀 규칙과 CI 환경에 맞추려는 개발자·저장소 관리자
- search-intent: Copilot code review instructions, copilot-code-review.yml, REVIEW.md, Copilot firewall, agent skills review
- update-existing: false
- notes: 89점. 2026-07-21 `/blog/github-copilot-code-review-customization-guide/`로 발행. setup 실패 시 리뷰가 계속될 수 있는 운영상 주의점까지 포함함

## GitHub Copilot 저장소별 사용량 지표 API
- status: hold
- source: GitHub 2026-07-17 repository-level Copilot usage metrics GA 발표와 REST API 문서
- why-now: coding agent가 만든·병합한 PR과 code review 활동을 저장소별 일 단위로 조회할 수 있게 됨
- target-reader: Copilot Business·Enterprise 도입 성과를 저장소 단위로 측정하는 조직 관리자
- search-intent: GitHub Copilot repository metrics API, coding agent PR metrics, code review metrics
- update-existing: false
- notes: 72점. 공식 근거는 강하지만 조직 권한과 실제 데이터가 필요한 주제라 현재 Restato 독자가 바로 재현하기 어려움. 향후 여러 AI 개발 도구의 성과 측정을 묶는 digest 후보

## AI SDK 7 프로덕션 에이전트 가이드
- status: published
- source: Vercel 2026-06-25 AI SDK 7 공식 발표, AI SDK 공식 문서와 Vercel Knowledge Base
- why-now: AI SDK가 모델 호출 라이브러리에서 승인·durable 실행·하네스·샌드박스·관측성을 포함한 프로덕션 에이전트 계층으로 확장됨
- target-reader: TypeScript로 도구 호출 에이전트나 코딩 에이전트를 서비스에 넣는 개발자
- search-intent: AI SDK 7, WorkflowAgent, HarnessAgent, tool approval, AI SDK 6 마이그레이션
- update-existing: false
- notes: 2026-07-20 `/blog/ai-sdk-7-production-agent-guide/`로 발행. 기능 나열보다 실행 경계와 운영 체크리스트에 집중함

## Restato Content OS 구축기
- status: published
- source: 실제 `.agents/` 정책·memory·skills, 후보 JSON, Content OS 대시보드와 Astro 스키마
- why-now: 저장소에 장기 기억, 역할별 스킬, Gap Finder, 점수 엔진, 후보 대시보드가 실제 구현되어 재현 가능한 개발기를 작성할 수 있음
- target-reader: ChatGPT·Codex로 GitHub 기반 블로그나 문서 자동화를 운영하려는 개발자
- search-intent: Content OS, AI 블로그 자동화, GitHub 에이전트 메모리, SKILL.md, 자동 발행
- update-existing: false
- notes: 2026-07-20 `/blog/github-content-os-agent-skills-workflow/`로 발행. 기존 자동 개발 블로그 생성 글과 달리 주제 선정·중복 방지·발행 중단 조건까지 다룸

## ChatGPT 커스텀 지침 5,000자 확대
- status: rejected
- source: OpenAI 2026-07-15 공식 릴리스 노트
- why-now: Plus·Pro·Enterprise·Business·Education의 커스텀 지침 한도가 1,500자에서 5,000자로 확대됨
- target-reader: ChatGPT를 개인 업무에 맞게 설정하는 사용자
- search-intent: ChatGPT custom instructions limit, 커스텀 지침 5000자
- update-existing: false
- notes: 공식 변경은 확인했지만 독립 개발 글로 제공할 코드·마이그레이션·운영 판단이 부족해 61점으로 제외

## Codex iOS 인라인 시각화와 작업 제어
- status: rejected
- source: OpenAI 2026-07-13 공식 릴리스 노트
- why-now: Codex 작업의 인라인 시각화와 모바일 작업 제어가 개선됨
- target-reader: iOS에서 Codex 작업을 관리하는 사용자
- search-intent: Codex iOS inline visualization, Codex task controls
- update-existing: false
- notes: UI 개선 중심이며 독립 실습과 장기 검색 가치가 부족해 64점으로 제외

## GPT-5.6 Sol·Terra·Luna 선택 가이드
- status: published
- source: 사용자 직접 요청, OpenAI 2026-07-09 정식 출시 발표와 공식 API 모델 문서
- why-now: GPT-5.6이 ChatGPT·Codex·API에 정식 제공되었고 세 모델 계층과 장문·캐시 가격 규칙이 새로 도입됨
- target-reader: OpenAI API로 AI 기능과 코딩 에이전트를 운영하는 개발자
- search-intent: GPT-5.6 모델 비교, API 가격, Sol Terra Luna 선택, GPT-5.5 마이그레이션
- update-existing: false
- notes: 2026-07-19 `/blog/gpt-5-6-sol-terra-luna-api-guide/`로 발행. 출시 요약보다 모델 라우팅과 실제 비용 판단에 집중함
