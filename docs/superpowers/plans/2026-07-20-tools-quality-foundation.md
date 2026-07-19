# Tools Quality Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore a clean baseline for the existing 41 tools and replace duplicated route/catalog metadata with a validated tool registry.

**Architecture:** Pure tool metadata lives in a typed registry, Astro routes consume registry selectors, and build validators enforce links and SEO invariants. Existing component behavior is repaired before new tools are introduced.

**Tech Stack:** Astro 5, React 19, TypeScript, Vitest, Testing Library, jsdom.

## Global Constraints

- Keep GitHub Pages static output.
- Processing-tool inputs and files never leave the browser; explicit communication tools may send content only to the intended peer and must disclose signaling, relay, and transfer behavior.
- Existing public slugs remain valid.
- Use two-space indentation, semicolons, and single quotes.
- Write a failing test and observe the expected failure before every behavior change.

---

### Task 1: Repair the test environment

**Files:**
- Modify: `src/test/setup.ts`
- Modify: `src/components/tools/__tests__/JsonFormatter.test.tsx`
- Create: `src/test/setup.test.ts`

**Interfaces:**
- Produces: a real jsdom `window.location` with `pathname === '/ko/tools/test'` and deterministic canvas/clipboard/object-URL mocks.

- [ ] **Step 1: Write a failing setup smoke test**

```ts
import { describe, expect, it } from 'vitest';

describe('test browser environment', () => {
  it('provides a pathname and browser file APIs', () => {
    expect(window.location.pathname).toBe('/ko/tools/test');
    expect(HTMLCanvasElement.prototype.getContext).toBeTypeOf('function');
    expect(URL.createObjectURL).toBeTypeOf('function');
    expect(URL.revokeObjectURL).toBeTypeOf('function');
  });
});
```

- [ ] **Step 2: Run the test and verify the missing-pathname failure**

Run: `npm test -- --run src/test/setup.test.ts`
Expected: FAIL because the current setup replaces `window.location` without `pathname`.

- [ ] **Step 3: Replace the destructive location mock and add deterministic APIs**

```ts
window.history.replaceState({}, '', '/ko/tools/test');

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value: vi.fn(() => ({ clearRect: vi.fn(), drawImage: vi.fn(), fillRect: vi.fn() })),
});

Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:test') });
Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
```

Delete the `delete window.location` block. Update JsonFormatter test input helpers to enter literal JSON with `fireEvent.change` because the installed `user-event` treats braces as keyboard descriptors; do not change JsonFormatter production behavior.

- [ ] **Step 4: Run setup and existing tests**

Run: `npm test -- --run src/test/setup.test.ts src/components/tools/__tests__/JsonFormatter.test.tsx`
Expected: PASS; no `window.location.pathname.match` or canvas-not-implemented error.

- [ ] **Step 5: Commit**

```bash
git add src/test/setup.ts src/test/setup.test.ts
git commit -m "test: repair browser test environment"
```

### Task 2: Introduce the typed registry contract

**Files:**
- Create: `src/data/tools/types.ts`
- Create: `src/data/tools/locales.ts`
- Create: `src/data/tools/registry.ts`
- Create: `src/data/tools/__tests__/registry.test.ts`
- Modify: `src/data/tools.ts`

**Interfaces:**
- Produces: `Language`, `Localized<T>`, `ToolDefinition`, `toolsRegistry`, `getTool`, `getPublishedTools`, `getIndexableLanguages`.

- [ ] **Step 1: Write failing invariant tests**

```ts
import { describe, expect, it } from 'vitest';
import { toolsRegistry } from '../registry';

describe('toolsRegistry', () => {
  it('contains unique slugs and valid relations', () => {
    const slugs = toolsRegistry.map(tool => tool.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const tool of toolsRegistry) {
      expect(tool.related.every(slug => slugs.includes(slug))).toBe(true);
    }
  });

  it('does not index incomplete localizations', () => {
    for (const tool of toolsRegistry) {
      for (const lang of tool.indexableLanguages) {
        expect(tool.content[lang]?.status).toBe('complete');
      }
    }
  });
});
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run src/data/tools/__tests__/registry.test.ts`
Expected: FAIL because the registry modules do not exist.

- [ ] **Step 3: Add the exact registry types**

```ts
export type Language = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW' | 'es' | 'pt' | 'de' | 'fr' | 'it' | 'id' | 'hi';
export type LocalizationStatus = 'complete' | 'fallback';
export type ToolPrivacyMode = 'local-only' | 'local-with-assets' | 'local-with-network-data' | 'peer-to-peer';

export interface ToolContent {
  status: LocalizationStatus;
  name: string;
  title: string;
  description: string;
  searchIntent: string;
  overview: string;
  steps: string[];
  examples: string[];
  limitations: string[];
  privacy: string;
  faq: Array<{ question: string; answer: string }>;
}

export interface ToolDefinition {
  slug: string;
  icon: string;
  category: string;
  cluster: string;
  component: string;
  privacyMode: ToolPrivacyMode;
  related: string[];
  content: Partial<Record<Language, ToolContent>>;
  indexableLanguages: Language[];
  released: boolean;
  updatedAt: string;
}
```

- [ ] **Step 4: Migrate the existing 41 records without changing copy**

