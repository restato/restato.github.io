import { readFileSync } from 'node:fs';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import tailwindConfig from '../../../tailwind.config.mjs';
// @ts-expect-error jsdom does not publish TypeScript declarations.
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, it } from 'vitest';

const read = (file: string) => readFileSync(file, 'utf8');
let compiledGlobalCss = '';

const directPageTemplates = [
  'src/pages/blog/index.astro',
  'src/pages/blog/[...slug].astro',
  'src/pages/blog/tag/[tag].astro',
  'src/pages/articles/index.astro',
  'src/pages/articles/admin.astro',
  'src/pages/dashboard.astro',
  'src/pages/jobs/index.astro',
  'src/pages/llm-wiki/index.astro',
  'src/pages/content-os.astro',
  'src/pages/anonymous-chat.astro',
  'src/pages/[lang]/anonymous-chat.astro',
  'src/pages/projects/pastedock.astro',
  'src/pages/projects/pastedock/pricing.astro',
  'src/pages/projects/pastedock/privacy.astro',
  'src/pages/projects/pastedock/refund.astro',
  'src/pages/projects/pastedock/terms.astro',
];

const policyRoutes = [
  'src/pages/[lang]/about.astro',
  'src/pages/[lang]/contact.astro',
  'src/pages/[lang]/privacy.astro',
  'src/pages/[lang]/terms.astro',
  'src/pages/[lang]/disclaimer.astro',
];

const widePages = [
  'src/pages/articles/index.astro',
  'src/pages/articles/admin.astro',
  'src/pages/dashboard.astro',
  'src/pages/jobs/index.astro',
  'src/pages/llm-wiki/index.astro',
  'src/pages/content-os.astro',
];

const readingRegions: Array<[string, RegExp]> = [
  ['src/components/SitePolicyPage.astro', /<article[^>]*class="[^"]*\bfc-prose\b[^"]*"/],
  ['src/pages/blog/[...slug].astro', /<(?:article|div)[^>]*class="[^"]*\bfc-prose\b[^"]*"/],
  ['src/pages/projects/pastedock/privacy.astro', /<article[^>]*class="[^"]*\bfc-prose\b[^"]*"/],
  ['src/pages/projects/pastedock/refund.astro', /<article[^>]*class="[^"]*\bfc-prose\b[^"]*"/],
  ['src/pages/projects/pastedock/terms.astro', /<article[^>]*class="[^"]*\bfc-prose\b[^"]*"/],
];

const pageChromeComponents = [
  ...directPageTemplates,
  'src/components/SitePolicyPage.astro',
  'src/components/articles/ArticleAggregator.tsx',
  'src/components/articles/ArticleAdmin.tsx',
  'src/components/dashboard/ExchangeRatesPanel.tsx',
  'src/components/jobs/JobsAggregator.tsx',
  'src/components/llm-wiki/LlmWikiExperience.tsx',
  'src/components/llm-wiki/OkfExplorer.tsx',
  'src/components/llm-wiki/OpenWikiTerminal.tsx',
  'src/components/llm-wiki/PresentationControls.tsx',
  'src/components/llm-wiki/RagComparison.tsx',
  'src/components/llm-wiki/ScenarioSwitcher.tsx',
  'src/components/llm-wiki/SourceWorkbench.tsx',
];

const oldPresentationClass =
  /\b(?:gradient-text|gradient-bg|bg-gradient-[\w-]+|backdrop-blur[\w-]*|hover:-?translate-[xy]?-[\w./[\]-]+|hover:shadow[\w-]*|group-hover:scale-[\w-]+)\b/;

