import { useState } from 'react';
import { convertData, type DataFormat } from '../../../lib/data-text/conversion';
import { copyText, downloadText } from './ui';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';
import { ToolPanel } from '../ui/ToolPanel';
import { ToolResult } from '../ui/ToolResult';

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
    <ToolPanel aria-labelledby="csv-json-title">
      <h2 id="csv-json-title" className="text-xl font-semibold">CSV, JSON, and TSV converter</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolField id="csv-json-input-format" label="Input format">
          <select value={inputFormat} onChange={(event) => setInputFormat(event.target.value as DataFormat)}>
            {formats.map((format) => <option key={format.value} value={format.value}>{format.label}</option>)}
          </select>
        </ToolField>
        <ToolField id="csv-json-output-format" label="Output format">
          <select value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as DataFormat)}>
            {formats.map((format) => <option key={format.value} value={format.value}>{format.label}</option>)}
          </select>
        </ToolField>
      </div>
      <ToolField id="csv-json-input" label="Input data">
        <textarea className="min-h-48 font-mono" value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} />
      </ToolField>
      <ToolActions primary={<button type="button" onClick={convert}>Convert data</button>} />
      {error && <ToolResult status="error">{error}</ToolResult>}
      {output && <ToolResult status="success">
        <ToolField id="csv-json-output" label="Converted output">
          <textarea className="min-h-48 font-mono" value={output} readOnly />
        </ToolField>
      </ToolResult>}
      <ToolActions
        primary={<button type="button" onClick={copy} disabled={!output}>{copied ? 'Copied' : 'Copy output'}</button>}
        secondary={<button type="button" onClick={() => downloadText(output, `converted.${outputFormat}`, outputFormat === 'json' ? 'application/json' : 'text/plain')} disabled={!output}>Download output</button>}
      />
    </ToolPanel>
  );
}
