export type DataFormat = 'csv' | 'json' | 'tsv';

export function parseDelimited(input: string, delimiter: ',' | '\t'): string[][] {
  if (!input) return [];
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"') {
        if (input[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += character;
      }
    } else if (character === '"' && field === '') {
      quoted = true;
    } else if (character === delimiter) {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && input[index + 1] === '\n') index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error('A quoted field is not closed.');
  row.push(field);
  if (row.length > 1 || row[0] !== '' || rows.length === 0) rows.push(row);
  return rows;
}

function escapeDelimited(value: string, delimiter: string): string {
  return value.includes(delimiter) || /["\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function stringifyDelimited(rows: string[][], delimiter: ',' | '\t'): string {
  return rows.map((row) => row.map((value) => escapeDelimited(value, delimiter)).join(delimiter)).join('\n');
}

function validateRows(rows: string[][]): string[] {
  if (rows.length === 0) throw new Error('Input data is empty.');
  const headers = rows[0];
  if (headers.some((header) => header.trim() === '')) throw new Error('Header names cannot be blank.');
  if (new Set(headers).size !== headers.length) throw new Error('Header names must be unique.');
  const invalidRow = rows.findIndex((row, index) => index > 0 && row.length !== headers.length);
  if (invalidRow !== -1) throw new Error(`Row ${invalidRow + 1} has ${rows[invalidRow].length} columns; expected ${headers.length}.`);
  return headers;
}

function parseJsonRows(input: string): Array<Record<string, string | number | boolean | null>> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (error) {
    throw new Error(`Invalid JSON: ${(error as Error).message}`);
  }
  if (!Array.isArray(parsed) || parsed.some((value) => !value || typeof value !== 'object' || Array.isArray(value))) {
    throw new Error('JSON input must be an array of objects.');
  }
  for (const record of parsed as Array<Record<string, unknown>>) {
    if (Object.values(record).some((value) => value !== null && !['string', 'number', 'boolean'].includes(typeof value))) {
      throw new Error('JSON values must be scalar strings, numbers, booleans, or null.');
    }
  }
  return parsed as Array<Record<string, string | number | boolean | null>>;
}

function jsonToRows(input: string): string[][] {
  const records = parseJsonRows(input);
  if (records.length === 0) throw new Error('JSON array must contain at least one object.');
  const headers = [...new Set(records.flatMap((record) => Object.keys(record)))];
  if (headers.length === 0) throw new Error('JSON objects must contain at least one property.');
  return [headers, ...records.map((record) => headers.map((header) => record[header] == null ? '' : String(record[header])))];
}

export function convertData(input: string, inputFormat: DataFormat, outputFormat: DataFormat): string {
  if (input.trim() === '') throw new Error('Input data is empty.');
  if (inputFormat === 'json') {
    const rows = jsonToRows(input);
    if (outputFormat === 'json') return JSON.stringify(parseJsonRows(input), null, 2);
    return stringifyDelimited(rows, outputFormat === 'csv' ? ',' : '\t');
  }

  const rows = parseDelimited(input, inputFormat === 'csv' ? ',' : '\t');
  const headers = validateRows(rows);
  if (outputFormat === 'json') {
    return JSON.stringify(rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]]))), null, 2);
  }
  return stringifyDelimited(rows, outputFormat === 'csv' ? ',' : '\t');
}
