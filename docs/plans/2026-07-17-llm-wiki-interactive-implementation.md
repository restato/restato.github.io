# Interactive LLM Wiki Learning Experience Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an English, presentation-ready interactive page at `/llm-wiki/` that teaches the LLM Wiki pattern, LangChain OpenWiki, and Google Cloud's OKF through three deterministic, hands-on simulations.

**Architecture:** Astro renders the SEO shell, explanatory fallback content, citations, glossary, and structured data. A single React island manages the stateful learning journey using typed, precomputed scenario fixtures, small reusable visual components, local persistence, and CSS-driven motion that degrades for reduced-motion users.

**Tech Stack:** Astro 5, React 19, TypeScript strict mode, Tailwind CSS 3, feature-scoped CSS, Vitest 4, Testing Library, jsdom.

---

### Task 1: Typed scenario fixtures and progression helpers

**Files:**
- Create: `src/types/llm-wiki.ts`
- Create: `src/data/llm-wiki/scenarios.ts`
- Create: `src/lib/llm-wiki.ts`
- Test: `src/lib/__tests__/llm-wiki.test.ts`

**Step 1: Write the failing tests**

Test that all three scenario IDs exist, each scenario has at least four sources, three wiki documents, graph edges with valid nodes, questions with evidence, and an OKF file. Test a pure progression helper that adds sources without duplicates and reports the compilation stage.

```ts
expect(Object.keys(llmWikiScenarios)).toEqual(['repository', 'research', 'company']);
expect(getCompilationStage(0, scenario.sources.length)).toBe('idle');
expect(addCompiledSource(['route'], 'route')).toEqual(['route']);
```

**Step 2: Run the focused test and verify failure**

Run: `npx vitest run src/lib/__tests__/llm-wiki.test.ts`
Expected: FAIL because the feature modules do not exist.

**Step 3: Implement strict feature types and fixtures**

Define `Scenario`, `SourceFile`, `WikiDocument`, `GraphNode`, `GraphEdge`, `GuidedQuestion`, and `OkfBundle` types. Add concise, realistic fixture content for:

- repository authentication architecture,
- research-paper scaling-law contradictions,
- company weekly-active-user metric governance.

Implement pure helpers:

```ts
export function addCompiledSource(current: string[], sourceId: string): string[] {
  return current.includes(sourceId) ? current : [...current, sourceId];
}

export function getCompilationStage(count: number, total: number): CompilationStage {
  if (count === 0) return 'idle';
  if (count < total) return 'compiling';
  return 'ready';
}
```

**Step 4: Run the focused test and verify success**

Run: `npx vitest run src/lib/__tests__/llm-wiki.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/types/llm-wiki.ts src/data/llm-wiki/scenarios.ts src/lib/llm-wiki.ts src/lib/__tests__/llm-wiki.test.ts
git commit -m "feat: add LLM Wiki scenario model"
```

### Task 2: Experience state, persistence, and keyboard-safe controls

**Files:**
- Create: `src/components/llm-wiki/useLlmWikiExperience.ts`
- Test: `src/components/llm-wiki/__tests__/useLlmWikiExperience.test.tsx`

**Step 1: Write the failing tests**

Render a small hook harness and verify initial state, scenario switching, adding a source, compiling all sources, selecting a question, selecting a document, resetting, and graceful behavior when local storage throws.

```tsx
expect(screen.getByTestId('scenario')).toHaveTextContent('repository');
await user.click(screen.getByRole('button', { name: 'Switch to research' }));
expect(screen.getByTestId('scenario')).toHaveTextContent('research');
```

**Step 2: Run the focused test and verify failure**

Run: `npx vitest run src/components/llm-wiki/__tests__/useLlmWikiExperience.test.tsx`
Expected: FAIL because the hook is missing.

**Step 3: Implement the hook**

Keep canonical state in React, derive the compilation stage from Task 1 helpers, and store only a versioned, minimal state object.

```ts
const STORAGE_KEY = 'restato-llm-wiki-v1';

type PersistedState = {
  scenarioId: ScenarioId;
  completedSections: string[];
};
```

Catch storage read/write errors and continue with in-memory defaults. Reset transient selections when a scenario changes.

**Step 4: Run the focused test and verify success**

