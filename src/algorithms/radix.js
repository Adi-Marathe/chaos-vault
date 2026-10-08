/**
 * Radix Sort engine for Chaos Vault.
 *
 * State: { queue, bins, pass, phase, done }
 *   queue: array of 3-digit numbers
 *   bins: array of 10 arrays (bins 0-9)
 *   pass: 1, 2, or 3 (ones, tens, hundreds)
 *   phase: 'drop' | 'collect'
 *   done: boolean
 *
 * Drop phase: action drop { bin } for queue[0].
 *   Valid only when bin = that parcel's digit for the current pass.
 *   The parcel moves into the bin.
 *   When the queue is empty → phase becomes 'collect'.
 *
 * Collect phase: action collect flattens bins 0-9 into queue, clears bins, pass++.
 *   After pass 3: done.
 */
import { mulberry32, uniqueRandomInts } from './rng.js';

const PARCEL_COUNT = 8;
const PASS_NAMES = ['', 'ones', 'tens', 'hundreds'];

export const meta = {
  id: 'radix',
  name: 'Radix Sort',
  concept:
    'Radix sort distributes numbers into bins by their current digit (LSD first), then collects them in bin order. No comparisons needed!',
  learned:
    'Radix sort (LSD, base 10) sorts in O(d · (n + k)) time where d is the number of digits and k is the base. It never compares two elements directly — it relies on stable digit-binning.',
  pseudocode: [
    'for exp in [1, 10, 100]:',
    '    for parcel in parcels:',
    '        digit = (parcel // exp) % 10',
    '        bins[digit].append(parcel)',
    '    parcels = flatten(bins)  // stable FIFO',
  ],
  actions: [
    { type: 'drop', label: 'Drop into Bin', key: null, button: false },
    { type: 'collect', label: 'Collect Bins', key: ' ', button: true },
  ],
};

function getDigit(num, pass) {
  // pass 1 = ones, 2 = tens, 3 = hundreds
  const exp = Math.pow(10, pass - 1);
  return Math.floor(num / exp) % 10;
}

export function createState(seed) {
  const rng = mulberry32(seed);
  const queue = uniqueRandomInts(rng, PARCEL_COUNT, 100, 999);
  return {
    queue,
    bins: Array.from({ length: 10 }, () => []),
    pass: 1,
    phase: 'drop',
    done: false,
  };
}

export function applyAction(state, action) {
  if (state.done) {
    return { ok: false, reason: 'Already sorted.', state };
  }

  // ── Drop phase ──
  if (state.phase === 'drop') {
    if (action.type === 'collect') {
      return {
        ok: false,
        reason: 'Drop every parcel into a bin before collecting.',
        state,
      };
    }

    if (action.type !== 'drop') {
      return { ok: false, reason: `Unknown action: ${action.type}`, state };
    }

    const { queue, bins, pass } = state;
    if (queue.length === 0) {
      return { ok: false, reason: 'Queue is empty — collect now.', state };
    }

    const parcel = queue[0];
    const correctBin = getDigit(parcel, pass);
    const chosenBin = action.bin;

    if (chosenBin !== correctBin) {
      return {
        ok: false,
        reason: `Pass ${pass} looks at the ${PASS_NAMES[pass]} digit: ${parcel} ${
          pass === 1 ? 'ends in' : pass === 2 ? "'s tens digit is" : "'s hundreds digit is"
        } ${correctBin}, so it goes into bin ${correctBin}.`,
        state,
      };
    }

    const newQueue = queue.slice(1);
    const newBins = bins.map((b, i) => (i === correctBin ? [...b, parcel] : b));

    // If queue now empty, transition to collect
    if (newQueue.length === 0) {
      return {
        ok: true,
        state: { ...state, queue: newQueue, bins: newBins, phase: 'collect' },
        event: {
          text: `Dropped ${parcel} into bin ${correctBin} (${PASS_NAMES[pass]} digit). All parcels distributed — collect now!`,
          line: 3,
        },
      };
    }

    return {
      ok: true,
      state: { ...state, queue: newQueue, bins: newBins },
      event: {
        text: `Dropped ${parcel} into bin ${correctBin} (${PASS_NAMES[pass]}=${correctBin})`,
        line: 3,
      },
    };
  }

  // ── Collect phase ──
  if (state.phase === 'collect') {
    if (action.type === 'drop') {
      return {
        ok: false,
        reason: 'All parcels are in bins. Press Collect to flatten bins into the queue.',
        state,
      };
    }

    if (action.type !== 'collect') {
      return { ok: false, reason: `Unknown action: ${action.type}`, state };
    }

    const { bins, pass } = state;
    const collected = bins.flat();
    const newPass = pass + 1;

    if (newPass > 3) {
      return {
        ok: true,
        state: {
          ...state,
          queue: collected,
          bins: Array.from({ length: 10 }, () => []),
          pass: newPass,
          phase: 'drop',
          done: true,
        },
        event: { text: `Collected! All 3 passes complete — parcels are sorted!`, line: 4 },
      };
    }

    return {
      ok: true,
      state: {
        ...state,
        queue: collected,
        bins: Array.from({ length: 10 }, () => []),
        pass: newPass,
        phase: 'drop',
      },
      event: {
        text: `Collected from bins. Starting pass ${newPass} (${PASS_NAMES[newPass]} digit).`,
        line: 4,
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

  if (state.phase === 'collect') {
    return { type: 'collect' };
  }

  // Drop phase
  const { queue, pass } = state;
  if (queue.length === 0) return { type: 'collect' };
  const parcel = queue[0];
  const digit = getDigit(parcel, pass);
  return { type: 'drop', bin: digit };
}
