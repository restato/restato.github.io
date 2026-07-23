import { useState } from 'react';
import { imagesToPdf } from '../../../lib/pdf/operations';
import { downloadPdf, FilePicker, imageInputAccept, PdfToolShell, primaryButton, readFileBytes } from './shared';

export default function ImagesToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const convert = async () => {
    setBusy(true);
    setError('');
    try {
      const images = await Promise.all(files.map(async (file) => ({
        bytes: await readFileBytes(file),
        mimeType: file.type === 'image/png' ? 'image/png' as const : 'image/jpeg' as const,
        name: file.name,
      })));
      downloadPdf(await imagesToPdf(images), 'images.pdf');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not convert these images.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PdfToolShell error={error}>
      <FilePicker accept={imageInputAccept} multiple label="PNG/JPEG 이미지 선택 / Choose PNG or JPEG images" onFiles={(selected) => setFiles((current) => [...current, ...selected])} />
      {files.length > 0 && <ol className="list-decimal pl-6">{files.map((file, index) => <li key={`${file.name}-${index}`}>{file.name}</li>)}</ol>}
      <button className={primaryButton} disabled={files.length === 0 || busy} onClick={convert}>{busy ? '처리 중…' : 'PDF 만들기 / Create PDF'}</button>
    </PdfToolShell>
  );
}
