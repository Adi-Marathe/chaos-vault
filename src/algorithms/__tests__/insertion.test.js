import { describe, it, expect } from 'vitest';
import { createState, applyAction, isDone, nextCorrectAction, meta } from '../insertion.js';

describe('Insertion Sort engine', () => {
  it('has correct meta', () => {
    expect(meta.id).toBe('insertion');
    expect(meta.actions.length).toBe(2);
  });

  for (let seed = 1; seed <= 15; seed++) {
    it(`seed ${seed}: auto-play reaches sorted state`, () => {
      let state = createState(seed);
      expect(state.a.length).toBe(7);

      let steps = 0;
      while (!isDone(state) && steps < 100) {
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

  it('slide when left is not bigger returns error', () => {
    // Create a state and play until we get a place-correct situation
    let state = createState(99);
    // Find a spot where place is correct
    let found = false;
    for (let i = 0; i < 50 && !isDone(state); i++) {
      const correct = nextCorrectAction(state);
      if (correct.type === 'place') {
        // Try to slide instead
        const result = applyAction(state, { type: 'slide' });
        expect(result.ok).toBe(false);
        expect(result.reason).toContain('not bigger');
        found = true;
        break;
      }
      state = applyAction(state, correct).state;
    }
    expect(found).toBe(true);
  });

  it('place when left is bigger returns error', () => {
    let state = createState(99);
    let found = false;
    for (let i = 0; i < 50 && !isDone(state); i++) {
      const correct = nextCorrectAction(state);
      if (correct.type === 'slide') {
        const result = applyAction(state, { type: 'place' });
        expect(result.ok).toBe(false);
        expect(result.reason).toContain('bigger');
        found = true;
        break;
      }
      state = applyAction(state, correct).state;
    }
    expect(found).toBe(true);
  });
});
