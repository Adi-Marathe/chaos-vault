import { useReducer, useCallback, useMemo } from 'react';

/**
 * Level game hook.
 *
 * Uses useReducer for pure state management (React StrictMode safe).
 * State shape:
 *   { seed, game, hearts, moves, mistakes, status, log, toast, parMoves }
 *
 * status: 'briefing' | 'playing' | 'paused' | 'won' | 'lost'
 */

function computeParMoves(engine, initialState) {
  let state = initialState;
  let count = 0;
  const maxIter = 2000;
  while (!engine.isDone(state) && count < maxIter) {
    const action = engine.nextCorrectAction(state);
    if (!action) break;
    const result = engine.applyAction(state, action);
    if (!result.ok) break;
    state = result.state;
    count++;
  }
  return count;
}

function makeSeed() {
  return Math.floor(Math.random() * 2147483647) + 1;
}

function initState(engine, seed) {
  const game = engine.createState(seed);
  const parMoves = computeParMoves(engine, game);
  return {
    seed,
    game,
    hearts: 3,
    moves: 0,
    mistakes: 0,
    status: 'briefing',
    log: [],
    toast: null,
    parMoves,
  };
}

/**
 * Pure reducer – all state transitions here.
 */
function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, status: 'playing', toast: null };

    case 'PAUSE':
      return { ...state, status: 'paused' };

    case 'RESUME':
      return { ...state, status: 'playing', toast: null };

    case 'ACT': {
      if (state.status !== 'playing') return state;
      const { engine, actionPayload } = action;
      const result = engine.applyAction(state.game, actionPayload);

      if (!result.ok) {
        // Invalid move
        const newHearts = state.hearts - 1;
        const newMistakes = state.mistakes + 1;
        const toast = { type: 'error', message: result.reason };

        if (newHearts <= 0) {
          return {
            ...state,
            hearts: 0,
            mistakes: newMistakes,
            status: 'lost',
            toast,
          };
        }

        return {
          ...state,
          hearts: newHearts,
          mistakes: newMistakes,
          toast,
        };
      }

      // Valid move
      const newMoves = state.moves + 1;
      const logEntry = {
        step: newMoves,
        text: result.event?.text || `Move ${newMoves}`,
        line: result.event?.line ?? -1,
      };
      const newLog = [logEntry, ...state.log];
      const toast = {
        type: 'success',
        message: result.event?.text || 'Valid move!',
      };

      // Check if done
      if (engine.isDone(result.state)) {
        return {
          ...state,
          game: result.state,
          moves: newMoves,
          log: newLog,
          status: 'won',
          toast,
        };
      }

      return {
        ...state,
        game: result.state,
        moves: newMoves,
        log: newLog,
        toast,
      };
    }

    case 'RESTART': {
      const { engine } = action;
      const newSeed = makeSeed();
      return initState(engine, newSeed);
    }

    case 'CLEAR_TOAST':
      return { ...state, toast: null };

    default:
      return state;
  }
}

/**
 * Hook for managing a level's game state.
 *
 * @param {object} engine - The algorithm engine module (meta, createState, applyAction, isDone, nextCorrectAction)
 * @returns Game state + action dispatchers
 */
export function useLevelGame(engine) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    const seed = makeSeed();
    return initState(engine, seed);
  });

  const act = useCallback(
    (actionPayload) => {
      dispatch({ type: 'ACT', engine, actionPayload });
    },
    [engine],
  );

  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART', engine }), [engine]);
  const clearToast = useCallback(() => dispatch({ type: 'CLEAR_TOAST' }), []);

  return useMemo(
    () => ({
      ...state,
      act,
      start,
      pause,
      resume,
      restart,
      clearToast,
    }),
    [state, act, start, pause, resume, restart, clearToast],
  );
}
