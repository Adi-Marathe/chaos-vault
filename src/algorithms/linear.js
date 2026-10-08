/**
 * Linear Search engine for Chaos Vault.
 *
 * State: { crates: number[], target: number, i: number, opened: boolean[], done: boolean }
 * Actions: { type: 'open' } | { type: 'next' }
 *
 * open: valid only if crate[i] is not opened yet.
 * next: valid only if crate[i] is opened and is not the target.
 * Opening the target ends the level.
 */
import { mulberry32, uniqueRandomInts, randomInt } from './rng.js';

const CRATE_COUNT = 10;

export const meta = {
  id: 'linear',
  name: 'Linear Search',
  concept:
    'Linear search checks every element in order, one by one, until the target is found or the end is reached.',
  learned:
    'Linear search visits at most n elements. It works on unsorted data but is O(n) in the worst case — every crate may need checking.',
  pseudocode: [
    'for i = 0 to n - 1:',
    '    open crate[i]',
    '    if crate[i] == target:',
    '        return i  // found!',
    '    move to next crate',
    'return -1  // not found',
  ],
  actions: [
    { type: 'open', label: 'Open Crate', key: 'o', button: true },
    { type: 'next', label: 'Next Crate', key: 'n', button: true },
  ],
};

/**
 * Create the initial game state from a seed.
 */
export function createState(seed) {
  const rng = mulberry32(seed);
  const crates = uniqueRandomInts(rng, CRATE_COUNT, 1, 99);
  const targetIdx = randomInt(rng, 0, CRATE_COUNT - 1);
  return {
    crates,
    target: crates[targetIdx],
    i: 0,
    opened: new Array(CRATE_COUNT).fill(false),
    done: false,
  };
}

/**
 * Apply an action to the state. Pure function.
 */
export function applyAction(state, action) {
  if (state.done) {
    return { ok: false, reason: 'The target has already been found.', state };
  }

  const { crates, target, i, opened } = state;

  if (action.type === 'open') {
    if (opened[i]) {
      return {
        ok: false,
        reason: 'Already opened. Move the lantern to the next crate.',
        state,
      };
    }

    const newOpened = [...opened];
    newOpened[i] = true;

    // Found the target?
    if (crates[i] === target) {
      return {
        ok: true,
        state: { ...state, opened: newOpened, done: true },
        event: {
          text: `Opened crate ${i}: found target ${target}!`,
          line: 2, // if crate[i] == target
        },
      };
    }

    return {
      ok: true,
      state: { ...state, opened: newOpened },
      event: {
        text: `Opened crate ${i}: value ${crates[i]} — not the target (${target})`,
        line: 1, // open crate[i]
      },
    };
  }

  if (action.type === 'next') {
    if (!opened[i]) {
      return {
        ok: false,
        reason:
          'Open the crate under the lantern before moving on. Linear search checks every crate in order.',
        state,
      };
    }

    if (crates[i] === target) {
      return {
        ok: false,
        reason: 'You found the target! No need to move on.',
        state,
      };
    }

    if (i >= crates.length - 1) {
      return {
        ok: false,
        reason: 'Already at the last crate.',
        state,
      };
    }

    return {
      ok: true,
      state: { ...state, i: i + 1 },
      event: {
        text: `Moved lantern to crate ${i + 1}`,
        line: 4, // move to next crate
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
  const { opened, i } = state;
  if (!opened[i]) return { type: 'open' };
  return { type: 'next' };
}
