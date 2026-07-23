export function encodeWavSegment(
  channels: Float32Array[],
  sampleRate: number,
  startSeconds: number,
  endSeconds: number,
): Blob {
  const sourceLength = channels[0]?.length ?? 0;
  const start = Math.max(0, Math.floor(startSeconds * sampleRate));
  const end = Math.min(sourceLength, Math.floor(endSeconds * sampleRate));
  if (end <= start) throw new Error('The end time must be after the start time.');
  const channelCount = channels.length;
  const frameCount = end - start;
  const buffer = new ArrayBuffer(44 + frameCount * channelCount * 2);
  const view = new DataView(buffer);
  const write = (offset: number, value: string) => [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
  write(0, 'RIFF'); view.setUint32(4, buffer.byteLength - 8, true); write(8, 'WAVE');
  write(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channelCount * 2, true); view.setUint16(32, channelCount * 2, true);
  view.setUint16(34, 16, true); write(36, 'data'); view.setUint32(40, frameCount * channelCount * 2, true);
  let offset = 44;
  for (let frame = start; frame < end; frame++) {
    for (const channel of channels) {
      const sample = Math.max(-1, Math.min(1, channel[frame] ?? 0));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

export function audioBufferToChannels(buffer: AudioBuffer): Float32Array[] {
  return Array.from({ length: buffer.numberOfChannels }, (_, index) => buffer.getChannelData(index));
}
