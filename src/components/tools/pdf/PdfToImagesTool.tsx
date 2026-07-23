import { useState } from 'react';
import { renderPdfPagesToImages } from '../../../lib/pdf/render';
import { downloadBlob, fieldClass, FilePicker, pdfInputAccept, PdfToolShell, primaryButton, readFileBytes } from './shared';

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
      <label className="flex flex-col gap-2">이미지 형식 / Image format<select className={fieldClass} value={format} onChange={(event) => setFormat(event.target.value as 'image/png' | 'image/jpeg')}><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option></select></label>
      <button className={primaryButton} disabled={!file || busy} onClick={convert}>{busy ? '렌더링 중…' : '이미지로 변환 / Convert to images'}</button>
    </PdfToolShell>
  );
}
