import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoanCalculatorTool from '../LoanCalculatorTool';
import ModernImageConverterTool from '../ModernImageConverterTool';
import ExifRemoverTool from '../ExifRemoverTool';
import FaviconGeneratorTool from '../FaviconGeneratorTool';
import AudioTrimmerTool from '../AudioTrimmerTool';

describe('media and calculator tools', () => {
  it('shows loan and compound results from accessible inputs', () => {
    render(<LoanCalculatorTool />);
    fireEvent.change(screen.getByLabelText('Loan amount'), { target: { value: '12000' } });
    fireEvent.change(screen.getByLabelText('Annual interest rate (%)'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Loan term (years)'), { target: { value: '1' } });
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Compound interest' }));
    expect(screen.getByLabelText('Monthly contribution')).toBeInTheDocument();
  });

  it.each([
    [ModernImageConverterTool, 'Choose HEIC or AVIF image'],
    [ExifRemoverTool, 'Choose image to clean'],
    [FaviconGeneratorTool, 'Choose icon source image'],
    [AudioTrimmerTool, 'Choose audio file'],
  ])('exposes an accessible local file picker and privacy statement', (Tool, label) => {
    render(<Tool />);
    expect(screen.getByLabelText(label)).toHaveAttribute('type', 'file');
    expect(screen.getByText(/stays in your browser/i)).toBeInTheDocument();
  });
});
