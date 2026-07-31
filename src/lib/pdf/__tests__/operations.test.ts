import { describe, expect, it } from 'vitest';
import { PDFDocument, rgb } from 'pdf-lib';
import {
  extractPdfPages,
  imagesToPdf,
  mergePdfFiles,
  rotatePdfPages,
} from '../operations';

async function samplePdf(pageCount: number, label = 'sample') {
  const pdf = await PDFDocument.create();
  for (let index = 0; index < pageCount; index += 1) {
    const page = pdf.addPage([200 + index, 300 + index]);
    page.drawText(`${label}-${index + 1}`, { x: 20, y: 250, color: rgb(0, 0, 0) });
  }
  return pdf.save();
}

describe('PDF operations', () => {
  it('merges valid PDFs in file and page order', async () => {
    const merged = await mergePdfFiles([
      await samplePdf(2, 'first'),
      await samplePdf(1, 'second'),
    ]);

    const result = await PDFDocument.load(merged);
    expect(result.getPageCount()).toBe(3);
    expect(result.getPage(0).getWidth()).toBe(200);
    expect(result.getPage(2).getWidth()).toBe(200);
  });

  it('extracts selected one-based pages in the requested order', async () => {
    const extracted = await extractPdfPages(await samplePdf(4), [4, 2]);

    const result = await PDFDocument.load(extracted);
    expect(result.getPageCount()).toBe(2);
    expect(result.getPage(0).getWidth()).toBe(203);
    expect(result.getPage(1).getWidth()).toBe(201);
  });

  it('rejects an out-of-range extraction page', async () => {
    await expect(extractPdfPages(await samplePdf(2), [3])).rejects.toThrow('Page 3');
  });

  it('rotates only selected pages and normalizes the angle', async () => {
    const rotated = await rotatePdfPages(await samplePdf(2), [2], -90);

    const result = await PDFDocument.load(rotated);
    expect(result.getPage(0).getRotation().angle).toBe(0);
    expect(result.getPage(1).getRotation().angle).toBe(270);
  });

  it('creates a real PDF with one correctly sized page per PNG or JPEG', async () => {
    const png = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='), (char) => char.charCodeAt(0));
    const jpeg = Uint8Array.from(atob('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9oADAMBAAIAAwAAABD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/EP/EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8Q/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxB//9k='), (char) => char.charCodeAt(0));

    const output = await imagesToPdf([
      { bytes: png, mimeType: 'image/png', name: 'one.png' },
      { bytes: jpeg, mimeType: 'image/jpeg', name: 'two.jpg' },
    ]);

    const result = await PDFDocument.load(output);
    expect(result.getPageCount()).toBe(2);
    expect(result.getPages().every((page) => page.getWidth() > 0 && page.getHeight() > 0)).toBe(true);
  });

  it('rejects empty inputs instead of producing misleading output', async () => {
    await expect(mergePdfFiles([])).rejects.toThrow('at least');
    await expect(imagesToPdf([])).rejects.toThrow('at least');
  });
});
