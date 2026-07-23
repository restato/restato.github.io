import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { ToolActions } from '../ToolActions';
import { ToolField } from '../ToolField';
import { ToolPanel } from '../ToolPanel';
import { ToolResult } from '../ToolResult';

describe('shared tool interface primitives', () => {
  it('links a field label, hint, and error to its control', () => {
    render(
      <ToolField id="source" label="Source" hint="Paste plain text." error="Source is required.">
        <textarea />
      </ToolField>,
    );

    const control = screen.getByRole('textbox', { name: 'Source' });
    expect(control).toHaveAttribute('id', 'source');
    expect(control).toHaveAttribute('aria-describedby', 'source-hint source-error');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Paste plain text.')).toHaveAttribute('id', 'source-hint');
    expect(screen.getByText('Source is required.')).toHaveAttribute('id', 'source-error');
  });

  it('renders primary actions before secondary actions with shared disabled styling', () => {
    render(
      <ToolActions
        primary={<button disabled>Convert</button>}
        secondary={<button>Clear</button>}
      />,
    );

    const actions = screen.getAllByRole('button');
    expect(actions.map((action) => action.textContent)).toEqual(['Convert', 'Clear']);
    expect(actions[0]).toHaveClass('fc-button', 'fc-button-primary');
    expect(actions[0]).toBeDisabled();
    expect(actions[1]).toHaveClass('fc-button', 'fc-button-secondary');
    expect(screen.getByTestId('tool-actions')).toHaveClass('fc-tool-actions');
  });

  it('announces non-error results politely and reports working progress', () => {
    const { rerender } = render(<ToolResult title="Output">Ready</ToolResult>);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'false');

    rerender(<ToolResult status="working">Converting</ToolResult>);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveClass('fc-tool-result-working');
  });

  it('uses an alert only for errors', () => {
    render(<ToolResult status="error">Conversion failed.</ToolResult>);

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('activates a drop zone with Enter and Space', () => {
    const onActivate = vi.fn();
    render(
      <ToolPanel variant="drop-zone" onActivate={onActivate} aria-label="Choose files">
        Drop files
      </ToolPanel>,
    );

    const dropZone = screen.getByRole('button', { name: 'Choose files' });
    expect(dropZone).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(dropZone, { key: 'Enter' });
    fireEvent.keyDown(dropZone, { key: ' ' });
    expect(onActivate).toHaveBeenCalledTimes(2);
  });

  it('styles controls inside fragments without passing DOM props to the fragment', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ToolPanel><><button>Run</button></></ToolPanel>);

    expect(screen.getByRole('button', { name: 'Run' })).toHaveClass('fc-button');
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe('tool detail route shell', () => {
  const legacyLayout = readFileSync(resolve('src/layouts/ToolLayout.astro'), 'utf8');
  const localizedRoute = readFileSync(resolve('src/pages/[lang]/tools/[slug].astro'), 'utf8');

  it.each([
    ['legacy layout', legacyLayout],
    ['localized route', localizedRoute],
  ])('shares Forest Café shell landmarks in the %s', (_name, source) => {
    expect(source).toContain('fc-tool-shell');
    expect(source).toContain('fc-tool-breadcrumb');
    expect(source).toContain('fc-tool-header');
    expect(source).toContain('fc-tool-workspace');
    expect(source).toContain('fc-tool-privacy');
    expect(source).toContain('fc-tool-instructions');
  });

  it('preserves localized SEO, lazy islands, ads, bookmarking, and recent tracking', () => {
    expect(localizedRoute).toContain('robots={robots}');
    expect(localizedRoute).toContain('alternateUrls={alternateUrls}');
    expect(localizedRoute).toContain('FAQPage');
    expect(localizedRoute).toContain('WebApplication');
    expect(localizedRoute).toContain('<AdSlot placement="tool-after-help"');
    expect(localizedRoute).toContain('isAdditionalToolSlug(tool.slug)');
    expect(localizedRoute).toContain('<AdditionalToolIsland client:load');
    expect(localizedRoute).toContain('<LocalizedToolIsland client:load');
    expect(localizedRoute).toContain('<BookmarkPrompt client:idle');
    expect(localizedRoute).toContain("const STORAGE_KEY = 'restato_recent_tools'");
  });

  it('preserves the legacy canonical, robots policy, schemas, and redirect behavior', () => {
    expect(legacyLayout).toContain('robots="noindex, follow"');
    expect(legacyLayout).toContain('canonical={canonicalUrl}');
    expect(legacyLayout).toContain('FAQPage');
    expect(legacyLayout).toContain('WebApplication');
    expect(legacyLayout).toContain('<BookmarkPrompt client:idle');
    expect(legacyLayout).toContain("const STORAGE_KEY = 'restato_recent_tools'");
    expect(legacyLayout).toContain('window.location.replace(newPath)');
  });
});

describe('text and developer tool family', () => {
  const files = [
    'JsonFormatter',
    'Base64Tool',
    'HashGenerator',
    'RegexTester',
    'UrlEncoder',
    'UtmBuilder',
    'JwtDecoder',
    'UuidGenerator',
    'CronGenerator',
    'MarkdownPreview',
    'TextCounter',
    'LoremIpsumGenerator',
    'KorEngConverter',
    'PasswordGenerator',
    'DiffTool',
  ];

  it.each(files)('%s delegates native control styling to the shared panel', (file) => {
    const source = readFileSync(resolve(`src/components/tools/${file}.tsx`), 'utf8');
    expect(source).toContain("import { ToolPanel } from './ui/ToolPanel'");
    expect(source).toContain('<ToolPanel');
    expect(source).toContain('</ToolPanel>');
  });
});

describe('calculator and time tool family', () => {
  const files = [
    'AgeCalculator',
    'BmiCalculator',
    'DdayCalculator',
    'DiscountCalculator',
    'DutchPayCalculator',
    'PercentCalculator',
    'UnitConverter',
    'LlmCostCalculator',
    'TimestampConverter',
    'TimerStopwatch',
    'WorldClock',
    'PomodoroTimer',
    'DiceRoller',
    'CoinFlip',
  ];

  it.each(files)('%s delegates native control styling to the shared panel', (file) => {
    const source = readFileSync(resolve(`src/components/tools/${file}.tsx`), 'utf8');
    expect(source).toContain("import { ToolPanel } from './ui/ToolPanel'");
    expect(source).toContain('<ToolPanel');
    expect(source).toContain('</ToolPanel>');
  });
});
