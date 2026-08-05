import { useState } from 'react';
import { generateLadder, traceLadder, type Ladder } from '../../../lib/random/ladder';
import { ToolShell, ToolStatus } from '../media-calc/ToolShell';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;
const ROWS_PER_PLAYER = 3;
const COLUMN_GAP = 72;
const ROW_GAP = 26;
const PADDING = 20;

const resize = (values: string[], size: number) =>
  Array.from({ length: size }, (_, index) => values[index] ?? '');

const playerFallback = (name: string, index: number) => name.trim() || `Player ${index + 1}`;
const resultFallback = (label: string, index: number) =>
  label.trim() || (index === 0 ? 'Winner' : 'Pass');

export default function LadderGameTool() {
  const [playerCount, setPlayerCount] = useState(4);
  const [names, setNames] = useState<string[]>(resize([], 4));
  const [results, setResults] = useState<string[]>(resize([], 4));
  const [ladder, setLadder] = useState<Ladder | null>(null);
  const [revealed, setRevealed] = useState<number[]>([]);

  const changeCount = (nextCount: number) => {
    setPlayerCount(nextCount);
    setNames(current => resize(current, nextCount));
    setResults(current => resize(current, nextCount));
    setLadder(null);
    setRevealed([]);
  };

  const build = () => {
    setLadder(generateLadder(playerCount, playerCount * ROWS_PER_PLAYER));
    setRevealed([]);
  };

  const reveal = (column: number) =>
    setRevealed(current => (current.includes(column) ? current : [...current, column]));

  const width = PADDING * 2 + (playerCount - 1) * COLUMN_GAP;
  const height = ladder ? PADDING * 2 + ladder.rows * ROW_GAP : 0;
  const railX = (column: number) => PADDING + column * COLUMN_GAP;
  const rungY = (row: number) => PADDING + (row + 0.5) * ROW_GAP;

  const pathPoints = (startColumn: number): string => {
    if (!ladder) return '';
    const { path } = traceLadder(ladder, startColumn);
    const points: string[] = [`${railX(path[0])},${PADDING - 10}`];
    for (let row = 0; row < ladder.rows; row += 1) {
      if (path[row + 1] !== path[row]) {
        points.push(`${railX(path[row])},${rungY(row)}`);
        points.push(`${railX(path[row + 1])},${rungY(row)}`);
      }
    }
    points.push(`${railX(path[ladder.rows])},${height - PADDING + 10}`);
    return points.join(' ');
  };

  return (
    <ToolShell>
      <ToolField id="ladder-player-count" label="Number of players">
        <select
          value={playerCount}
          onChange={event => changeCount(Number(event.target.value))}
        >
          {Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, index) => MIN_PLAYERS + index)
            .map(count => <option key={count} value={count}>{count}</option>)}
        </select>
      </ToolField>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          {names.map((name, index) => (
            <ToolField key={`name-${index}`} id={`ladder-name-${index}`} label={`Player ${index + 1} name`}>
              <input
                type="text"
                value={name}
                placeholder={`Player ${index + 1}`}
                onChange={event =>
                  setNames(current => current.map((value, i) => (i === index ? event.target.value : value)))}
              />
            </ToolField>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {results.map((label, index) => (
            <ToolField key={`result-${index}`} id={`ladder-result-${index}`} label={`Result ${index + 1}`}>
              <input
                type="text"
                value={label}
                placeholder={index === 0 ? 'Winner' : 'Pass'}
                onChange={event =>
                  setResults(current => current.map((value, i) => (i === index ? event.target.value : value)))}
              />
            </ToolField>
          ))}
        </div>
      </div>
      <ToolActions
        primary={<button type="button" onClick={build}>{ladder ? 'Shuffle again' : 'Build ladder'}</button>}
        secondary={ladder && (
          <button
            type="button"
            onClick={() => setRevealed(Array.from({ length: playerCount }, (_, column) => column))}
          >
            Reveal all
          </button>
        )}
      />
      {ladder && (
        <div className="overflow-x-auto">
          <svg
            data-testid="ladder-svg"
            role="img"
            aria-label="Ladder diagram"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="mx-auto"
          >
            {Array.from({ length: playerCount }, (_, column) => (
              <line
                key={`rail-${column}`}
                data-rail
                x1={railX(column)}
                y1={PADDING}
                x2={railX(column)}
                y2={height - PADDING}
                stroke="currentColor"
                strokeWidth="2"
              />
            ))}
            {ladder.rungs.flatMap((rowRungs, row) =>
              rowRungs.map((hasRung, column) => hasRung && (
                <line
                  key={`rung-${row}-${column}`}
                  x1={railX(column)}
                  y1={rungY(row)}
                  x2={railX(column + 1)}
                  y2={rungY(row)}
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.6"
                />
              )),
            )}
            {revealed.map((column, order) => (
              <polyline
                key={`path-${column}`}
                data-path
                points={pathPoints(column)}
                fill="none"
                stroke={`hsl(${(column * 137) % 360} 70% 50%)`}
                strokeWidth="4"
                strokeLinejoin="round"
                opacity={order === revealed.length - 1 ? 1 : 0.5}
              />
            ))}
          </svg>
        </div>
      )}
      {ladder && (
        <ToolActions
          selection
          primary={names.map((name, column) => (
            <button
              key={`trace-${column}`}
              type="button"
              aria-pressed={revealed.includes(column)}
              onClick={() => reveal(column)}
            >
              {`Trace ${playerFallback(name, column)}`}
            </button>
          ))}
        />
      )}
      {ladder && (
        <ToolStatus status="success" title="Outcomes">
          <ul data-testid="ladder-outcomes" className="flex flex-col gap-1">
            {revealed.map(column => {
              const endColumn = traceLadder(ladder, column).endColumn;
              return (
                <li key={`outcome-${column}`} data-testid="ladder-outcome-item">
                  {`${playerFallback(names[column], column)} → ${resultFallback(results[endColumn], endColumn)}`}
                </li>
              );
            })}
          </ul>
        </ToolStatus>
      )}
    </ToolShell>
  );
}
