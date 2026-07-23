import { describe, expect, it } from 'vitest';
import { encodeWavSegment } from '../audio';

describe('encodeWavSegment', () => {
  it('exports only the requested PCM frames with a valid WAV header', () => {
    const channel = new Float32Array([0, 0.5, -0.5, 1]);
    const blob = encodeWavSegment([channel], 2, 0.5, 1.5);
    expect(blob.type).toBe('audio/wav');
    expect(blob.size).toBe(48);
  });

  it('rejects empty trim ranges', () => {
    expect(() => encodeWavSegment([new Float32Array(4)], 2, 1, 1)).toThrow('end');
  });
});
