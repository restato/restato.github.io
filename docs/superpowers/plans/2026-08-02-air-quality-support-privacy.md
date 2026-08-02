# 공기 앱 지원·개인정보 페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** App Store 제출에 사용할 `공기 — 미세먼지와 예보`의 공개 지원 페이지와 개인정보처리방침 페이지를 Restato GitHub Pages에 배포한다.

**Architecture:** 기존 Astro `MainLayout`과 카드형 정책 페이지 패턴을 재사용해 정적 경로 두 개를 만든다. Vitest는 페이지 소스의 필수 공개 문구와 링크를 검증하고, Astro 프로덕션 빌드는 렌더링 및 사이트맵 생성을 검증한다.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, Vitest, GitHub Pages Actions

## Global Constraints

- 공개 경로는 `/apps/air-quality/support`와 `/apps/air-quality/privacy`다.
- 공개 지원 이메일은 `direcision@gmail.com`이다.
- 현재 1.0에는 계정, 광고, 타사 추적, 분석 SDK가 없다고만 설명한다.
- 위치·시간대·장소 검색어가 Open-Meteo API로 직접 전송될 수 있음을 명시한다.
- 현재 구성에는 개발자 운영 계정 서버와 CloudKit 동기화가 없음을 명시한다.
- 건강 진단이나 응급 판단을 대신하지 않는다는 안내를 포함한다.
- 기존 `MainLayout`, 2-space indentation, single quotes, 세미콜론 스타일을 유지한다.
- 구현은 `origin/master`에서 만든 격리 worktree와 `codex/air-quality-support-pages` 브랜치에서 수행한다.

---

### Task 1: 페이지 계약 테스트

**Files:**
- Create: `src/pages/apps/air-quality/__tests__/pages.test.ts`
- Consume: `docs/superpowers/specs/2026-08-02-air-quality-support-privacy-design.md`

**Interfaces:**
- Consumes: Node `fs.readFileSync`, 프로젝트 루트 기준 Astro 페이지 경로
- Produces: 지원·개인정보 페이지가 지켜야 할 공개 문구 계약

- [ ] **Step 1: 격리 worktree를 만들고 설계·계획 커밋을 옮긴다**

```bash
plan_sha="$(git rev-parse blog/gpt-5-6)"
git worktree add ../restato-air-quality-support -b codex/air-quality-support-pages origin/master
git -C ../restato-air-quality-support cherry-pick fb10d6d
git -C ../restato-air-quality-support cherry-pick "${plan_sha}"
```

- [ ] **Step 2: 실패하는 페이지 계약 테스트를 작성한다**

```ts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = fileURLToPath(new URL('../../../../../', import.meta.url));
const source = (name: 'support' | 'privacy') =>
  readFileSync(`${projectRoot}src/pages/apps/air-quality/${name}.astro`, 'utf8');

describe('air quality App Store pages', () => {
  it('publishes support contact and safe troubleshooting guidance', () => {
    const page = source('support');
    expect(page).toContain('direcision@gmail.com');
    expect(page).toContain('건강 진단이나 응급 판단을 대신하지 않습니다');
    expect(page).toContain('/apps/air-quality/privacy');
  });

  it('discloses the shipped privacy boundary', () => {
    const page = source('privacy');
    for (const text of [
      'Open-Meteo',
      '광고를 포함하지 않습니다',
      '추적하지 않습니다',
      'CloudKit 동기화를 사용하지 않습니다',
      'direcision@gmail.com',
    ]) {
      expect(page).toContain(text);
    }
    expect(page).toContain('/apps/air-quality/support');
  });
});
```

- [ ] **Step 3: 테스트가 페이지 부재로 실패하는지 확인한다**

Run: `npx vitest run src/pages/apps/air-quality/__tests__/pages.test.ts`

Expected: FAIL with `ENOENT` for `support.astro`.

- [ ] **Step 4: 테스트 계약을 커밋한다**

```bash
git add src/pages/apps/air-quality/__tests__/pages.test.ts
git commit -m "test: define air quality policy page contract"
```

### Task 2: 지원·개인정보 페이지 구현

**Files:**
- Create: `src/pages/apps/air-quality/support.astro`
- Create: `src/pages/apps/air-quality/privacy.astro`
- Test: `src/pages/apps/air-quality/__tests__/pages.test.ts`

**Interfaces:**
- Consumes: `MainLayout` from `src/layouts/MainLayout.astro`
- Produces: App Store 지원 URL과 개인정보처리방침 URL로 사용할 정적 HTML 경로

- [ ] **Step 1: 지원 페이지를 구현한다**

`support.astro`는 `MainLayout`을 사용하고 canonical을
`/apps/air-quality/support`로 설정한다. 상단에 앱 이름과 “지원”을 표시하고,
본문 카드에 다음 내용을 정확히 포함한다.

