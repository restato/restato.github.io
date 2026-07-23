import { describe, expect, it, vi } from 'vitest';
import { renderPdfPagesToImages, type PdfRendererDependencies } from '../render';

const validPng = Uint8Array.from(
  atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='),
  (char) => char.charCodeAt(0),
);

const readBlob = (blob: Blob) => new Promise<Uint8Array>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
  reader.onerror = () => reject(reader.error);
  reader.readAsArrayBuffer(blob);
});

describe('renderPdfPagesToImages', () => {
  it('renders every PDF page to a downloadable image using only in-memory bytes', async () => {
    const render = vi.fn(async () => undefined);
    const getPage = vi.fn(async (pageNumber: number) => ({
      getViewport: ({ scale }: { scale: number }) => ({ width: 100 * scale, height: 50 * scale }),
      render: ({ canvas }: { canvas: HTMLCanvasElement }) => {
        expect(canvas.width).toBe(200);
        expect(canvas.height).toBe(100);
        return { promise: render() };
      },
    }));
    const dependencies: PdfRendererDependencies = {
      loadDocument: async (bytes) => {
        expect(bytes).toEqual(new Uint8Array([1, 2, 3]));
        return { numPages: 2, getPage, destroy: vi.fn(async () => undefined) };
      },
      createCanvas: () => ({
        width: 0,
        height: 0,
        toBlob: (callback: BlobCallback) => callback(new Blob([validPng], { type: 'image/png' })),
      } as HTMLCanvasElement),
    };

    const images = await renderPdfPagesToImages(new Uint8Array([1, 2, 3]), { scale: 2 }, dependencies);

    expect(images.map((image) => image.name)).toEqual(['page-1.png', 'page-2.png']);
    expect((await readBlob(images[0]!.blob)).slice(0, 8)).toEqual(validPng.slice(0, 8));
    expect(getPage).toHaveBeenCalledTimes(2);
    expect(render).toHaveBeenCalledTimes(2);
  });

  it('rejects when the browser cannot encode a rendered canvas', async () => {
    const dependencies: PdfRendererDependencies = {
      loadDocument: async () => ({
        numPages: 1,
        getPage: async () => ({
          getViewport: () => ({ width: 10, height: 10 }),
          render: () => ({ promise: Promise.resolve() }),
        }),
        destroy: async () => undefined,
      }),
      createCanvas: () => ({
        toBlob: (callback: BlobCallback) => callback(null),
      } as HTMLCanvasElement),
    };

    await expect(renderPdfPagesToImages(new Uint8Array([1]), {}, dependencies)).rejects.toThrow('encode');
  });
});
