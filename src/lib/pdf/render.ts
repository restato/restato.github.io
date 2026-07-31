import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

interface PdfPageAdapter {
  getViewport(options: { scale: number }): { width: number; height: number };
  render(options: { canvas: HTMLCanvasElement; viewport: unknown }): { promise: Promise<unknown> };
}

interface PdfDocumentAdapter {
  numPages: number;
  getPage(pageNumber: number): Promise<PdfPageAdapter>;
  destroy(): Promise<void>;
}

export interface PdfRendererDependencies {
  loadDocument(bytes: Uint8Array): Promise<PdfDocumentAdapter>;
  createCanvas(): HTMLCanvasElement;
}

export interface RenderedPdfPage {
  pageNumber: number;
  name: string;
  blob: Blob;
  width: number;
  height: number;
}

export interface PdfRenderOptions {
  scale?: number;
  imageType?: 'image/png' | 'image/jpeg';
  quality?: number;
}

const defaultDependencies: PdfRendererDependencies = {
  async loadDocument(bytes) {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    const loadingTask = pdfjs.getDocument({ data: bytes.slice() });
    return await loadingTask.promise as unknown as PdfDocumentAdapter;
  },
  createCanvas: () => document.createElement('canvas'),
};

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('The browser could not encode the rendered PDF page.'));
    }, type, quality);
  });

export async function renderPdfPagesToImages(
  bytes: Uint8Array,
  options: PdfRenderOptions = {},
  dependencies: PdfRendererDependencies = defaultDependencies,
): Promise<RenderedPdfPage[]> {
  const scale = options.scale ?? 2;
  if (!Number.isFinite(scale) || scale <= 0) throw new Error('Render scale must be greater than zero.');
  const imageType = options.imageType ?? 'image/png';
  const extension = imageType === 'image/jpeg' ? 'jpg' : 'png';
  const pdf = await dependencies.loadDocument(bytes);

  try {
    const results: RenderedPdfPage[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = dependencies.createCanvas();
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvas, viewport }).promise;
      results.push({
        pageNumber,
        name: `page-${pageNumber}.${extension}`,
        blob: await canvasToBlob(canvas, imageType, options.quality),
        width: canvas.width,
        height: canvas.height,
      });
    }
    return results;
  } finally {
    await pdf.destroy();
  }
}
