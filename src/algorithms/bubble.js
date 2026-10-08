/**
 * Bubble Sort engine for Chaos Vault.
 *
 * State: { a: number[], j: number, pass: number, swapped: boolean, done: boolean }
 * Actions: { type: 'swap' } | { type: 'skip' }
 *
 * Current pair is a[j] and a[j+1].
 * Correct: swap if a[j] > a[j+1], otherwise skip.
 * After any valid action j++. When j reaches n-1-pass the pass ends:
 *   - if nothing was swapped in that pass → done (early exit)
 *   - otherwise pass++, j=0, swapped=false
 *   - when pass reaches n-1 → done
 */
import { mulberry32, uniqueRandomInts } from './rng.js';

const TILE_COUNT = 8;

export const meta = {
  id: 'bubble',
  name: 'Bubble Sort',
  concept:
    'Bubble sort repeatedly compares adjacent pairs and swaps them only when the left value is strictly larger than the right value.',
  learned:
    'Bubble sort needs up to n − 1 passes; stopping when a pass makes no swaps gives an early exit. Worst case O(n²).',
  pseudocode: [
    'for pass = 0 to n - 2:',
    '    swapped = false',
    '    for j = 0 to n - 2 - pass:',
    '        if a[j] > a[j + 1]:',
    '            swap(a[j], a[j + 1])',
    '            swapped = true',
    '    if not swapped: stop',
  ],
  actions: [
    { type: 'swap', label: 'Swap Neighbors', key: 's', button: true },
    { type: 'skip', label: 'Skip / Keep', key: 'k', button: true },
  ],
};

/**
 * Create the initial game state from a seed.
 * Generates TILE_COUNT unique values in [1, 99].
 */
export function createState(seed) {
  const rng = mulberry32(seed);
  const a = uniqueRandomInts(rng, TILE_COUNT, 1, 99);
  return {
    a,
    j: 0,
    pass: 0,
    swapped: false,
    done: false,
  };
}

/**
 * Apply an action to the state. Pure function – never mutates.
 *
 * Returns { ok: boolean, reason?: string, state: State, event?: { text, line } }
 *   - line = pseudocode index to highlight (0-based)
 */
export function applyAction(state, action) {
  if (state.done) {
    return { ok: false, reason: 'The array is already sorted.', state };
  }

  const { a, j, pass, swapped } = state;
  const n = a.length;
  const left = a[j];
  const right = a[j + 1];
  const shouldSwap = left > right;

  if (action.type === 'swap') {
    if (!shouldSwap) {
      return {
        ok: false,
        reason: `Bubble sort only swaps when the left value is bigger (${left} is not bigger than ${right}), so skip.`,
        state,
      };
    }
    // Perform swap
    const newA = [...a];
    newA[j] = right;
    newA[j + 1] = left;
    const next = advance({ a: newA, j, pass, swapped: true, done: false });
    return {
      ok: true,
      state: next,
      event: {
        text: `Swapped ${left} ↔ ${right} at index [${j}, ${j + 1}]`,
        line: 4, // swap line in pseudocode
      },
    };
  }

  if (action.type === 'skip') {
    if (shouldSwap) {
      return {
        ok: false,
        reason: `${left} is bigger than ${right}, so they must swap.`,
        state,
      };
    }
    const next = advance({ a: [...a], j, pass, swapped, done: false });
    return {
      ok: true,
      state: next,
      event: {
        text: `Kept ${left}, ${right} — already in order at [${j}, ${j + 1}]`,
        line: 3, // comparison line
      },
    };
  }

  return { ok: false, reason: `Unknown action: ${action.type}`, state };
}

/**
 * Advance j (and possibly pass). Determines if done.
 */
function advance(state) {
  const { a, j, pass, swapped } = state;
  const n = a.length;
  const nextJ = j + 1;

  // End of this pass?
  if (nextJ > n - 2 - pass) {
    // Early exit: no swaps this pass
    if (!swapped) {
      return { ...state, j: nextJ, done: true };
    }
    const nextPass = pass + 1;
    // All passes exhausted?
    if (nextPass >= n - 1) {
      return { ...state, j: 0, pass: nextPass, swapped: false, done: true };
    }
    // New pass
    return { ...state, j: 0, pass: nextPass, swapped: false };
  }

  return { ...state, j: nextJ };
}

/**
 * Check if the sort is complete.
 */
export function isDone(state) {
  return state.done;
}

/**
 * Return the next correct action the algorithm would take.
 */
export function nextCorrectAction(state) {
  if (state.done) return null;
  const { a, j } = state;
  if (a[j] > a[j + 1]) {
    return { type: 'swap' };
  }
  return { type: 'skip' };
}
