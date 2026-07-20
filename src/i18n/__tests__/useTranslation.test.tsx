import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as translationModule from '../useTranslation';

function TranslationProbe() {
  const { lang, t } = translationModule.useTranslation();
  return <span data-lang={lang}>{t({ ko: '한국어', en: 'English', ja: '日本語' })}</span>;
}

describe('TranslationProvider SSR locale boundary', () => {
  it.each([
    ['ko', 'ko', '한국어'],
    ['en', 'en', 'English'],
    ['ja', 'ja', '日本語'],
    ['fr', 'en', 'English'],
    ['zh-CN', 'en', 'English'],
    ['zh-TW', 'en', 'English'],
    ['es', 'en', 'English'],
    ['pt', 'en', 'English'],
    ['de', 'en', 'English'],
    ['it', 'en', 'English'],
    ['id', 'en', 'English'],
    ['hi', 'en', 'English'],
  ] as const)('renders requested %s UI as %s in the initial server HTML', (requested, expectedLanguage, expectedCopy) => {
    const Provider = Reflect.get(translationModule, 'TranslationProvider');
    expect(Provider, 'TranslationProvider must define the SSR locale boundary').toBeTypeOf('function');

    const html = renderToString(
      <Provider initialLanguage={requested}>
        <TranslationProbe />
      </Provider>,
    );

    expect(html).toContain(`data-lang="${expectedLanguage}"`);
    expect(html).toContain(expectedCopy);
  });

  it('hydrates an English fallback island without changing its initial server markup', async () => {
    const Provider = Reflect.get(translationModule, 'TranslationProvider');
    const tree = (
      <Provider initialLanguage="fr">
        <TranslationProbe />
      </Provider>
    );
    const serverHtml = renderToString(tree);
    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    window.history.replaceState({}, '', '/fr/tools/json');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, tree);
    });

    expect(container.innerHTML).toBe(serverHtml);
    expect(consoleError.mock.calls.flat().join(' ')).not.toMatch(/hydration|did not match/i);
    await act(async () => root!.unmount());
    consoleError.mockRestore();
  });
});
