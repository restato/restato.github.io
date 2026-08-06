# Ladder Game Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a client-side 사다리타기 (Amidakuji / ladder lottery) tool at `/{lang}/tools/ladder-game` following the additional-tools registry pattern.

**Architecture:** Pure ladder logic in `src/lib/random/ladder.ts` (injected RNG, fully unit-tested), an English-UI React component rendering the ladder as SVG, and registration through the additional-tools pipeline (`additions/random.ts` with 12-language profiles → registry → island lazy import → contract tests).

**Tech Stack:** React 19, TypeScript, Astro 5 static routes (auto-generated from registry), vitest + testing-library.

---

### Task 1: Ladder logic module

**Files:**
- Create: `src/lib/random/ladder.ts`
- Test: `src/lib/random/__tests__/ladder.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/random/__tests__/ladder.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/random/__tests__/ladder.test.ts`
Expected: FAIL — cannot resolve `../ladder`.

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/random/ladder.ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/random/__tests__/ladder.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/random
git commit -m "feat: add ladder lottery generation and tracing logic"
```

### Task 2: LadderGameTool component

**Files:**
- Create: `src/components/tools/random/LadderGameTool.tsx`
- Test: `src/components/tools/random/__tests__/tools.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/tools/random/__tests__/tools.test.tsx
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import LadderGameTool from '../LadderGameTool';

const buildLadder = () => fireEvent.click(screen.getByRole('button', { name: 'Build ladder' }));

