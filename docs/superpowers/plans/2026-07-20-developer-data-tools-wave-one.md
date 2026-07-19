# Developer and Data Tools Wave One Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship seven reliable browser-only developer and data tools with reusable editor behavior.

**Architecture:** Pure parsers and formatters expose discriminated results. A shared dual-pane editor supplies input, output, sample, copy, download, validation status, and responsive layout.

**Tech Stack:** React, TypeScript, sql-formatter, yaml, papaparse, Prettier standalone, csso, DOMParser, Vitest.

## Global Constraints

- Never execute user HTML, CSS, SQL, XML, YAML, or URLs.
- Cap text inputs at 5 MB and report the limit before parsing.
- Preserve non-Latin Unicode.
- Lazy-load formatter dependencies per route.
- Copy/download output must match the visible output exactly.

---

### Task 1: Shared result and editor contracts

**Files:**
- Create: `src/lib/tools/result.ts`
- Create: `src/components/tools/shared/DualPaneTool.tsx`
- Create: `src/components/tools/shared/__tests__/DualPaneTool.test.tsx`

**Interfaces:**

```ts
export type ToolResult<T> = { ok: true; value: T; warnings: string[] } | { ok: false; code: string; message: string; line?: number; column?: number };
export interface DualPaneToolProps { inputLabel: string; outputLabel: string; input: string; output: string; error?: string; onInput(value: string): void; onRun(): void; onReset(): void; onSample(): void; }
```

- [ ] Write failing tests for labels, keyboard flow, empty state, error live region, sample, reset, copy, and mobile stacking.
- [ ] Implement without `dangerouslySetInnerHTML`.
- [ ] Run tests and commit with `feat(tools): add reusable dual pane editor`.

### Task 2: SQL, YAML/JSON, and CSV/JSON logic

**Files:**
- Create: `src/lib/tools/sql.ts`
- Create: `src/lib/tools/yaml-json.ts`
- Create: `src/lib/tools/csv-json.ts`
- Create: `src/lib/tools/__tests__/sql-yaml-csv.test.ts`

**Interfaces:**

```ts
export function formatSql(input: string, dialect: 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'transactsql'): ToolResult<string>;
export function yamlToJson(input: string, indent: 2 | 4): ToolResult<string>;
export function jsonToYaml(input: string): ToolResult<string>;
export function csvToJson(input: string, header: boolean): ToolResult<string>;
export function jsonToCsv(input: string): ToolResult<string>;
```

- [ ] Write failing fixtures for comments, quoted delimiters, nested YAML, YAML aliases, duplicate headers, formula-like cells, nulls, Unicode, and malformed input.
- [ ] Install the three focused dependencies and implement exact `ToolResult` errors.
- [ ] Prevent prototype-polluting keys from being assigned to objects created by the app.
- [ ] Run tests and commit with `feat(tools): add sql yaml and csv transformations`.

### Task 3: XML, HTML, CSS, and URL logic

**Files:**
- Create: `src/lib/tools/xml.ts`
- Create: `src/lib/tools/html.ts`
- Create: `src/lib/tools/css.ts`
- Create: `src/lib/tools/url.ts`
- Create: `src/lib/tools/__tests__/xml-html-css-url.test.ts`

**Interfaces:**

```ts
export function formatXml(input: string, indent: 2 | 4): ToolResult<string>;
export async function formatHtml(input: string): Promise<ToolResult<string>>;
export async function minifyHtml(input: string): Promise<ToolResult<string>>;
export function minifyCss(input: string): ToolResult<string>;
export function inspectUrl(input: string, base?: string): ToolResult<{ href: string; protocol: string; host: string; pathname: string; query: Array<[string, string]>; hash: string }>;
```

- [ ] Write failing tests for XML parser errors, comments, CDATA, script/style preservation, malformed CSS, repeated query keys, IDN hosts, relative URLs, and disallowed protocols.
- [ ] Implement formatting without rendering user markup.
- [ ] Permit only `http:` and `https:` in normalized URL outputs and never create clickable `javascript:` output.
- [ ] Run tests and commit with `feat(tools): add markup and url transformations`.

### Task 4: Seven components, registry entries, and content

**Files:**
- Create: `src/components/tools/developer/SqlFormatter.tsx`
- Create: `src/components/tools/developer/YamlJsonConverter.tsx`
- Create: `src/components/tools/developer/CsvJsonConverter.tsx`
- Create: `src/components/tools/developer/XmlFormatter.tsx`
- Create: `src/components/tools/developer/HtmlFormatter.tsx`
- Create: `src/components/tools/developer/CssMinifier.tsx`
- Create: `src/components/tools/developer/UrlInspector.tsx`
- Create: `src/components/tools/developer/__tests__/developer-tools.test.tsx`
- Modify: `src/data/tools/registry.ts`
- Modify: `src/pages/[lang]/tools/[slug].astro`

- [ ] Write one failing primary-flow test plus invalid-input and Unicode tests for each component.
- [ ] Implement adapters using `DualPaneTool`, explicit operation toggles, and localized status text.
- [ ] Add seven registry entries, relations, privacy copy, limitations, real samples, validation messages, and visible FAQs in all 12 priority languages; the completeness test must keep an incomplete locale out of the index.
- [ ] Run focused and full verification; expect PASS.
- [ ] Commit each transformation family separately, ending with `feat(tools): publish developer data cluster`.

### Task 5: Security and bundle verification

**Files:**
- Create: `tests/e2e/developer-tools.spec.ts`

- [ ] Test payloads containing `<script>`, event handlers, `javascript:` URLs, CSV formulas, and prototype keys without execution or navigation.
- [ ] Verify no network request contains editor input.
- [ ] Confirm formatter dependencies are absent from unrelated route bundles.
- [ ] Run `npm run verify && npm run test:e2e -- developer-tools` and commit with `test(tools): secure developer transformations`.
