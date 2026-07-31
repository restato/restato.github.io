import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CsvJsonTool from '../CsvJsonTool';
import SeoGeneratorTool from '../SeoGeneratorTool';
import TextCleanerTool from '../TextCleanerTool';

describe('CsvJsonTool', () => {
  beforeEach(() => vi.clearAllMocks());

  it('converts CSV to JSON and announces validation errors', async () => {
    const user = userEvent.setup();
    render(<CsvJsonTool />);
    await user.type(screen.getByLabelText('Input data'), 'name,age{enter}Ada,36');
    await user.click(screen.getByRole('button', { name: 'Convert data' }));
    expect((screen.getByLabelText('Converted output') as HTMLTextAreaElement).value).toContain('"name": "Ada"');

    await user.clear(screen.getByLabelText('Input data'));
    await user.type(screen.getByLabelText('Input data'), 'name,age{enter}Ada');
    await user.click(screen.getByRole('button', { name: 'Convert data' }));
    expect(screen.getByRole('alert')).toHaveTextContent('columns');
  });

  it('copies and downloads converted output', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<CsvJsonTool />);
    fireEvent.change(screen.getByLabelText('Input data'), { target: { value: 'name\nAda' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convert data' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy output' }));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: 'Download output' }));
    expect(click).toHaveBeenCalled();
  });
});

describe('TextCleanerTool', () => {
  it('creates a slug and removes duplicate lines', async () => {
    const user = userEvent.setup();
    render(<TextCleanerTool />);
    const input = screen.getByLabelText('Text input');
    await user.type(input, 'Crème brûlée');
    await user.selectOptions(screen.getByLabelText('Transformation'), 'slug');
    expect(screen.getByLabelText('Transformed output')).toHaveValue('creme-brulee');

    await user.clear(input);
    await user.type(input, 'Alpha{enter}alpha{enter}Beta');
    await user.click(screen.getByLabelText('Ignore case'));
    await user.click(screen.getByRole('button', { name: 'Remove duplicate lines' }));
    expect(screen.getByLabelText('Transformed output')).toHaveValue('Alpha\nBeta');
  });
});

describe('SeoGeneratorTool', () => {
  it('generates all three outputs and exposes copy controls', async () => {
    const user = userEvent.setup();
    render(<SeoGeneratorTool />);
    await user.type(screen.getByLabelText('Page title'), 'Example page');
    await user.type(screen.getByLabelText('Meta description'), 'A useful description');
    await user.type(screen.getByLabelText('Canonical URL'), 'https://example.com/page');
    await user.click(screen.getByRole('button', { name: 'Generate SEO files' }));
    expect((screen.getByLabelText('Meta tags output') as HTMLTextAreaElement).value).toContain('<title>Example page</title>');
    expect((screen.getByLabelText('Robots.txt output') as HTMLTextAreaElement).value).toContain('User-agent: *');
    expect((screen.getByLabelText('Schema JSON-LD output') as HTMLTextAreaElement).value).toContain('"@context"');
    expect(screen.getAllByRole('button', { name: /Copy/ })).toHaveLength(3);
  });
});
