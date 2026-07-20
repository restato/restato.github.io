import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  }, 30_000);

  it('downloads completed local conversions and only re-fetches their local data URL', async () => {
    const localFetch = vi.fn(async () => ({
      blob: async () => new Blob(['local conversion source'], { type: 'image/png' }),
    }));
    vi.stubGlobal('fetch', localFetch);
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const { container } = render(<ImageConverter />);
    const input = container.querySelector('input[type="file"]')!;

    fireEvent.change(input, {
      target: { files: [new File(['private image bytes'], '비공개-원본.png', { type: 'image/png' })] },
    });

    expect(await screen.findByText('비공개-원본.png')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '모두 다운로드' }));
    expect(download).toHaveBeenCalledTimes(1);
    expect(localFetch).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: '다시 변환' }));
    await waitFor(() => expect(localFetch).toHaveBeenCalledTimes(1));
    const [url, init] = localFetch.mock.calls[0];
    expect(String(url)).toMatch(/^data:image\//);
    expect(init?.body).toBeUndefined();
    expect(String(init ?? '')).not.toContain('비공개-원본.png');
    expect(String(init ?? '')).not.toContain('private image bytes');
  });

  it('ignores empty and unsupported file selections', () => {
    const { container } = render(<ImageConverter />);
    const input = container.querySelector('input[type="file"]')!;

    fireEvent.change(input, { target: { files: [] } });
    expect(screen.queryByText('unsupported.txt')).not.toBeInTheDocument();
    fireEvent.change(input, { target: { files: [new File(['text'], 'unsupported.txt', { type: 'text/plain' })] } });
    expect(screen.queryByText('unsupported.txt')).not.toBeInTheDocument();
  });
});