describe('LadderGameTool', () => {
  it('renders shared field controls for players and results', () => {
    render(<LadderGameTool />);
    const count = screen.getByLabelText('Number of players');
    expect(count).toHaveClass('fc-select');
    expect(count.closest('.fc-tool-field')).not.toBeNull();
    expect(screen.getByLabelText('Player 1 name')).toHaveClass('fc-input');
    expect(screen.getByLabelText('Result 1')).toHaveClass('fc-input');
  });

  it('resizes name and result fields when the player count changes', () => {
    render(<LadderGameTool />);
    fireEvent.change(screen.getByLabelText('Number of players'), { target: { value: '5' } });
    expect(screen.getByLabelText('Player 5 name')).toBeInTheDocument();
    expect(screen.getByLabelText('Result 5')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Number of players'), { target: { value: '2' } });
    expect(screen.queryByLabelText('Player 3 name')).not.toBeInTheDocument();
  });

  it('builds an SVG ladder with one rail per player', () => {
    render(<LadderGameTool />);
    buildLadder();
    expect(screen.getByTestId('ladder-svg').querySelectorAll('[data-rail]')).toHaveLength(4);
  });

  it('reveals a single result when a player is picked', () => {
    render(<LadderGameTool />);
    buildLadder();
    fireEvent.click(screen.getByRole('button', { name: 'Trace Player 1' }));
    const outcomes = screen.getByTestId('ladder-outcomes');
    expect(outcomes.textContent).toContain('Player 1');
    expect(screen.getByTestId('ladder-svg').querySelector('[data-path]')).not.toBeNull();
  });

  it('reveals every result at once', () => {
    render(<LadderGameTool />);
    buildLadder();
    fireEvent.click(screen.getByRole('button', { name: 'Reveal all' }));
    const outcomes = screen.getByTestId('ladder-outcomes');
    for (let player = 1; player <= 4; player += 1) {
      expect(outcomes.textContent).toContain(`Player ${player}`);
    }
  });

  it('assigns every result exactly once when all are revealed', () => {
    render(<LadderGameTool />);
    for (let index = 1; index <= 4; index += 1) {
      fireEvent.change(screen.getByLabelText(`Result ${index}`), { target: { value: `Prize ${index}` } });
    }
    buildLadder();
    fireEvent.click(screen.getByRole('button', { name: 'Reveal all' }));
    const items = screen.getAllByTestId('ladder-outcome-item');
    const results = items.map(item => item.textContent?.split('→')[1]?.trim());
    expect(new Set(results).size).toBe(4);
  });

  it('clears revealed outcomes when the ladder is shuffled', () => {
    render(<LadderGameTool />);
    buildLadder();
    fireEvent.click(screen.getByRole('button', { name: 'Reveal all' }));
    fireEvent.click(screen.getByRole('button', { name: 'Shuffle again' }));
    expect(screen.queryAllByTestId('ladder-outcome-item')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/tools/random/__tests__/tools.test.tsx`
Expected: FAIL — cannot resolve `../LadderGameTool`.

- [ ] **Step 3: Write the component**

```tsx
// src/components/tools/random/LadderGameTool.tsx
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
            {revealed.map(column => (
              <li key={`outcome-${column}`} data-testid="ladder-outcome-item">
                {`${playerFallback(names[column], column)} → ${resultFallback(
                  results[traceLadder(ladder, column).endColumn],
                  traceLadder(ladder, column).endColumn,
                )}`}
              </li>
            ))}
          </ul>
        </ToolStatus>
      )}
    </ToolShell>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/tools/random/__tests__/tools.test.tsx`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/tools/random
git commit -m "feat: add ladder game tool component"
```

### Task 3: Register ladder-game in the additional-tools pipeline

**Files:**
- Create: `src/data/tools/additions/random.ts`
- Modify: `src/data/tools/registry.ts` (imports + `additionalToolDefinitions` spread)
- Modify: `src/data/tools/localizedContent.ts` (imports + `getEnglishProfilePhrases` array)
- Modify: `src/components/tools/additionalToolSlugs.ts`
- Modify: `src/components/tools/AdditionalToolIsland.tsx`
- Modify: `src/data/tools/resultAdoption.ts`
- Modify: `src/data/tools/__tests__/additionalToolsIntegration.test.ts`
- Modify: `src/data/tools/__tests__/resultAdoptionContract.test.ts`

- [ ] **Step 1: Extend the contract tests first (failing)**

In `additionalToolsIntegration.test.ts`, add `'ladder-game'` to `additionalSlugs`:

```ts
const additionalSlugs = [
  'pdf-merge', 'pdf-split', 'pdf-rotate', 'images-to-pdf', 'pdf-to-images',
  'csv-json', 'text-cleaner', 'seo-generator',
  'modern-image-converter', 'exif-remover', 'favicon-generator', 'loan-calculator', 'audio-trimmer',
  'ladder-game',
] as const;
```

In `resultAdoptionContract.test.ts`, add the import and spread:

```ts
import { additionalTools as randomTools } from '../additions/random';
```

```ts
const publicTools = [
  ...toolsConfig.map(({ slug, component }) => ({ slug, component })),
  { slug: 'anonymous-chat', component: 'Chat' },
  ...dataTextTools.map(({ slug, component }) => ({ slug, component })),
  ...mediaCalculatorTools.map(({ slug, component }) => ({ slug, component })),
  ...pdfTools.map(({ slug, component }) => ({ slug, component })),
  ...randomTools.map(({ slug, component }) => ({ slug, component })),
].sort((left, right) => left.slug.localeCompare(right.slug));
```

- [ ] **Step 2: Run contract tests to verify they fail**

Run: `npx vitest run src/data/tools/__tests__/additionalToolsIntegration.test.ts src/data/tools/__tests__/resultAdoptionContract.test.ts`
Expected: FAIL — `../additions/random` unresolved / `ladder-game` registry entry undefined.

- [ ] **Step 3: Create `src/data/tools/additions/random.ts`**

```ts
import type { AdditionalToolProfile } from '../localizedContent';
import type { Language } from '../types';
import type { AdditionalToolSpec } from './types';

const ladderProfiles: Record<Language, AdditionalToolProfile> = {
  ko: { name: '사다리타기', input: '참가자 이름과 결과 항목', output: '무작위 사다리를 따라 정해진 참가자별 결과', example: '참가자 4명 + 당첨 1개 → 당첨자 추첨', limitation: '브라우저 난수를 사용하므로 법적 효력이 필요한 추첨에는 적합하지 않습니다.' },
  en: { name: 'Ladder Game (Ghost Leg)', input: 'participant names and result labels', output: 'a random ladder assignment for every participant', example: '4 players + 1 winner slot → one winner drawn', limitation: 'Browser randomness is not certified for regulated lotteries.' },
  ja: { name: 'あみだくじ', input: '参加者名と結果の項目', output: 'ランダムなあみだくじで決まる参加者ごとの結果', example: '参加者4人 + 当たり1つ → 当選者を抽選', limitation: 'ブラウザの乱数を使用するため、法的効力が必要な抽選には適しません。' },
  'zh-CN': { name: '画鬼脚（阶梯抽签）', input: '参与者姓名和结果条目', output: '随机阶梯为每位参与者分配的结果', example: '4 名参与者 + 1 个中奖位 → 抽出一名中奖者', limitation: '使用浏览器随机数，不适用于需要法律效力的抽奖。' },
  'zh-TW': { name: '畫鬼腳（階梯抽籤）', input: '參與者姓名和結果項目', output: '隨機階梯為每位參與者分配的結果', example: '4 名參與者 + 1 個中獎位 → 抽出一名中獎者', limitation: '使用瀏覽器隨機數，不適用於需要法律效力的抽獎。' },
  es: { name: 'Sorteo de escalera (Amidakuji)', input: 'nombres de participantes y etiquetas de resultado', output: 'una asignación aleatoria de resultados para cada participante', example: '4 jugadores + 1 premio → se sortea un ganador', limitation: 'La aleatoriedad del navegador no está certificada para sorteos regulados.' },
  pt: { name: 'Sorteio de escada (Amidakuji)', input: 'nomes dos participantes e rótulos de resultado', output: 'uma atribuição aleatória de resultados para cada participante', example: '4 jogadores + 1 prêmio → um vencedor sorteado', limitation: 'A aleatoriedade do navegador não é certificada para sorteios regulamentados.' },
  de: { name: 'Leiterlos (Amidakuji)', input: 'Teilnehmernamen und Ergebnisfelder', output: 'eine zufällige Leiter-Zuordnung für jeden Teilnehmer', example: '4 Spieler + 1 Gewinnfeld → ein Gewinner wird gezogen', limitation: 'Browser-Zufallszahlen sind nicht für regulierte Verlosungen zertifiziert.' },
  fr: { name: "Tirage à l'échelle (Amidakuji)", input: 'les noms des participants et les libellés de résultat', output: 'une attribution aléatoire de résultat pour chaque participant', example: '4 joueurs + 1 lot → un gagnant tiré au sort', limitation: "L'aléa du navigateur n'est pas certifié pour les tirages réglementés." },
  it: { name: 'Sorteggio a scala (Amidakuji)', input: 'nomi dei partecipanti ed etichette dei risultati', output: "un'assegnazione casuale dei risultati per ogni partecipante", example: '4 giocatori + 1 premio → viene estratto un vincitore', limitation: 'La casualità del browser non è certificata per estrazioni regolamentate.' },
  id: { name: 'Undian tangga (Amidakuji)', input: 'nama peserta dan label hasil', output: 'penetapan hasil acak untuk setiap peserta', example: '4 pemain + 1 slot pemenang → satu pemenang diundi', limitation: 'Keacakan browser tidak tersertifikasi untuk undian resmi.' },
  hi: { name: 'सीढ़ी लॉटरी (अमिदाकुजी)', input: 'प्रतिभागियों के नाम और परिणाम लेबल', output: 'हर प्रतिभागी के लिए यादृच्छिक सीढ़ी से तय परिणाम', example: '4 खिलाड़ी + 1 विजेता स्थान → एक विजेता चुना जाता है', limitation: 'ब्राउज़र की यादृच्छिकता विनियमित लॉटरी के लिए प्रमाणित नहीं है।' },
};

export const additionalTools: AdditionalToolSpec[] = [
  {
    slug: 'ladder-game',
    icon: '🪜',
    category: 'random',
    component: 'LadderGameTool',
    related: ['coin-flip', 'dice'],
    profiles: ladderProfiles,
  },
];
```

- [ ] **Step 4: Register everywhere**

`src/data/tools/registry.ts` — add import next to the other additions imports, and add the spread inside `additionalToolDefinitions`:

```ts
import { additionalTools as randomTools } from './additions/random';
```

```ts
const additionalToolDefinitions: ToolDefinition[] = [
  ...pdfTools,
  ...dataTextTools,
  ...mediaCalcTools,
  ...randomTools,
].map(tool => {
```

`src/data/tools/localizedContent.ts` — add the same import next to the other additions imports, and extend the array in `getEnglishProfilePhrases`:

```ts
import { additionalTools as randomTools } from './additions/random';
```

```ts
  const additional = [...pdfTools, ...dataTextTools, ...mediaCalcTools, ...randomTools]
    .find(tool => tool.slug === slug)?.profiles.en;
```

`src/components/tools/additionalToolSlugs.ts`:

```ts
export const additionalToolSlugs = new Set([
  'pdf-merge', 'pdf-split', 'pdf-rotate', 'images-to-pdf', 'pdf-to-images',
  'csv-json', 'text-cleaner', 'seo-generator',
  'modern-image-converter', 'exif-remover', 'favicon-generator', 'loan-calculator', 'audio-trimmer',
  'ladder-game',
]);
```

`src/components/tools/AdditionalToolIsland.tsx` — add to `toolComponents`:

```ts
  'ladder-game': lazy(() => import('./random/LadderGameTool')),
```

`src/data/tools/resultAdoption.ts` — append to `toolResultAdoption`:

```ts
  { slug: 'ladder-game', component: 'LadderGameTool', mode: 'self-announcing', rationale: 'Each traced player appends to an always-visible labeled outcomes list beside the highlighted ladder path.' },
```

- [ ] **Step 5: Run the contract tests to verify they pass**

Run: `npx vitest run src/data/tools/__tests__/`
Expected: PASS (registry, pageMetadata, integration, resultAdoption suites).

- [ ] **Step 6: Commit**

```bash
git add src/data/tools src/components/tools/additionalToolSlugs.ts src/components/tools/AdditionalToolIsland.tsx
git commit -m "feat: publish ladder-game tool through the additional-tools registry"
```

### Task 4: Full verification

- [ ] **Step 1: Run the entire test suite**

Run: `npm test`
Expected: only the pre-existing `media-calc` loan-calculator failure (1 failed on master baseline); no new failures.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds; `dist/ko/tools/ladder-game/index.html` exists (spot-check with `ls dist/ko/tools/ladder-game`).

- [ ] **Step 3: Commit any stragglers and push**

```bash
git status --short   # expect clean
git push -u origin feature/ladder-game-tool
```
