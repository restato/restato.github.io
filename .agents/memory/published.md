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

## 2026-07-19 — GPT-5.6 Sol·Terra·Luna 선택 가이드: API 가격, 컨텍스트, 마이그레이션
- type: new
- slug: /blog/gpt-5-6-sol-terra-luna-api-guide/
- file: src/content/blog/gpt-5-6-sol-terra-luna-api-guide.mdx
- topics: [OpenAI API, GPT-5.6, Codex, AI 에이전트]
- sources: [https://openai.com/ko-KR/index/gpt-5-6/, https://developers.openai.com/api/docs/models, https://developers.openai.com/api/docs/models/gpt-5.6-sol, https://developers.openai.com/api/docs/models/gpt-5.6-terra, https://developers.openai.com/api/docs/models/gpt-5.6-luna]
- commit: cd48aa8353d3584c1f0a16061f4d393d6117fbbf
- notes: 출시 요약이 아니라 Sol·Terra·Luna 선택 기준, 27만 2천 토큰 초과 요율, 캐시 비용, Responses API 예제와 GPT-5.5 마이그레이션 절차를 제공함

## 2026-07-19 — GPT-5.6 Agent Engineering: Tools, Permissions, and Evaluation in Production
- type: new
- slug: /blog/gpt-5-6-agent-engineering-production-guide/
- file: src/content/blog/gpt-5-6-agent-engineering-production-guide.mdx
- topics: [OpenAI API, GPT-5.6, AI agents, production engineering]
- sources: [https://openai.com/index/gpt-5-6/, https://developers.openai.com/api/docs/models, https://developers.openai.com/api/docs/models/gpt-5.6-sol, https://developers.openai.com/api/docs/models/gpt-5.6-terra, https://developers.openai.com/api/docs/models/gpt-5.6-luna]
- commit: d7d1bdd9530a5da35bf7b7f96a01ad55ce7b4c69
- notes: 모델 기능 요약보다 모델 라우팅, 최소 권한, 계획·실행·검증 분리, 장문 컨텍스트 비용, 에이전트 평가 지표를 영문 실전 가이드로 제공함