Run: `npx vitest run src/components/llm-wiki/__tests__/useLlmWikiExperience.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/llm-wiki/useLlmWikiExperience.ts src/components/llm-wiki/__tests__/useLlmWikiExperience.test.tsx
git commit -m "feat: manage LLM Wiki learning state"
```

### Task 3: Knowledge Workbench interaction

**Files:**
- Create: `src/components/llm-wiki/icons.tsx`
- Create: `src/components/llm-wiki/ScenarioSwitcher.tsx`
- Create: `src/components/llm-wiki/SourceWorkbench.tsx`
- Create: `src/components/llm-wiki/KnowledgeGraph.tsx`
- Test: `src/components/llm-wiki/__tests__/KnowledgeWorkbench.test.tsx`

**Step 1: Write the failing interaction tests**

Verify accessible scenario tabs, add-to-wiki buttons, drag/drop support, compile-all, progress announcement, graph-node selection, and a semantic relationship list.

```tsx
expect(screen.getByRole('tab', { name: /open-source repository/i })).toHaveAttribute('aria-selected', 'true');
await user.click(screen.getByRole('button', { name: /add auth middleware/i }));
expect(screen.getByRole('status')).toHaveTextContent(/1 of 5 sources compiled/i);
```

**Step 2: Run the focused test and verify failure**

Run: `npx vitest run src/components/llm-wiki/__tests__/KnowledgeWorkbench.test.tsx`
Expected: FAIL because the components are missing.

**Step 3: Implement the controls**

Use semantic buttons and tabs as the canonical interaction. Enhance source cards with native drag events but never make dragging the only path. Render the graph with SVG lines and positioned buttons, plus an accessible relationship list below it. Use inline SVG icons from a shared icon component instead of emoji.

**Step 4: Run the focused test and verify success**

Run: `npx vitest run src/components/llm-wiki/__tests__/KnowledgeWorkbench.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/llm-wiki/icons.tsx src/components/llm-wiki/ScenarioSwitcher.tsx src/components/llm-wiki/SourceWorkbench.tsx src/components/llm-wiki/KnowledgeGraph.tsx src/components/llm-wiki/__tests__/KnowledgeWorkbench.test.tsx
git commit -m "feat: build interactive knowledge workbench"
```

### Task 4: RAG comparison, OpenWiki terminal, and OKF explorer

**Files:**
- Create: `src/components/llm-wiki/RagComparison.tsx`
- Create: `src/components/llm-wiki/OpenWikiTerminal.tsx`
- Create: `src/components/llm-wiki/OkfExplorer.tsx`
- Test: `src/components/llm-wiki/__tests__/KnowledgeTools.test.tsx`

**Step 1: Write the failing tests**

Verify question selection, evidence rendering, comparison states, terminal run/replay/skip controls, file selection, plain-language/YAML view switching, and portability consumer selection.

```tsx
await user.click(screen.getByRole('button', { name: /where is authentication handled/i }));
expect(screen.getByText(/evidence used/i)).toBeVisible();
await user.click(screen.getByRole('tab', { name: /raw yaml/i }));
expect(screen.getByText(/type: architecture/i)).toBeVisible();
```

**Step 2: Run the focused test and verify failure**

Run: `npx vitest run src/components/llm-wiki/__tests__/KnowledgeTools.test.tsx`
Expected: FAIL because the components are missing.

**Step 3: Implement deterministic tools**

Drive all results from scenario fixtures. Terminal animations may reveal lines over time, but every sequence must also support skip and reduced-motion immediate completion. Use `aria-live="polite"` for meaningful status changes and avoid announcing decorative terminal output.

**Step 4: Run the focused test and verify success**

Run: `npx vitest run src/components/llm-wiki/__tests__/KnowledgeTools.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/llm-wiki/RagComparison.tsx src/components/llm-wiki/OpenWikiTerminal.tsx src/components/llm-wiki/OkfExplorer.tsx src/components/llm-wiki/__tests__/KnowledgeTools.test.tsx
git commit -m "feat: simulate OpenWiki and OKF workflows"
```

### Task 5: Compose the learning application

**Files:**
- Create: `src/components/llm-wiki/LlmWikiExperience.tsx`
- Create: `src/components/llm-wiki/PresentationControls.tsx`
- Test: `src/components/llm-wiki/__tests__/LlmWikiExperience.test.tsx`

**Step 1: Write the failing journey test**

