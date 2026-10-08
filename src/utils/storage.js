/**
 * localStorage wrapper for Chaos Vault progress.
 * All access is try/caught — falls back to in-memory store on failure.
 */

const STORAGE_KEY = 'chaosVault.v1';

let memoryFallback = null;

function defaultData() {
  return { levels: {}, lastResult: null };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultData(), ...parsed };
    }
  } catch {
    /* fall through */
  }
  if (memoryFallback) return memoryFallback;
  return defaultData();
}

export function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    memoryFallback = data;
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  memoryFallback = null;
}