describe('Modern Restato public page contract', () => {
  beforeAll(async () => {
    const from = 'src/styles/global.css';
    compiledGlobalCss = (
      await postcss([
        tailwindcss({
          ...tailwindConfig,
          content: [{
            raw: '<main class="block fc-prose prose prose-lg dark:prose-invert"></main>',
            extension: 'html',
          }],
        }),
      ]).process(read(from), { from })
    ).css;
  }, 10_000);

  it('routes every public template through the shared site layout', () => {
    for (const file of directPageTemplates) {
      expect.soft(read(file), file).toMatch(/import MainLayout from ['"][^'"]+MainLayout\.astro['"]/);
    }

    for (const file of policyRoutes) {
      expect.soft(read(file), file).toMatch(/import SitePolicyPage from ['"][^'"]+SitePolicyPage\.astro['"]/);
    }

    expect(read('src/components/SitePolicyPage.astro')).toMatch(
      /import MainLayout from ['"][^'"]+MainLayout\.astro['"]/,
    );
  });

  it('gives data-heavy public applications the wide PageShell', () => {
    for (const file of widePages) {
      const source = read(file);
      expect.soft(source, `${file} imports PageShell`).toMatch(
        /import PageShell from ['"][^'"]+PageShell\.astro['"]/,
      );
      expect.soft(source, `${file} renders the wide shell`).toMatch(
        /<PageShell\b[^>]*\bsize="wide"[^>]*>/,
      );
    }
  });

  it('places long-form copy in an element-scoped 68ch prose region', () => {
    for (const [file, region] of readingRegions) {
      expect.soft(read(file), file).toMatch(region);
    }
  });

  it('keeps Modern Restato editorial rules winning in the compiled prose cascade', () => {
    const document = new JSDOM(`
      <style>${compiledGlobalCss}</style>
      <main class="fc-prose prose prose-lg dark:prose-invert">
        <a id="editorial-link" href="#">Link</a>
        <p><code id="inline-code">inline</code></p>
        <pre id="code-block"><code id="block-code">block</code></pre>
        <blockquote id="editorial-quote">Quote</blockquote>
      </main>
    `).window.document;
    const style = (selector: string) => document.defaultView!.getComputedStyle(
      document.querySelector(selector)!,
    );

    expect.soft(style('main').maxInlineSize, 'reading measure').toBe('68ch');
    expect.soft(style('#editorial-link').color, 'brand link color').toBe('var(--brand)');
    expect.soft(style('#editorial-link').textUnderlineOffset, 'brand link underline').toBe('0.18em');
    expect.soft(style('#inline-code').color, 'semantic inline code').toBe('var(--accent)');
    expect.soft(style('#inline-code').padding, 'compact inline code').toBe('0.12rem 0.35rem');
    expect.soft(style('#code-block').background, 'semantic code surface').toBe('var(--surface-soft)');
    expect.soft(style('#block-code').color, 'code block inherits semantic text').toBe('inherit');
    expect.soft(style('#editorial-quote').backgroundColor, 'soft blockquote surface').toBe('var(--surface-soft)');
    expect.soft(style('#editorial-quote').padding, 'blockquote spacing').toBe('1rem 1.25rem');
  });

  it('keeps legacy gradients, glass, and hover-lift out of page chrome', () => {
    for (const file of pageChromeComponents) {
      expect.soft(read(file), file).not.toMatch(oldPresentationClass);
    }

    const llmWikiCss = read('src/styles/llm-wiki.css');
    for (const selector of ['.llmw-hero-grid', '.llmw-adoption-card']) {
      const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rule = llmWikiCss.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
      expect.soft(rule, `${selector} outer UI`).not.toMatch(/(?:linear|radial|conic)-gradient\(/);
    }
  });

  it('keeps LLM Wiki surrounding chrome inside the Modern Restato contract', () => {
    const llmWikiCss = read('src/styles/llm-wiki.css');
    const ruleFor = (selector: string) => {
      const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return llmWikiCss.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
    };

    expect(llmWikiCss).not.toMatch(/(?:linear|radial|conic)-gradient\(/);
    expect(llmWikiCss).not.toMatch(/font-family:\s*[^;]*(?:Georgia|Times New Roman|\bserif\b)/i);
    expect(llmWikiCss).not.toMatch(/@keyframes\b/);
    expect(llmWikiCss).not.toMatch(/(?:^|[;{]\s*)animation\s*:/m);

    for (const selector of [
      '.llmw-topbar',
      '.llmw-hero-instrument',
      '.llmw-presentation-controls',
      '.llmw-adoption-card',
      '.llmw-footer-mark',
    ]) {
      const rule = ruleFor(selector);
      expect.soft(rule, `${selector} semantic surface`).toMatch(
        /background:\s*var\(--(?:surface-raised|surface-soft|llmw-panel-solid)\)/,
      );
      expect.soft(rule, `${selector} 6-10px geometry`).toMatch(
        /border-radius:\s*(?:0\.375|0\.5|0\.625)rem/,
      );
    }

    expect(ruleFor('.llmw-brand > span:first-child')).toMatch(/border-radius:\s*0\.375rem/);
    expect(ruleFor('.llmw-footer-mark')).not.toMatch(/border-radius:\s*50%/);
    expect(ruleFor('.llmw-primary-link,\n.llmw-adoption-actions a:first-child'))
      .toMatch(/color:\s*var\(--on-brand\)\s*!important/);
    expect(ruleFor('.llmw-presentation-controls > button[aria-pressed]'))
      .toMatch(/color:\s*var\(--on-brand\)/);
  });

  it('keeps Korean discovery headers localized', () => {
    expect(read('src/pages/articles/index.astro')).not.toContain('Discovery desk');
    expect(read('src/pages/jobs/index.astro')).not.toContain('Career board');
  });

  it('marks the article title as the current breadcrumb page', () => {
    const blogPost = read('src/pages/blog/[...slug].astro');
    expect(blogPost).toMatch(/<li><a href="\/blog">Blog<\/a><\/li>/);
    expect(blogPost).toMatch(/<li aria-current="page">\{post\.data\.title\}<\/li>/);
    expect(blogPost).toContain('type="article"');
    expect(blogPost).toContain('publishedTime={post.data.date}');
  });

  it('uses shared controls and surfaces on dense application chrome', () => {
    const articleFeed = read('src/components/articles/ArticleAggregator.tsx');
    const articleAdmin = read('src/components/articles/ArticleAdmin.tsx');
    const dashboard = read('src/components/dashboard/ExchangeRatesPanel.tsx');
    const jobs = read('src/components/jobs/JobsAggregator.tsx');
    const presentationControls = read('src/components/llm-wiki/PresentationControls.tsx');

    expect(articleFeed).toMatch(/className="[^"]*\bfc-surface\b/);
    expect(articleFeed).toMatch(/className="[^"]*\bfc-button\b/);
    expect(articleAdmin).toMatch(/className="[^"]*\bfc-input\b/);
    expect(articleAdmin).toMatch(/className="[^"]*\bfc-button\b/);
    expect(dashboard).toMatch(/className="[^"]*\bfc-button\b/);
    expect(jobs).toMatch(/className="[^"]*\bfc-surface\b/);
    expect(presentationControls).toMatch(/className="[^"]*\bfc-surface\b/);
  });
});
