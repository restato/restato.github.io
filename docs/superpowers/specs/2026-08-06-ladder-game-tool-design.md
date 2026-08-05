# 사다리타기(Ladder Game) 도구 설계

- 날짜: 2026-08-06
- 상태: 승인됨 (사용자 위임: "검색 잘되고 광고수익 나도록 알아서")
- 배경: 당초 PDF 합치기/분할을 계획했으나 최신 master에 PDF 5종
  (merge/split/rotate/images-to-pdf/pdf-to-images)이 이미 배포되어 있음을 확인.
  남은 수요 공백 중 한국 검색량이 가장 크고 미구현인 사다리타기를 추가한다.

## 목표

- 슬러그 `ladder-game`, 카테고리 `random` (기존: coin-flip, dice와 클러스터 형성).
- "사다리타기" 는 점심 내기·경품 추첨 등 반복 사용 상황의 고수요 한국어 키워드.
  재방문율이 높은 도구라 광고 노출·체류시간에 유리하다.
- 100% 클라이언트 사이드 (privacyMode `local-only`).

## 아키텍처 (기존 additional-tool 패턴 준수)

- 순수 로직 `src/lib/random/ladder.ts`:
  - `generateLadder(columns, rows, random)` — 같은 행에 인접 가로대 금지,
    모든 이웃 열쌍에 최소 1개 가로대 보장, RNG 주입으로 결정적 테스트.
  - `traceLadder(ladder, startColumn)` — 위→아래로 경로 추적,
    결과는 순열(permutation)이 됨을 보장.
- 컴포넌트 `src/components/tools/random/LadderGameTool.tsx`:
  - additional-tool 관례대로 UI 텍스트는 영어 단일, 페이지 콘텐츠는 12개 언어.
  - 참가자 수(2–8) 선택, 이름/결과 입력(ToolField), 사다리 생성(ToolActions),
    SVG로 사다리 렌더링, 참가자 클릭 시 경로 하이라이트 + 결과 표시(ToolStatus),
    전체 공개·다시 섞기 버튼.
  - SVG 채택 이유: jsdom 테스트 용이, 반응형, canvas 목킹 불필요.
- 등록: `additions/random.ts`(12개 언어 프로필) → registry, localizedContent,
  additionalToolSlugs, AdditionalToolIsland(lazy import), resultAdoption
  (mode `self-announcing`), 계약 테스트 2종에 슬러그 추가.
- 페이지·사이트맵·hreflang은 registry 기반으로 자동 생성 — 페이지 파일 불필요.

## 에러/엣지 처리

- 참가자 수 변경 시 이름·결과 배열 리사이즈(기존 입력 보존).
- 사다리 재생성 시 공개된 결과 초기화.
- 빈 이름은 "Player N" 폴백.

## 범위 밖

- 애니메이션 경로 트레이싱 (v2)
- 한국어 UI 로컬라이즈 (additional-tool 공통 과제)
