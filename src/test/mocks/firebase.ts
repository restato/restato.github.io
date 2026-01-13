import { vi } from 'vitest';

// Mock database structure
let mockDatabase: Record<string, any> = {};

// Mock Firebase App
export const mockApp = {};

// Mock Database functions
export const get = vi.fn((ref: any) => {
  const path = ref._path;
  const data = mockDatabase[path];

  return Promise.resolve({
    exists: () => data !== undefined,
    val: () => data,
  });
});

export const set = vi.fn((ref: any, value: any) => {
  const path = ref._path;
  mockDatabase[path] = value;
  return Promise.resolve();
});

export const push = vi.fn((ref: any) => {
  const path = ref._path;
  const key = `mock-key-${Date.now()}-${Math.random()}`;
  const newRef = { _path: `${path}/${key}`, key };
  return newRef;
});

export const remove = vi.fn((ref: any) => {
  const path = ref._path;
  delete mockDatabase[path];
  return Promise.resolve();
});

export const onValue = vi.fn((ref: any, callback: Function) => {
  const path = ref._path;

  // Immediately call callback with current value
  callback({
    exists: () => mockDatabase[path] !== undefined,
    val: () => mockDatabase[path],
  });

  // Return unsubscribe function
  return vi.fn();
});

export const ref = vi.fn((db: any, path?: string) => {
  return {
    _path: path || '',
  };
});

export const getDatabase = vi.fn(() => ({}));

export const initializeApp = vi.fn(() => mockApp);

// Helper function to reset mock database
export const resetMockDatabase = () => {
  mockDatabase = {};
};

// Helper function to set mock data
export const setMockData = (path: string, data: any) => {
  mockDatabase[path] = data;
};

// Helper function to get mock data
export const getMockData = (path: string) => {
  return mockDatabase[path];
};
