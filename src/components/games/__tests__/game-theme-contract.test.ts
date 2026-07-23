import { readFileSync, readdirSync } from 'node:fs';
import ts from 'typescript';
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

interface ElementRecord {
  file: string;
  line: number;
  tag: string;
  node: ts.JsxOpeningLikeElement;
  sourceFile: ts.SourceFile;
}

function getAttribute(element: ElementRecord, name: string) {
  return element.node.attributes.properties.find(
    (property): property is ts.JsxAttribute => ts.isJsxAttribute(property)
      && property.name.getText(element.sourceFile) === name,
  );
}

function attributeSource(element: ElementRecord, name: string) {
  return getAttribute(element, name)?.getText(element.sourceFile) ?? '';
}

function hasAccessibleAssociation(element: ElementRecord) {
  if (getAttribute(element, 'aria-label') || getAttribute(element, 'aria-labelledby')) return true;

  let parent: ts.Node | undefined = element.node.parent;
  while (parent) {
    if (ts.isJsxElement(parent) && parent.openingElement.tagName.getText(element.sourceFile) === 'label') {
      return true;
    }
    parent = parent.parent;
  }

  const idAttribute = getAttribute(element, 'id');
  const id = idAttribute?.initializer && ts.isStringLiteral(idAttribute.initializer)
    ? idAttribute.initializer.text
    : null;
  if (!id) return false;

  return element.sourceFile.getText().includes(`htmlFor="${id}"`);
}

function collectElements(file: string): ElementRecord[] {
  const source = readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const elements: ElementRecord[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(sourceFile);
      const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      elements.push({ file, line: line + 1, tag, node, sourceFile });
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return elements;
}

const elements = gameFiles.flatMap(collectElements);
const controls = elements.filter(element => ['button', 'input', 'textarea'].includes(element.tag));

describe('Forest Café game structure contract', () => {
  it('styles every native control with the matching shared primitive', () => {
    const violations = controls.flatMap(element => {
      const classSource = attributeSource(element, 'className');
      const typeSource = attributeSource(element, 'type');
      const hasPrimitive = element.tag === 'button'
        ? /\bfc-(?:button|game-cell|chip)\b/.test(classSource)
        : element.tag === 'textarea'
          ? /\bfc-textarea\b/.test(classSource)
          : /type="checkbox"/.test(typeSource)
            ? /\bfc-check\b/.test(classSource)
            : /\bfc-input\b/.test(classSource);

      return hasPrimitive ? [] : [`${element.file}:${element.line} <${element.tag}>`];
    });

    expect(violations).toEqual([]);
  });

  it('sets an explicit type on every native game button', () => {
    const violations = controls
      .filter(element => element.tag === 'button')
      .filter(element => !getAttribute(element, 'type'))
      .map(element => `${element.file}:${element.line} <button>`);

    expect(violations).toEqual([]);
  });

  it('associates every game input and textarea with a real accessible label', () => {
    const violations = controls
      .filter(element => element.tag === 'input' || element.tag === 'textarea')
      .filter(element => !hasAccessibleAssociation(element))
      .map(element => `${element.file}:${element.line} <${element.tag}>`);

    expect(violations).toEqual([]);
  });

  it('exposes selected state on every visual mode, difficulty, language, and catalog selector', () => {
    const selectorPattern = /(?:(?:set|change)(?:Difficulty|Language|Mode|Filter)\s*\(|newGame\(diff\))/;
    const violations = controls
      .filter(element => element.tag === 'button')
      .filter(element => selectorPattern.test(attributeSource(element, 'onClick')))
      .filter(element => !getAttribute(element, 'aria-pressed'))
      .map(element => `${element.file}:${element.line} selector button`);

    expect(violations).toEqual([]);
  });

  it('gives every clickable non-native game surface keyboard semantics', () => {
    const violations = elements
      .filter(element => element.tag !== 'button' && getAttribute(element, 'onClick'))
      .filter(element => (
        !getAttribute(element, 'role')
        || !getAttribute(element, 'tabIndex')
        || !getAttribute(element, 'onKeyDown')
      ))
      .map(element => `${element.file}:${element.line} <${element.tag}>`);

    expect(violations).toEqual([]);
  });

  it('removes legacy decoration and transition-all from each scoped component', () => {
    const violations = gameFiles.flatMap(file => {
      const source = readFileSync(file, 'utf8');
      const forbiddenPatterns = [
        /\bbg-gradient-to-\w+/g,
        /\bbackdrop-blur(?:-\w+)?/g,
        /\bbg-white\/\d+/g,
        /\bhover:(?:-?translate-[xy]|scale-\d+|shadow-\w+)/g,
        /\btransition-all\b/g,
      ];

      return forbiddenPatterns.flatMap(pattern =>
        Array.from(source.matchAll(pattern), match => {
          const line = source.slice(0, match.index).split('\n').length;
          return `${file}:${line} ${match[0]}`;
        }),
      );
    });

    expect(violations).toEqual([]);
  });

  it('uses a neutral PageShell container inside MainLayout and keeps migrated routes on that shell', () => {
    const pageShell = readFileSync('src/components/ui/PageShell.astro', 'utf8');
    expect(pageShell).not.toContain('<main');
    expect(pageShell).toMatch(/<(?:div|section)\b/);

    const violations = gamePageFiles.flatMap(file => {
      const source = readFileSync(file, 'utf8');
      const missing = [
        !source.includes('PageShell') && 'PageShell',
        !source.includes('PageHeader') && 'PageHeader',
      ].filter(Boolean);
      return missing.map(component => `${file}: missing ${component}`);
    });
    expect(violations).toEqual([]);
  });

  it('keeps narrow game boards fluid or intentionally internally scrollable', () => {
    const expectations: Record<string, RegExp> = {
      'src/components/games/Game2048.tsx': /\b(?:w-full|max-w-full|overflow-x-auto)\b/,
      'src/components/games/TicTacToe.tsx': /\b(?:aspect-square|w-full|max-w-full)\b/,
      'src/components/games/Minesweeper.tsx': /\boverflow-x-auto\b/,
      'src/components/Roulette.tsx': /\b(?:aspect-square|w-full|max-w-full)\b/,
      'src/components/SlotMachine.tsx': /\b(?:grid-cols-3|w-full|max-w-full)\b/,
    };

    const violations = Object.entries(expectations).flatMap(([file, pattern]) => (
      pattern.test(readFileSync(file, 'utf8')) ? [] : [file]
    ));

    expect(violations).toEqual([]);
  });

  it('enumerates every dynamic or terminal status owner', () => {
    const statusOwners = [
      'src/components/ReactionTest.tsx',
      'src/components/games/Breakout.tsx',
      'src/components/games/DinoRunner.tsx',
      'src/components/games/FlappyBird.tsx',
      'src/components/games/SnakeGame.tsx',
      'src/components/games/MathQuiz.tsx',
      'src/components/games/ColorMatch.tsx',
    ];

    const violations = statusOwners.flatMap(file => {
      const owner = elements.find(element => (
        element.file === file
        && /role="status"/.test(attributeSource(element, 'role'))
        && getAttribute(element, 'aria-live')
      ));
      return owner ? [] : [`${file}: missing explicit live status owner`];
    });

    expect(violations).toEqual([]);
  });
});
