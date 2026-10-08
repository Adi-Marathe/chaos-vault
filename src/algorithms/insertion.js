/**
 * Insertion Sort engine for Chaos Vault.
 *
 * State: { a: number[], k: number, p: number, done: boolean }
 *   a[0..k-1] is the sorted hand. The drawn card sits at position p (starts at k).
 *   Actions: slide, place.
 *   Correct: slide if p > 0 and a[p-1] > a[p], otherwise place.
 *   place: k++, p = k; done when k = n.
 */
import { mulberry32, uniqueRandomInts } from './rng.js';

const CARD_COUNT = 7;

export const meta = {
  id: 'insertion',
  name: 'Insertion Sort',
  concept:
    'Insertion sort takes the next unsorted card and slides it left through the sorted hand until it reaches its correct position.',
  learned:
    'Insertion sort is O(n²) worst-case but O(n) on nearly-sorted data, making it efficient for small or partially sorted arrays. It sorts in-place and is stable.',
  pseudocode: [
    'for i = 1 to cards.length:',
    '    key = cards[i]',
    '    j = i - 1',
    '    while j >= 0 and cards[j] > key:',
    '        cards[j + 1] = cards[j]  // shift right',
    '        j = j - 1',
    '    cards[j + 1] = key  // insert!',
  ],
  actions: [
    { type: 'slide', label: 'Slide Left', key: 's', button: true },
    { type: 'place', label: 'Place Here', key: 'p', button: true },
  ],
};

/**
 * Create the initial game state from a seed.
 */
export function createState(seed) {
  const rng = mulberry32(seed);
  const a = uniqueRandomInts(rng, CARD_COUNT, 1, 99);
  return {
    a,
    k: 1, // first card is trivially sorted; drawn card is a[1]
    p: 1,
    done: false,
  };
}

/**
 * Apply an action to the state.
 */
export function applyAction(state, action) {
  if (state.done) {
    return { ok: false, reason: 'The hand is already sorted.', state };
  }

  const { a, k, p } = state;
  const shouldSlide = p > 0 && a[p - 1] > a[p];

  if (action.type === 'slide') {
    if (!shouldSlide) {
      return {
        ok: false,
        reason: p === 0
          ? 'Already at the leftmost position — place the card.'
          : `The left card (${a[p - 1]}) is not bigger than the drawn card (${a[p]}), so this card is in place: place it.`,
        state,
      };
    }

    // Swap a[p] and a[p-1]
    const newA = [...a];
    [newA[p - 1], newA[p]] = [newA[p], newA[p - 1]];

    return {
      ok: true,
      state: { ...state, a: newA, p: p - 1 },
      event: {
        text: `Slid card ${a[p]} left past ${a[p - 1]}`,
        line: 4, // shift right line
      },
    };
  }

  if (action.type === 'place') {
    if (shouldSlide) {
      return {
        ok: false,
        reason: `The left card (${a[p - 1]}) is bigger than the drawn card (${a[p]}), so slide left.`,
        state,
      };
    }

    // Place the card: advance k
    const newK = k + 1;
    if (newK >= a.length) {
      return {
        ok: true,
        state: { ...state, k: newK, p: newK, done: true },
        event: {
          text: `Placed card ${a[p]} — hand is fully sorted!`,
          line: 6, // insert line
        },
      };
    }

    return {
      ok: true,
      state: { ...state, k: newK, p: newK },
      event: {
        text: `Placed card ${a[p]} at position ${p}. Drawing next card: ${a[newK]}`,
        line: 6, // insert line
      },
    };
  }

  return { ok: false, reason: `Unknown action: ${action.type}`, state };
}

export function isDone(state) {
  return state.done;
}

export function nextCorrectAction(state) {
  if (state.done) return null;
  const { a, p } = state;
  if (p > 0 && a[p - 1] > a[p]) {
    return { type: 'slide' };
  }
  return { type: 'place' };
}
