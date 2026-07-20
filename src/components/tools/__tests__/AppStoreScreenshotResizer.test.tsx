import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import './testUtils';

// Mock react-image-crop
vi.mock('react-image-crop', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="react-crop">{children}</div>,
  centerCrop: vi.fn(() => ({ x: 5, y: 5, width: 90, height: 90, unit: '%' })),
  makeAspectCrop: vi.fn(() => ({ x: 5, y: 5, width: 90, height: 90, unit: '%' })),
}));

// Mock URL.createObjectURL
const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = vi.fn();
const OriginalImage = global.Image;

class LoadedImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 100;
  height = 200;
  naturalWidth = 100;
  naturalHeight = 200;
  set src(_: string) { queueMicrotask(() => this.onload?.()); }
}

import AppStoreScreenshotResizer from '../AppStoreScreenshotResizer';

describe('AppStoreScreenshotResizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('URL', {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    });
    Object.defineProperty(global, 'Image', { configurable: true, writable: true, value: LoadedImage });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as never);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,processed');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(global, 'Image', { configurable: true, writable: true, value: OriginalImage });
  });

  it('renders drop zone initially', () => {
    render(<AppStoreScreenshotResizer />);
    expect(screen.getByText('이미지를 드래그하거나 클릭하여 업로드 (최대 10장)')).toBeInTheDocument();
  });

  it('has hidden file input', () => {
    render(<AppStoreScreenshotResizer />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('hidden');
  });

  it('accepts multiple image files', () => {
    render(<AppStoreScreenshotResizer />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('multiple');
  });

  it('only accepts image files', () => {
    render(<AppStoreScreenshotResizer />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('accept', 'image/*');
  });

  it('has hidden canvas for processing', () => {
    render(<AppStoreScreenshotResizer />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('hidden');
  });

  it('renders drop zone with correct styling', () => {
    render(<AppStoreScreenshotResizer />);
    const dropzone = screen.getByText('이미지를 드래그하거나 클릭하여 업로드 (최대 10장)').parentElement;
    expect(dropzone).toHaveClass('border-dashed');
    expect(dropzone).toHaveClass('cursor-pointer');
  });

  it('generates and downloads a processed screenshot', async () => {
    render(<AppStoreScreenshotResizer />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [new File(['private-image'], '비공개.png', { type: 'image/png' })] } });

    const preview = await screen.findByRole('img', { name: 'Crop preview' });
    fireEvent.load(preview);
    fireEvent.click(screen.getByRole('button', { name: '모두 처리' }));
    await screen.findByRole('img', { name: 'Processed 1' });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    fireEvent.click(screen.getAllByRole('button').at(-1)!);

    await waitFor(() => expect(click).toHaveBeenCalledTimes(1));
  });
});
