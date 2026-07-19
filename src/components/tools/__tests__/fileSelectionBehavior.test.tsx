import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ExifViewer from '../ExifViewer';
import ImageMetadataViewer from '../ImageMetadataViewer';
import BackgroundRemover from '../BackgroundRemover';
import AppStoreScreenshotResizer from '../AppStoreScreenshotResizer';
import './testUtils';

class ArrayBufferReader {
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

  readAsArrayBuffer() {
    this.onload?.({ target: { result: new Uint8Array([0, 0]).buffer } } as unknown as ProgressEvent<FileReader>);
  }
}

class LoadedImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 100;
  height = 50;

  set src(_: string) {
    this.onload?.();
  }
}

describe('file selection results', () => {
  beforeEach(() => {
    vi.stubGlobal('FileReader', ArrayBufferReader);
    vi.stubGlobal('Image', LoadedImage);
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:local-preview'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the selected non-Latin filename and missing-EXIF result', async () => {
    const { container } = render(<ExifViewer />);
    const input = container.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [new File(['x'], '비공개.jpg', { type: 'image/jpeg' })] } });

    expect(await screen.findByText('EXIF 데이터를 찾을 수 없습니다')).toBeInTheDocument();
    expect(screen.getAllByText('비공개.jpg').length).toBeGreaterThan(0);
  });

  it('shows selected image metadata after the preview image loads', async () => {
    const { container } = render(<ImageMetadataViewer />);
    const input = container.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [new File(['x'], '비공개.png', { type: 'image/png' })] } });

    expect((await screen.findAllByText('비공개.png')).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('image/png')).toBeInTheDocument();
    expect(screen.getByText('100 × 50')).toBeInTheDocument();
  });

  it('loads a local image into the background-removal workflow', async () => {
    const { container } = render(<BackgroundRemover />);
    const input = container.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [new File(['x'], '배경.png', { type: 'image/png' })] } });

    expect(await screen.findByText('100 x 50 • 1 Bytes')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Original' })).toHaveAttribute('src', 'blob:local-preview');
  });

  it('loads a local screenshot into the App Store resize workflow', async () => {
    const { container } = render(<AppStoreScreenshotResizer />);
    const input = container.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [new File(['x'], '스토어.png', { type: 'image/png' })] } });

    expect(await screen.findByRole('img', { name: 'Crop preview' })).toHaveAttribute('src', 'blob:local-preview');
    expect(screen.getByText('1320 × 2868px')).toBeInTheDocument();
  });

  it('keeps the EXIF workflow empty when no file is selected', () => {
    const { container } = render(<ExifViewer />);
    const input = container.querySelector('input[type="file"]')!;

    fireEvent.change(input, { target: { files: [] } });
    expect(screen.queryByText('empty.jpg')).not.toBeInTheDocument();
  });

  it('renders EXIF fallback feedback for an unsupported selected file', async () => {
    const { container } = render(<ExifViewer />);
    const input = container.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [new File(['text'], 'unsupported.txt', { type: 'text/plain' })] } });

    expect(await screen.findByText('EXIF 데이터를 찾을 수 없습니다')).toBeInTheDocument();
    expect(screen.getAllByText('unsupported.txt').length).toBeGreaterThan(0);
  });

  it('replaces EXIF and metadata workflows when a second local file is selected', async () => {
    const exif = render(<ExifViewer />);
    const exifInput = exif.container.querySelector('input[type="file"]')!;
    fireEvent.change(exifInput, { target: { files: [new File(['x'], 'first.jpg', { type: 'image/jpeg' })] } });
    await screen.findByText('first.jpg');
    fireEvent.change(exifInput, { target: { files: [new File(['y'], 'second.jpg', { type: 'image/jpeg' })] } });
    expect(await screen.findByText('second.jpg')).toBeInTheDocument();
    exif.unmount();

    const metadata = render(<ImageMetadataViewer />);
    const metadataInput = metadata.container.querySelector('input[type="file"]')!;
    fireEvent.change(metadataInput, { target: { files: [new File(['x'], 'first.png', { type: 'image/png' })] } });
    expect((await screen.findAllByText('first.png')).length).toBeGreaterThanOrEqual(2);
    fireEvent.change(metadataInput, { target: { files: [new File(['y'], 'second.png', { type: 'image/png' })] } });
    expect((await screen.findAllByText('second.png')).length).toBeGreaterThanOrEqual(2);
  });

  it('keeps metadata empty without a file and surfaces an unsupported file as metadata fallback', async () => {
    const { container } = render(<ImageMetadataViewer />);
    const input = container.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [] } });
    expect(screen.queryByText('unsupported.txt')).not.toBeInTheDocument();
    fireEvent.change(input, { target: { files: [new File(['text'], 'unsupported.txt', { type: 'text/plain' })] } });
    expect((await screen.findAllByText('unsupported.txt')).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('text/plain')).toBeInTheDocument();
  });

  it('does not create a local preview for empty or non-image removal and screenshot selections', () => {
    const remove = render(<BackgroundRemover />);
    const removeInput = remove.container.querySelector('input[type="file"]')!;
    fireEvent.change(removeInput, { target: { files: [] } });
    fireEvent.change(removeInput, { target: { files: [new File(['x'], 'not-image.txt', { type: 'text/plain' })] } });
    expect(screen.queryByRole('img', { name: 'Original' })).not.toBeInTheDocument();
    remove.unmount();

    const screenshot = render(<AppStoreScreenshotResizer />);
    const screenshotInput = screenshot.container.querySelector('input[type="file"]')!;
    fireEvent.change(screenshotInput, { target: { files: [] } });
    fireEvent.change(screenshotInput, { target: { files: [new File(['x'], 'not-image.txt', { type: 'text/plain' })] } });
    expect(screen.queryByRole('img', { name: 'Crop preview' })).not.toBeInTheDocument();
  });

  it('creates fresh local previews for repeated removal and screenshot selections', async () => {
    const remove = render(<BackgroundRemover />);
    const removeInput = remove.container.querySelector('input[type="file"]')!;
    fireEvent.change(removeInput, { target: { files: [new File(['x'], 'first.png', { type: 'image/png' })] } });
    expect(await screen.findByRole('img', { name: 'Original' })).toBeInTheDocument();
    fireEvent.change(removeInput, { target: { files: [new File(['y'], 'second.png', { type: 'image/png' })] } });
    expect(screen.getByRole('img', { name: 'Original' })).toHaveAttribute('src', 'blob:local-preview');
    remove.unmount();

    const screenshot = render(<AppStoreScreenshotResizer />);
    const screenshotInput = screenshot.container.querySelector('input[type="file"]')!;
    fireEvent.change(screenshotInput, { target: { files: [new File(['x'], 'first.png', { type: 'image/png' })] } });
    expect((await screen.findAllByRole('img', { name: 'Crop preview' })).length).toBe(1);
    fireEvent.change(screenshotInput, { target: { files: [new File(['y'], 'second.png', { type: 'image/png' })] } });
    expect(URL.createObjectURL).toHaveBeenCalledTimes(4);
  });

});
