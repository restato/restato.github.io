import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

import AppStoreScreenshotResizer from '../AppStoreScreenshotResizer';

describe('AppStoreScreenshotResizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
