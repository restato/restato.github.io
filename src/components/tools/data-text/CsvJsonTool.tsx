import { useState } from 'react';
import { convertData, type DataFormat } from '../../../lib/data-text/conversion';
import { buttonClass, copyText, downloadText, fieldClass, secondaryButtonClass } from './ui';

const formats: Array<{ value: DataFormat; label: string }> = [
  { value: 'csv', label: 'CSV' },
  { value: 'json', label: 'JSON' },
  { value: 'tsv', label: 'TSV' },
];

export default function CsvJsonTool() {
  const [inputFormat, setInputFormat] = useState<DataFormat>('csv');
  const [outputFormat, setOutputFormat] = useState<DataFormat>('json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    try {
      setOutput(convertData(input, inputFormat, outputFormat));
      setError('');
    } catch (conversionError) {
      setOutput('');
      setError((conversionError as Error).message);
    }
  };

  const copy = async () => {
    await copyText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="space-y-4" aria-labelledby="csv-json-title">
      <h2 id="csv-json-title" className="text-xl font-semibold">CSV, JSON, and TSV converter</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="font-medium">Input format</span>
          <select className={fieldClass} value={inputFormat} onChange={(event) => setInputFormat(event.target.value as DataFormat)}>
            {formats.map((format) => <option key={format.value} value={format.value}>{format.label}</option>)}
          </select>
        </label>
        <label className="space-y-1">
          <span className="font-medium">Output format</span>
          <select className={fieldClass} value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as DataFormat)}>
            {formats.map((format) => <option key={format.value} value={format.value}>{format.label}</option>)}
          </select>
        </label>
      </div>
      <label className="block space-y-1">
        <span className="font-medium">Input data</span>
        <textarea className={`${fieldClass} min-h-48 font-mono`} value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} />
      </label>
      <button type="button" className={buttonClass} onClick={convert}>Convert data</button>
      {error && <p role="alert" className="text-red-700 dark:text-red-400">{error}</p>}
      <label className="block space-y-1">
        <span className="font-medium">Converted output</span>
        <textarea className={`${fieldClass} min-h-48 font-mono`} value={output} readOnly />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={secondaryButtonClass} onClick={copy} disabled={!output}>{copied ? 'Copied' : 'Copy output'}</button>
        <button type="button" className={secondaryButtonClass} onClick={() => downloadText(output, `converted.${outputFormat}`, outputFormat === 'json' ? 'application/json' : 'text/plain')} disabled={!output}>Download output</button>
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">Your data is converted locally in this browser and is not uploaded.</p>
    </section>
  );
}
