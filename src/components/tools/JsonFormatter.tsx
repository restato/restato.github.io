import { useState, useCallback } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { ToolActions } from './ui/ToolActions';
import { ToolField } from './ui/ToolField';
import { ToolPanel } from './ui/ToolPanel';
import { ToolResult } from './ui/ToolResult';

export default function JsonFormatter() {
  const { t, translations } = useTranslation();
  const tt = translations.tools.json;
  const tc = translations.tools.common;

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const formatJson = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setIsValid(true);
    } catch (e) {
      setError((e as Error).message);
      setIsValid(false);
      setOutput('');
    }
  }, [input, indentSize]);

  const minifyJson = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
    } catch (e) {
      setError((e as Error).message);
      setIsValid(false);
      setOutput('');
    }
  }, [input]);

  const validateJson = useCallback(() => {
    setError('');
    try {
      JSON.parse(input);
      setIsValid(true);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setIsValid(false);
    }
  }, [input]);

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const loadSample = () => {
    const sample = {
      name: "Sample Object",
      version: "1.0.0",
      items: [
        { id: 1, name: "Item 1", active: true },
        { id: 2, name: "Item 2", active: false }
      ],
      metadata: {
        created: "2024-01-01",
        tags: ["sample", "json", "demo"]
      }
    };
    setInput(JSON.stringify(sample));
    setOutput('');
    setIsValid(null);
    setError('');
  };

  return (
    <ToolPanel className="gap-6">
      {/* Actions */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <ToolActions
          primary={<button onClick={formatJson}>{t(tt.format)}</button>}
          secondary={
            <>
              <button onClick={minifyJson}>{t(tt.minify)}</button>
              <button onClick={validateJson}>{t(tt.validate)}</button>
              <button onClick={loadSample}>
                {t({ ko: '샘플 불러오기', en: 'Load Sample', ja: 'サンプルを読み込む' })}
              </button>
            </>
          }
        />
        <ToolField id="json-indent" label="Indent:">
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 space</option>
          </select>
        </ToolField>
      </div>

      {/* Validation Status */}
      {isValid !== null && (
        <ToolResult status={isValid ? 'success' : 'error'}>
          <div className={`flex items-center gap-2 ${isValid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
          {isValid ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t(tt.valid)}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t(tt.invalid)}
            </>
          )}
          </div>
          {error && <code className="block mt-2 text-sm text-red-700 dark:text-red-400 break-all">{error}</code>}
        </ToolResult>
      )}

      {/* Input/Output Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <ToolField id="json-input" label={t(tc.input)}>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsValid(null);
              setError('');
            }}
            placeholder={t(tt.inputPlaceholder)}
            rows={15}
            className="font-mono text-sm"
            spellCheck={false}
          />
        </ToolField>

        {/* Output */}
        <div className="space-y-2">
          <ToolActions
            primary={<button onClick={copyOutput} disabled={!output}>{copied ? t(tc.copied) : t(tc.copy)}</button>}
          />
          <ToolField id="json-output" label={t(tc.output)}>
            <textarea value={output} readOnly rows={15} className="font-mono text-sm" spellCheck={false} />
          </ToolField>
        </div>
      </div>
    </ToolPanel>
  );
}
