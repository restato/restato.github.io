import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ExifViewer from '../ExifViewer';
import './testUtils';

class ArrayBufferReader {
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

  readAsArrayBuffer() {
    this.onload?.({ target: { result: new Uint8Array([0, 0]).buffer } } as unknown as ProgressEvent<FileReader>);
  }
}

describe('file selection results', () => {
  beforeEach(() => {
    vi.stubGlobal('FileReader', ArrayBufferReader);
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

});
