import { expect, type Page } from '@playwright/test';

const MAX_CAPTURED_EVENTS = 200;

interface ConsoleState {
  errors: string[];
  overflowed: boolean;
}

interface RequestState {
  requests: Array<{ url: string; method: string; postData: string | null }>;
  overflowed: boolean;
}

const consoleStates = new WeakMap<Page, ConsoleState>();
const requestStates = new WeakMap<Page, RequestState>();

function isBrowserExtensionNoise(sourceUrl?: string): boolean {
  // Browser extensions are outside this site. Ignore only errors whose source is
  // explicitly an extension URL, never message text that site code can imitate.
  return /^(chrome|moz)-extension:\/\//.test(sourceUrl ?? '');
}

function getConsoleState(page: Page): ConsoleState {
  const existing = consoleStates.get(page);
  if (existing) return existing;

  const state: ConsoleState = { errors: [], overflowed: false };
  const capture = (message: string, sourceUrl?: string) => {
    if (isBrowserExtensionNoise(sourceUrl)) return;
    if (state.errors.length === MAX_CAPTURED_EVENTS) {
      state.overflowed = true;
      return;
    }
    state.errors.push(message);
  };

  page.on('console', (message) => {
    if (message.type() === 'error') capture(message.text(), message.location().url);
  });
  // Playwright's pageerror Error has no verified source URL. Do not infer one
  // from its message or stack, because either can contain user-controlled text.
  page.on('pageerror', (error) => capture(error.message));
  consoleStates.set(page, state);
  return state;
}

function getRequestState(page: Page): RequestState {
  const existing = requestStates.get(page);
  if (existing) return existing;

  const state: RequestState = { requests: [], overflowed: false };
  page.on('request', (request) => {
    if (state.requests.length === MAX_CAPTURED_EVENTS) {
      state.overflowed = true;
      return;
    }
    state.requests.push({
      url: request.url(),
      method: request.method(),
      postData: request.postData(),
    });
  });
  requestStates.set(page, state);
  return state;
}

export function assertNoHorizontalOverflow(page: Page) {
  return expect.poll(() => page.evaluate(() => (
    document.documentElement.scrollWidth <= document.documentElement.clientWidth
  ))).toBe(true);
}

export function assertNoUnexpectedConsoleErrors(page: Page) {
  const state = getConsoleState(page);
  expect(state.overflowed, `Console collector exceeded ${MAX_CAPTURED_EVENTS} events`).toBe(false);
  expect(state.errors).toEqual([]);
}

export function assertNoContentUpload(page: Page, secrets: string[]) {
  const state = getRequestState(page);
  const checkedSecrets = secrets.filter(Boolean);
  expect(checkedSecrets, 'Pass a non-empty sentinel secret so content leaks fail closed').not.toEqual([]);
  expect(state.overflowed, `Request collector exceeded ${MAX_CAPTURED_EVENTS} events`).toBe(false);

  const uploads = state.requests.filter((request) => {
    const containsSecret = checkedSecrets.some((secret) => (
      request.url.includes(secret) || request.postData?.includes(secret)
    ));
    // A request body is an outbound content transfer. Catalog pages have no
    // legitimate body-bearing requests, so this intentionally fails closed.
    return containsSecret || Boolean(request.postData);
  });

  expect(uploads).toEqual([]);
}
