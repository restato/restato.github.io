import { useMemo, useState } from 'react';
import { removeDuplicateLines, transformText, type TextTransformation } from '../../../lib/data-text/text';
import { copyText } from './ui';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';
import { ToolPanel } from '../ui/ToolPanel';
import { ToolResult } from '../ui/ToolResult';

const transformations: Array<{ value: TextTransformation; label: string }> = [
  { value: 'upper', label: 'UPPER CASE' },
  { value: 'lower', label: 'lower case' },
  { value: 'title', label: 'Title Case' },
  { value: 'sentence', label: 'Sentence case' },
  { value: 'camel', label: 'camelCase' },
  { value: 'snake', label: 'snake_case' },
  { value: 'kebab', label: 'kebab-case' },
  { value: 'slug', label: 'URL slug' },
];

export default function TextCleanerTool() {
  const [input, setInput] = useState('');
  const [transformation, setTransformation] = useState<TextTransformation>('lower');
  const [duplicateResult, setDuplicateResult] = useState<string | null>(null);
  const [trim, setTrim] = useState(true);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [removeBlank, setRemoveBlank] = useState(true);
  const output = useMemo(() => duplicateResult ?? transformText(input, transformation), [duplicateResult, input, transformation]);

  const changeInput = (value: string) => {
    setInput(value);
    setDuplicateResult(null);
  };

  return (
    <ToolPanel aria-labelledby="text-cleaner-title">
      <h2 id="text-cleaner-title" className="text-xl font-semibold">Text case, slug, and duplicate-line cleaner</h2>
      <ToolField id="text-cleaner-input" label="Text input">
        <textarea className="min-h-44" value={input} onChange={(event) => changeInput(event.target.value)} />
      </ToolField>
      <ToolField id="text-cleaner-transformation" label="Transformation">
        <select value={transformation} onChange={(event) => { setTransformation(event.target.value as TextTransformation); setDuplicateResult(null); }}>
          {transformations.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </ToolField>
      <fieldset className="flex flex-wrap gap-4">
        <legend className="mb-2 font-medium">Duplicate-line options</legend>
        <ToolField id="text-cleaner-trim" label="Trim lines"><input type="checkbox" checked={trim} onChange={(event) => setTrim(event.target.checked)} /></ToolField>
        <ToolField id="text-cleaner-ignore-case" label="Ignore case"><input type="checkbox" checked={ignoreCase} onChange={(event) => setIgnoreCase(event.target.checked)} /></ToolField>
        <ToolField id="text-cleaner-remove-blank" label="Remove blank lines"><input type="checkbox" checked={removeBlank} onChange={(event) => setRemoveBlank(event.target.checked)} /></ToolField>
      </fieldset>
      <ToolActions primary={<button type="button" onClick={() => setDuplicateResult(removeDuplicateLines(input, { trim, ignoreCase, removeBlank }))}>Remove duplicate lines</button>} />
      {output && <ToolResult status="success"><ToolField id="text-cleaner-output" label="Transformed output"><textarea className="min-h-44" value={output} readOnly /></ToolField></ToolResult>}
      <ToolActions primary={<button type="button" onClick={() => copyText(output)} disabled={!output}>Copy output</button>} />
    </ToolPanel>
  );
}
