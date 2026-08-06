# Lunar-Solar Converter Implementation Plan

> Executed inline in-session (superpowers:executing-plans). Mirrors the
> ladder-game pipeline (docs/superpowers/plans/2026-08-06-ladder-game-tool.md);
> registration touch-points are identical unless noted.

**Goal:** Ship `lunar-solar` (음력↔양력 변환기) at `/{lang}/tools/lunar-solar`.

**Tech:** `korean-lunar-calendar` (installed, ships own types), React, additional-tools registry.

### Task 1: Wrapper `src/lib/dates/lunarSolar.ts` (TDD)
- Test vectors (library-verified): solar 2025-01-29 → lunar 2025-01-01 (설날, gapja 을사년);
  lunar 2024-08-15 → solar 2024-09-17 (추석); lunar 2025-06-01 leap → solar 2025-07-25 and
  round-trip back with `leapMonth: true`; invalid leap (2024-01 leap) → null;
  out of range (999-01-01, 2051-01-01) → null; round-trip identity sweep over sample dates.
- API: `solarToLunar(y,m,d)` → `{year,month,day,leapMonth,gapjaYear}|null`;
  `lunarToSolar(y,m,d,leap)` → `{year,month,day}|null`.
- Commit: `feat: add korean lunar-solar conversion wrapper`

### Task 2: Component `src/components/tools/dates/LunarSolarTool.tsx` (TDD)
- Test: fc-select/fc-input/fc-check classes inside ToolField; mode tabs
  (aria-pressed); default solar mode converts today; entering 2025-01-29 solar
  shows `Lunar 2025-01-01` and `을사년`; lunar mode with leap checkbox converts
  2025-06-01(leap) → `Solar 2025-07-25`; invalid date shows error status.
- English UI, ToolShell/ToolStatus from media-calc, live conversion (no submit).
- Commit: `feat: add lunar-solar converter component`

### Task 3: Registration
- `additions/dates.ts` (12-language profiles), registry.ts + localizedContent.ts
  imports/spreads, localizedWorkflows `['configure','liveConvert','inspect']`,
  additionalToolSlugs, AdditionalToolIsland lazy entry, resultAdoption
  (self-announcing, liveValue-style rationale), contract tests: integration slug
  list, resultAdoption spread, registry.test + completeness.test counts 55 → 56.
- `package.json`/`package-lock.json`: korean-lunar-calendar dependency.
- Commit: `feat: publish lunar-solar tool through the additional-tools registry`

### Task 4: Verify & ship
- `npm test` (baseline: 1 pre-existing media-calc loan failure allowed),
  `npm run build` + `dist/ko/tools/lunar-solar/index.html` check,
  push, PR, merge (user pre-authorized "올려줘"), verify live URL, cleanup worktree.
