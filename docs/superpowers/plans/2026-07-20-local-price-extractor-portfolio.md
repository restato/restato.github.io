# Local Price Extractor Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an honest, installable Local Price Extractor case study in the Restato project catalog.

**Architecture:** Keep the existing typed project-card array and Astro file-based project routes. Add one catalog record and one static detail page using `MainLayout`, schema.org metadata, CSS-only diagrams, and the site's existing Tailwind/CSS-variable visual language.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS 3, Vitest 4, GitHub Pages

## Global Constraints

- Present the product as `Experimental Prototype`, not a production Chrome Web Store release.
- State that the prototype has no backend and no remote scripts, and processes captured content in the user's Chrome environment.
- State that Korean extraction is experimental and is not a production reliability guarantee.
- Do not claim official support for Naver or any retailer.
- Use `https://github.com/restato/local-price-extractor` as the only product call-to-action URL.
- Do not add dependencies, runtime JavaScript, remote assets, or a content-collection refactor.
- Preserve two-space indentation, semicolons, and single quotes in TypeScript.
- Treat the pre-existing full-suite result of 131 failures out of 242 tests as an unrelated baseline; require focused project tests and the production build to pass.

---

### Task 1: Register the project in the catalog

**Files:**
- Modify: `src/data/projects.test.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/pages/projects/index.astro`

**Interfaces:**
- Consumes: existing exported `projects: ProjectCard[]`
- Produces: a `ProjectCard` with slug `local-price-extractor`, consumed by the existing project grid

- [ ] **Step 1: Write the failing catalog test**

Add these tests to `src/data/projects.test.ts`:

```ts
it('publishes Local Price Extractor as an experimental public project', () => {
  const extractor = projects.find((project) => project.slug === 'local-price-extractor');

  expect(extractor).toMatchObject({
    title: 'Local Price Extractor',
    description: "Extract product prices locally with Chrome's built-in AI—no shopping-page backend required.",
    icon: '🏷️',
    badge: 'EXPERIMENTAL',
    color: 'from-amber-500 to-orange-500',
  });
});

it('includes Local Price Extractor in the project catalog metadata', () => {
  const source = readFileSync(join(process.cwd(), 'src/pages/projects/index.astro'), 'utf8');

  expect(source).toContain('including Local Price Extractor');
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npx vitest run src/data/projects.test.ts
```

Expected: FAIL because `local-price-extractor` is absent and the projects-page description does not mention it.

- [ ] **Step 3: Add the catalog metadata**

Insert this record at the beginning of `projects` in `src/data/projects.ts`:

```ts
{
  slug: 'local-price-extractor',
  title: 'Local Price Extractor',
  description: "Extract product prices locally with Chrome's built-in AI—no shopping-page backend required.",
  icon: '🏷️',
  color: 'from-amber-500 to-orange-500',
  badge: 'EXPERIMENTAL',
},
```

Change the `pageDescription` string in `src/pages/projects/index.astro` to:

```ts
const pageDescription = "A collection of personal projects, practical apps, and tools including Local Price Extractor, RoomFit 3D, PasteDock, Quick Issue, JobWorld Kids Planner, and mini games.";
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
npx vitest run src/data/projects.test.ts
```

Expected: 4 tests pass, 0 fail.

- [ ] **Step 5: Commit the catalog change**

```bash
git add src/data/projects.test.ts src/data/projects.ts src/pages/projects/index.astro
git commit -m "feat: list local price extractor project"
```

---

### Task 2: Publish the static project detail page

**Files:**
- Modify: `src/data/projects.test.ts`
- Create: `src/pages/projects/local-price-extractor.astro`

**Interfaces:**
- Consumes: `MainLayout` and the repository URL `https://github.com/restato/local-price-extractor`
- Produces: static route `/projects/local-price-extractor` with `SoftwareApplication` and `BreadcrumbList` JSON-LD

- [ ] **Step 1: Write the failing detail-page source test**

Add this test to `src/data/projects.test.ts`:

```ts
it('documents the Local Price Extractor install flow and experimental boundary', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/pages/projects/local-price-extractor.astro'),
    'utf8',
  );

  expect(source).toContain('Experimental Prototype');
  expect(source).toContain('2 accepted');
  expect(source).toContain('0 rejected');
  expect(source).toContain('chrome://extensions');
  expect(source).toContain('현재 페이지 분석');
  expect(source).toContain('Korean extraction is experimental');
  expect(source).toContain('https://github.com/restato/local-price-extractor');
  expect(source).toContain("'@type': 'SoftwareApplication'");
  expect(source).not.toContain('Open Live App');
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npx vitest run src/data/projects.test.ts
```

Expected: FAIL with `ENOENT` because `src/pages/projects/local-price-extractor.astro` does not exist.

- [ ] **Step 3: Create the page frontmatter and content model**

Create `src/pages/projects/local-price-extractor.astro` beginning with:

