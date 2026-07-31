import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildLanguageUrl, localizedRouteFamilies, supportsLanguageRouting } from '../src/i18n/urlUtils';

const read = (path: string) => readFileSync(path, 'utf8');

describe('merge-review locale contracts', () => {
  it('uses one shared localized-route family list for server and header runtime routing', () => {
    expect(localizedRouteFamilies).toEqual(expect.arrayContaining([
      '/', '/tools', '/anonymous-chat', '/games',
      '/about', '/contact', '/privacy', '/terms', '/disclaimer',
    ]));
    for (const family of localizedRouteFamilies) {
      expect(supportsLanguageRouting(family)).toBe(true);
      expect(buildLanguageUrl(family, 'fr')).toBe(family === '/games' ? '/en/games' : `/fr${family}`);
    }

    const header = read('src/components/Header.astro');
    expect(header).toContain('localizedRouteFamilies');
    expect(header).not.toContain("const langSupportedPaths = ['/', '/tools', '/anonymous-chat', '/games']");
  });

  it('locks all English-only Quick Issue and PasteDock pages', () => {
    const pages = [
      'src/pages/projects/quick-issue.astro',
      'src/pages/projects/pastedock.astro',
      'src/pages/projects/pastedock/pricing.astro',
      'src/pages/projects/pastedock/privacy.astro',
      'src/pages/projects/pastedock/refund.astro',
      'src/pages/projects/pastedock/terms.astro',
    ];
    for (const page of pages) {
      expect(read(page)).toMatch(/<MainLayout[^>]*lang="en"[^>]*lockLanguage=\{true\}/);
    }

    const matrix = read('tests/e2e/modern-restato-routes.ts');
    expect(matrix).toMatch(/id: 'project-quick-issue',[\s\S]*?locale: 'en'/);
  });

  it('gates MainLayout skip-link storage and event synchronization behind lockLanguage', () => {
    const layout = read('src/layouts/MainLayout.astro');
    expect(layout).toContain('data-lock-language={lockLanguage');
    expect(layout).toContain('if (lockLanguage) return');
  });
});

describe('merge-review interactive color contracts', () => {
  const files = [
    'src/components/tools/TimerStopwatch.tsx',
    'src/components/games/roulette/EventRoulette.tsx',
    'src/components/games/BingoGame.tsx',
    'src/components/games/LadderGame.tsx',
    'src/components/tools/AppStoreScreenshotResizer.tsx',
  ];

  it.each(files)('%s has no legacy saturated green/yellow/blue/red plus white state override', (file) => {
    expect(read(file)).not.toMatch(/bg-(?:green|yellow|blue|red)-(?:[3-7]00)[^"'`\n]*text-white/);
  });

  it('uses sibling native buttons for screenshot selection/removal and D-Day loading/deletion', () => {
    const screenshots = read('src/components/tools/AppStoreScreenshotResizer.tsx');
    const dday = read('src/components/tools/DdayCalculator.tsx');
    expect(screenshots).toContain("ko: `이미지 ${idx + 1} 선택`");
    expect(screenshots).toContain("en: `Select image ${idx + 1}`");
    expect(screenshots).toContain("ja: `画像 ${idx + 1} を選択`");
    expect(screenshots).toContain("ko: `이미지 ${idx + 1} 제거`");
    expect(screenshots).toContain("en: `Remove image ${idx + 1}`");
    expect(screenshots).toContain("ja: `画像 ${idx + 1} を削除`");
    expect(screenshots).not.toContain('onClick={() => setActiveImageIndex(idx)}\n                >');
    expect(dday).toContain('aria-label={t({ ko: `${dday.name} 불러오기`');
    expect(dday).toMatch(/<button[\s\S]*?aria-label=\{t\(\{ ko: `\$\{dday\.name\} 불러오기`[\s\S]*?onClick=\{\(\) => loadDday/);
  });
});
