# Global Localization and AdSense Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 12-language publication gates, trustworthy policy content, consent-aware analytics, and dormant AdSense placements.

**Architecture:** Locale metadata and completeness checks control route indexability. Analytics and ads are configuration-driven integrations isolated from tool content and disabled when consent or approval conditions are not met.

**Tech Stack:** Astro, TypeScript, static environment variables, GA4, Vitest.

## Global Constraints

- Supported languages are exactly `ko`, `en`, `ja`, `zh-CN`, `zh-TW`, `es`, `pt`, `de`, `fr`, `it`, `id`, and `hi`.
- English is `x-default`.
- Fallback pages are `noindex, follow` and omitted from sitemaps and hreflang sets.
- Do not load AdSense scripts before approval and explicit enablement.
- Analytics never includes user input, file metadata, or generated output.

---

### Task 1: Expand locale metadata and URL parsing

**Files:**
- Modify: `src/i18n/index.ts`
- Modify: `src/i18n/urlUtils.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/Header.astro`
- Create: `src/pages/[lang]/index.astro`
- Create: `src/i18n/__tests__/locales.test.ts`

**Interfaces:**
- `Language` comes only from `src/data/tools/types.ts`.
- `parseLanguage(pathname: string): Language | null`
- `buildLanguageUrl(pathname: string, lang: Language): string`
- `localeMetadata: Record<Language, { label: string; html: string; og: string; dir: 'ltr' }>`

- [ ] Write failing tests for all 12 prefixes, `zh-CN`/`zh-TW`, browser fallback, and direct localized URLs.
- [ ] Run `npm test -- --run src/i18n/__tests__/locales.test.ts`; expect failures for the nine new languages.
- [ ] Add exact locale metadata and replace every hard-coded `(ko|en|ja)` regex with an escaped matcher derived from the language list.
- [ ] Create a localized landing page for every language so breadcrumbs such as `/${lang}/` never lead to a 404; render task clusters and direct localized tool links.
- [ ] Render alternate URLs with trailing-slash normalization and English `x-default`.
- [ ] Rerun locale tests and `npm run check`; expect PASS.
- [ ] Commit with `feat: add priority language routing`.

### Task 2: Enforce localization completeness

**Files:**
- Create: `src/i18n/completeness.ts`
- Create: `src/i18n/__tests__/completeness.test.ts`
- Modify: `src/pages/[lang]/tools/[slug].astro`
- Modify: `src/pages/[lang]/tools/index.astro`

**Interfaces:**

```ts
export interface PublicationState {
  indexable: boolean;
  robots: 'index, follow' | 'noindex, follow';
  alternates: Array<{ lang: Language; url: string }>;
}

export function getPublicationState(tool: ToolDefinition, lang: Language): PublicationState;
```

- [ ] Write tests proving complete translations are indexable and fallback translations are excluded from reciprocal alternates.
- [ ] Verify RED.
- [ ] Implement `getPublicationState` and pass its `robots` and `alternates` to `MainLayout`.
- [ ] Translate the common navigation, footer, catalog, categories, shared tool controls, validation vocabulary, and all existing 41 tool content records into the 12 priority languages. Each record includes title, description, overview, steps, examples, limitations, privacy text, and visible FAQs.
- [ ] Make catalog cards display English fallback with a visible language notice but without creating indexable fallback pages during the translation rollout.
- [ ] Run completeness, registry, and build validation tests; expect PASS.
- [ ] Commit with `feat: gate localized pages by completeness`.

### Task 3: Add localized trust and policy routes

**Files:**
- Create: `src/data/site-content.ts`
- Create: `src/pages/[lang]/about.astro`
- Create: `src/pages/[lang]/contact.astro`
- Create: `src/pages/[lang]/privacy.astro`
- Create: `src/pages/[lang]/terms.astro`
- Create: `src/pages/[lang]/disclaimer.astro`
- Modify: `src/components/Footer.astro`
- Create: `src/data/__tests__/site-content.test.ts`

