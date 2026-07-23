import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LoanCalculatorTool from '../LoanCalculatorTool';
import ModernImageConverterTool from '../ModernImageConverterTool';
import ExifRemoverTool from '../ExifRemoverTool';
import FaviconGeneratorTool from '../FaviconGeneratorTool';
import AudioTrimmerTool from '../AudioTrimmerTool';

vi.mock('../../../../lib/media-calc/image', () => ({
  decodeAndEncodeImage: vi.fn().mockRejectedValue(new Error('Unsupported image')),
  createIconBlobs: vi.fn().mockRejectedValue(new Error('Icon generation failed')),
  downloadBlob: vi.fn(),
}));

describe('media and calculator tools', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('shows loan and compound results from accessible inputs', () => {
    render(<LoanCalculatorTool />);
    fireEvent.change(screen.getByLabelText('Loan amount'), { target: { value: '12000' } });
    fireEvent.change(screen.getByLabelText('Annual interest rate (%)'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Loan term (years)'), { target: { value: '1' } });
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.queryByText('Loan result')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Compound interest' }));
    expect(screen.getByLabelText('Monthly contribution')).toBeInTheDocument();
    expect(screen.queryByText('Compound interest result')).not.toBeInTheDocument();
  });

  it.each([
    [ModernImageConverterTool, 'Choose HEIC or AVIF image'],
    [ExifRemoverTool, 'Choose image to clean'],
    [FaviconGeneratorTool, 'Choose icon source image'],
    [AudioTrimmerTool, 'Choose audio file'],
  ])('exposes an accessible local file picker without duplicating the route privacy row', (Tool, label) => {
    render(<Tool />);
    expect(screen.getByLabelText(label)).toHaveAttribute('type', 'file');
    expect(document.querySelector('.fc-tool-privacy')).toBeNull();
  });

  it.each([
    [ModernImageConverterTool, 'Choose HEIC or AVIF image'],
    [ExifRemoverTool, 'Choose image to clean'],
    [FaviconGeneratorTool, 'Choose icon source image'],
    [AudioTrimmerTool, 'Choose audio file'],
  ])('does not render an empty idle result for %s', (Tool) => {
    const { container } = render(<Tool />);
    expect(container.querySelector('.fc-tool-result')).toBeNull();
  });

  it.each([
    [ModernImageConverterTool, 'Choose HEIC or AVIF image', 'Convert and download'],
    [ExifRemoverTool, 'Choose image to clean', 'Remove metadata and download'],
    [FaviconGeneratorTool, 'Choose icon source image', 'Generate and download PNG icons'],
  ])('announces failed image work as an error for %s', async (Tool, label, action) => {
    render(<Tool />);
    fireEvent.change(screen.getByLabelText(label), {
      target: { files: [new File(['image'], 'sample.heic', { type: 'image/heic' })] },
    });
    fireEvent.click(screen.getByRole('button', { name: action }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('announces audio decode failures as errors', async () => {
    render(<AudioTrimmerTool />);
    fireEvent.change(screen.getByLabelText('Choose audio file'), {
      target: { files: [new File(['audio'], 'sample.invalid', { type: 'audio/invalid' })] },
    });
    expect(await screen.findByRole('alert')).toHaveTextContent('cannot decode');
  });

  it.each([
    [ModernImageConverterTool, 'Choose HEIC or AVIF image', 'Convert and download'],
    [ExifRemoverTool, 'Choose image to clean', 'Remove metadata and download'],
    [FaviconGeneratorTool, 'Choose icon source image', 'Generate and download PNG icons'],
  ])('clears stale image feedback as soon as a replacement is selected for %s', async (Tool, label, action) => {
    render(<Tool />);
    const picker = screen.getByLabelText(label);
    fireEvent.change(picker, { target: { files: [new File(['first'], 'first.heic', { type: 'image/heic' })] } });
    fireEvent.click(screen.getByRole('button', { name: action }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    fireEvent.change(picker, { target: { files: [new File(['second'], 'second.heic', { type: 'image/heic' })] } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('clears an audio error when the replacement selection is empty', async () => {
    render(<AudioTrimmerTool />);
    const picker = screen.getByLabelText('Choose audio file');
    fireEvent.change(picker, { target: { files: [new File(['bad'], 'bad.invalid', { type: 'audio/invalid' })] } });
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    fireEvent.change(picker, { target: { files: [] } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('audio')).not.toBeInTheDocument();
  });

  it('revokes and removes the old audio preview when a replacement fails', async () => {
    const decodeAudioData = vi.fn()
      .mockResolvedValueOnce({ duration: 3 })
      .mockRejectedValueOnce(new Error('decode failed'));
    const close = vi.fn().mockResolvedValue(undefined);
    class MockAudioContext {
      decodeAudioData = decodeAudioData;
      close = close;
    }
    Object.defineProperty(window, 'AudioContext', { configurable: true, value: MockAudioContext });
    const createObjectURL = vi.fn().mockReturnValue('blob:first-preview');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });

    render(<AudioTrimmerTool />);
    const picker = screen.getByLabelText('Choose audio file');
    const first = Object.assign(new File(['first'], 'first.wav', { type: 'audio/wav' }), {
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    });
    fireEvent.change(picker, { target: { files: [first] } });
    expect(await screen.findByText('Your browser does not support audio preview.')).toBeInTheDocument();

    const replacement = Object.assign(new File(['bad'], 'bad.wav', { type: 'audio/wav' }), {
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    });
    fireEvent.change(picker, { target: { files: [replacement] } });
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledWith('blob:first-preview'));
    expect(screen.queryByText('Your browser does not support audio preview.')).not.toBeInTheDocument();
  });
});
