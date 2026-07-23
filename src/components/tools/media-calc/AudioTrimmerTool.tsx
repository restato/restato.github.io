import { useEffect, useRef, useState } from 'react';
import { audioBufferToChannels, encodeWavSegment } from '../../../lib/media-calc/audio';
import { downloadBlob } from '../../../lib/media-calc/image';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';
import { ToolShell, ToolStatus, buttonClass, fieldClass } from './ToolShell';

export default function AudioTrimmerTool() {
  const [file, setFile] = useState<File | null>(null); const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [start, setStart] = useState(0); const [end, setEnd] = useState(0); const [feedback, setFeedback] = useState<{ message: string; status: 'success' | 'error' } | null>(null); const [preview, setPreview] = useState('');
  const previewRef = useRef('');
  const clearPreview = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = '';
    setPreview('');
  };
  useEffect(() => () => { if (previewRef.current) URL.revokeObjectURL(previewRef.current); }, []);
  const load = async (next: File | null) => {
    setFile(next); setBuffer(null); setFeedback(null); setStart(0); setEnd(0); clearPreview(); if (!next) return;
    try { const Context = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext; if (!Context) throw new Error('Web Audio is unavailable in this browser.'); const context = new Context(); const decoded = await context.decodeAudioData(await next.arrayBuffer()); await context.close(); setBuffer(decoded); setStart(0); setEnd(decoded.duration); const url = URL.createObjectURL(next); previewRef.current = url; setPreview(url); }
    catch { setFeedback({ message: 'This browser cannot decode that audio format. Try WAV, MP3, AAC/M4A, or Ogg supported by your browser.', status: 'error' }); }
  };
  const exportWav = () => {
    if (!buffer || !file) return;
    try { const blob = encodeWavSegment(audioBufferToChannels(buffer), buffer.sampleRate, start, end); downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, '')}-trimmed.wav`); setFeedback({ message: 'Trimmed WAV exported locally.', status: 'success' }); }
    catch (error) { setFeedback({ message: error instanceof Error ? error.message : 'Export failed.', status: 'error' }); }
  };
  return <ToolShell>
    <p className="text-sm text-[var(--color-text-muted)]">Web Audio decoding varies by browser. Export is uncompressed 16-bit WAV only; this tool does not claim MP3 or AAC encoding.</p>
    <ToolField id="audio-file" label="Choose audio file"><input className={fieldClass} type="file" accept="audio/*" onChange={(e) => load(e.target.files?.[0] ?? null)} /></ToolField>
    {preview && <audio className="w-full" controls src={preview}>Your browser does not support audio preview.</audio>}
    <div className="grid gap-4 sm:grid-cols-2"><ToolField id="audio-start" label="Start (seconds)"><input className={fieldClass} type="number" min="0" max={end} step="0.01" value={start} onChange={(e) => setStart(+e.target.value)} /></ToolField><ToolField id="audio-end" label="End (seconds)"><input className={fieldClass} type="number" min={start} max={buffer?.duration} step="0.01" value={end} onChange={(e) => setEnd(+e.target.value)} /></ToolField></div>
    <ToolActions primary={<button className={buttonClass} disabled={!buffer || end <= start} onClick={exportWav}>Export trimmed WAV</button>} />
    {feedback && <ToolStatus status={feedback.status}>{feedback.message}</ToolStatus>}
  </ToolShell>;
}
