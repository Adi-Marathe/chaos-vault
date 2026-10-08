/**
 * Merge Sort engine for Chaos Vault.
 *
 * State: { phase, runs, pair, left, right, out, round, done, original }
 *   phase: 'split' | 'merge'
 *   runs: array of arrays – the current set of runs
 *   pair: index of the current pair being merged (0, 2, 4 …)
 *   left/right: the two lanes of the current merge
 *   out: the merged output lane
 *   round: current merge round (for display)
 *   done: boolean
 *   original: the initial unsplit array (for display)
 *
 * Split phase: action 'split' halves every run longer than 1.
 *   After 3 splits all runs are single tiles → phase becomes 'merge'.
 *
 * Merge phase: neighbouring runs merge pairwise.
 *   takeLeft / takeRight move front tile of that lane to out.
 *   When one lane empties, the other's tiles auto-append.
 *   When the pair is done, the merged run replaces the pair in runs.
 */
import { mulberry32, uniqueRandomInts } from './rng.js';

const TILE_COUNT = 8;

export const meta = {
  id: 'merge',
  name: 'Merge Sort',
  concept:
    'Merge sort splits the array into single-element runs, then merges neighbouring runs by always taking the smaller front tile.',
  learned:
    'Merge sort guarantees O(n log n) time regardless of input order, at the cost of O(n) extra space. The merge step is stable.',
  pseudocode: [
    'while left and right:',
    '    if left[0] <= right[0]:',
    '        output.append(left.pop(0))',
    '    else:',
    '        output.append(right.pop(0))',
  ],
  actions: [
    { type: 'split', label: 'Split', key: 'x', button: true },
    { type: 'takeLeft', label: 'Take Left Front', key: 'a', button: true },
    { type: 'takeRight', label: 'Take Right Front', key: 'd', button: true },
  ],
};

/**
 * Create the initial game state from a seed.
 */
export function createState(seed) {
  const rng = mulberry32(seed);
  const arr = uniqueRandomInts(rng, TILE_COUNT, 1, 99);
  return {
    phase: 'split',
    runs: [arr],
    splitCount: 0,
    pair: 0,
    left: [],
    right: [],
    out: [],
    round: 0,
    done: false,
    original: [...arr],
  };
}

function splitRuns(runs) {
  const result = [];
  for (const run of runs) {
    if (run.length <= 1) {
      result.push(run);
    } else {
      const mid = Math.ceil(run.length / 2);
      result.push(run.slice(0, mid));
      result.push(run.slice(mid));
    }
  }
  return result;
}

function setupNextPair(state) {
  const { runs, pair } = state;
  // Find next pair to merge
  let p = pair;
  while (p + 1 < runs.length) {
    return {
      ...state,
      pair: p,
      left: [...runs[p]],
      right: [...runs[p + 1]],
      out: [],
    };
  }
  // If odd run, it carries over. Start new round.
  return startNewRound(state);
}

function startNewRound(state) {
  const { runs } = state;
  if (runs.length <= 1) {
    return { ...state, done: true, left: [], right: [], out: [] };
  }
  // Merge pairwise in a new round
  return {
    ...state,
    pair: 0,
    left: [...runs[0]],
    right: runs.length > 1 ? [...runs[1]] : [],
    out: [],
    round: state.round + 1,
  };
}

function finishPairMerge(state) {
  const { runs, pair, out } = state;
  // Replace runs[pair] and runs[pair+1] with the merged run
  const newRuns = [...runs];
  newRuns.splice(pair, 2, out);

  // Try next pair in this round
  const nextPair = pair; // After splice, the index stays the same for the next unmerged pair
  if (nextPair + 1 < newRuns.length) {
    return {
      ...state,
      runs: newRuns,
      pair: nextPair,
      left: [...newRuns[nextPair]],
      right: [...newRuns[nextPair + 1]],
      out: [],
    };
  }

  // Round done
  if (newRuns.length <= 1) {
    return { ...state, runs: newRuns, done: true, left: [], right: [], out: [] };
  }

  // Start new round
  return {
    ...state,
    runs: newRuns,
    pair: 0,
    left: [...newRuns[0]],
    right: newRuns.length > 1 ? [...newRuns[1]] : [],
    out: [],
    round: state.round + 1,
  };
}

