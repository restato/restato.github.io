## Task 9: Verify accessibility, responsive behavior, dark mode, SEO, and performance

**Files:**
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/catalog.spec.ts`
- Create: `tests/e2e/forest-cafe-visual.spec.ts`
- Create: `tests/e2e/forest-cafe-routes.ts`
- Create: `docs/superpowers/reports/2026-07-23-forest-cafe-verification.md`

**Step 1: Add failing end-to-end assertions**

Define a representative route matrix covering home, catalog, text tool, file tool, game catalog, game detail, blog article, policy, dashboard, and chat in Korean/English plus one RTL locale. For each route assert:

- no horizontal overflow at 390px;
- D2Coding is the first computed family;
- light/dark backgrounds and text meet the named semantic tokens;
- theme persists across navigation/reload;
- keyboard focus is visible;
- skip link reaches main;
- one `h1`, valid landmarks, and no serious Axe violations.

Visual screenshots should use stable viewport/content, mask ads/time-dependent areas, and save light/mobile-dark references. Do not assert pixel identity for canvas games.

Run: `npm run build && npx playwright test tests/e2e/forest-cafe-visual.spec.ts --project=desktop --project=mobile-390`

Expected: initially FAIL wherever a page family still violates the contract.

**Step 2: Fix only verified regressions**

Address overflow, contrast, focus order, truncation, RTL alignment, or theme-state issues at the shared primitive/token level first. Add route-local fixes only where the layout is genuinely unique. Never remove content, headings, metadata, or functionality to make screenshots pass.

**Step 3: Run the complete verification ladder**

Run in this order:

```sh
npm test -- --run
npm run check
npm run build
node scripts/validate-site.mjs dist
node scripts/audit-content.mjs dist
node scripts/check-bundles.mjs dist
npm run test:a11y
npx playwright test tests/e2e/catalog.spec.ts tests/e2e/forest-cafe-visual.spec.ts --project=desktop --project=mobile-390
```

Expected:

- all Vitest files pass;
- Astro check has zero errors;
- all localized routes build (baseline: 1,269 pages unless intentional route data changed, which this plan does not authorize);
- site validation and content audit pass;
- all bundle budgets pass;
- Axe reports no serious/critical violations;
- desktop/mobile light/dark visual checks pass.

**Step 4: Perform a manual browser review**

At 390, 768, and 1440 widths, inspect at least home, tools, one PDF tool, one calculator, one game, one article, and one RTL page in both themes. Confirm D2Coding loads from `/fonts/D2Coding.woff2`, unsupported scripts fall back without tofu, hover does not shift layout, and all primary actions remain obvious.

Record commands, pass counts, built page count, representative routes, and any intentional visual-test masking in `docs/superpowers/reports/2026-07-23-forest-cafe-verification.md`.

**Step 5: Final commit**

```sh
git add tests/e2e docs/superpowers/reports/2026-07-23-forest-cafe-verification.md
git commit -m "test: verify forest cafe redesign across public site"
```

## Completion guardrails

- Do not deploy, push, enable AdSense, or modify ad environment variables as part of this plan.
- Do not stage or alter `.superpowers/sdd/rollout-task-1-report.md`.
- Do not change registry content, route slugs, localized copy, SEO policy, analytics behavior, or tool algorithms unless a failing regression test proves the redesign broke them.
- Keep route-specific lazy imports in `AdditionalToolIsland.tsx`; visual unification must not collapse tools into one large client bundle.
- Every task ends with focused tests and a small commit; Task 9 is the only completion claim.

## Root-approved scope amendment — 2026-07-23

The root coordinator explicitly authorizes Task 9 to repair the shared blog-tag
template after the complete content audit identified thin localized tag pages.
This approval covers substantive localized tag discovery copy, selecting tag
page language from matching article metadata, locking that language in the
shared layout, and the focused unit/integration tests needed to prove the
behavior. It does not authorize route, registry, article-body, or SEO-policy
changes.

## Plan self-review checklist

- Spec coverage: D2Coding, forest/cinnamon palette, warm light theme, espresso dark theme, every public page family, 54 tools, games, responsive, RTL, accessibility, SEO, and bundle budgets are mapped to tasks.
- Interface consistency: `PageShell`, `PageHeader`, `Surface`, `ToolField`, `ToolActions`, and `ToolResult` have one stable responsibility each; Astro shells do not own React tool state.
- Verification: every implementation task begins with a failing test or contract and ends with an explicit command and expected result.
- Scope safety: no deployment, ad activation, content rewrite, route change, or unrelated worktree mutation is authorized.
