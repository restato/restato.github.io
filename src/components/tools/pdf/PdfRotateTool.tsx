import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { rotatePdfPages } from '../../../lib/pdf/operations';
import { downloadPdf, FilePicker, parsePageSelection, pdfInputAccept, PdfToolShell, readFileBytes } from './shared';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';
import { ToolResult } from '../ui/ToolResult';

export default function PdfRotateTool() {
  const [file, setFile] = useState<File>();
  const [pages, setPages] = useState('1');
  const [angle, setAngle] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const rotate = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const bytes = await readFileBytes(file);
      const selected = pages.trim() === 'all'
        ? Array.from({ length: (await PDFDocument.load(bytes)).getPageCount() }, (_, index) => index + 1)
        : parsePageSelection(pages);
      downloadPdf(await rotatePdfPages(bytes, selected, angle), `${file.name.replace(/\.pdf$/i, '')}-rotated.pdf`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not rotate pages.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PdfToolShell error={error}>
      <FilePicker accept={pdfInputAccept} label="PDF 선택 / Choose a PDF" onFiles={(selected) => setFile(selected[0])} />
      {file && <p>{file.name}</p>}
      <ToolField id="pdf-rotate-pages" label="페이지 (1-3 또는 all) / Pages"><input value={pages} onChange={(event) => setPages(event.target.value)} /></ToolField>
      <ToolField id="pdf-rotate-angle" label="회전 / Rotation"><select value={angle} onChange={(event) => setAngle(Number(event.target.value))}><option value={90}>90° clockwise</option><option value={-90}>90° counter-clockwise</option><option value={180}>180°</option></select></ToolField>
      <ToolActions primary={<button disabled={!file || busy} onClick={rotate}>{busy ? '처리 중…' : 'PDF 회전 / Rotate PDF'}</button>} />
      {busy && <ToolResult status="working">처리 중… / Rotating PDF…</ToolResult>}
    </PdfToolShell>
  );
}
