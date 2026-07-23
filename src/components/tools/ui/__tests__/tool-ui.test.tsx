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

  it('merges caller descriptions and preserves caller invalid state without an error', () => {
    render(
      <ToolField id="source" label="Source" hint="Paste plain text.">
        <input aria-describedby="external-description" aria-invalid="true" />
      </ToolField>,
    );

    const control = screen.getByRole('textbox', { name: 'Source' });
    expect(control).toHaveAttribute(
      'aria-describedby',
      'external-description source-hint',
    );
    expect(control).toHaveAttribute('aria-invalid', 'true');
  });

  it('forces invalid state when an error is present while retaining caller descriptions', () => {
    render(
      <ToolField id="source" label="Source" error="Source is required.">
        <input aria-describedby="external-description" aria-invalid="false" />
      </ToolField>,
    );

    const control = screen.getByRole('textbox', { name: 'Source' });
    expect(control).toHaveAttribute(
      'aria-describedby',
      'external-description source-error',
    );
    expect(control).toHaveAttribute('aria-invalid', 'true');
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

  it('never leaves a primary action with the secondary variant class', () => {
    render(
      <ToolActions
        primary={<button className="fc-button-secondary">Convert</button>}
        secondary={<button className="fc-button-primary">Clear</button>}
      />,
    );

    const [primary, secondary] = screen.getAllByRole('button');
    expect(primary).toHaveClass('fc-button-primary');
    expect(primary).not.toHaveClass('fc-button-secondary');
    expect(secondary).toHaveClass('fc-button-secondary');
    expect(secondary).not.toHaveClass('fc-button-primary');
  });

  it('styles each action inside an explicit fragment without mutating the fragment', () => {
    render(
      <ToolActions
        primary={<button>Convert</button>}
        secondary={<><button>Clear</button><button>Sample</button></>}
      />,
    );

    expect(screen.getByRole('button', { name: 'Clear' })).toHaveClass('fc-button-secondary');
    expect(screen.getByRole('button', { name: 'Sample' })).toHaveClass('fc-button-secondary');
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

  it('is a plain visual container and does not mutate nested controls', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ToolPanel><><button>Run</button></></ToolPanel>);

    expect(screen.getByRole('button', { name: 'Run' })).not.toHaveClass('fc-button');
    expect(screen.getByRole('button', { name: 'Run' }).closest('section')).toHaveClass('fc-tool-panel');
    expect(screen.getByRole('button', { name: 'Run' }).closest('section')).not.toHaveClass('fc-surface');
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe('tool detail route shell', () => {
  const legacyLayout = readFileSync(resolve('src/layouts/ToolLayout.astro'), 'utf8');
  const localizedRoute = readFileSync(resolve('src/pages/[lang]/tools/[slug].astro'), 'utf8');
  const globalCss = readFileSync(resolve('src/styles/global.css'), 'utf8');

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

  it('lays out the single raised workspace and restores instruction list markers', () => {
    expect(globalCss).toMatch(/\.fc-tool-workspace\s*\{[^}]*display:\s*grid/s);
    expect(globalCss).toMatch(
      /\.fc-tool-instructions\s+:where\(ol,\s*ul\)\s*\{[^}]*padding-inline-start:/s,
    );
    expect(globalCss).toMatch(
      /\.fc-tool-instructions\s+ol\s*\{[^}]*list-style:\s*decimal/s,
    );
    expect(globalCss).toMatch(
      /\.fc-tool-instructions\s+ul\s*\{[^}]*list-style:\s*disc/s,
    );
  });
});
