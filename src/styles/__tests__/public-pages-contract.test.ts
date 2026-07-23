import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (file: string) => readFileSync(file, 'utf8');

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
  'src/components/llm-wiki/PresentationControls.tsx',
];

const oldPresentationClass =
  /\b(?:gradient-text|gradient-bg|bg-gradient-[\w-]+|backdrop-blur[\w-]*|hover:-?translate-[xy]?-[\w./[\]-]+|hover:shadow[\w-]*|group-hover:scale-[\w-]+)\b/;

describe('Forest Café public page contract', () => {
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

  it('keeps legacy gradients, glass, and hover-lift out of page chrome', () => {
    for (const file of pageChromeComponents) {
      expect.soft(read(file), file).not.toMatch(oldPresentationClass);
    }
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
