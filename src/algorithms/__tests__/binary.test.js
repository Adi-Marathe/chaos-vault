import { describe, it, expect } from 'vitest';
import { createState, applyAction, isDone, nextCorrectAction, meta } from '../binary.js';

describe('Binary Search engine', () => {
  it('has correct meta', () => {
    expect(meta.id).toBe('binary');
  });

  for (let seed = 1; seed <= 20; seed++) {
    it(`seed ${seed}: auto-play finds the target in ≤ 4 probes`, () => {
      let state = createState(seed);
      expect(state.a.length).toBe(15);
      // Array must be sorted
      for (let i = 0; i < state.a.length - 1; i++) {
        expect(state.a[i]).toBeLessThan(state.a[i + 1]);
      }
      expect(state.a).toContain(state.target);

      let probes = 0;
      while (!isDone(state) && probes < 10) {
        const action = nextCorrectAction(state);
        expect(action).not.toBeNull();
        const result = applyAction(state, action);
        expect(result.ok).toBe(true);
        state = result.state;
        probes++;
      }
      expect(isDone(state)).toBe(true);
      expect(probes).toBeLessThanOrEqual(4); // floor(log2 15) + 1
    });
  }

  it('probing wrong index returns error with middle hint', () => {
    const state = createState(42);
    const mid = Math.floor((state.lo + state.hi) / 2);
    const wrongIdx = mid === 0 ? 1 : 0;
    const result = applyAction(state, { type: 'probe', index: wrongIdx });
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('middle');
  });
});
