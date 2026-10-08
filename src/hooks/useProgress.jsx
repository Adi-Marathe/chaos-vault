import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { loadProgress, saveProgress, clearProgress } from '../utils/storage';
import { levels, getLevelIndex, TOTAL_LEVELS } from '../data/levels';

const ProgressContext = createContext(null);

/**
 * Provider that wraps the app and exposes progress state.
 */
export function ProgressProvider({ children }) {
  const [data, setData] = useState(() => loadProgress());

  const persist = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveProgress(next);
      return next;
    });
  }, []);

  /**
   * Is a level unlocked?
   * Level 0 is always unlocked; level N+1 unlocks when level N is cleared.
   */
  const isUnlocked = useCallback(
    (levelId) => {
      const idx = getLevelIndex(levelId);
      if (idx <= 0) return true; // first level always unlocked
      const prevLevel = levels[idx - 1];
      return !!data.levels[prevLevel.id]?.cleared;
    },
    [data],
  );

  /**
   * Get stats for a specific level.
   */
  const getStats = useCallback(
    (levelId) => {
      return data.levels[levelId] || null;
    },
    [data],
  );

  /**
   * Record a successful result.
   * result: { levelId, stars, timeSec, mistakes, moves, parMoves, heartsLeft }
   */
  const recordResult = useCallback(
    (result) => {
      persist((prev) => {
        const existing = prev.levels[result.levelId] || {
          cleared: false,
          bestStars: 0,
          bestTimeSec: Infinity,
          fewestMistakes: Infinity,
          attempts: 0,
          lastPlayedAt: null,
        };

        const firstClear = !existing.cleared;
        const starsGained = Math.max(0, result.stars - existing.bestStars);

        const updated = {
          ...existing,
          cleared: true,
          bestStars: Math.max(existing.bestStars, result.stars),
          bestTimeSec: Math.min(
            existing.bestTimeSec === Infinity ? result.timeSec : existing.bestTimeSec,
            result.timeSec,
          ),
          fewestMistakes: Math.min(
            existing.fewestMistakes === Infinity ? result.mistakes : existing.fewestMistakes,
            result.mistakes,
          ),
          attempts: existing.attempts + 1,
          lastPlayedAt: new Date().toISOString(),
        };

        const lastResult = {
          ...result,
          firstClear,
          starsGained,
          earnedAt: new Date().toISOString(),
        };

        return {
          ...prev,
          levels: { ...prev.levels, [result.levelId]: updated },
          lastResult,
        };
      });
    },
    [persist],
  );

  /**
   * Record a failed attempt (0 hearts).
   */
  const recordFail = useCallback(
    (levelId) => {
      persist((prev) => {
        const existing = prev.levels[levelId] || {
          cleared: false,
          bestStars: 0,
          bestTimeSec: Infinity,
          fewestMistakes: Infinity,
          attempts: 0,
          lastPlayedAt: null,
        };
        return {
          ...prev,
          levels: {
            ...prev.levels,
            [levelId]: {
              ...existing,
              attempts: existing.attempts + 1,
              lastPlayedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [persist],
  );

  /**
   * Reset all progress.
   */
  const resetProgress = useCallback(() => {
    clearProgress();
    setData({ levels: {}, lastResult: null });
  }, []);

  /** Derived values */
  const clearedCount = useMemo(
    () => Object.values(data.levels).filter((l) => l.cleared).length,
    [data],
  );

  const totalStars = useMemo(
    () => Object.values(data.levels).reduce((sum, l) => sum + (l.bestStars || 0), 0),
    [data],
  );

  /** Coins: 10 per best star, summed over all levels (derived, not stored). */
  const coins = useMemo(() => totalStars * 10, [totalStars]);

  /** The next uncleared level (for "Continue" CTA). */
  const nextLevel = useMemo(() => {
    return levels.find((l) => !data.levels[l.id]?.cleared) || null;
  }, [data]);

  const value = useMemo(
    () => ({
      progress: data,
      isUnlocked,
      getStats,
      recordResult,
      recordFail,
      resetProgress,
      clearedCount,
      totalStars,
      coins,
      nextLevel,
    }),
    [data, isUnlocked, getStats, recordResult, recordFail, resetProgress, clearedCount, totalStars, coins, nextLevel],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

/**
 * Hook to access progress context.
 */
export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
