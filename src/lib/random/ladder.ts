export interface Ladder {
  columns: number;
  rows: number;
  /** rungs[row][col] is true when a rung connects column col to col + 1 at that row. */
  rungs: boolean[][];
}

export interface LadderTrace {
  endColumn: number;
  /** Column occupied before row 0, then after each row — path.length === rows + 1. */
  path: number[];
}

const RUNG_PROBABILITY = 0.4;

export function generateLadder(
  columns: number,
  rows: number,
  random: () => number = Math.random,
): Ladder {
  if (columns < 2) throw new RangeError('a ladder needs at least 2 columns');
  if (rows < 1) throw new RangeError('a ladder needs at least 1 row');

  const rungs: boolean[][] = [];
  for (let row = 0; row < rows; row += 1) {
    const rowRungs = new Array<boolean>(columns - 1).fill(false);
    for (let col = 0; col < columns - 1; col += 1) {
      if (col > 0 && rowRungs[col - 1]) continue;
      rowRungs[col] = random() < RUNG_PROBABILITY;
    }
    rungs.push(rowRungs);
  }

  for (let col = 0; col < columns - 1; col += 1) {
    if (rungs.some(rowRungs => rowRungs[col])) continue;
    const freeRow = rungs.find(rowRungs =>
      !(col > 0 && rowRungs[col - 1]) && !(col + 1 < columns - 1 && rowRungs[col + 1]),
    );
    if (freeRow) freeRow[col] = true;
  }

  return { columns, rows, rungs };
}

export function traceLadder(ladder: Ladder, startColumn: number): LadderTrace {
  if (startColumn < 0 || startColumn >= ladder.columns) {
    throw new RangeError('start column is outside the ladder');
  }
  let column = startColumn;
  const path = [column];
  for (let row = 0; row < ladder.rows; row += 1) {
    const rowRungs = ladder.rungs[row];
    if (column < ladder.columns - 1 && rowRungs[column]) column += 1;
    else if (column > 0 && rowRungs[column - 1]) column -= 1;
    path.push(column);
  }
  return { endColumn: column, path };
}
