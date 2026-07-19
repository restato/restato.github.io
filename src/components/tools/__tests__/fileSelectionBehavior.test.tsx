import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ExifViewer from '../ExifViewer';
import ImageMetadataViewer from '../ImageMetadataViewer';
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

});
