import { describe, expect, it } from 'vitest';
import { convertData, parseDelimited, stringifyDelimited } from '../conversion';

describe('delimited data conversion', () => {
  it('parses quoted delimiters, escaped quotes, and embedded newlines', () => {
    expect(parseDelimited('name,note\n"Doe, Jane","She said ""hi""\nand left"', ',')).toEqual([
      ['name', 'note'],
      ['Doe, Jane', 'She said "hi"\nand left'],
    ]);
  });

  it('escapes values when serializing CSV and preserves empty values', () => {
    expect(stringifyDelimited([['name', 'note'], ['Jane', 'a,b'], ['', 'say "hi"']], ',')).toBe(
      'name,note\nJane,"a,b"\n,"say ""hi"""',
    );
  });

  it('converts CSV to JSON using the header row', () => {
    expect(convertData('name,age\nAda,36', 'csv', 'json')).toBe(
      '[\n  {\n    "name": "Ada",\n    "age": "36"\n  }\n]',
    );
  });

  it('converts a JSON object array to TSV and rejects nested values', () => {
    expect(convertData('[{"name":"Ada","active":true}]', 'json', 'tsv')).toBe('name\tactive\nAda\ttrue');
    expect(() => convertData('[{"name":{"first":"Ada"}}]', 'json', 'csv')).toThrow('scalar');
  });

  it('rejects malformed rows and duplicate or blank headers', () => {
    expect(() => convertData('name,age\nAda', 'csv', 'json')).toThrow('columns');
    expect(() => convertData('name,name\nAda,Lovelace', 'csv', 'json')).toThrow('unique');
    expect(() => convertData('name,\nAda,36', 'csv', 'json')).toThrow('blank');
  });
});
