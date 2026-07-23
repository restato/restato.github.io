import { useState } from 'react';
import { renderPdfPagesToImages } from '../../../lib/pdf/render';
import { downloadBlob, FilePicker, pdfInputAccept, PdfToolShell, readFileBytes } from './shared';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';
import { ToolResult } from '../ui/ToolResult';

export default function PdfToImagesTool() {
  const [file, setFile] = useState<File>();
  const [format, setFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const pages = await renderPdfPagesToImages(await readFileBytes(file), { imageType: format, scale: 2, quality: 0.92 });
      pages.forEach((page) => downloadBlob(page.blob, page.name));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not render this PDF.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PdfToolShell error={error}>
      <FilePicker accept={pdfInputAccept} label="PDF 선택 / Choose a PDF" onFiles={(selected) => setFile(selected[0])} />
      {file && <p>{file.name}</p>}
      <ToolField id="pdf-image-format" label="이미지 형식 / Image format"><select value={format} onChange={(event) => setFormat(event.target.value as 'image/png' | 'image/jpeg')}><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option></select></ToolField>
      <ToolActions primary={<button disabled={!file || busy} onClick={convert}>{busy ? '렌더링 중…' : '이미지로 변환 / Convert to images'}</button>} />
      {busy && <ToolResult status="working">렌더링 중… / Rendering pages…</ToolResult>}
    </PdfToolShell>
  );
}
