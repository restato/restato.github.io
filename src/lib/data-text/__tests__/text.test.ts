import { describe, expect, it } from 'vitest';
import { removeDuplicateLines, transformText } from '../text';

describe('text transformations', () => {
  it('supports title, sentence, camel, snake, kebab, upper, and lower case', () => {
    expect(transformText('hello WORLD', 'title')).toBe('Hello World');
    expect(transformText('hELLO WORLD. nEXT line!', 'sentence')).toBe('Hello world. Next line!');
    expect(transformText('Hello, café world', 'camel')).toBe('helloCaféWorld');
    expect(transformText('Hello, café world', 'snake')).toBe('hello_café_world');
    expect(transformText('Hello, café world', 'kebab')).toBe('hello-café-world');
    expect(transformText('Mixed', 'upper')).toBe('MIXED');
    expect(transformText('Mixed', 'lower')).toBe('mixed');
  });

  it('creates ASCII slugs with normalized spacing and punctuation', () => {
    expect(transformText('  Crème brûlée & Café!  ', 'slug')).toBe('creme-brulee-cafe');
  });

  it('removes duplicate lines while preserving first-seen order', () => {
    expect(removeDuplicateLines(' Alpha \nbeta\nalpha\n\nbeta ', { trim: true, ignoreCase: true, removeBlank: true })).toBe(
      'Alpha\nbeta',
    );
  });
});
