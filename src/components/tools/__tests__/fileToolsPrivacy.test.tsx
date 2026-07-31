import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import type { ComponentType, ReactNode } from 'react';
import ImageConverter from '../ImageConverter';
import ImageResizer from '../ImageResizer';
import ExifViewer from '../ExifViewer';
import BackgroundRemover from '../BackgroundRemover';
import ImageMetadataViewer from '../ImageMetadataViewer';
import AppStoreScreenshotResizer from '../AppStoreScreenshotResizer';
import './testUtils';

vi.mock('react-image-crop', () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  centerCrop: vi.fn(),
  makeAspectCrop: vi.fn(),
}));

vi.mock('@imgly/background-removal', () => ({
  removeBackground: vi.fn(),
}));

const fileTools: Array<[string, ComponentType]> = [
  ['image-converter', ImageConverter],
  ['image-resizer', ImageResizer],
  ['exif', ExifViewer],
  ['background-remover', BackgroundRemover],
  ['image-metadata', ImageMetadataViewer],
  ['appstore-screenshot', AppStoreScreenshotResizer],
];

describe('file tools local privacy boundary', () => {
  const fetchMock = vi.fn();
  let xhrSendMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });
    Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, value: 1 });
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('max-width') || query.includes('pointer: coarse'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.stubGlobal('fetch', fetchMock);
    xhrSendMock = vi.spyOn(XMLHttpRequest.prototype, 'send');
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:local-preview'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it.each(fileTools)('%s does not upload the selected file', (_, Component) => {
    const { container } = render(<Component />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['local-only-image'], '비공개.png', { type: 'image/png' });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAccessibleName('이미지 파일 선택');
    input.focus();
    expect(input).toHaveFocus();
    fireEvent.change(input, { target: { files: [file] } });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(xhrSendMock).not.toHaveBeenCalled();
  });
});
