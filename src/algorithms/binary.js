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
    { type: 'searchLeft', label: 'Search Left', key: 'ArrowLeft', button: true },
    { type: 'found', label: 'Target Found', key: 'Enter', button: true },
    { type: 'searchRight', label: 'Search Right', key: 'ArrowRight', button: true },
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

  const { a, target, lo, hi, probed } = state;
  const mid = Math.floor((lo + hi) / 2);
  const value = a[mid];
  const newProbed = [...probed];
  newProbed[mid] = true;

  if (action.type === 'found') {
    if (value === target) {
      return {
        ok: true,
        state: { ...state, probed: newProbed, done: true },
        event: {
          text: `Mid is ${value} — target found!`,
          line: 4, // return mid
        },
      };
    } else {
      return {
        ok: false,
        reason: `Target is ${target}, but mid is ${value}. Not a match.`,
        state,
      };
    }
  }

  if (action.type === 'searchLeft') {
    if (target < value) {
      return {
        ok: true,
        state: { ...state, hi: mid - 1, probed: newProbed },
        event: {
          text: `Target ${target} < ${value}. Searching left half [${lo + 1}..${mid}].`,
          line: 2, // high = mid - 1
        },
      };
    } else {
      return {
        ok: false,
        reason: `Target ${target} is not less than mid ${value}! Should search right.`,
        state,
      };
    }
  }

  if (action.type === 'searchRight') {
    if (target > value) {
      return {
        ok: true,
        state: { ...state, lo: mid + 1, probed: newProbed },
        event: {
          text: `Target ${target} > ${value}. Searching right half [${mid + 2}..${hi + 1}].`,
          line: 3, // low = mid + 1
        },
      };
    } else {
      return {
        ok: false,
        reason: `Target ${target} is not greater than mid ${value}! Should search left.`,
        state,
      };
    }
  }

  return { ok: false, reason: `Unknown action: ${action.type}`, state };
}

export function isDone(state) {
  return state.done;
}

export function nextCorrectAction(state) {
  if (state.done) return null;
  const mid = Math.floor((state.lo + state.hi) / 2);
  const value = state.a[mid];
  
  if (value === state.target) return { type: 'found' };
  if (state.target < value) return { type: 'searchLeft' };
  return { type: 'searchRight' };
}
