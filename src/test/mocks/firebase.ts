import { vi } from 'vitest';

type JsonObject = Record<string, any>;

let mockDatabase: JsonObject = {};
const subscriptions = new Map<string, Set<(snapshot: ReturnType<typeof snapshotFor>) => void>>();

function pathParts(path: string): string[] {
  return path.split('/').filter(Boolean);
}

function getData(path: string): any {
  return pathParts(path).reduce<any>((current, part) => current?.[part], mockDatabase);
}

function setData(path: string, value: any): void {
  const parts = pathParts(path);
  if (parts.length === 0) {
    mockDatabase = value;
    return;
  }

  let current = mockDatabase;
  for (const part of parts.slice(0, -1)) {
    current[part] ??= {};
    current = current[part];
  }
  current[parts.at(-1)!] = value;
}

function removeData(path: string): void {
  const parts = pathParts(path);
  if (parts.length === 0) {
    mockDatabase = {};
    return;
  }

  const parent = parts.slice(0, -1).reduce<any>((current, part) => current?.[part], mockDatabase);
  if (parent && typeof parent === 'object') {
    delete parent[parts.at(-1)!];
  }
}

function snapshotFor(path: string) {
  const data = getData(path);
  return {
    exists: () => data !== undefined,
    val: () => data,
  };
}

function notify(path: string): void {
  for (const [subscriptionPath, callbacks] of subscriptions) {
    if (path === subscriptionPath || path.startsWith(`${subscriptionPath}/`) || subscriptionPath.startsWith(`${path}/`)) {
      const snapshot = snapshotFor(subscriptionPath);
      callbacks.forEach((callback) => callback(snapshot));
    }
  }
}

export const mockApp = {};

export const get = vi.fn((ref: any) => Promise.resolve(snapshotFor(ref._path)));

export const set = vi.fn((ref: any, value: any) => {
  setData(ref._path, value);
  notify(ref._path);
  return Promise.resolve();
});

export const push = vi.fn((ref: any) => {
  const key = `mock-key-${Date.now()}-${Math.random()}`;
  return { _path: `${ref._path}/${key}`, key };
});

export const remove = vi.fn((ref: any) => {
  removeData(ref._path);
  notify(ref._path);
  return Promise.resolve();
});

export const runTransaction = vi.fn(async (ref: any, update: (current: any) => any) => {
  const next = update(getData(ref._path));
  if (next === undefined) {
    return { committed: false, snapshot: snapshotFor(ref._path) };
  }

  setData(ref._path, next);
  notify(ref._path);
  return { committed: true, snapshot: snapshotFor(ref._path) };
});

export const onValue = vi.fn((ref: any, callback: (snapshot: ReturnType<typeof snapshotFor>) => void) => {
  const callbacks = subscriptions.get(ref._path) ?? new Set();
  callbacks.add(callback);
  subscriptions.set(ref._path, callbacks);
  callback(snapshotFor(ref._path));

  return vi.fn(() => {
    callbacks.delete(callback);
    if (callbacks.size === 0) subscriptions.delete(ref._path);
  });
});

export const ref = vi.fn((_: any, path = '') => ({ _path: path }));
export const getDatabase = vi.fn(() => ({}));
export const initializeApp = vi.fn(() => mockApp);

export const resetMockDatabase = () => {
  mockDatabase = {};
  subscriptions.clear();
};

export const setMockData = (path: string, data: any) => {
  setData(path, data);
  notify(path);
};

export const getMockData = (path: string) => getData(path);
