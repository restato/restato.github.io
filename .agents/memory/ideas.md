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

## AI Gateway 스트리밍 전사
- status: published
- source: Vercel 2026-07-22 AI Gateway streaming transcription 발표, AI Gateway Grok STT 공식 모델 페이지
- why-now: 완성된 오디오 파일 전사에서 live audio stream과 transcript delta를 주고받는 beta 기능으로 확장됐으며 AI SDK의 experimental_streamTranscribe와 짧은 수명의 client token 흐름이 공개됨
- target-reader: AI SDK로 실시간 자막, 음성 입력, 텍스트 기반 voice agent를 만드는 TypeScript 개발자
- search-intent: AI SDK streamTranscribe, AI Gateway streaming transcription, realtime whisper PCM, voice agent transcription token
- update-existing: false
- notes: 94점. 2026-07-23 `/blog/ai-gateway-streaming-transcription-guide/`로 발행. raw PCM 형식, 임시 토큰, 부분·최종 전사 분리와 에이전트 승인 경계에 집중함

## eve installable agent extensions
- status: published
- source: Vercel 2026-07-22 eve extensions 발표, eve 공식 사이트·integrations, agent-browser 공식 eve extension 문서
- why-now: tools, connections, skills, instructions, hooks를 하나의 npm 패키지처럼 설치·버전 관리·업그레이드할 수 있게 됨
- target-reader: 여러 eve 에이전트에서 같은 능력과 정책을 재사용하려는 AI agent·TypeScript 개발자
- search-intent: eve extension, defineExtension, agent skills package, eve extension build, agent/extensions namespace
- update-existing: false
- notes: 92점. 2026-07-23 `/blog/eve-installable-agent-extensions-guide/`로 발행. scaffold 소개보다 승인, secret, namespace, 버전과 통합 테스트를 운영 계약으로 설명함

## GitHub Copilot 영향 대시보드와 저장소 지표
- status: hold
- source: GitHub 2026-07-22 Copilot usage metrics impact dashboard, 2026-07-17 repository-level usage metrics API
- why-now: adoption phase별 merge throughput·merge velocity·LOC·사용자 수와 권장 행동을 시각화하는 dashboard가 추가돼 단순 활성 사용자 수보다 조직 도입 깊이를 판단할 수 있게 됨
- target-reader: Copilot Business·Enterprise 도입 효과를 측정하는 엔터프라이즈 관리자와 organization owner
- search-intent: GitHub Copilot impact dashboard, AI adoption phase, Copilot repository usage metrics, merge velocity
- update-existing: false
- notes: 80점. 공식 근거와 실무 판단은 강화됐지만 관리자 전용 기능이며 실제 조직 데이터 없이 독자가 재현할 수 있는 예제가 부족해 향후 AI 개발 도구 성과 측정 digest까지 보류

## Gemini 3.6 Flash API 마이그레이션
- status: published
- source: Google Gemini 최신 모델·모델 사양 공식 문서, GitHub Copilot 2026-07-21 changelog, Vercel AI Gateway 2026-07-21 changelog
- why-now: Gemini 3.6 Flash와 3.5 Flash-Lite가 2026-07-21 GA됐고 sampling parameter 폐기, prefilled model turn 금지와 Copilot 모델 교체 일정이 함께 발생함
- target-reader: Gemini API, GitHub Copilot, AI SDK로 코딩·에이전트 기능을 운영하는 개발자
- search-intent: Gemini 3.6 Flash migration, temperature top_p 제거, prefilled model turn 400, Gemini Copilot, Gemini AI Gateway
- update-existing: false
- notes: 97점. 2026-07-22 `/blog/gemini-3-6-flash-migration-guide/`로 발행. 기능 소개보다 요청 형식 변경과 모델별 역할 분리, 검증 순서를 제공함

## Vercel AI Gateway Service Tiers
- status: published
- source: Vercel 2026-07-21 service tiers changelog와 AI Gateway 공식 문서
- why-now: OpenAI·Google AI Studio·Vertex 모델에 default·priority·flex 처리 티어를 요청하고 실제 적용 티어 기준으로 과금하는 기능이 추가됨
- target-reader: AI SDK와 AI Gateway에서 사용자 대면 요청과 배치 작업의 지연 시간·비용을 분리하려는 개발자
- search-intent: Vercel AI Gateway service tier, priority flex, providerMetadata serviceTier, AI SDK cost latency
- update-existing: false
- notes: 92점. 2026-07-22 `/blog/vercel-ai-gateway-service-tiers-guide/`로 발행. best-effort downgrade와 requested/applied tier 관측을 중심으로 설명함

## Vercel Workflows 지역별 run state
- status: hold
- source: Vercel 2026-07-20 regional workflow run state 발표와 Workflow SDK beta 문서
- why-now: workflow run state, queue, output을 프로젝트 home region에 유지할 수 있게 됨
- target-reader: 데이터 위치와 장기 실행 상태를 관리하는 Vercel Workflows 사용자
- search-intent: Vercel Workflows region, workflow run state home region, Workflow SDK beta
- update-existing: false
- notes: 79점. 기능이 beta이고 현재 Restato에서 직접 구현·검증한 운영 사례가 없어 향후 Workflows 기능을 묶은 digest 또는 실제 적용기까지 보류

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
- notes: 2026-07-23 impact dashboard 후보와 통합해 80점으로 재평가. 조직 권한과 실제 데이터가 필요한 주제라 현재 Restato 독자가 바로 재현하기 어려워 보류

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
