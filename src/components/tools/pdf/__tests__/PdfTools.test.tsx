import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PDFDocument } from 'pdf-lib';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PdfMergeTool from '../PdfMergeTool';
import PdfSplitTool from '../PdfSplitTool';
import PdfRotateTool from '../PdfRotateTool';
import ImagesToPdfTool from '../ImagesToPdfTool';
import PdfToImagesTool from '../PdfToImagesTool';

const components = [PdfMergeTool, PdfSplitTool, PdfRotateTool, ImagesToPdfTool, PdfToImagesTool];

describe('PDF tool components', () => {
  beforeEach(() => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  it.each(components)('leaves privacy copy to the route workspace', (Component) => {
    const { container } = render(<Component />);
    expect(container.querySelector('.fc-tool-privacy')).toBeNull();
  });

  it('merges selected PDFs into a real downloadable PDF without network requests', async () => {
    const first = await PDFDocument.create();
    first.addPage();
    const second = await PDFDocument.create();
    second.addPage();
    second.addPage();
    const makeFile = async (name: string, bytes: Uint8Array) => {
      const file = new File([bytes as BlobPart], name, { type: 'application/pdf' });
      Object.defineProperty(file, 'arrayBuffer', { value: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) });
      return file;
    };
    const files = [await makeFile('a.pdf', await first.save()), await makeFile('b.pdf', await second.save())];
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { container } = render(<PdfMergeTool />);

    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files } });
    fireEvent.click(screen.getByRole('button', { name: /PDF 병합|merge pdf/i }));

    await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalled());
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
  });

  it('offers PDF-only inputs for PDF sources and image-only input for images-to-PDF', () => {
    const pdfTools = [PdfMergeTool, PdfSplitTool, PdfRotateTool, PdfToImagesTool];
    pdfTools.forEach((Component) => {
      const { container, unmount } = render(<Component />);
      expect(container.querySelector('input[type="file"]')).toHaveAttribute('accept', 'application/pdf,.pdf');
      unmount();
    });
    const { container } = render(<ImagesToPdfTool />);
    expect(container.querySelector('input[type="file"]')).toHaveAttribute('accept', 'image/png,image/jpeg,.png,.jpg,.jpeg');
  });
});
