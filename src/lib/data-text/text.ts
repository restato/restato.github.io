export type TextTransformation = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab' | 'slug';

function words(input: string): string[] {
  return input.match(/[\p{L}\p{N}]+/gu) ?? [];
}

function capitalize(value: string): string {
  return value ? value[0].toLocaleUpperCase() + value.slice(1).toLocaleLowerCase() : value;
}

export function transformText(input: string, transformation: TextTransformation): string {
  if (transformation === 'upper') return input.toLocaleUpperCase();
  if (transformation === 'lower') return input.toLocaleLowerCase();
  if (transformation === 'title') return input.replace(/[\p{L}\p{N}]+/gu, capitalize);
  if (transformation === 'sentence') {
    return input.toLocaleLowerCase().replace(/(^|[.!?]\s+)(\p{L})/gu, (_match, prefix: string, letter: string) => prefix + letter.toLocaleUpperCase());
  }
  const parts = words(input);
  if (transformation === 'camel') {
    return parts.map((part, index) => index === 0 ? part.toLocaleLowerCase() : capitalize(part)).join('');
  }
  if (transformation === 'slug') {
    return parts
      .map((part) => part.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x00-\x7F]/g, '').toLowerCase())
      .filter(Boolean)
      .join('-');
  }
  return parts.map((part) => part.toLocaleLowerCase()).join(transformation === 'snake' ? '_' : '-');
}

export interface DuplicateLineOptions {
  trim?: boolean;
  ignoreCase?: boolean;
  removeBlank?: boolean;
}

export function removeDuplicateLines(input: string, options: DuplicateLineOptions = {}): string {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const originalLine of input.split(/\r?\n/)) {
    const line = options.trim ? originalLine.trim() : originalLine;
    if (options.removeBlank && line === '') continue;
    const key = options.ignoreCase ? line.toLocaleLowerCase() : line;
    if (!seen.has(key)) {
      seen.add(key);
      output.push(line);
    }
  }
  return output.join('\n');
}