**Interfaces:**
- `SitePageKey = 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer'`
- `siteContent: Record<SitePageKey, Record<Language, SitePageContent>>`

- [ ] Write tests requiring a non-empty title, description, sections, effective date, contact path, analytics disclosure, local-processing disclosure, and advertising disclosure in all 12 languages.
- [ ] Verify RED.
- [ ] Add complete human-readable policy copy; do not use duplicated tool-page boilerplate.
- [ ] Generate five localized static paths and add crawlable footer links in the current language.
- [ ] Run tests, build, and site validator; expect 60 localized policy URLs with correct canonicals and hreflang.
- [ ] Commit with `feat: add localized trust pages`.

### Task 4: Make analytics consent-aware and content-safe

**Files:**
- Create: `src/lib/analytics.ts`
- Create: `src/components/ConsentBanner.astro`
- Create: `src/lib/__tests__/analytics.test.ts`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**

```ts
export type ToolEventName = 'tool_open' | 'tool_start' | 'tool_complete' | 'tool_error' | 'tool_download' | 'tool_copy' | 'tool_favorite' | 'tool_share';
export interface ToolEvent { name: ToolEventName; tool: string; locale: Language; durationBucket?: '<1s' | '1-5s' | '>5s'; errorCategory?: string; }
export function trackToolEvent(event: ToolEvent): void;
```

- [ ] Write failing tests that reject extra payload keys and suppress events before consent.
- [ ] Verify RED.
- [ ] Move the GA script out of unconditional `BaseLayout` markup. Load it only when `PUBLIC_GA_ID` exists and consent state is `granted` where required.
- [ ] Store only `granted`, `denied`, or `unset`; never store consent fingerprint data.
- [ ] Run analytics tests and inspect a production page for absence of GA when configuration is empty.
- [ ] Commit with `feat: add privacy-safe analytics consent`.

### Task 5: Add dormant advertising slots

**Files:**
- Create: `src/components/ads/AdSlot.astro`
- Create: `src/components/ads/__tests__/ad-config.test.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `.env.example`

**Interfaces:**
- `AdSlot` props: `{ placement: 'tool-after-help' | 'catalog-between-clusters'; class?: string }`
- Environment: `PUBLIC_ADSENSE_ENABLED`, `PUBLIC_ADSENSE_CLIENT`, `PUBLIC_ADSENSE_SLOT_TOOL`, `PUBLIC_ADSENSE_SLOT_CATALOG`.

- [ ] Write tests proving disabled or incomplete configuration returns an empty string with no reserved height.
- [ ] Verify RED.
- [ ] Implement exact enabled predicate: enabled string is `true`, client starts with `ca-pub-`, and the placement slot is non-empty.
- [ ] Remove the hard-coded AdSense account meta value from `BaseLayout.astro`; render it only from a valid configured client ID.
- [ ] Load the AdSense script once only when at least one enabled slot renders.
- [ ] Place ads after help content and between catalog clusters, never between input and result.
- [ ] Run build twice: once with empty config and once with fixture config. Verify absence/presence and no layout shift placeholder when disabled.
- [ ] Commit with `feat: prepare adsense placements`.

### Task 6: Audit indexable content

**Files:**
- Create: `scripts/audit-content.mjs`
- Create: `docs/quality/indexation-audit.md`
- Modify: `package.json`

- [ ] Add a test fixture that detects duplicate titles/descriptions, pages under minimum substantive-content thresholds, missing author/contact links, and suspiciously repeated paragraphs.
- [ ] Implement the audit and add `audit:content` to `npm run verify`.
- [ ] Review every reported route manually and record `keep`, `improve`, `noindex`, or `redirect` with rationale.
- [ ] Apply only evidence-backed indexation changes, rebuild, and rerun the audit with zero unreviewed findings.
- [ ] Commit with `seo: enforce indexable content quality`.
