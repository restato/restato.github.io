import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ImageConverter from '../ImageConverter';
import './testUtils';

class DataUrlReader {
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

  readAsDataURL() {
    this.onload?.({ target: { result: 'data:image/png;base64,AAAA' } } as unknown as ProgressEvent<FileReader>);
  }
}

class ConvertedImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 100;
  height = 50;

  set src(_: string) {
    this.onload?.();
  }
}

const toDataURL = vi.fn((mimeType: string) => `data:${mimeType};base64,QUJD`);

describe('ImageConverter', () => {
  beforeEach(() => {
    vi.stubGlobal('FileReader', DataUrlReader);
    vi.stubGlobal('Image', ConvertedImage);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(toDataURL);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('converts repeated non-Latin image selections to the chosen output format', async () => {
    const { container } = render(<ImageConverter />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'png' } });

    const input = container.querySelector('input[type="file"]')!;
    fireEvent.change(input, {
      target: {
        files: [
          new File(['x'], '비공개.png', { type: 'image/png' }),
          new File(['y'], '두번째.png', { type: 'image/png' }),
        ],
      },
    });

    expect(await screen.findByText('비공개.png')).toBeInTheDocument();
    expect(screen.getByText('두번째.png')).toBeInTheDocument();
    expect(screen.getAllByText('PNG: 3 B')).toHaveLength(2);
    expect(toDataURL).toHaveBeenLastCalledWith('image/png', undefined);
  });
});