```text
공기 — 미세먼지와 예보 지원
위치 권한 없이도 장소를 직접 검색할 수 있습니다.
대기질 정보는 건강 진단이나 응급 판단을 대신하지 않습니다.
문의: direcision@gmail.com
문의 시 앱 버전, iPhone 또는 Apple Watch 모델, OS 버전, 문제 발생 시각과 재현 단계를 알려주세요. 정확한 위치 좌표나 비밀번호 같은 민감정보는 보내지 마세요.
```

개인정보처리방침 링크는 `/apps/air-quality/privacy`를 사용한다.

- [ ] **Step 2: 개인정보처리방침 페이지를 구현한다**

`privacy.astro`는 canonical을 `/apps/air-quality/privacy`로 설정하고 최종
갱신일 `2026년 8월 2일`을 표시한다. 다음 섹션을 각각 카드로 제공한다.

```text
1. 처리 주체 및 연락처
2. 현재 버전이 처리하는 데이터
3. Open-Meteo로 전송되는 정보
4. 기기 내 저장과 삭제
5. 광고, 분석 및 추적
6. Apple Watch
7. 지원 문의 보관
8. 이용자 권리와 정책 변경
```

Open-Meteo 링크는 `https://open-meteo.com/`, 약관 링크는
`https://open-meteo.com/en/terms`, 지원 링크는
`/apps/air-quality/support`를 사용한다. 계정·광고·추적·분석 SDK가 없고
CloudKit 동기화를 사용하지 않는다는 현재 1.0의 경계를 명시한다.

- [ ] **Step 3: 계약 테스트를 통과시킨다**

Run: `npx vitest run src/pages/apps/air-quality/__tests__/pages.test.ts`

Expected: `2 passed`.

- [ ] **Step 4: 프로덕션 빌드를 검증한다**

Run: `npm run build`

Expected: exit 0 and generated files:

```text
dist/apps/air-quality/support/index.html
dist/apps/air-quality/privacy/index.html
```

- [ ] **Step 5: 생성 HTML의 공개 계약을 확인한다**

```bash
rg -n "direcision@gmail.com|건강 진단이나 응급 판단" dist/apps/air-quality/support/index.html
rg -n "Open-Meteo|광고를 포함하지 않습니다|추적하지 않습니다|CloudKit 동기화를 사용하지 않습니다" dist/apps/air-quality/privacy/index.html
```

Expected: 각 검색어가 해당 HTML에서 한 번 이상 발견된다.

- [ ] **Step 6: 구현을 커밋한다**

```bash
git add src/pages/apps/air-quality/support.astro src/pages/apps/air-quality/privacy.astro
git commit -m "feat: add air quality support pages"
```

### Task 3: 배포 및 공개 URL 검증

**Files:**
- Verify: `.github/workflows/deploy.yml`
- Verify: `dist/apps/air-quality/support/index.html`
- Verify: `dist/apps/air-quality/privacy/index.html`

**Interfaces:**
- Consumes: `codex/air-quality-support-pages`의 검증된 커밋
- Produces: 로그인 없이 접근 가능한 GitHub Pages HTTPS URL 두 개

- [ ] **Step 1: 최종 저장소 상태를 확인한다**

```bash
git diff --check
git status --porcelain=v1
git log -4 --oneline
```

Expected: 공백 오류와 미커밋 변경이 없다.

- [ ] **Step 2: 브랜치를 푸시하고 PR을 만든다**

```bash
git push -u origin codex/air-quality-support-pages
pr_url="$(gh pr create --base master --head codex/air-quality-support-pages --title "feat: add air quality app support pages" --body "Adds public support and privacy pages required for the 공기 App Store submission. Verified with the focused Vitest contract and npm run build.")"
pr_number="${pr_url##*/}"
```

- [ ] **Step 3: PR 검사를 확인하고 master에 병합한다**

```bash
gh pr checks "${pr_number}" --watch
gh pr merge "${pr_number}" --squash --delete-branch
```

Expected: required checks pass and the PR reports `MERGED`.

- [ ] **Step 4: GitHub Pages 배포 완료를 확인한다**

```bash
gh run list --workflow deploy.yml --branch master --limit 1
run_id="$(gh run list --workflow deploy.yml --branch master --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "${run_id}"
```

Expected: deploy workflow conclusion is `success`.

- [ ] **Step 5: 공개 HTTPS URL을 확인한다**

```bash
curl -fsS https://restato.github.io/apps/air-quality/support/ | rg "direcision@gmail.com|건강 진단이나 응급 판단"
curl -fsS https://restato.github.io/apps/air-quality/privacy/ | rg "Open-Meteo|추적하지 않습니다"
```

Expected: 두 요청 모두 HTTP 성공이며 필수 공개 문구가 발견된다.

- [ ] **Step 6: App Store Connect 입력값을 기록한다**

```text
지원 URL: https://restato.github.io/apps/air-quality/support/
개인정보처리방침 URL: https://restato.github.io/apps/air-quality/privacy/
```

두 URL의 공개 검증이 성공한 뒤에만 App Store Connect에 저장한다.
