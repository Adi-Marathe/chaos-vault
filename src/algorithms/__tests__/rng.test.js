import { describe, it, expect } from 'vitest';
import { mulberry32, randomInt, shuffle, uniqueRandomInts } from '../rng.js';

describe('mulberry32', () => {
  it('produces deterministic output for the same seed', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);
    const seq1 = Array.from({ length: 20 }, () => rng1());
    const seq2 = Array.from({ length: 20 }, () => rng2());
    expect(seq1).toEqual(seq2);
  });

  it('produces different output for different seeds', () => {
    const rng1 = mulberry32(1);
    const rng2 = mulberry32(2);
    const v1 = rng1();
    const v2 = rng2();
    expect(v1).not.toBe(v2);
  });

  it('produces values in [0, 1)', () => {
    const rng = mulberry32(99);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('randomInt', () => {
  it('produces values within the range [min, max]', () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 200; i++) {
      const v = randomInt(rng, 5, 15);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(15);
    }
  });
});

describe('shuffle', () => {
  it('keeps all elements', () => {
    const rng = mulberry32(10);
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    shuffle(rng, arr);
    expect(arr.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('is deterministic for the same seed', () => {
    const a = [1, 2, 3, 4, 5];
    const b = [1, 2, 3, 4, 5];
    shuffle(mulberry32(77), a);
    shuffle(mulberry32(77), b);
    expect(a).toEqual(b);
  });
});

describe('uniqueRandomInts', () => {
  it('produces the correct count of unique values', () => {
    const rng = mulberry32(42);
    const vals = uniqueRandomInts(rng, 8, 1, 99);
    expect(vals.length).toBe(8);
    expect(new Set(vals).size).toBe(8);
  });

  it('all values are within [min, max]', () => {
    const rng = mulberry32(55);
    const vals = uniqueRandomInts(rng, 10, 10, 50);
    for (const v of vals) {
      expect(v).toBeGreaterThanOrEqual(10);
      expect(v).toBeLessThanOrEqual(50);
    }
  });

  it('throws if range is too small', () => {
    const rng = mulberry32(1);
    expect(() => uniqueRandomInts(rng, 5, 1, 3)).toThrow();
  });
});