Render the application and complete the primary repository journey using user-visible controls. Verify the central relationship recap, reset behavior, presentation controls, and scenario-specific adoption guide.

```tsx
expect(screen.getByRole('heading', { name: /the knowledge workbench/i })).toBeVisible();
await user.click(screen.getByRole('button', { name: /compile all sample sources/i }));
expect(screen.getByText(/wiki ready/i)).toBeVisible();
expect(screen.getByText(/idea/i)).toBeVisible();
expect(screen.getByText(/tool/i)).toBeVisible();
expect(screen.getByText(/format/i)).toBeVisible();
```

**Step 2: Run the focused test and verify failure**

Run: `npx vitest run src/components/llm-wiki/__tests__/LlmWikiExperience.test.tsx`
Expected: FAIL because the composed application is missing.

**Step 3: Compose the application**

Connect the state hook to the workbench and tool components. Add a sticky section-progress control, presentation-mode request with a safe fullscreen fallback, reset, and guided next-step prompts. Keep headings and section IDs stable for Astro navigation and presentation mode.

**Step 4: Run the focused test and verify success**

Run: `npx vitest run src/components/llm-wiki/__tests__/LlmWikiExperience.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/llm-wiki/LlmWikiExperience.tsx src/components/llm-wiki/PresentationControls.tsx src/components/llm-wiki/__tests__/LlmWikiExperience.test.tsx
git commit -m "feat: compose LLM Wiki learning journey"
```

### Task 6: Premium Astro page, SEO, static fallback, and visual system

**Files:**
- Create: `src/pages/llm-wiki/index.astro`
- Create: `src/styles/llm-wiki.css`
- Create: `public/images/llm-wiki-og.svg`
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Add a build-level failing assertion**

Create the route with imports before the stylesheet and page implementation exist, then run the build.

Run: `npm run build:astro`
Expected: FAIL due to unresolved page dependencies.

**Step 2: Implement the Astro shell**

Add English metadata, canonical URL, OG image, FAQ JSON-LD, article/source links, noscript/static fallback, glossary, citations, and the React island with `client:visible`. Add any small `BaseLayout` extension needed for page-specific body classes without changing existing page behavior.

**Step 3: Implement the visual system**

Use feature-scoped CSS variables and selectors. Include:

- editorial hero and animated knowledge field,
- instrument-panel surfaces and fine grid/noise layers,
- responsive workbench and terminal layouts,
- meaningful state colors with AA contrast,
- focus-visible and touch states,
- reduced-motion overrides,
- print/presentation styling,
- dark/light theme compatibility,
- no horizontal overflow from 320 px upward.

**Step 4: Run production build**

Run: `npm run build:astro`
Expected: PASS and generation of `/llm-wiki/index.html`.

**Step 5: Commit**

```bash
git add src/pages/llm-wiki/index.astro src/styles/llm-wiki.css public/images/llm-wiki-og.svg src/layouts/BaseLayout.astro
git commit -m "feat: launch interactive LLM Wiki guide"
```

### Task 7: Full verification and browser polish

**Files:**
- Modify: any feature file above when verification reveals a defect

**Step 1: Run all automated tests**

Run: `npm run test:coverage -- --run`
Expected: PASS with no unhandled errors.

**Step 2: Run type-aware Astro checks and production build**

Run: `npx astro check && npm run build`
Expected: PASS; sitemaps include the new route.

**Step 3: Run the local production preview**

Run: `npm run preview -- --host 127.0.0.1`
Expected: Preview server starts and `/llm-wiki/` returns 200.

**Step 4: Inspect the full journey in a real browser**

Check at 390×844, 768×1024, 1440×1000, and a presentation viewport. Exercise:

- every scenario,
- source compilation and reset,
- graph selection and relationship list,
- every guided question,
- terminal run, skip, replay, and file selection,
- OKF views and portability consumers,
- theme switch,
- keyboard-only navigation,
- reduced-motion mode,
- presentation mode.

Check browser console, overflow, focus visibility, clipping, layout shifts, text readability, and broken links.

**Step 5: Correct defects and repeat Steps 1–4**

Continue until tests, checks, build, console, and the complete browser journey are clean.

**Step 6: Review the final diff and commit verification fixes**

```bash
git diff --check
git status --short
git add <only-verified-feature-files>
git commit -m "fix: polish LLM Wiki learning experience"
```
