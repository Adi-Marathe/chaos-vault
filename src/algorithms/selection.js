/**
 * Selection Sort engine for Chaos Vault.
 *
 * State: { a: number[], i: number, done: boolean }
 * Actions: { type: 'pick', index: number }
 *
 * Valid only when index is the position of the minimum value in a[i..n-1].
 * It then swaps a[index] with a[i] and i++.
 * Done when i >= n - 1.
 */
import { mulberry32, uniqueRandomInts } from './rng.js';

const TILE_COUNT = 8;

export const meta = {
  id: 'selection',
  name: 'Selection Sort',
  concept:
    'Selection sort scans the unsorted zone for the minimum value and swaps it into the next sorted position.',
  learned:
    'Selection sort always does exactly n(n−1)/2 comparisons regardless of input order. Time complexity is O(n²), but it minimises the number of swaps to at most n − 1.',
  pseudocode: [
    'for i = 0 to n - 2:',
    '    minIdx = i',
    '    for j = i + 1 to n - 1:',
    '        if a[j] < a[minIdx]: minIdx = j',
    '    swap(a[i], a[minIdx])',
    '    // a[0..i] is now sorted',
  ],
  actions: [
    { type: 'pick', label: 'Pick Minimum', key: null, button: false },
  ],
};

/**
 * Create the initial game state from a seed.
 */
export function createState(seed) {
  const rng = mulberry32(seed);
  const a = uniqueRandomInts(rng, TILE_COUNT, 1, 99);
  return {
    a,
    i: 0,
    done: false,
  };
}

/**
 * Apply a pick action.
 */
export function applyAction(state, action) {
  if (state.done) {
    return { ok: false, reason: 'The array is already sorted.', state };
  }

  if (action.type !== 'pick') {
    return { ok: false, reason: `Unknown action: ${action.type}`, state };
  }

  const { a, i } = state;
  const n = a.length;
  const idx = action.index;

  // Find the actual minimum in a[i..n-1]
  let minIdx = i;
  for (let j = i + 1; j < n; j++) {
    if (a[j] < a[minIdx]) minIdx = j;
  }

  if (idx !== minIdx) {
    return {
      ok: false,
      reason: `Selection sort picks the smallest tile in the unsorted zone, not just any tile. The minimum is ${a[minIdx]} at position ${minIdx}.`,
      state,
    };
  }

  // Swap a[i] and a[minIdx]
  const newA = [...a];
  [newA[i], newA[minIdx]] = [newA[minIdx], newA[i]];

  const newI = i + 1;
  const done = newI >= n - 1;

  return {
    ok: true,
    state: { a: newA, i: newI, done },
    event: {
      text: done
        ? `Picked ${a[minIdx]} — array is now fully sorted!`
        : `Picked minimum ${a[minIdx]} from position ${minIdx}, swapped into slot ${i}`,
      line: 4, // swap line
    },
  };
}

export function isDone(state) {
  return state.done;
}

export function nextCorrectAction(state) {
  if (state.done) return null;
  const { a, i } = state;
  let minIdx = i;
  for (let j = i + 1; j < a.length; j++) {
    if (a[j] < a[minIdx]) minIdx = j;
  }
  return { type: 'pick', index: minIdx };
}