```astro
---
import MainLayout from '../../layouts/MainLayout.astro';

const pageTitle = 'Local Price Extractor | On-Device Chrome Price Extraction';
const pageDescription = "Extract product prices from the page you are viewing with Chrome's built-in AI, without sending the page to a backend.";
const repositoryUrl = 'https://github.com/restato/local-price-extractor';

const workflow = [
  {
    title: 'Capture a bounded page view',
    description: 'Read only a bounded representation of the active shopping page after the user starts an analysis.',
  },
  {
    title: 'Structure with on-device AI',
    description: "Ask Chrome's built-in model for schema-constrained product, price, shipping, and link data.",
  },
  {
    title: 'Validate against the source',
    description: 'Reject prices and URLs that cannot be found in the captured page instead of trusting model output blindly.',
  },
];

const installSteps = [
  'Download the repository ZIP from GitHub or clone the public repository.',
  'Open chrome://extensions and enable Developer mode.',
  'Choose Load unpacked and select the repository directory.',
  'Open a shopping page, click the extension, and select 현재 페이지 분석.',
];

const stack = [
  { label: 'Extension', value: 'Chrome Manifest V3, JavaScript' },
  { label: 'On-device model', value: 'Chrome LanguageModel API' },
  { label: 'Output controls', value: 'JSON Schema, source validation' },
  { label: 'Verification', value: 'Vitest, real Chrome fixture' },
];

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Local Price Extractor',
  description: pageDescription,
  applicationCategory: 'BrowserApplication',
  operatingSystem: 'Desktop Google Chrome',
  codeRepository: repositoryUrl,
  url: 'https://restato.github.io/projects/local-price-extractor',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://restato.github.io/' },
    { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://restato.github.io/projects/' },
    { '@type': 'ListItem', position: 3, name: 'Local Price Extractor', item: 'https://restato.github.io/projects/local-price-extractor' },
  ],
};
---
```

- [ ] **Step 4: Add the complete semantic page body**

Continue the same file with the following structure and exact required copy:

```astro
<MainLayout title={pageTitle} description={pageDescription} lang="en" lockLanguage={true}>
  <script type="application/ld+json" set:html={JSON.stringify(appSchema)} />
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />

  <section class="relative overflow-hidden py-16 px-4 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent">
    <div class="relative max-w-5xl mx-auto">
      <nav aria-label="Breadcrumb" class="mb-8 text-sm text-[var(--color-text-muted)] flex items-center gap-2">
        <a href="/" class="hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded">Home</a>
        <span aria-hidden="true">/</span>
        <a href="/projects" class="hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded">Projects</a>
        <span aria-hidden="true">/</span>
        <span class="text-[var(--color-text)]" aria-current="page">Local Price Extractor</span>
      </nav>

      <div class="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-5">
            <span class="text-4xl mr-1" aria-hidden="true">🏷️</span>
            <span class="px-3 py-1 text-sm font-medium rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-200">Experimental Prototype</span>
            <span class="px-3 py-1 text-sm font-medium rounded-full bg-orange-500/10 text-orange-800 dark:text-orange-200">On-Device AI</span>
            <span class="px-3 py-1 text-sm font-medium rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-200">No Backend</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-5">Local Price Extractor</h1>
          <p class="text-xl md:text-2xl leading-relaxed text-[var(--color-text-muted)] mb-8">
            Extract product prices from the page you are viewing with Chrome's built-in AI, without sending the page to a backend.
          </p>
          <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-lg shadow-orange-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500">
            View on GitHub <span class="ml-2" aria-hidden="true">↗</span>
          </a>
        </div>

        <div class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-xl" aria-label="Local extraction flow preview">
          <div class="rounded-xl border border-[var(--color-border)] p-4 mb-3">
            <p class="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-2">Active shopping page</p>
            <div class="h-3 w-4/5 rounded bg-[var(--color-border)] mb-2"></div>
            <div class="h-3 w-2/5 rounded bg-amber-500/50"></div>
          </div>
          <div class="flex items-center justify-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-300 py-2">
            <span>Chrome on-device AI</span><span aria-hidden="true">↓</span>
          </div>
          <div class="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 font-mono text-sm">
            <p>{`{ "title": "Product",`}</p>
            <p class="pl-4">{`"price": 29900 }`}</p>
          </div>
        </div>
      </div>

      <div class="grid sm:grid-cols-3 gap-3 mt-10">
        <div class="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"><p class="text-xs uppercase text-[var(--color-text-muted)] mb-1">Platform</p><p class="font-semibold">Chrome Extension</p></div>
        <div class="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"><p class="text-xs uppercase text-[var(--color-text-muted)] mb-1">Processing</p><p class="font-semibold">Inside the browser</p></div>
        <div class="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"><p class="text-xs uppercase text-[var(--color-text-muted)] mb-1">Tested fixture</p><p class="font-semibold">2 accepted · 0 rejected</p></div>
      </div>
    </div>
  </section>

  <section class="py-16 px-4">
    <div class="max-w-5xl mx-auto">
      <p class="text-sm font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-300 mb-3">How it works</p>
      <h2 class="text-3xl md:text-4xl font-bold mb-8">Model output is only the first draft</h2>
      <div class="grid md:grid-cols-3 gap-6">
        {workflow.map((item, index) => (
          <article class="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold mb-5">{index + 1}</div>
            <h3 class="text-xl font-semibold mb-2">{item.title}</h3>
            <p class="leading-relaxed text-[var(--color-text-muted)]">{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>

  <section class="py-16 px-4 border-y border-[var(--color-border)] bg-[var(--color-card)]/30">
    <div class="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-300 mb-3">Install and try</p>
        <h2 class="text-3xl font-bold mb-6">Load it directly from GitHub</h2>
        <ol class="space-y-4">
          {installSteps.map((step, index) => (
            <li class="flex gap-4"><span class="shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold">{index + 1}</span><span class="pt-1 leading-relaxed">{step}</span></li>
          ))}
        </ol>
        <p class="mt-6 text-sm text-[var(--color-text-muted)]">The first analysis can trigger an on-device model download. Progress appears in the extension popup.</p>
      </div>
      <aside class="p-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 self-start">
        <h2 class="text-2xl font-bold mb-3">Privacy boundary and limits</h2>
        <p class="mb-4">The prototype has no backend and includes no remote scripts. Captured page content is processed inside the user's Chrome environment.</p>
        <p class="mb-4">Korean extraction is experimental because Korean is not currently an officially supported Prompt API language. The tested result is not a production reliability guarantee.</p>
        <p class="text-[var(--color-text-muted)]">Desktop Chrome must expose the built-in Prompt API and meet its on-device model hardware and storage requirements.</p>
      </aside>
    </div>
  </section>

  <section class="py-16 px-4">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold mb-8">Implementation evidence</h2>
      <div class="grid sm:grid-cols-2 gap-4 mb-10">
        {stack.map((item) => (
          <div class="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"><p class="text-sm uppercase tracking-wide text-[var(--color-text-muted)] mb-2">{item.label}</p><p class="font-semibold text-lg">{item.value}</p></div>
        ))}
      </div>
      <div class="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div><h2 class="text-2xl font-bold mb-2">Inspect the prototype</h2><p class="text-orange-50">Read the source, run the tests, and load the unpacked extension in Chrome.</p></div>
        <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" class="inline-flex shrink-0 items-center justify-center px-5 py-3 rounded-xl bg-white text-orange-800 hover:bg-amber-50 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600">Open GitHub repository</a>
      </div>
    </div>
  </section>
</MainLayout>
```

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

