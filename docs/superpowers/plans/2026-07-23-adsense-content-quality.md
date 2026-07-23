# AdSense Content Quality Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove confirmed mass-produced content signals, reduce index bloat, add publisher trust information, and fix route-language rendering before opening a draft PR.

**Architecture:** Astro continues to generate the public static site. Search eligibility is controlled at each page and again in the split sitemap generator; deterministic localized controls receive the route language as an explicit prop. A build-output verifier protects the complete SEO contract.

**Tech Stack:** Astro 5, React 19, TypeScript, Vitest, Node.js build scripts, GitHub Pages

## Global Constraints

- Delete all 100 `src/content/blog/ai-dev-playbook-*.mdx` posts without redirects to unrelated pages.
- Keep reader-facing tag archives available with `noindex, follow` and exclude them from sitemaps.
- Exclude `/articles/admin/`, `/dashboard/`, and `/content-os/` from indexing and sitemaps.
- Add factual `/about/`, `/contact/`, `/privacy/`, and `public/ads.txt` assets.
- Do not claim or guarantee AdSense approval.
- Do not rewrite retained articles merely to reach a target length.

---

### Task 1: Build an executable content-quality contract

**Files:**
- Create: `scripts/verify-content-quality.mjs`
- Modify: `package.json`
- Test: `scripts/verify-content-quality.mjs`

**Interfaces:**
- Consumes: repository root and generated `dist/`
- Produces: `npm run verify:content-quality`, exiting nonzero with a list of failed requirements

- [ ] **Step 1: Write the failing verifier**

Create checks for zero playbook source files, the three trust routes, `ads.txt`, noindex metadata on archive/internal pages, sitemap exclusions, and English/Japanese localized control text.

- [ ] **Step 2: Run it to verify RED**

Run: `npm run build:astro && node scripts/verify-content-quality.mjs`

Expected: failure listing existing playbook files, missing trust assets, indexable internal pages, and Korean control labels.

- [ ] **Step 3: Add the package command**

```json
"verify:content-quality": "node scripts/verify-content-quality.mjs"
```

- [ ] **Step 4: Keep the verifier failing until Tasks 2–5 satisfy the contract**

Expected: each task removes only its corresponding failures.

### Task 2: Remove the templated 100-post series

**Files:**
- Delete: `src/content/blog/ai-dev-playbook-001-*.mdx` through `src/content/blog/ai-dev-playbook-100-*.mdx`
- Test: `scripts/verify-content-quality.mjs`

**Interfaces:**
- Consumes: Astro blog content collection
- Produces: a retained article set with no `ai-dev-playbook-*` entries

- [ ] **Step 1: Confirm the failing count is exactly 100**

Run: `find src/content/blog -name 'ai-dev-playbook-*.mdx' | wc -l`

Expected: `100`.

- [ ] **Step 2: Delete the files through an explicit patch**

No redirects are added; the existing noindex 404 handles old URLs.

- [ ] **Step 3: Verify the source condition passes**

Run: `find src/content/blog -name 'ai-dev-playbook-*.mdx' | wc -l`

Expected: `0`.

### Task 3: Enforce robots and sitemap policy

**Files:**
- Modify: `src/pages/blog/tag/[tag].astro`
- Modify: `src/pages/dashboard.astro`
- Modify: `src/pages/content-os.astro`
- Modify: `scripts/generate-sitemaps.mjs`
- Test: `scripts/verify-content-quality.mjs`

**Interfaces:**
- Consumes: `MainLayout`'s existing `robots` prop and generated Astro sitemap URLs
- Produces: `noindex, follow` pages and split sitemaps without archive/internal URLs

- [ ] **Step 1: Confirm current pages are indexable**

Run the verifier and observe robots/sitemap failures.

- [ ] **Step 2: Add explicit robots directives**

Pass `robots="noindex, follow"` on tag, dashboard, and content OS routes. Preserve `noindex, nofollow` on the admin route.

- [ ] **Step 3: Extend sitemap exclusions**

