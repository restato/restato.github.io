# Restato Content OS Workflow

## Default collaboration mode

Restato 기술 콘텐츠의 기본 오케스트레이터는 `.agents/skills/restato-content-partner/SKILL.md`다.

기본 승인 흐름:

```text
brief + research + outline
  → direcision outline approval
  → English MDX draft + editorial verification
  → direcision final draft approval
  → branch + pull request
  → merge/deploy verification
  → publication memory update
```

사용자가 명시적으로 fast-track을 요청하지 않는 한 두 승인 지점을 생략하지 않는다. 기본 브랜치에 직접 푸시하거나 PR을 자동 병합하지 않는다.

## Execution modes

### 1. Collaborative on-demand

사용자가 주제를 주면 `restato-content-partner`가 조사와 목차를 제안하고, 두 승인 지점을 거쳐 PR을 만든다. 기본 모드다.

### 2. Fast-track

사용자가 승인된 목차·초안을 제공하거나 중간 승인을 줄여 달라고 명시하면 `one-click-publish`가 승인 단계를 합친다. 사실 검증과 빌드는 그대로 유지한다.

### 3. Trend watch

`trend-finder`가 관심 주제의 공식 발표, 릴리스, 폐기 공지, 중요한 실무 변화를 확인한다. 의미 있는 변화가 있을 때만 후보를 만든며 자동 게시하지 않는다.

### 4. Project log

최근 커밋과 기능 변경에서 재사용 가능한 배움이 확인되면 콘텐츠 브리프 후보로 만든다. 저장소로 확인되지 않은 시행착오나 성과는 추가하지 않는다.

### 5. Evergreen or digest

검색 의도가 분명한 장기 가이드 또는 여러 작은 소식을 묶은 정리를 제안할 수 있다. 새 정보나 고유한 판단 기준이 없으면 작성하지 않는다.

## Active pipeline

1. `restato-content-partner`: brief, 승인 지점, 전체 조정
2. `trend-finder` 또는 사용자 요청: 후보 정의
3. `researcher`: 1차 자료와 코드 조사
4. `gap-finder`: 기존 글 대비 고유한 약속 정의
5. direcision: outline 승인
6. `restato-blog-writer`: 승인된 목차를 영문 MDX로 작성
7. `restato-content-partner`: 사실·코드·문체·SEO·MDX·빌드 검수
8. direcision: 최종 원고 승인
9. `one-click-publish` 또는 표준 GitHub 흐름: 브랜치·커밋·PR
10. 병합·배포 확인 후 memory 갱신

존재하지 않는 역할 이름을 파이프라인 단계로 호출하지 않는다. 필요한 역할은 위 스킬 또는 `restato-content-partner`의 명시된 단계로 수행한다.

## Decision rules

- 사용자의 즉시 요청이 예약 탐색보다 우선한다.
- 사용자 지정 주제는 점수와 무관하게 조사하지만 품질 기준은 동일하다.
- 기존 글과 검색 의도가 같으면 업데이트를 우선한다.
- 새로운 정보, 검증 가능한 예제, 또는 고유한 판단 기준이 없으면 발행하지 않는다.
- 점수는 우선순위 참고값이며 사실 오류나 빌드 실패를 상쇄하지 못한다.
- PR 생성, 병합, 배포를 서로 다른 상태로 보고한다.

## Publication state

- `draft`: 로컬 초안이며 승인 전
- `approved`: 최종 원고 승인 완료
- `pr-open`: PR 생성, 아직 게시되지 않음
- `merged`: 기본 브랜치 반영, 배포 확인 전
- `published`: 실제 게시 URL과 콘텐츠가 확인됨

`published` 상태에서만 `.agents/memory/published.md`에 발행 완료를 기록한다.
