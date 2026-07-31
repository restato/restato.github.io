import { useState } from 'react';
import { extractPdfPages } from '../../../lib/pdf/operations';
import { downloadPdf, FilePicker, parsePageSelection, pdfInputAccept, PdfToolShell, readFileBytes } from './shared';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';
import { ToolResult } from '../ui/ToolResult';

export default function PdfSplitTool() {
  const [file, setFile] = useState<File>();
  const [pages, setPages] = useState('1');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const extract = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const output = await extractPdfPages(await readFileBytes(file), parsePageSelection(pages));
      downloadPdf(output, `${file.name.replace(/\.pdf$/i, '')}-pages.pdf`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not extract pages.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PdfToolShell error={error}>
      <FilePicker accept={pdfInputAccept} label="PDF 선택 / Choose a PDF" onFiles={(selected) => setFile(selected[0])} />
      {file && <p>{file.name}</p>}
      <ToolField id="pdf-split-pages" label="페이지 (예: 1-3, 5) / Pages"><input value={pages} onChange={(event) => setPages(event.target.value)} /></ToolField>
      <ToolActions primary={<button disabled={!file || busy} onClick={extract}>{busy ? '처리 중…' : '페이지 추출 / Extract pages'}</button>} />
      {busy && <ToolResult status="working">처리 중… / Extracting pages…</ToolResult>}
    </PdfToolShell>
  );
}