Add patterns for `/blog/tag/`, `/dashboard/`, and `/content-os/`; keep `/articles/admin/` excluded.

- [ ] **Step 4: Build split sitemaps and verify exclusions**

Run: `npm run build`

Expected: no matching paths in `dist/sitemap-*.xml`.

### Task 4: Add publisher identity and privacy surfaces

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/privacy.astro`
- Create: `public/ads.txt`
- Modify: `src/components/Footer.astro`
- Test: `scripts/verify-content-quality.mjs`

**Interfaces:**
- Consumes: `MainLayout`, current public email, GitHub and LinkedIn URLs, publisher ID from `BaseLayout`
- Produces: discoverable trust routes and an authorized-seller record

- [ ] **Step 1: Verify missing route failures**

Run the verifier and confirm all four assets are reported missing.

- [ ] **Step 2: Add factual trust pages**

Use semantic headings, readable prose, canonical defaults, and no unsupported credentials or approval claims. Explain analytics, advertising cookies, browser-local tools, external links, and contact rights in the privacy page.

- [ ] **Step 3: Add footer discovery links**

Add `소개`, `문의`, and `개인정보처리방침` links without removing existing social links.

- [ ] **Step 4: Add `ads.txt`**

```text
google.com, pub-5341896100319873, DIRECT, f08c47fec0942fa0
```

### Task 5: Make route-language rendering deterministic

**Files:**
- Modify: `src/i18n/useTranslation.ts`
- Modify: `src/components/tools/FavoriteButton.tsx`
- Modify: `src/components/tools/ShareButton.tsx`
- Modify: `src/components/tools/BookmarkPrompt.tsx`
- Modify: `src/pages/[lang]/tools/[slug].astro`
- Modify: `src/layouts/ToolLayout.astro`
- Test: `src/components/tools/__tests__/LocalizedControls.test.tsx`
- Test: `scripts/verify-content-quality.mjs`

**Interfaces:**
- Consumes: `Language` (`'ko' | 'en' | 'ja'`) from each canonical route
- Produces: `useTranslation(initialLang?: Language)` and shared controls with optional `lang?: Language`

- [ ] **Step 1: Write failing component tests**

Render each shared control with `lang="en"` and `lang="ja"`; assert localized accessible labels and visible strings, including the delayed bookmark prompt with fake timers.

- [ ] **Step 2: Run focused tests to verify RED**

Run: `npx vitest run src/components/tools/__tests__/LocalizedControls.test.tsx`

Expected: TypeScript/render assertions fail because controls ignore the prop and bookmark copy is hard-coded Korean.

- [ ] **Step 3: Implement explicit initial language**

Initialize the translation hook from the supplied route language and keep browser language-change events for non-locked consumers. Add localized bookmark strings.

- [ ] **Step 4: Pass route language from both tool layouts**

Canonical localized routes pass `lang`; legacy `ToolLayout` passes English because its canonical destination is `/en/tools/`.

- [ ] **Step 5: Run focused tests to verify GREEN**

Run: `npx vitest run src/components/tools/__tests__/LocalizedControls.test.tsx`

Expected: all localized-control tests pass.

### Task 6: Full verification and draft PR

**Files:**
- Modify if required by evidence: only files already named in this plan

**Interfaces:**
- Consumes: completed implementation and repository git state
- Produces: pushed branch and draft PR against `master`

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test -- --run`

Expected: zero failed tests.

- [ ] **Step 2: Run coverage**

Run: `npm run test:coverage`

Expected: zero failed tests and a generated coverage report.

- [ ] **Step 3: Run the production build and quality verifier**

Run: `npm run build && npm run verify:content-quality`

Expected: exit 0; all trust, robots, sitemap, removal, and localization checks pass.

- [ ] **Step 4: Review the diff**

Run: `git diff --check && git status -sb && git diff --stat master...HEAD`

Expected: no whitespace errors or unrelated files.

- [ ] **Step 5: Commit, push, and open a draft PR**

Use explicit paths for staging, push `agent/adsense-content-quality`, and create a draft PR targeting `master` with rationale, impact, and verification results.
