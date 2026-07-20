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
