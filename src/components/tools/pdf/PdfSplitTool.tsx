import { useState } from 'react';
import { extractPdfPages } from '../../../lib/pdf/operations';
import { downloadPdf, fieldClass, FilePicker, parsePageSelection, pdfInputAccept, PdfToolShell, primaryButton, readFileBytes } from './shared';

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
      <label className="flex flex-col gap-2">페이지 (예: 1-3, 5) / Pages<input className={fieldClass} value={pages} onChange={(event) => setPages(event.target.value)} /></label>
      <button className={primaryButton} disabled={!file || busy} onClick={extract}>{busy ? '처리 중…' : '페이지 추출 / Extract pages'}</button>
    </PdfToolShell>
  );
}
