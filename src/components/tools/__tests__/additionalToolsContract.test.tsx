import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CsvJsonTool from '../data-text/CsvJsonTool';
import SeoGeneratorTool from '../data-text/SeoGeneratorTool';
import TextCleanerTool from '../data-text/TextCleanerTool';
import ImagesToPdfTool from '../pdf/ImagesToPdfTool';
import PdfMergeTool from '../pdf/PdfMergeTool';
import PdfRotateTool from '../pdf/PdfRotateTool';
import PdfSplitTool from '../pdf/PdfSplitTool';
import PdfToImagesTool from '../pdf/PdfToImagesTool';
import AudioTrimmerTool from '../media-calc/AudioTrimmerTool';
import ExifRemoverTool from '../media-calc/ExifRemoverTool';
import FaviconGeneratorTool from '../media-calc/FaviconGeneratorTool';
import LoanCalculatorTool from '../media-calc/LoanCalculatorTool';
import ModernImageConverterTool from '../media-calc/ModernImageConverterTool';
import { additionalTools as dataTools } from '../../../data/tools/additions/data-text';
import { additionalTools as mediaTools } from '../../../data/tools/additions/media-calc';
import { additionalTools as pdfTools } from '../../../data/tools/additions/pdf';
import './testUtils';

const tools = [
  ['csv-json', CsvJsonTool],
  ['text-cleaner', TextCleanerTool],
  ['seo-generator', SeoGeneratorTool],
  ['pdf-merge', PdfMergeTool],
  ['pdf-split', PdfSplitTool],
  ['pdf-rotate', PdfRotateTool],
  ['images-to-pdf', ImagesToPdfTool],
  ['pdf-to-images', PdfToImagesTool],
  ['modern-image-converter', ModernImageConverterTool],
  ['exif-remover', ExifRemoverTool],
  ['favicon-generator', FaviconGeneratorTool],
  ['loan-calculator', LoanCalculatorTool],
  ['audio-trimmer', AudioTrimmerTool],
] as const;

describe('additional public tool UI contract', () => {
  it.each(tools)('%s uses real shared controls', (slug, Component) => {
    const { container } = render(<Component />);
    const violations: string[] = [];
    container.querySelectorAll<HTMLElement>(
      'textarea, select, input:not([type="hidden"]):not([aria-hidden="true"]):not(.hidden)',
    ).forEach((control) => {
      if (!control.closest('.fc-tool-field')) violations.push(`${control.tagName} missing ToolField`);
      if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby') && !control.id) {
        violations.push(`${control.tagName} missing accessible association`);
      }
      if (!(
        control.classList.contains('fc-input')
        || control.classList.contains('fc-select')
        || control.classList.contains('fc-textarea')
        || control.classList.contains('fc-check')
        || control.classList.contains('fc-radio')
        || control.classList.contains('fc-range')
        || control.classList.contains('fc-color-input')
        || control.classList.contains('fc-file-input')
      )) violations.push(`${control.tagName} missing shared control class`);
    });
    screen.queryAllByRole('button').filter((button) => !button.classList.contains('fc-tool-drop-zone')).forEach((button) => {
      if (!button.closest('.fc-tool-actions')) violations.push(`button "${button.textContent?.trim()}" missing ToolActions`);
    });
    expect(violations, slug).toEqual([]);
    const firstAction = container.querySelector('.fc-tool-actions > .fc-button');
    if (firstAction && !firstAction.parentElement?.hasAttribute('data-selection')) {
      expect(firstAction).toHaveClass('fc-button-primary');
    }
  });

  it('keeps Text Cleaner and SEO checkbox controls compact', () => {
    for (const Component of [TextCleanerTool, SeoGeneratorTool]) {
      const { unmount } = render(<Component />);
      for (const checkbox of screen.getAllByRole('checkbox')) {
        expect(checkbox).toHaveClass('fc-check');
        expect(checkbox).not.toHaveClass('fc-input');
      }
      unmount();
    }
  });

  it('covers every additional registry tool exactly once', () => {
    const registrySlugs = [...dataTools, ...mediaTools, ...pdfTools].map(({ slug }) => slug).sort();
    expect(tools.map(([slug]) => slug).sort()).toEqual(registrySlugs);
  });
});
