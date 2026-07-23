import { useRef, useState } from 'react';
import { decodeAndEncodeImage, downloadBlob } from '../../../lib/media-calc/image';
import { ToolShell, ToolStatus } from './ToolShell';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';

export default function ExifRemoverTool() {
  const [file, setFile] = useState<File | null>(null); const [feedback, setFeedback] = useState<{ message: string; status: 'success' | 'error' } | null>(null);
  const [busy, setBusy] = useState(false); const operationRef = useRef(0);
  const selectFile = (next: File | null) => { operationRef.current += 1; setFile(next); setFeedback(null); setBusy(false); };
  const clean = async () => {
    if (!file) return; const operation = ++operationRef.current; setFeedback(null); setBusy(true);
    try {
      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'; const blob = await decodeAndEncodeImage(file, mime);
      if (operation !== operationRef.current) return;
      downloadBlob(blob, `clean-${file.name.replace(/\.[^.]+$/, '')}.${mime === 'image/png' ? 'png' : 'jpg'}`);
      setFeedback({ message: 'Re-encoded without EXIF metadata.', status: 'success' });
    }
    catch (error) {
      if (operation === operationRef.current) setFeedback({ message: error instanceof Error ? error.message : 'Could not clean this image.', status: 'error' });
    } finally {
      if (operation === operationRef.current) setBusy(false);
    }
  };
  return <ToolShell>
    <p className="text-sm text-[var(--color-text-muted)]">The visible pixels are re-encoded into a new file, discarding EXIF, GPS, camera, and embedded text metadata. Color appearance may vary by browser.</p>
    <ToolField id="exif-remover-file" label="Choose image to clean"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => selectFile(e.target.files?.[0] ?? null)} /></ToolField>
    <ToolActions primary={<button disabled={!file || busy} onClick={clean}>Remove metadata and download</button>} />
    {busy && <ToolStatus status="working">Removing metadata…</ToolStatus>}
    {!busy && feedback && <ToolStatus status={feedback.status}>{feedback.message}</ToolStatus>}
  </ToolShell>;
}
