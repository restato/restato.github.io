import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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
});
