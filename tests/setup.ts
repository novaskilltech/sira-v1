import { afterEach, vi } from 'vitest';

// Restore browser API spies between tests, including intentionally failing storage.
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});
