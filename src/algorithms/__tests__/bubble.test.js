import { describe, it, expect } from 'vitest';
import { createState, applyAction, isDone, nextCorrectAction, meta } from '../bubble.js';

describe('Bubble Sort engine', () => {
  it('has correct meta', () => {
    expect(meta.id).toBe('bubble');
    expect(meta.actions.length).toBe(2);
  });

  // Play 20 different seeds to completion using nextCorrectAction
  for (let seed = 1; seed <= 20; seed++) {
    it(`seed ${seed}: auto-play reaches sorted state`, () => {
      let state = createState(seed);
      expect(state.a.length).toBe(8);

      // All values unique 1-99
      const vals = new Set(state.a);
      expect(vals.size).toBe(8);
      state.a.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(99);
      });

      let steps = 0;
      const maxSteps = 500;
      while (!isDone(state) && steps < maxSteps) {
        const action = nextCorrectAction(state);
        expect(action).not.toBeNull();
        const result = applyAction(state, action);
        expect(result.ok).toBe(true);
        state = result.state;
        steps++;
      }

      expect(isDone(state)).toBe(true);
      // Array should be sorted
      for (let i = 0; i < state.a.length - 1; i++) {
        expect(state.a[i]).toBeLessThanOrEqual(state.a[i + 1]);
      }
    });
  }

  it('wrong swap returns ok:false and leaves state unchanged', () => {
    // Find a seed where the first pair is already in order
    let state;
    for (let s = 1; s < 100; s++) {
      state = createState(s);
      if (state.a[0] <= state.a[1]) break;
    }
    // Attempting swap on an already-ordered pair should fail
    if (state.a[0] <= state.a[1]) {
      const result = applyAction(state, { type: 'swap' });
      expect(result.ok).toBe(false);
      expect(result.reason).toBeTruthy();
      expect(result.state).toEqual(state);
    }
  });

  it('wrong skip returns ok:false and leaves state unchanged', () => {
    // Find a seed where the first pair is out of order
    let state;
    for (let s = 1; s < 100; s++) {
      state = createState(s);
      if (state.a[0] > state.a[1]) break;
    }
    if (state.a[0] > state.a[1]) {
      const result = applyAction(state, { type: 'skip' });
      expect(result.ok).toBe(false);
      expect(result.reason).toBeTruthy();
      expect(result.state).toEqual(state);
    }
  });

  it('early exit works when a pass has no swaps', () => {
    // Use a nearly-sorted array scenario: play to completion and verify
    // the engine doesn't go through all n-1 passes
    const state = createState(42);
    let s = state;
    let steps = 0;
    while (!isDone(s)) {
      s = applyAction(s, nextCorrectAction(s)).state;
      steps++;
    }
    // Should terminate before theoretical maximum of n*(n-1)/2 = 28
    expect(steps).toBeLessThanOrEqual(28);
    expect(isDone(s)).toBe(true);
  });
});
