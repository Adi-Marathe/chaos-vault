import { describe, it, expect } from 'vitest';
import { createState, applyAction, isDone, nextCorrectAction, meta } from '../shell.js';

describe('Shell Sort engine', () => {
  it('has correct meta', () => {
    expect(meta.id).toBe('shell');
    expect(meta.actions.length).toBe(2);
  });

  for (let seed = 1; seed <= 15; seed++) {
    it(`seed ${seed}: auto-play reaches sorted state`, () => {
      let state = createState(seed);
      expect(state.a.length).toBe(8);
      expect(state.gaps).toEqual([4, 2, 1]);

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
      for (let i = 0; i < state.a.length - 1; i++) {
        expect(state.a[i]).toBeLessThanOrEqual(state.a[i + 1]);
      }
    });
  }

  it('jump when partner is not bigger is rejected', () => {
    let state = createState(99);
    let found = false;
    for (let i = 0; i < 100 && !isDone(state); i++) {
      const correct = nextCorrectAction(state);
      if (correct.type === 'place') {
        const result = applyAction(state, { type: 'jump' });
        expect(result.ok).toBe(false);
        found = true;
        break;
      }
      state = applyAction(state, correct).state;
    }
    expect(found).toBe(true);
  });

  it('place when partner is bigger is rejected', () => {
    let state = createState(99);
    let found = false;
    for (let i = 0; i < 100 && !isDone(state); i++) {
      const correct = nextCorrectAction(state);
      if (correct.type === 'jump') {
        const result = applyAction(state, { type: 'place' });
        expect(result.ok).toBe(false);
        found = true;
        break;
      }
      state = applyAction(state, correct).state;
    }
    expect(found).toBe(true);
  });
});
