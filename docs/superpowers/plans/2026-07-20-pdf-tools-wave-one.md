# PDF Tools Wave One Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship eight privacy-first PDF tools that create verifiably correct downloadable files entirely in the browser.

**Architecture:** `pdf-lib` handles document mutation and `pdfjs-dist` renders pages to images. Pure operations return bytes or page models; one reusable React shell handles files, progress, cancellation, errors, and download lifecycle.

**Tech Stack:** React, TypeScript, pdf-lib, pdfjs-dist, fflate, Vitest, Web Workers where required.

## Global Constraints

- No file upload or runtime API.
- Lazy-load PDF libraries only on PDF routes.
- Default maximum is 100 MB, 500 pages, and 20 input files; reject before processing.
- Revoke object URLs and release ArrayBuffers after use.
- Generated PDFs must be reopened in tests.

---

### Task 1: PDF core and fixtures

**Files:**
- Create: `src/lib/pdf/types.ts`
- Create: `src/lib/pdf/limits.ts`
- Create: `src/lib/pdf/load.ts`
- Create: `src/lib/pdf/__tests__/fixtures.ts`
- Create: `src/lib/pdf/__tests__/load.test.ts`
- Modify: `package.json`

**Interfaces:**

```ts
export interface PdfInput { name: string; bytes: Uint8Array; }
export interface PageRef { documentIndex: number; pageIndex: number; rotation: 0 | 90 | 180 | 270; }
export interface PdfLimits { maxBytes: number; maxPages: number; maxFiles: number; }
export async function inspectPdf(input: PdfInput, limits?: PdfLimits): Promise<{ pageCount: number; encrypted: boolean }>;
```

- [ ] Write failing tests for valid, malformed, oversized, encrypted, zero-page, and excessive-page inputs.
- [ ] Install `pdf-lib`, `pdfjs-dist`, and `fflate`, then implement signature and limit validation.
- [ ] Run `npm test -- --run src/lib/pdf/__tests__/load.test.ts`; expect PASS.
- [ ] Commit with `feat(pdf): add validated browser pdf core`.

### Task 2: Merge, split, reorder, delete, and rotate operations

**Files:**
- Create: `src/lib/pdf/organize.ts`
- Create: `src/lib/pdf/__tests__/organize.test.ts`

**Interfaces:**

```ts
export async function mergePdfs(inputs: PdfInput[]): Promise<Uint8Array>;
export async function extractPdfPages(input: PdfInput, pages: number[]): Promise<Uint8Array>;
export async function organizePdfPages(input: PdfInput, pages: Array<{ index: number; rotation: 0 | 90 | 180 | 270 }>): Promise<Uint8Array>;
```

- [ ] Write failing tests asserting output page order, count, rotation, metadata preservation policy, and rejection of duplicate/out-of-range selections.
- [ ] Implement with `PDFDocument.load`, `copyPages`, `addPage`, and normalized rotations.
- [ ] Reopen every output with `PDFDocument.load` and assert its real page model.
- [ ] Commit with `feat(pdf): add document organization operations`.

### Task 3: Image conversion and annotations

**Files:**
- Create: `src/lib/pdf/render.ts`
- Create: `src/lib/pdf/create.ts`
- Create: `src/lib/pdf/annotate.ts`
- Create: `src/lib/pdf/__tests__/render-create-annotate.test.ts`

**Interfaces:**

```ts
export async function imagesToPdf(images: Array<{ bytes: Uint8Array; mime: 'image/png' | 'image/jpeg'; name: string }>): Promise<Uint8Array>;
export async function pdfToImages(input: PdfInput, options: { format: 'png' | 'jpeg'; scale: number; quality: number }): Promise<Array<{ name: string; bytes: Uint8Array }>>;
export async function addPdfWatermark(input: PdfInput, options: { text: string; opacity: number; rotation: number; fontSize: number }): Promise<Uint8Array>;
export async function addPdfPageNumbers(input: PdfInput, options: { start: number; position: 'bottom-left' | 'bottom-center' | 'bottom-right' }): Promise<Uint8Array>;
```

- [ ] Write failing artifact tests for dimensions, image count, watermark text operators, and page-number range.
- [ ] Implement image embedding, PDF.js canvas rendering, and annotation placement with bounded options.
- [ ] Run artifact tests; expect generated files to decode successfully.
- [ ] Commit with `feat(pdf): add conversion and annotation operations`.

### Task 4: Reusable PDF interface shell

**Files:**
- Create: `src/components/tools/pdf/PdfToolShell.tsx`
- Create: `src/components/tools/pdf/FileDropzone.tsx`
- Create: `src/components/tools/pdf/ProcessingStatus.tsx`
- Create: `src/components/tools/pdf/usePdfJob.ts`
- Create: `src/components/tools/pdf/__tests__/PdfToolShell.test.tsx`

**Interfaces:**

```ts
export interface PdfJobResult { filename: string; mime: 'application/pdf' | 'application/zip'; bytes: Uint8Array; }
export function usePdfJob(run: (signal: AbortSignal) => Promise<PdfJobResult>): { status: 'idle' | 'running' | 'success' | 'error'; start(): Promise<void>; cancel(): void; reset(): void; result?: PdfJobResult; error?: string; };
```

- [ ] Write failing keyboard, validation, progress, cancel, retry, download, URL-revocation, and accessible-live-region tests.
- [ ] Implement one state transition per action and keep the source file after recoverable errors.
- [ ] Run shell tests and axe checks; expect PASS.
- [ ] Commit with `feat(pdf): add accessible pdf tool shell`.

### Task 5: Eight PDF route adapters and registry content

**Files:**
- Create: `src/components/tools/pdf/MergePdf.tsx`
- Create: `src/components/tools/pdf/SplitPdf.tsx`
- Create: `src/components/tools/pdf/OrganizePdf.tsx`
- Create: `src/components/tools/pdf/RotatePdf.tsx`
- Create: `src/components/tools/pdf/ImagesToPdf.tsx`
- Create: `src/components/tools/pdf/PdfToImages.tsx`
- Create: `src/components/tools/pdf/WatermarkPdf.tsx`
- Create: `src/components/tools/pdf/PageNumbersPdf.tsx`
- Modify: `src/data/tools/registry.ts`
- Modify: `src/pages/[lang]/tools/[slug].astro`
- Create: `src/components/tools/pdf/__tests__/pdf-tools.test.tsx`

- [ ] Add failing route/component tests for all eight slugs and their primary action.
- [ ] Implement thin adapters over the pure operations and reusable shell.
- [ ] Add complete interface and help content for all 12 priority languages. Registry completeness tests must reject the cluster if any title, description, instruction, example, limitation, privacy note, validation message, or FAQ is missing.
- [ ] Run PDF unit/component tests, full verification, and browser download tests on desktop and 390px mobile.
- [ ] Commit each logical pair, ending with `feat(pdf): publish first pdf tool cluster`.

### Task 6: PDF privacy and performance verification

**Files:**
- Create: `tests/e2e/pdf-tools.spec.ts`
- Modify: Lighthouse configuration introduced by the growth verification plan.

- [ ] Intercept all requests and fail if a selected local file’s bytes or filename appear in a request.
- [ ] Test a 50 MB fixture, cancellation, repeated downloads, and memory cleanup.
- [ ] Verify PDF libraries are absent from the tool hub and text-tool route bundles.
- [ ] Run `npm run verify && npm run test:e2e -- pdf-tools && npm run lighthouse`.
- [ ] Commit with `test(pdf): verify privacy and performance`.
