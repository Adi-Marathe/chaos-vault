/**
 * Shell Sort engine for Chaos Vault.
 *
 * State: { a, gaps, gi, i, p, done }
 *   gaps = [4, 2, 1]
 *   gi = current gap index
 *   i = outer loop position (starts at current gap)
 *   p = current position of the tile being inserted (starts at i)
 *
 * For current gap g = gaps[gi]:
 *   compare a[p] with a[p - g].
 *   jump: swap with a[p-g], p -= g. Valid when p >= g and a[p-g] > a[p].
 *   place: advance i++, p = i. Valid otherwise.
 *   When i reaches n, move to next gap (gi++, i = new gap, p = i).
 *   After gap 1 finishes: done.
 */
import { mulberry32, uniqueRandomInts } from './rng.js';

const TILE_COUNT = 8;
const GAPS = [4, 2, 1];

export const meta = {
  id: 'shell',
  name: 'Shell Sort',
  concept:
    'Shell sort runs insertion sort over elements separated by a shrinking gap. Large gaps move tiles far quickly; gap 1 finishes the job.',
  learned:
    'Shell sort reduces inversions with large gaps cheaply, making the final gap-1 pass fast. With good gap sequences it achieves O(n^(3/2)) or better — much faster than plain insertion sort\'s O(n²).',
  pseudocode: [
    'for gap in [4, 2, 1]:',
    '    for i = gap to n - 1:',
    '        temp = arr[i]',
    '        while j >= gap and arr[j-gap] > temp:',
    '            arr[j] = arr[j-gap]; j -= gap',
    '        arr[j] = temp  // placed',
  ],
  actions: [
    { type: 'jump', label: 'Jump Back', key: 'j', button: true },
    { type: 'place', label: 'Place', key: 'p', button: true },
  ],
};

export function createState(seed) {
  const rng = mulberry32(seed);
  const a = uniqueRandomInts(rng, TILE_COUNT, 1, 99);
  return {
    a,
    gaps: GAPS,
    gi: 0,
    i: GAPS[0],
    p: GAPS[0],
    done: false,
  };
}

export function applyAction(state, action) {
  if (state.done) {
    return { ok: false, reason: 'Already sorted.', state };
  }

  const { a, gaps, gi, i, p } = state;
  const g = gaps[gi];
  const n = a.length;
  const shouldJump = p >= g && a[p - g] > a[p];

  if (action.type === 'jump') {
    if (!shouldJump) {
      if (p < g) {
        return {
          ok: false,
          reason: `Already at the start of this lane — place the tile.`,
          state,
        };
      }
      return {
        ok: false,
        reason: `The tile ${g} steps back (${a[p - g]}) is not bigger than the current tile (${a[p]}), so this tile is in place in its lane: place it.`,
        state,
      };
    }

    const newA = [...a];
    [newA[p - g], newA[p]] = [newA[p], newA[p - g]];

    return {
      ok: true,
      state: { ...state, a: newA, p: p - g },
      event: {
        text: `Jumped back: swapped ${a[p]} with ${a[p - g]} (gap ${g})`,
        line: 4,
      },
    };
  }

  if (action.type === 'place') {
    if (shouldJump) {
      return {
        ok: false,
        reason: `The tile ${g} steps back (${a[p - g]}) is bigger than the current tile (${a[p]}), so jump back.`,
        state,
      };
    }

    // Advance to next position
    const newI = i + 1;
    if (newI >= n) {
      // This gap is done, move to next gap
      const newGi = gi + 1;
      if (newGi >= gaps.length) {
        return {
          ok: true,
          state: { ...state, i: newI, p: newI, done: true },
          event: { text: `Placed. All gaps complete — array is sorted!`, line: 5 },
        };
      }
      const newGap = gaps[newGi];
      return {
        ok: true,
        state: { ...state, gi: newGi, i: newGap, p: newGap },
        event: { text: `Placed. Gap ${g} complete. Moving to gap ${newGap}.`, line: 5 },
      };
    }

    return {
      ok: true,
      state: { ...state, i: newI, p: newI },
      event: { text: `Placed tile at position ${p}. Moving to position ${newI}.`, line: 5 },
    };
  }

  return { ok: false, reason: `Unknown action: ${action.type}`, state };
}

export function isDone(state) {
  return state.done;
}

export function nextCorrectAction(state) {
  if (state.done) return null;
  const { a, gaps, gi, p } = state;
  const g = gaps[gi];
  if (p >= g && a[p - g] > a[p]) {
    return { type: 'jump' };
  }
  return { type: 'place' };
}
