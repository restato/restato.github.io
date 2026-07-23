import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import * as translationModule from '../useTranslation';
import LocalizedToolIsland from '../../components/tools/LocalizedToolIsland';

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

  it.each([
    ['image-converter', '이미지 파일 선택'],
    ['image-resizer', '이미지 파일 선택'],
    ['exif', '이미지 파일 선택'],
    ['background-remover', '이미지 파일 선택'],
    ['image-metadata', '이미지 파일 선택'],
    ['appstore-screenshot', '이미지 파일 선택'],
    ['percent', '계산 유형'],
    ['discount', '원래 가격'],
    ['dday', '이벤트 이름'],
    ['dutch-pay', '총 금액'],
    ['coin-flip', '동전 던지기'],
    ['dice', '주사위 종류'],
    ['kor-eng', '변환 결과'],
  ] as const)('does not leak Korean UI from %s into English or Japanese SSR', (slug, koreanUi) => {
    for (const lang of ['en', 'ja'] as const) {
      const html = renderToString(<LocalizedToolIsland slug={slug} lang={lang} />);
      expect(html, `${slug}/${lang}`).not.toContain(koreanUi);
    }
  });

  it.each([
    'image-converter', 'image-resizer', 'exif', 'background-remover', 'image-metadata',
    'appstore-screenshot', 'percent', 'discount', 'dday', 'dutch-pay', 'coin-flip', 'dice',
  ] as const)('renders the complete initial %s island without Hangul in English fallback', (slug) => {
    expect(renderToString(<LocalizedToolIsland slug={slug} lang="fr" />), slug).not.toMatch(/[가-힣]/);
  });

  it('describes coin-flip randomness truthfully in English fallback', () => {
    const html = renderToString(<LocalizedToolIsland slug="coin-flip" lang="fr" />);
    expect(html).not.toMatch(/cryptographically secure/i);
    expect(html).toMatch(/not for security or gambling decisions/i);
  });
});
