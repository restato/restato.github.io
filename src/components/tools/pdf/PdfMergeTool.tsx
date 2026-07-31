import { useState } from 'react';
import { mergePdfFiles } from '../../../lib/pdf/operations';
import { ToolActions } from '../ui/ToolActions';
import { downloadPdf, FilePicker, pdfInputAccept, PdfToolShell, primaryButton, readFileBytes } from './shared';

export default function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const merge = async () => {
    setBusy(true);
    setError('');
    try {
      const output = await mergePdfFiles(await Promise.all(files.map(readFileBytes)));
      downloadPdf(output, 'merged.pdf');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not merge these PDF files.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PdfToolShell error={error}>
      <FilePicker accept={pdfInputAccept} multiple label="병합할 PDF 선택 / Choose PDFs to merge" onFiles={(selected) => setFiles((current) => [...current, ...selected])} />
      {files.length > 0 && <ol className="list-decimal pl-6">{files.map((file, index) => <li key={`${file.name}-${index}`}>{file.name}</li>)}</ol>}
      <ToolActions primary={
        <button className={primaryButton} disabled={files.length < 2 || busy} onClick={merge}>
          {busy ? '처리 중…' : 'PDF 병합 / Merge PDF'}
        </button>
      } />
    </PdfToolShell>
  );
}
