import { useState } from 'react';
import { createIconBlobs, downloadBlob } from '../../../lib/media-calc/image';
import { ToolShell, ToolStatus } from './ToolShell';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';

export default function FaviconGeneratorTool() {
  const [file, setFile] = useState<File | null>(null); const [feedback, setFeedback] = useState<{ message: string; status: 'success' | 'error' } | null>(null);
  const generate = async () => {
    if (!file) return; setFeedback(null);
    try { const icons = await createIconBlobs(file); icons.forEach(({ size, blob }) => downloadBlob(blob, size === 180 ? 'apple-touch-icon.png' : `icon-${size}x${size}.png`)); setFeedback({ message: `Generated ${icons.length} PNG icons. Your browser may ask permission for multiple downloads.`, status: 'success' }); }
    catch (error) { setFeedback({ message: error instanceof Error ? error.message : 'Icon generation failed.', status: 'error' }); }
  };
  return <ToolShell>
    <p className="text-sm text-[var(--color-text-muted)]">Creates transparent PNG icons at 16, 32, 48, 180, 192, and 512 pixels. It does not create the legacy multi-image .ico container.</p>
    <ToolField id="favicon-source" label="Choose icon source image"><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></ToolField>
    <ToolActions primary={<button disabled={!file} onClick={generate}>Generate and download PNG icons</button>} />
    {feedback && <ToolStatus status={feedback.status}>{feedback.message}</ToolStatus>}
  </ToolShell>;
}
