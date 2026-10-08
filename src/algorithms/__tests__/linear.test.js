import { describe, it, expect } from 'vitest';
import { createState, applyAction, isDone, nextCorrectAction, meta } from '../linear.js';

describe('Linear Search engine', () => {
  it('has correct meta', () => {
    expect(meta.id).toBe('linear');
    expect(meta.actions.length).toBe(2);
  });

  for (let seed = 1; seed <= 10; seed++) {
    it(`seed ${seed}: auto-play finds the target`, () => {
      let state = createState(seed);
      expect(state.crates.length).toBe(10);
      expect(state.crates).toContain(state.target);

      let steps = 0;
      while (!isDone(state) && steps < 50) {
        const action = nextCorrectAction(state);
        expect(action).not.toBeNull();
        const result = applyAction(state, action);
        expect(result.ok).toBe(true);
        state = result.state;
        steps++;
      }
      expect(isDone(state)).toBe(true);
    });
  }

  it('open before next is enforced', () => {
    const state = createState(42);
    const result = applyAction(state, { type: 'next' });
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('Open the crate');
  });

  it('double open is rejected', () => {
    let state = createState(42);
    const r1 = applyAction(state, { type: 'open' });
    expect(r1.ok).toBe(true);
    state = r1.state;
    // If not the target, opening again should fail
    if (!isDone(state)) {
      const r2 = applyAction(state, { type: 'open' });
      expect(r2.ok).toBe(false);
      expect(r2.reason).toContain('Already opened');
    }
  });
});
