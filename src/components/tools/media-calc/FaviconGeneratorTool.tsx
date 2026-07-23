import { useState } from 'react';
import { createIconBlobs, downloadBlob } from '../../../lib/media-calc/image';
import { ToolShell, buttonClass, fieldClass } from './ToolShell';

export default function FaviconGeneratorTool() {
  const [file, setFile] = useState<File | null>(null); const [message, setMessage] = useState('');
  const generate = async () => {
    if (!file) return;
    try { const icons = await createIconBlobs(file); icons.forEach(({ size, blob }) => downloadBlob(blob, size === 180 ? 'apple-touch-icon.png' : `icon-${size}x${size}.png`)); setMessage(`Generated ${icons.length} PNG icons. Your browser may ask permission for multiple downloads.`); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Icon generation failed.'); }
  };
  return <ToolShell>
    <p className="text-sm text-[var(--color-text-muted)]">Creates transparent PNG icons at 16, 32, 48, 180, 192, and 512 pixels. It does not create the legacy multi-image .ico container.</p>
    <label>Choose icon source image<input aria-label="Choose icon source image" className={fieldClass} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
    <button className={buttonClass} disabled={!file} onClick={generate}>Generate and download PNG icons</button><p aria-live="polite">{message}</p>
  </ToolShell>;
}
