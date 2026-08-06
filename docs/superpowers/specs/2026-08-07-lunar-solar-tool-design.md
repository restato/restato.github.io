# 음력↔양력 변환기 도구 설계

- 날짜: 2026-08-07
- 상태: 승인됨 (사용자 요청: "음력 양력 변환기도 만들어서 올려줘")

## 목표

- 슬러그 `lunar-solar`, 카테고리 `converters`, related: `age`, `dday`.
- 제사·생신·설날/추석 날짜 확인이라는 반복 수요의 한국어 키워드
  ("음력 양력 변환", "음력 계산기")를 타깃. 100% 클라이언트 사이드.

## 아키텍처 (additional-tools 파이프라인, ladder-game과 동일)

- 변환 엔진: `korean-lunar-calendar` (MIT, 자체 타입 포함, 지원 범위
  양력 1000-02-13 ~ 2050-12-31, 윤달·간지 지원). 검증 완료:
  양력 2025-01-29 → 음력 2025-01-01(설날), 음력 2024-08-15 → 양력 2024-09-17(추석).
- 래퍼 `src/lib/dates/lunarSolar.ts`:
  - `solarToLunar(y, m, d)` → `{ year, month, day, leapMonth, gapjaYear } | null`
  - `lunarToSolar(y, m, d, leapMonth)` → `{ year, month, day } | null`
  - 범위 밖/존재하지 않는 날짜는 `null` (라이브러리 setter의 boolean 반환 활용).
- 컴포넌트 `src/components/tools/dates/LunarSolarTool.tsx`:
  - 영어 UI (additional-tool 관례), 모드 탭 Solar → Lunar / Lunar → Solar,
    연·월·일 입력 + (Lunar 모드) 윤달 체크박스, 입력 즉시 변환(liveConvert),
    결과는 ToolStatus에 상시 표시 — 간지(예: 을사년)와 윤달 여부 포함,
    잘못된 날짜는 error 상태 메시지.
- 등록: `additions/dates.ts` (12개 언어 프로필) → registry, localizedContent,
  localizedWorkflows(`['configure', 'liveConvert', 'inspect']`), additionalToolSlugs,
  AdditionalToolIsland, resultAdoption(self-announcing) + 계약 테스트 4곳
  (integration slugs, resultAdoption spread, registry/completeness 개수 55→56).

## 테스트

- 래퍼: 설날/추석 알려진 날짜 벡터, 윤달 케이스(2025년 윤6월), 왕복 변환
  항등성 스윕, 범위 밖(999, 2051) null.
- 컴포넌트: fc 클래스 계약, 모드 전환, 실시간 변환 결과, 오류 표시.

## 범위 밖

- 만세력(시주) 전체, 음력 달력 뷰, 공휴일 계산.
