/**
 * Binary Search engine for Chaos Vault.
 *
 * State: { a: number[], target: number, lo: number, hi: number, probed: boolean[], done: boolean }
 * Actions: { type: 'probe', index: number }
 *
 * Valid only when index === Math.floor((lo + hi) / 2).
 * Then: value === target → done; value < target → lo = mid + 1; else hi = mid − 1.
 * Any other index is a mistake, even the target.
 * Probe budget = floor(log2(n)) + 1.
 */
import { mulberry32, uniqueRandomInts, randomInt } from './rng.js';

const TILE_COUNT = 15;

export const meta = {
  id: 'binary',
  name: 'Binary Search',
  concept:
    'Binary search always probes the middle element, halving the search space each step. It requires a sorted array.',
  learned:
    'Binary search finds any element in a sorted array in at most ⌊log₂ n⌋ + 1 probes, giving O(log n) time — exponentially faster than linear search.',
  pseudocode: [
    'low = 0, high = n - 1',
    'mid = floor((low + high) / 2)',
    'if a[mid] > target: high = mid - 1',
    'else if a[mid] < target: low = mid + 1',
    'else: return mid  // TARGET FOUND!',
  ],
  actions: [
    { type: 'probe', label: 'Probe Tile', key: null, button: false },
  ],
};

/**
 * Create the initial game state from a seed.
 * Generates TILE_COUNT unique sorted values.
 */
export function createState(seed) {
  const rng = mulberry32(seed);
  const vals = uniqueRandomInts(rng, TILE_COUNT, 1, 99);
  const a = vals.sort((x, y) => x - y);
  const targetIdx = randomInt(rng, 0, TILE_COUNT - 1);
  return {
    a,
    target: a[targetIdx],
    lo: 0,
    hi: TILE_COUNT - 1,
    probed: new Array(TILE_COUNT).fill(false),
    done: false,
  };
}

/**
 * Apply a probe action.
 */
export function applyAction(state, action) {
  if (state.done) {
    return { ok: false, reason: 'The target has already been found.', state };
  }

  if (action.type !== 'probe') {
    return { ok: false, reason: `Unknown action: ${action.type}`, state };
  }

  const { a, target, lo, hi, probed } = state;
  const mid = Math.floor((lo + hi) / 2);
  const idx = action.index;

  // Must probe the exact middle
  if (idx !== mid) {
    // Use 1-based tile numbers in the reason
    return {
      ok: false,
      reason: `Binary search always probes the middle of what is left: tile ${mid + 1} (low ${lo + 1}, high ${hi + 1}).`,
      state,
    };
  }

  const value = a[mid];
  const newProbed = [...probed];
  newProbed[mid] = true;

  if (value === target) {
    return {
      ok: true,
      state: { ...state, probed: newProbed, done: true },
      event: {
        text: `Probed tile ${mid + 1} (val: ${value}) — target found!`,
        line: 4, // return mid
      },
    };
  }

  if (value < target) {
    return {
      ok: true,
      state: { ...state, lo: mid + 1, probed: newProbed },
      event: {
        text: `Probed ${value}: too low, discard the left half. New range [${mid + 2}..${hi + 1}]`,
        line: 3, // low = mid + 1
      },
    };
  }

  // value > target
  return {
    ok: true,
    state: { ...state, hi: mid - 1, probed: newProbed },
    event: {
      text: `Probed ${value}: too high, discard the right half. New range [${lo + 1}..${mid}]`,
      line: 2, // high = mid - 1
    },
  };
}

export function isDone(state) {
  return state.done;
}

export function nextCorrectAction(state) {
  if (state.done) return null;
  const mid = Math.floor((state.lo + state.hi) / 2);
  return { type: 'probe', index: mid };
}
