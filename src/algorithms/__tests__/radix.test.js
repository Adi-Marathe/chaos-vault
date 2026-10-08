import { describe, it, expect } from 'vitest';
import { createState, applyAction, isDone, nextCorrectAction, meta } from '../radix.js';

describe('Radix Sort engine', () => {
  it('has correct meta', () => {
    expect(meta.id).toBe('radix');
  });

  for (let seed = 1; seed <= 15; seed++) {
    it(`seed ${seed}: auto-play produces sorted output`, () => {
      let state = createState(seed);
      expect(state.queue.length).toBe(8);
      // All 3-digit numbers
      state.queue.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(100);
        expect(v).toBeLessThanOrEqual(999);
      });

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
      // Queue should be sorted
      for (let i = 0; i < state.queue.length - 1; i++) {
        expect(state.queue[i]).toBeLessThanOrEqual(state.queue[i + 1]);
      }
    });
  }

  it('wrong bin is rejected with digit hint', () => {
    const state = createState(42);
    const parcel = state.queue[0];
    const correctBin = parcel % 10;
    const wrongBin = (correctBin + 1) % 10;
    const result = applyAction(state, { type: 'drop', bin: wrongBin });
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('bin');
  });

  it('collect during drop phase is rejected', () => {
    const state = createState(42);
    const result = applyAction(state, { type: 'collect' });
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('Drop');
  });
});
