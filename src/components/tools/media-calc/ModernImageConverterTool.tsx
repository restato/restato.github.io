import { useRef, useState } from 'react';
import { decodeAndEncodeImage, downloadBlob, type ImageOutputMime } from '../../../lib/media-calc/image';
import { ToolShell, ToolStatus } from './ToolShell';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';

export default function ModernImageConverterTool() {
  const [file, setFile] = useState<File | null>(null); const [format, setFormat] = useState<ImageOutputMime>('image/jpeg');
  const [quality, setQuality] = useState(90); const [feedback, setFeedback] = useState<{ message: string; status: 'success' | 'error' } | null>(null); const [busy, setBusy] = useState(false);
  const operationRef = useRef(0);
  const selectFile = (next: File | null) => { operationRef.current += 1; setFile(next); setFeedback(null); setBusy(false); };
  const convert = async () => {
    if (!file) return; const operation = ++operationRef.current; setBusy(true); setFeedback(null);
    try {
      const blob = await decodeAndEncodeImage(file, format, quality / 100);
      if (operation !== operationRef.current) return;
      downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, '')}.${format === 'image/jpeg' ? 'jpg' : 'webp'}`);
      setFeedback({ message: 'Converted locally and ready for download.', status: 'success' });
    }
    catch (error) {
      if (operation === operationRef.current) setFeedback({ message: error instanceof Error ? error.message : 'Conversion failed.', status: 'error' });
    } finally {
      if (operation === operationRef.current) setBusy(false);
    }
  };
  return <ToolShell>
    <p className="text-sm text-[var(--color-text-muted)]">HEIC and AVIF decoding depends on your browser. Unsupported files are reported honestly; no server fallback is used.</p>
    <ToolField id="modern-image-file" label="Choose HEIC or AVIF image"><input type="file" accept=".heic,.heif,.avif,image/heic,image/heif,image/avif" onChange={(e) => selectFile(e.target.files?.[0] ?? null)} /></ToolField>
    <ToolField id="modern-image-format" label="Output format"><select value={format} onChange={(e) => setFormat(e.target.value as ImageOutputMime)}><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></ToolField>
    <ToolField id="modern-image-quality" label={`Quality: ${quality}%`}><input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(+e.target.value)} /></ToolField>
    <ToolActions primary={<button disabled={!file || busy} onClick={convert}>{busy ? 'Converting…' : 'Convert and download'}</button>} />
    {busy && <ToolStatus status="working">Converting…</ToolStatus>}
    {!busy && feedback && <ToolStatus status={feedback.status}>{feedback.message}</ToolStatus>}
  </ToolShell>;
}
