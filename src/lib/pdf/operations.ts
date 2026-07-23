import { degrees, PDFDocument } from 'pdf-lib';

export interface PdfImageInput {
  bytes: Uint8Array | ArrayBuffer;
  mimeType: 'image/png' | 'image/jpeg';
  name?: string;
}

const asBytes = (value: Uint8Array | ArrayBuffer) =>
  value instanceof Uint8Array ? value : new Uint8Array(value);

const requireInputs = (values: unknown[], label: string) => {
  if (values.length === 0) throw new Error(`Select at least one ${label}.`);
};

export async function mergePdfFiles(files: Array<Uint8Array | ArrayBuffer>): Promise<Uint8Array> {
  requireInputs(files, 'PDF file');
  const output = await PDFDocument.create();

  for (const file of files) {
    const source = await PDFDocument.load(asBytes(file));
    const pages = await output.copyPages(source, source.getPageIndices());
    pages.forEach((page) => output.addPage(page));
  }

  return output.save();
}

export async function extractPdfPages(
  file: Uint8Array | ArrayBuffer,
  pageNumbers: number[],
): Promise<Uint8Array> {
  requireInputs(pageNumbers, 'page');
  const source = await PDFDocument.load(asBytes(file));
  const pageCount = source.getPageCount();

  for (const pageNumber of pageNumbers) {
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pageCount) {
      throw new Error(`Page ${pageNumber} is outside the 1-${pageCount} page range.`);
    }
  }

  const output = await PDFDocument.create();
  const pages = await output.copyPages(source, pageNumbers.map((page) => page - 1));
  pages.forEach((page) => output.addPage(page));
  return output.save();
}

export async function rotatePdfPages(
  file: Uint8Array | ArrayBuffer,
  pageNumbers: number[],
  angle: number,
): Promise<Uint8Array> {
  if (!Number.isInteger(angle) || angle % 90 !== 0) {
    throw new Error('Rotation must be a multiple of 90 degrees.');
  }

  const pdf = await PDFDocument.load(asBytes(file));
  const pageCount = pdf.getPageCount();
  requireInputs(pageNumbers, 'page');
  pageNumbers.forEach((pageNumber) => {
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pageCount) {
      throw new Error(`Page ${pageNumber} is outside the 1-${pageCount} page range.`);
    }
    const page = pdf.getPage(pageNumber - 1);
    const normalized = ((page.getRotation().angle + angle) % 360 + 360) % 360;
    page.setRotation(degrees(normalized));
  });
  return pdf.save();
}

export async function imagesToPdf(images: PdfImageInput[]): Promise<Uint8Array> {
  requireInputs(images, 'image');
  const pdf = await PDFDocument.create();

  for (const image of images) {
    const bytes = asBytes(image.bytes);
    const embedded = image.mimeType === 'image/png'
      ? await pdf.embedPng(bytes)
      : await pdf.embedJpg(bytes);
    const page = pdf.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
  }

  return pdf.save();
}
