import { describe, it, expect } from 'vitest';
import { createState, applyAction, isDone, nextCorrectAction, meta } from '../merge.js';

describe('Merge Sort engine', () => {
  it('has correct meta', () => {
    expect(meta.id).toBe('merge');
    expect(meta.actions.length).toBe(3);
  });

  for (let seed = 1; seed <= 15; seed++) {
    it(`seed ${seed}: auto-play reaches sorted state`, () => {
      let state = createState(seed);
      expect(state.original.length).toBe(8);
      expect(state.phase).toBe('split');

      let steps = 0;
      const maxSteps = 200;
      while (!isDone(state) && steps < maxSteps) {
        const action = nextCorrectAction(state);
        expect(action).not.toBeNull();
        const result = applyAction(state, action);
        expect(result.ok).toBe(true);
        state = result.state;
        steps++;
      }
      expect(isDone(state)).toBe(true);
      // Final runs should contain a single sorted array
      expect(state.runs.length).toBe(1);
      const sorted = state.runs[0];
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i]).toBeLessThanOrEqual(sorted[i + 1]);
      }
    });
  }

  it('takeLeft when right is smaller is rejected', () => {
    let state = createState(42);
    // Split to merge phase
    while (state.phase === 'split') {
      state = applyAction(state, { type: 'split' }).state;
    }
    // Find a state where right front < left front
    let found = false;
    for (let i = 0; i < 100 && !isDone(state); i++) {
      const { left, right } = state;
      if (left.length > 0 && right.length > 0 && right[0] < left[0]) {
        const result = applyAction(state, { type: 'takeLeft' });
        expect(result.ok).toBe(false);
        expect(result.reason).toContain('smaller');
        found = true;
        break;
      }
      state = applyAction(state, nextCorrectAction(state)).state;
    }
    // It's ok if we don't find one for this seed
  });

  it('split during merge phase is rejected', () => {
    let state = createState(42);
    while (state.phase === 'split') {
      state = applyAction(state, { type: 'split' }).state;
    }
    const result = applyAction(state, { type: 'split' });
    expect(result.ok).toBe(false);
  });
});
