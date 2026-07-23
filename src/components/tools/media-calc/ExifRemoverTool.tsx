import { useState } from 'react';
import { decodeAndEncodeImage, downloadBlob } from '../../../lib/media-calc/image';
import { ToolShell, ToolStatus, buttonClass, fieldClass } from './ToolShell';

export default function ExifRemoverTool() {
  const [file, setFile] = useState<File | null>(null); const [message, setMessage] = useState('');
  const clean = async () => {
    if (!file) return;
    try { const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'; const blob = await decodeAndEncodeImage(file, mime); downloadBlob(blob, `clean-${file.name.replace(/\.[^.]+$/, '')}.${mime === 'image/png' ? 'png' : 'jpg'}`); setMessage('Re-encoded without EXIF metadata.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not clean this image.'); }
  };
  return <ToolShell>
    <p className="text-sm text-[var(--color-text-muted)]">The visible pixels are re-encoded into a new file, discarding EXIF, GPS, camera, and embedded text metadata. Color appearance may vary by browser.</p>
    <label>Choose image to clean<input aria-label="Choose image to clean" className={fieldClass} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
    <button className={buttonClass} disabled={!file} onClick={clean}>Remove metadata and download</button><ToolStatus status={message ? 'success' : 'idle'}>{message}</ToolStatus>
  </ToolShell>;
}