export function applyAction(state, action) {
  if (state.done) {
    return { ok: false, reason: 'Already sorted.', state };
  }

  // ── Split phase ──
  if (state.phase === 'split') {
    if (action.type !== 'split') {
      return {
        ok: false,
        reason: 'Split first: press Split until every tile is on its own.',
        state,
      };
    }

    const newRuns = splitRuns(state.runs);
    const newSplitCount = state.splitCount + 1;
    const allSingle = newRuns.every((r) => r.length <= 1);

    if (allSingle) {
      // Transition to merge phase
      const mergeState = {
        ...state,
        phase: 'merge',
        runs: newRuns,
        splitCount: newSplitCount,
        pair: 0,
        left: [...newRuns[0]],
        right: newRuns.length > 1 ? [...newRuns[1]] : [],
        out: [],
        round: 1,
      };
      return {
        ok: true,
        state: mergeState,
        event: {
          text: `Split complete! All ${newRuns.length} tiles are individual runs. Starting merge phase.`,
          line: -1,
        },
      };
    }

    return {
      ok: true,
      state: { ...state, runs: newRuns, splitCount: newSplitCount },
      event: {
        text: `Split into ${newRuns.length} runs`,
        line: -1,
      },
    };
  }

  // ── Merge phase ──
  if (action.type === 'split') {
    return {
      ok: false,
      reason: 'Split phase is over. Now merge the runs by taking left or right front tiles.',
      state,
    };
  }

  const { left, right, out } = state;

  if (action.type === 'takeLeft') {
    if (left.length === 0) {
      return { ok: false, reason: 'Left lane is empty.', state };
    }
    if (right.length > 0 && left[0] > right[0]) {
      return {
        ok: false,
        reason: `Merge takes the smaller of the two front tiles: ${right[0]} is smaller than ${left[0]}, take right.`,
        state,
      };
    }

    const val = left[0];
    const newLeft = left.slice(1);
    let newOut = [...out, val];

    // If one lane empties, auto-append the other
    if (newLeft.length === 0 && right.length > 0) {
      newOut = [...newOut, ...right];
      const finished = finishPairMerge({ ...state, left: [], right: [], out: newOut });
      return {
        ok: true,
        state: finished,
        event: { text: `Took ${val} from left. Lane empty — right auto-appended.`, line: 2 },
      };
    }
    if (right.length === 0 && newLeft.length > 0) {
      newOut = [...newOut, ...newLeft];
      const finished = finishPairMerge({ ...state, left: [], right: [], out: newOut });
      return {
        ok: true,
        state: finished,
        event: { text: `Took ${val} from left. Right empty — left auto-appended.`, line: 2 },
      };
    }
    if (newLeft.length === 0 && right.length === 0) {
      const finished = finishPairMerge({ ...state, left: [], right: [], out: newOut });
      return {
        ok: true,
        state: finished,
        event: { text: `Took ${val} from left. Pair merge complete!`, line: 2 },
      };
    }

    return {
      ok: true,
      state: { ...state, left: newLeft, out: newOut },
      event: { text: `Took ${val} from left (${val} ≤ ${right[0]})`, line: 1 },
    };
  }

  if (action.type === 'takeRight') {
    if (right.length === 0) {
      return { ok: false, reason: 'Right lane is empty.', state };
    }
    if (left.length > 0 && right[0] >= left[0]) {
      return {
        ok: false,
        reason: `Merge takes the smaller of the two front tiles: ${left[0]} is smaller than or equal to ${right[0]}, take left.`,
        state,
      };
    }

    const val = right[0];
    const newRight = right.slice(1);
    let newOut = [...out, val];

    if (newRight.length === 0 && left.length > 0) {
      newOut = [...newOut, ...left];
      const finished = finishPairMerge({ ...state, left: [], right: [], out: newOut });
      return {
        ok: true,
        state: finished,
        event: { text: `Took ${val} from right. Lane empty — left auto-appended.`, line: 4 },
      };
    }
    if (left.length === 0 && newRight.length > 0) {
      newOut = [...newOut, ...newRight];
      const finished = finishPairMerge({ ...state, left: [], right: [], out: newOut });
      return {
        ok: true,
        state: finished,
        event: { text: `Took ${val} from right. Left empty — right auto-appended.`, line: 4 },
      };
    }
    if (left.length === 0 && newRight.length === 0) {
      const finished = finishPairMerge({ ...state, left: [], right: [], out: newOut });
      return {
        ok: true,
        state: finished,
        event: { text: `Took ${val} from right. Pair merge complete!`, line: 4 },
      };
    }

    return {
      ok: true,
      state: { ...state, right: newRight, out: newOut },
      event: { text: `Took ${val} from right (${val} < ${left[0]})`, line: 4 },
    };
  }

  return { ok: false, reason: `Unknown action: ${action.type}`, state };
}

export function isDone(state) {
  return state.done;
}

export function nextCorrectAction(state) {
  if (state.done) return null;

  if (state.phase === 'split') {
    return { type: 'split' };
  }

  const { left, right } = state;
  if (left.length === 0 && right.length === 0) return null;
  if (left.length === 0) return { type: 'takeRight' };
  if (right.length === 0) return { type: 'takeLeft' };
  if (left[0] <= right[0]) return { type: 'takeLeft' };
  return { type: 'takeRight' };
}
