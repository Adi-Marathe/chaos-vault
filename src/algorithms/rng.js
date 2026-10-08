/**
 * Seedable PRNG and helpers.
 * mulberry32 produces a deterministic sequence from a 32-bit seed.
 */

/**
 * Returns a seeded PRNG function (mulberry32).
 * Each call returns a float in [0, 1).
 */
export function mulberry32(seed) {
  let s = seed | 0;
  return function next() {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Random integer in [min, max] inclusive using the given rng.
 */
export function randomInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

/**
 * Fisher-Yates shuffle of an array (mutates in place), using the given rng.
 */
export function shuffle(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate `count` unique random integers in [min, max] inclusive.
 */
export function uniqueRandomInts(rng, count, min, max) {
  if (max - min + 1 < count) {
    throw new Error(`Cannot pick ${count} unique ints from [${min}, ${max}]`);
  }
  const set = new Set();
  while (set.size < count) {
    set.add(randomInt(rng, min, max));
  }
  return Array.from(set);
}
