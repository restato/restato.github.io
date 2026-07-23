import { useState } from 'react';
import { decodeAndEncodeImage, downloadBlob, type ImageOutputMime } from '../../../lib/media-calc/image';
import { ToolShell, ToolStatus, buttonClass, fieldClass } from './ToolShell';

export default function ModernImageConverterTool() {
  const [file, setFile] = useState<File | null>(null); const [format, setFormat] = useState<ImageOutputMime>('image/jpeg');
  const [quality, setQuality] = useState(90); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const convert = async () => {
    if (!file) return; setBusy(true); setMessage('');
    try { const blob = await decodeAndEncodeImage(file, format, quality / 100); downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, '')}.${format === 'image/jpeg' ? 'jpg' : 'webp'}`); setMessage('Converted locally and ready for download.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Conversion failed.'); } finally { setBusy(false); }
  };
  return <ToolShell>
    <p className="text-sm text-[var(--color-text-muted)]">HEIC and AVIF decoding depends on your browser. Unsupported files are reported honestly; no server fallback is used.</p>
    <label>Choose HEIC or AVIF image<input aria-label="Choose HEIC or AVIF image" className={fieldClass} type="file" accept=".heic,.heif,.avif,image/heic,image/heif,image/avif" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
    <label>Output format<select className={fieldClass} value={format} onChange={(e) => setFormat(e.target.value as ImageOutputMime)}><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></label>
    <label>Quality: {quality}%<input className="w-full" type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(+e.target.value)} /></label>
    <button className={buttonClass} disabled={!file || busy} onClick={convert}>{busy ? 'Converting…' : 'Convert and download'}</button>
    <ToolStatus status={busy ? 'working' : message ? 'success' : 'idle'}>{message}</ToolStatus>
  </ToolShell>;
}
