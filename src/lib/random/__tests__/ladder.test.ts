import { describe, expect, it } from 'vitest';
import { generateLadder, traceLadder } from '../ladder';

// Small deterministic LCG so tests never depend on Math.random.
const makeRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
};

describe('generateLadder', () => {
  it('rejects fewer than 2 columns or 1 row', () => {
    expect(() => generateLadder(1, 5)).toThrow(RangeError);
    expect(() => generateLadder(3, 0)).toThrow(RangeError);
  });

  it('never places two adjacent rungs in the same row', () => {
    for (let seed = 1; seed <= 25; seed += 1) {
      const ladder = generateLadder(6, 18, makeRandom(seed));
      for (const rowRungs of ladder.rungs) {
        for (let col = 0; col + 1 < rowRungs.length; col += 1) {
          expect(rowRungs[col] && rowRungs[col + 1]).toBe(false);
        }
      }
    }
  });

  it('gives every neighbouring column pair at least one rung', () => {
    for (let seed = 1; seed <= 25; seed += 1) {
      const ladder = generateLadder(5, 15, makeRandom(seed));
      for (let col = 0; col < ladder.columns - 1; col += 1) {
        expect(ladder.rungs.some(rowRungs => rowRungs[col])).toBe(true);
      }
    }
  });

  it('is deterministic for a fixed RNG', () => {
    expect(generateLadder(4, 12, makeRandom(7))).toEqual(generateLadder(4, 12, makeRandom(7)));
  });
});

describe('traceLadder', () => {
  it('throws when the start column is out of range', () => {
    const ladder = generateLadder(3, 9, makeRandom(1));
    expect(() => traceLadder(ladder, -1)).toThrow(RangeError);
    expect(() => traceLadder(ladder, 3)).toThrow(RangeError);
  });

  it('records one position per row plus the entry position', () => {
    const ladder = generateLadder(4, 12, makeRandom(2));
    expect(traceLadder(ladder, 0).path).toHaveLength(13);
  });

  it('maps all start columns onto a permutation of end columns', () => {
    for (let seed = 1; seed <= 25; seed += 1) {
      const ladder = generateLadder(6, 18, makeRandom(seed));
      const ends = Array.from({ length: 6 }, (_, col) => traceLadder(ladder, col).endColumn);
      expect([...ends].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);
    }
  });

  it('follows a hand-built ladder exactly', () => {
    // 3 columns, 2 rows: row 0 swaps columns 0/1, row 1 swaps columns 1/2.
    const ladder = { columns: 3, rows: 2, rungs: [[true, false], [false, true]] };
    expect(traceLadder(ladder, 0)).toEqual({ endColumn: 2, path: [0, 1, 2] });
    expect(traceLadder(ladder, 1)).toEqual({ endColumn: 0, path: [1, 0, 0] });
    expect(traceLadder(ladder, 2)).toEqual({ endColumn: 1, path: [2, 2, 1] });
  });
});
