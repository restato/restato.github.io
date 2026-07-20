import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { removeBackground } from '@imgly/background-removal';
import BackgroundRemover from '../BackgroundRemover';
import './testUtils';

vi.mock('@imgly/background-removal', () => ({ removeBackground: vi.fn() }));

class LoadedImage {
  onload: (() => void) | null = null;
  width = 100;
  height = 50;
  set src(_: string) { queueMicrotask(() => this.onload?.()); }
}

describe('BackgroundRemover output boundary', () => {
  beforeEach(() => {
    vi.stubGlobal('Image', LoadedImage);
    vi.stubGlobal('URL', { createObjectURL: vi.fn((blob: Blob) => blob instanceof File ? 'blob:source' : 'blob:result'), revokeObjectURL: vi.fn() });
    vi.mocked(removeBackground).mockResolvedValue(new Blob(['processed'], { type: 'image/png' }) as never);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as never);
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => vi.unstubAllGlobals());

  it('processes locally and downloads the resulting blob', async () => {
    const { container } = render(<BackgroundRemover />);
    const file = new File(['private-image-bytes'], '비공개.png', { type: 'image/png' });
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [file] } });

    await screen.findByRole('img', { name: 'Original' });
    fireEvent.click(screen.getByRole('button', { name: /배경 제거/ }));
    await waitFor(() => expect(removeBackground).toHaveBeenCalledWith(file, expect.any(Object)));
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    fireEvent.click(await screen.findByRole('button', { name: /다운로드/ }));

    expect(click).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenLastCalledWith(expect.any(Blob));
    expect(fetch).not.toHaveBeenCalled();
  });
});
