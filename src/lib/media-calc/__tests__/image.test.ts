import { describe, expect, it, vi } from 'vitest';
import { decodeAndEncodeImage } from '../image';

describe('decodeAndEncodeImage', () => {
  it('truthfully reports when the browser cannot decode HEIC', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('decode failed')));
    await expect(decodeAndEncodeImage(new File(['heic'], 'photo.heic', { type: 'image/heic' }), 'image/jpeg'))
      .rejects.toThrow(/does not decode HEIC/i);
    vi.unstubAllGlobals();
  });

  it('rejects a browser encoder that silently falls back to PNG', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ width: 1, height: 1, close: vi.fn() }));
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => callback(new Blob(['x'], { type: 'image/png' })));
    await expect(decodeAndEncodeImage(new File(['avif'], 'photo.avif', { type: 'image/avif' }), 'image/webp'))
      .rejects.toThrow(/cannot encode WebP/i);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
});