Move current entries into `registry.ts`, add accurate privacy modes based on actual network behavior, manually curated meaningful relations, English/Korean/Japanese content status, and compatibility exports from `src/data/tools.ts`. Classify anonymous chat as `peer-to-peer`; classify tools that fetch non-user network data as `local-with-network-data`; use `local-with-assets` only when runtime assets are downloaded for local processing.

- [ ] **Step 5: Run registry and existing tests**

Run: `npm test -- --run src/data/tools/__tests__/registry.test.ts src/components/tools/__tests__/allTools.test.tsx`
Expected: registry tests PASS. Record the four previously identified component/i18n smoke failures as the baseline backlog for Task 4; Task 2 is not responsible for changing those components.

- [ ] **Step 6: Commit**

```bash
git add src/data/tools.ts src/data/tools
git commit -m "refactor: centralize tool registry"
```

### Task 3: Make localized links direct and registry-driven

**Files:**
- Modify: `src/components/tools/ToolsGrid.tsx`
- Modify: `src/components/tools/RelatedTools.astro`
- Modify: `src/pages/[lang]/tools/index.astro`
- Modify: `src/pages/[lang]/tools/[slug].astro`
- Create: `src/components/tools/__tests__/ToolsGrid.test.tsx`

**Interfaces:**
- `ToolsGridProps` gains `lang: Language` and always emits `/${lang}/tools/${slug}` for tool slugs.

- [ ] **Step 1: Write the failing direct-link test**

```tsx
render(<ToolsGrid lang="ko" tools={[tool]} categories={[allCategory]} />);
expect(screen.getByRole('link', { name: /JSON/ })).toHaveAttribute('href', '/ko/tools/json');
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- --run src/components/tools/__tests__/ToolsGrid.test.tsx`
Expected: FAIL with `/tools/json`.

- [ ] **Step 3: Implement the localized href contract**

```ts
const toolHref = (slug: string) => slug.startsWith('/') ? slug : `/${lang}/tools/${slug}`;
```

Pass `lang` from the Astro index page and remove client language guessing for server-rendered card labels.

- [ ] **Step 4: Remove duplicate route markup and generic FAQ schema**

Delete the duplicate UUID component condition. Generate `WebApplication` and `BreadcrumbList` from registry content; keep visible FAQs but remove `FAQPage` markup.

- [ ] **Step 5: Verify**

Run: `npm test -- --run src/components/tools/__tests__/ToolsGrid.test.tsx src/data/tools/__tests__/registry.test.ts && npm run build`
Expected: PASS and production build exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/tools src/pages/[lang]/tools
git commit -m "fix: use direct localized tool links"
```

### Task 4: Close the existing-tool regression backlog

**Files:**
- Modify: `src/components/tools/__tests__/*.test.tsx`
- Modify: affected `src/components/tools/*.tsx`
- Create: `docs/quality/existing-tools-matrix.md`

**Interfaces:**
- Produces: one documented row per existing tool with valid, empty, invalid, boundary, non-Latin, repeat, copy/download, mobile, and privacy coverage.

- [ ] **Step 1: Capture a machine-readable baseline**

Run: `npm test -- --run --reporter=verbose`
Expected: record every failure by root cause in the matrix; do not change production code yet.

- [ ] **Step 2: Repair one root-cause group at a time using RED-GREEN**

For each failure group, narrow to one test file, confirm the intended failure, apply the smallest implementation fix, then rerun that file and `allTools.test.tsx`.

- [ ] **Step 3: Add missing behavior cases**

Use this exact table header:

```md
| Slug | Valid | Empty | Invalid | Boundary | Non-Latin | Repeat | Output | Mobile | Privacy |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
```

- [ ] **Step 4: Verify the complete baseline**

Run: `npm run test:coverage -- --run`
Expected: 0 failed suites and 0 failed tests.

- [ ] **Step 5: Commit in root-cause-sized commits**

Use `fix(tool): ...` subjects and never combine unrelated tool fixes.

### Task 5: Add build-time link and SEO validation

**Files:**
- Create: `scripts/validate-site.mjs`
- Create: `scripts/__tests__/validate-site.test.ts`
- Modify: `package.json`

**Interfaces:**
- `validateSite(distDir: string): Promise<{ pages: number; errors: string[] }>`
- New scripts: `check`, `validate:site`, and `verify`.

- [ ] **Step 1: Write failing fixture tests for duplicate canonicals, broken links, and incomplete hreflang**
- [ ] **Step 2: Run `npm test -- --run scripts/__tests__/validate-site.test.ts` and verify RED**
- [ ] **Step 3: Implement DOM parsing over generated HTML and exact internal-path resolution**

Install the validator dependencies with `npm install -D @astrojs/check cheerio` before adding the implementation.
- [ ] **Step 4: Add scripts**

```json
{
  "check": "astro check",
  "validate:site": "node scripts/validate-site.mjs dist",
  "verify": "npm test -- --run && npm run check && npm run build && npm run validate:site"
}
```

- [ ] **Step 5: Run `npm run verify`**
Expected: all tests pass, Astro check passes, build exits 0, validator reports zero errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json scripts
git commit -m "test: validate generated site integrity"
```
