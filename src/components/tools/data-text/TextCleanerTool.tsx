import { useMemo, useState } from 'react';
import { removeDuplicateLines, transformText, type TextTransformation } from '../../../lib/data-text/text';
import { buttonClass, copyText, fieldClass, secondaryButtonClass } from './ui';

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
    <section className="space-y-4" aria-labelledby="text-cleaner-title">
      <h2 id="text-cleaner-title" className="text-xl font-semibold">Text case, slug, and duplicate-line cleaner</h2>
      <label className="block space-y-1">
        <span className="font-medium">Text input</span>
        <textarea className={`${fieldClass} min-h-44`} value={input} onChange={(event) => changeInput(event.target.value)} />
      </label>
      <label className="block space-y-1">
        <span className="font-medium">Transformation</span>
        <select className={fieldClass} value={transformation} onChange={(event) => { setTransformation(event.target.value as TextTransformation); setDuplicateResult(null); }}>
          {transformations.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>
      <fieldset className="flex flex-wrap gap-4">
        <legend className="mb-2 font-medium">Duplicate-line options</legend>
        <label className="flex items-center gap-2"><input type="checkbox" checked={trim} onChange={(event) => setTrim(event.target.checked)} />Trim lines</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={ignoreCase} onChange={(event) => setIgnoreCase(event.target.checked)} />Ignore case</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={removeBlank} onChange={(event) => setRemoveBlank(event.target.checked)} />Remove blank lines</label>
      </fieldset>
      <button type="button" className={buttonClass} onClick={() => setDuplicateResult(removeDuplicateLines(input, { trim, ignoreCase, removeBlank }))}>Remove duplicate lines</button>
      <label className="block space-y-1">
        <span className="font-medium">Transformed output</span>
        <textarea className={`${fieldClass} min-h-44`} value={output} readOnly />
      </label>
      <button type="button" className={secondaryButtonClass} onClick={() => copyText(output)} disabled={!output}>Copy output</button>
      <p className="text-sm text-[var(--color-text-muted)]">Text processing stays entirely in your browser.</p>
    </section>
  );
}