```bash
npx vitest run src/data/projects.test.ts
```

Expected: 5 tests pass, 0 fail.

- [ ] **Step 6: Commit the detail page**

```bash
git add src/data/projects.test.ts src/pages/projects/local-price-extractor.astro
git commit -m "feat: add local price extractor case study"
```

---

### Task 3: Verify the published artifact and responsive page

**Files:**
- Verify: `dist/projects/local-price-extractor/index.html`
- Verify: `dist/sitemap-projects.xml`
- Create: `artifacts/local-price-extractor-desktop.png`
- Create: `artifacts/local-price-extractor-mobile.png`

**Interfaces:**
- Consumes: the Astro route and existing sitemap generator
- Produces: build evidence and PR-ready desktop/mobile screenshots

- [ ] **Step 1: Run the focused test once more**

Run:

```bash
npx vitest run src/data/projects.test.ts
```

Expected: 5 tests pass, 0 fail.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: exit 0 and the route list contains `/projects/local-price-extractor/index.html`.

- [ ] **Step 3: Verify generated page and sitemap contents**

Run:

```bash
test -f dist/projects/local-price-extractor/index.html
rg -n "Experimental Prototype|2 accepted|chrome://extensions" dist/projects/local-price-extractor/index.html
rg -n "projects/local-price-extractor" dist/sitemap-projects.xml
```

Expected: all commands exit 0 and print matching page/sitemap content.

- [ ] **Step 4: Preview and capture responsive screenshots**

Run `npm run preview -- --host 127.0.0.1`, then use browser verification to open `http://127.0.0.1:4321/projects/local-price-extractor/`. Capture the complete page at a desktop viewport near 1440×1000 and a mobile viewport near 390×844 as:

```text
artifacts/local-price-extractor-desktop.png
artifacts/local-price-extractor-mobile.png
```

Expected: both screenshots show the full hero, readable cards and calls to action, no horizontal overflow, and no clipped install steps.

- [ ] **Step 5: Perform accessibility and link checks**

Confirm in the browser that:

```text
- Tab reaches Home, Projects, View on GitHub, and Open GitHub repository with a visible focus ring.
- Heading order is one h1 followed by section h2 elements and workflow h3 elements.
- Both external links resolve to https://github.com/restato/local-price-extractor.
- The layout remains readable with prefers-reduced-motion enabled because no required information depends on animation.
```

- [ ] **Step 6: Check the final diff and repository state**

Run:

```bash
git diff origin/master...HEAD --check
git status --short --branch
```

Expected: no whitespace errors; only the intended documentation, catalog, test, detail page, and screenshot artifacts differ from `origin/master`.
