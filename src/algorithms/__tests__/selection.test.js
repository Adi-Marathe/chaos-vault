import { describe, it, expect } from 'vitest';
import { createState, applyAction, isDone, nextCorrectAction, meta } from '../selection.js';

describe('Selection Sort engine', () => {
  it('has correct meta', () => {
    expect(meta.id).toBe('selection');
  });

  for (let seed = 1; seed <= 15; seed++) {
    it(`seed ${seed}: auto-play reaches sorted state`, () => {
      let state = createState(seed);
      expect(state.a.length).toBe(8);

      let steps = 0;
      while (!isDone(state) && steps < 20) {
        const action = nextCorrectAction(state);
        expect(action).not.toBeNull();
        const result = applyAction(state, action);
        expect(result.ok).toBe(true);
        state = result.state;
        steps++;
      }
      expect(isDone(state)).toBe(true);
      for (let i = 0; i < state.a.length - 1; i++) {
        expect(state.a[i]).toBeLessThanOrEqual(state.a[i + 1]);
      }
      // Should take exactly n-1 = 7 picks
      expect(steps).toBe(7);
    });
  }

  it('picking wrong tile returns error', () => {
    const state = createState(42);
    // Find a non-minimum position
    let minIdx = 0;
    for (let j = 1; j < state.a.length; j++) {
      if (state.a[j] < state.a[minIdx]) minIdx = j;
    }
    const wrongIdx = minIdx === 0 ? 1 : 0;
    const result = applyAction(state, { type: 'pick', index: wrongIdx });
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('smallest');
  });
});
