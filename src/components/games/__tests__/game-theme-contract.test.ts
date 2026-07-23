import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const gameDirectory = 'src/components/games';
const legacyGameFiles = [
  'src/components/MemoryGame.tsx',
  'src/components/NumberGuess.tsx',
  'src/components/ReactionTest.tsx',
  'src/components/RockPaperScissors.tsx',
  'src/components/Roulette.tsx',
  'src/components/SlotMachine.tsx',
];

const localizedGameFiles = [
  ...readdirSync(gameDirectory)
    .filter(file => file.endsWith('.tsx'))
    .map(file => `${gameDirectory}/${file}`),
  ...readdirSync(`${gameDirectory}/roulette`)
    .filter(file => file.endsWith('.tsx'))
    .map(file => `${gameDirectory}/roulette/${file}`),
];

const gameFiles = [...legacyGameFiles, ...localizedGameFiles];
const playableGameFiles = gameFiles.filter(file =>
  !file.endsWith('/RouletteWheel.tsx') && !file.endsWith('/GameCatalog.tsx'),
);

const gamePageFiles = [
  'src/pages/[lang]/games/index.astro',
  'src/pages/[lang]/games/[slug].astro',
  'src/pages/games/index.astro',
  'src/pages/projects/index.astro',
  'src/pages/projects/games.astro',
  'src/pages/projects/memory-game.astro',
  'src/pages/projects/number-guess.astro',
  'src/pages/projects/reaction-test.astro',
  'src/pages/projects/rock-paper-scissors.astro',
  'src/pages/projects/roulette.astro',
  'src/pages/projects/slot-machine.astro',
];

const sources = new Map(
  gameFiles.map(file => [file, readFileSync(file, 'utf8')]),
);

describe('Forest Café game theme contract', () => {
  it('removes legacy gradient, glass, shadow-lift, and hover-lift decoration', () => {
    const violations = Array.from(sources).flatMap(([file, source]) => {
      const forbiddenPatterns = [
        /\bbg-gradient-to-\w+/g,
        /\bbackdrop-blur(?:-\w+)?/g,
        /\bbg-white\/\d+/g,
        /\bhover:(?:-?translate-[xy]|scale-\d+|shadow-\w+)/g,
      ];

      return forbiddenPatterns.flatMap(pattern =>
        Array.from(source.matchAll(pattern), match => `${file}: ${match[0]}`),
      );
    });

    expect(violations).toEqual([]);
  });

  it('uses the shared game root, surface, and action primitives', () => {
    const violations = playableGameFiles.flatMap(file => {
      const source = sources.get(file) ?? '';
      const missing = [];

      if (!source.includes('fc-game')) missing.push('fc-game');
      if (!source.includes('fc-surface')) missing.push('fc-surface');
      if (source.includes('<button') && !source.includes('fc-button')) missing.push('fc-button');

      return missing.map(className => `${file}: missing ${className}`);
    });

    expect(violations).toEqual([]);
  });

  it('keeps action controls keyboard-safe with explicit button semantics', () => {
    const violations = Array.from(sources).flatMap(([file, source]) => {
      const buttonViolations = Array.from(source.matchAll(/<button\b[\s\S]*?>/g))
        .filter(match => !/\btype="(?:button|submit)"/.test(match[0]))
        .map(() => `${file}: button missing explicit type`);

      const canvasActionViolations = file.endsWith('/RouletteWheel.tsx')
        && source.includes('onClick={spin}')
        && (!source.includes('role="button"')
          || !source.includes('tabIndex={0}')
          || !source.includes('onKeyDown'))
        ? [`${file}: clickable canvas missing keyboard semantics`]
        : [];

      const pointerActionViolations = file.endsWith('/FlappyBird.tsx')
        && source.includes('onClick={handleInteraction}')
        && (!source.includes('role="button"')
          || !source.includes('tabIndex={0}')
          || !source.includes('onKeyDown'))
        ? [`${file}: clickable play surface missing keyboard semantics`]
        : [];

      const touchActionViolations = file.endsWith('/DinoRunner.tsx')
        && source.includes('onClick={handleTouch}')
        && (!source.includes('role="button"')
          || !source.includes('tabIndex={0}')
          || !source.includes('onKeyDown'))
        ? [`${file}: clickable runner surface missing keyboard semantics`]
        : [];

      return [
        ...buttonViolations,
        ...canvasActionViolations,
        ...pointerActionViolations,
        ...touchActionViolations,
      ];
    });

    expect(violations).toEqual([]);
  });

  it('wraps every game and project route in the shared page shell and header', () => {
    const violations = gamePageFiles.flatMap(file => {
      const source = readFileSync(file, 'utf8');
      const missing = [];

      if (!source.includes('PageShell')) missing.push('PageShell');
      if (!source.includes('PageHeader')) missing.push('PageHeader');

      return missing.map(component => `${file}: missing ${component}`);
    });

    expect(violations).toEqual([]);
  });

  it('gives the localized catalog the compact searchable tool grammar', () => {
    const catalogPage = readFileSync('src/pages/[lang]/games/index.astro', 'utf8');

    expect(catalogPage).toContain('GameCatalog');
    expect(catalogPage).not.toMatch(/hover:(?:-?translate-[xy]|scale-\d+|shadow-\w+)/);
  });
});
