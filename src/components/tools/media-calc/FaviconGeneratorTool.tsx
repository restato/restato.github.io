import { useRef, useState } from 'react';
import { createIconBlobs, downloadBlob } from '../../../lib/media-calc/image';
import { ToolShell, ToolStatus } from './ToolShell';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';

export default function FaviconGeneratorTool() {
  const [file, setFile] = useState<File | null>(null); const [feedback, setFeedback] = useState<{ message: string; status: 'success' | 'error' } | null>(null);
  const [busy, setBusy] = useState(false); const operationRef = useRef(0);
  const selectFile = (next: File | null) => { operationRef.current += 1; setFile(next); setFeedback(null); setBusy(false); };
  const generate = async () => {
    if (!file) return; const operation = ++operationRef.current; setFeedback(null); setBusy(true);
    try {
      const icons = await createIconBlobs(file);
      if (operation !== operationRef.current) return;
      icons.forEach(({ size, blob }) => downloadBlob(blob, size === 180 ? 'apple-touch-icon.png' : `icon-${size}x${size}.png`));
      setFeedback({ message: `Generated ${icons.length} PNG icons. Your browser may ask permission for multiple downloads.`, status: 'success' });
    }
    catch (error) {
      if (operation === operationRef.current) setFeedback({ message: error instanceof Error ? error.message : 'Icon generation failed.', status: 'error' });
    } finally {
      if (operation === operationRef.current) setBusy(false);
    }
  };
  return <ToolShell>
    <p className="text-sm text-[var(--color-text-muted)]">Creates transparent PNG icons at 16, 32, 48, 180, 192, and 512 pixels. It does not create the legacy multi-image .ico container.</p>
    <ToolField id="favicon-source" label="Choose icon source image"><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(e) => selectFile(e.target.files?.[0] ?? null)} /></ToolField>
    <ToolActions primary={<button disabled={!file || busy} onClick={generate}>Generate and download PNG icons</button>} />
    {busy && <ToolStatus status="working">Generating icons…</ToolStatus>}
    {!busy && feedback && <ToolStatus status={feedback.status}>{feedback.message}</ToolStatus>}
  </ToolShell>;
}
