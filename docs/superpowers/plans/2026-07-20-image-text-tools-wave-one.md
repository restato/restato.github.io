# Image and Text Tools Wave One Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship four image utilities and five text utilities with native browser processing and negligible cost on unrelated pages.

**Architecture:** Image operations use decoded browser images and canvas behind a shared lifecycle helper. Text transformations are pure functions with locale-aware options and a shared editor shell.

**Tech Stack:** React, TypeScript, Canvas, Web Crypto where needed, Vitest.

## Global Constraints

- No image or text upload.
- Images: maximum 40 megapixels and 50 MB; disclose format limitations.
- Text: maximum 5 MB; preserve Unicode and line-ending intent.
- Object URLs and canvases are released after every job.
- All nine routes remain usable with keyboard and mobile viewport.

---

### Task 1: Image lifecycle and compression

**Files:**
- Create: `src/lib/image/browser-image.ts`
- Create: `src/lib/image/compress.ts`
- Create: `src/lib/image/__tests__/compress.test.ts`

**Interfaces:**

```ts
export interface DecodedImage { width: number; height: number; bitmap: ImageBitmap; dispose(): void; }
export async function decodeImage(file: File, signal?: AbortSignal): Promise<DecodedImage>;
export async function compressImage(file: File, options: { mime: 'image/jpeg' | 'image/webp' | 'image/png'; quality: number; maxWidth?: number; maxHeight?: number }, signal?: AbortSignal): Promise<Blob>;
```

- [ ] Write failing tests for unsupported files, dimension/size limits, aspect-ratio preservation, quality bounds, abort, and cleanup.
- [ ] Implement `createImageBitmap` with an image-element fallback and canvas export.
- [ ] Verify decoded output dimensions and blob MIME, then commit with `feat(image): add safe browser image pipeline`.

### Task 2: Rotate/flip, favicon, and color extraction

**Files:**
- Create: `src/lib/image/transform.ts`
- Create: `src/lib/image/favicon.ts`
- Create: `src/lib/image/colors.ts`
- Create: `src/lib/image/__tests__/transform-favicon-colors.test.ts`

**Interfaces:**

```ts
export async function transformImage(file: File, options: { rotation: 0 | 90 | 180 | 270; flipX: boolean; flipY: boolean; mime: 'image/png' | 'image/jpeg' | 'image/webp' }): Promise<Blob>;
export async function createFavicons(file: File): Promise<Array<{ size: 16 | 32 | 48 | 180 | 192 | 512; blob: Blob }>>;
export async function extractPalette(file: File, count: 3 | 5 | 8): Promise<Array<{ hex: string; population: number }>>;
```

- [ ] Write failing pixel-fixture tests for orientation, size outputs, transparent padding, deterministic palette order, and near-color merging.
- [ ] Implement transforms with explicit canvas matrices and deterministic quantization.
- [ ] Decode every output in tests and commit with `feat(image): add transform favicon and palette operations`.

### Task 3: Text transformations

**Files:**
- Create: `src/lib/text/transform.ts`
- Create: `src/lib/text/__tests__/transform.test.ts`

**Interfaces:**

```ts
export type CaseMode = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab';
export function convertCase(input: string, mode: CaseMode, locale: string): string;
export function cleanWhitespace(input: string, options: { trimLines: boolean; collapseSpaces: boolean; removeEmptyLines: boolean }): string;
export function removeDuplicateLines(input: string, options: { caseSensitive: boolean; trimBeforeCompare: boolean }): string;
export function sortLines(input: string, options: { direction: 'asc' | 'desc'; numeric: boolean; locale: string }): string;
export function createSlug(input: string, options: { separator: '-' | '_'; lowercase: boolean; transliterate: boolean }): string;
```

- [ ] Write failing tests for CRLF/LF, blank lines, emoji, accented Latin, Hangul, CJK, Hindi, Turkish casing, stable duplicate removal, numeric sorting, and empty input.
- [ ] Implement pure functions with `Intl.Collator`; transliteration supports documented Latin mappings only and preserves unsupported scripts rather than deleting them.
- [ ] Run tests and commit with `feat(text): add deterministic text transformations`.

### Task 4: Nine components and registry entries

**Files:**
- Create: `src/components/tools/image/ImageCompressor.tsx`
- Create: `src/components/tools/image/ImageTransformer.tsx`
- Create: `src/components/tools/image/FaviconGenerator.tsx`
- Create: `src/components/tools/image/ImageColorExtractor.tsx`
- Create: `src/components/tools/text/CaseConverter.tsx`
- Create: `src/components/tools/text/WhitespaceCleaner.tsx`
- Create: `src/components/tools/text/DuplicateLineRemover.tsx`
- Create: `src/components/tools/text/LineSorter.tsx`
- Create: `src/components/tools/text/SlugGenerator.tsx`
- Create: `src/components/tools/image/__tests__/image-tools.test.tsx`
- Create: `src/components/tools/text/__tests__/text-tools.test.tsx`
- Modify: `src/data/tools/registry.ts`
- Modify: `src/pages/[lang]/tools/[slug].astro`

- [ ] Write failing primary-flow, reset, repeat, copy/download, error, and non-Latin tests for every component.
- [ ] Reuse existing shared dropzone/result controls and `DualPaneTool`; do not fork their behavior.
- [ ] Add complete registry content, component labels, validation messages, and meaningful relations for nine slugs in all 12 priority languages; no fallback locale is indexable.
- [ ] Run focused tests, full verification, and 390px browser flows.
- [ ] Commit by family, ending with `feat(tools): publish image and text cluster`.

### Task 5: Privacy, accessibility, and performance

**Files:**
- Create: `tests/e2e/image-text-tools.spec.ts`

- [ ] Verify selected files and entered text never appear in requests or logs.
- [ ] Run keyboard-only flows and automated axe checks.
- [ ] Test repeated 40-megapixel rejection without a tab crash and successful moderate-image processing.
- [ ] Verify unrelated pages do not ship image pipeline code.
- [ ] Run `npm run verify && npm run test:e2e -- image-text-tools && npm run lighthouse` and commit with `test(tools): verify image and text quality`.
