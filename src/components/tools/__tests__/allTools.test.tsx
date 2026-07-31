/**
 * Smoke tests to verify all tools render without crashing
 * These tests ensure basic rendering works for each tool component
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import './testUtils';

// Import all tool components
import Base64Tool from '../Base64Tool';
import JsonFormatter from '../JsonFormatter';
import PasswordGenerator from '../PasswordGenerator';
import UnitConverter from '../UnitConverter';
import TextCounter from '../TextCounter';
import UuidGenerator from '../UuidGenerator';
import ColorConverter from '../ColorConverter';
import UrlEncoder from '../UrlEncoder';
import BmiCalculator from '../BmiCalculator';
import DiscountCalculator from '../DiscountCalculator';
import PercentCalculator from '../PercentCalculator';
import DdayCalculator from '../DdayCalculator';
import DutchPayCalculator from '../DutchPayCalculator';
import AgeCalculator from '../AgeCalculator';
import HashGenerator from '../HashGenerator';
import RegexTester from '../RegexTester';
import LoremIpsumGenerator from '../LoremIpsumGenerator';
import MarkdownPreview from '../MarkdownPreview';
import ColorPalette from '../ColorPalette';
import GradientGenerator from '../GradientGenerator';
import BoxShadowGenerator from '../BoxShadowGenerator';
import TimestampConverter from '../TimestampConverter';
import CronGenerator from '../CronGenerator';
import JwtDecoder from '../JwtDecoder';
import TimerStopwatch from '../TimerStopwatch';
import PomodoroTimer from '../PomodoroTimer';
import WorldClock from '../WorldClock';
import CoinFlip from '../CoinFlip';
import DiceRoller from '../DiceRoller';
import QRCodeGenerator from '../QRCodeGenerator';
import UtmBuilder from '../UtmBuilder';
import KorEngConverter from '../KorEngConverter';
import DiffTool from '../DiffTool';
import LlmCostCalculator from '../LlmCostCalculator';
import ImageConverter from '../ImageConverter';
import ImageResizer from '../ImageResizer';
import ExifViewer from '../ExifViewer';
import BackgroundRemover from '../BackgroundRemover';
import ImageMetadataViewer from '../ImageMetadataViewer';
import AppStoreScreenshotResizer from '../AppStoreScreenshotResizer';
import { toolsConfig } from '../../../data/tools/registry';

// Mock for image-related tools
vi.mock('@imgly/background-removal', () => ({
  removeBackground: vi.fn().mockResolvedValue(new Blob()),
}));

const toolComponents = [
  { name: 'Base64Tool', Component: Base64Tool },
  { name: 'JsonFormatter', Component: JsonFormatter },
  { name: 'PasswordGenerator', Component: PasswordGenerator },
  { name: 'UnitConverter', Component: UnitConverter },
  { name: 'TextCounter', Component: TextCounter },
  { name: 'UuidGenerator', Component: UuidGenerator },
  { name: 'ColorConverter', Component: ColorConverter },
  { name: 'UrlEncoder', Component: UrlEncoder },
  { name: 'BmiCalculator', Component: BmiCalculator },
  { name: 'DiscountCalculator', Component: DiscountCalculator },
  { name: 'PercentCalculator', Component: PercentCalculator },
  { name: 'DdayCalculator', Component: DdayCalculator },
  { name: 'DutchPayCalculator', Component: DutchPayCalculator },
  { name: 'AgeCalculator', Component: AgeCalculator },
  { name: 'HashGenerator', Component: HashGenerator },
  { name: 'RegexTester', Component: RegexTester },
  { name: 'LoremIpsumGenerator', Component: LoremIpsumGenerator },
  { name: 'MarkdownPreview', Component: MarkdownPreview },
  { name: 'ColorPalette', Component: ColorPalette },
  { name: 'GradientGenerator', Component: GradientGenerator },
  { name: 'BoxShadowGenerator', Component: BoxShadowGenerator },
  { name: 'TimestampConverter', Component: TimestampConverter },
  { name: 'CronGenerator', Component: CronGenerator },
  { name: 'JwtDecoder', Component: JwtDecoder },
  { name: 'TimerStopwatch', Component: TimerStopwatch },
  { name: 'PomodoroTimer', Component: PomodoroTimer },
  { name: 'WorldClock', Component: WorldClock },
  { name: 'CoinFlip', Component: CoinFlip },
  { name: 'DiceRoller', Component: DiceRoller },
  { name: 'QRCodeGenerator', Component: QRCodeGenerator },
  { name: 'UtmBuilder', Component: UtmBuilder },
  { name: 'KorEngConverter', Component: KorEngConverter },
  { name: 'DiffTool', Component: DiffTool },
  { name: 'LlmCostCalculator', Component: LlmCostCalculator },
  { name: 'ImageConverter', Component: ImageConverter },
  { name: 'ImageResizer', Component: ImageResizer },
  { name: 'ExifViewer', Component: ExifViewer },
  { name: 'BackgroundRemover', Component: BackgroundRemover },
  { name: 'ImageMetadataViewer', Component: ImageMetadataViewer },
  { name: 'AppStoreScreenshotResizer', Component: AppStoreScreenshotResizer },
];

describe('All Tools Smoke Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  toolComponents.forEach(({ name, Component }) => {
    it(`${name} renders without crashing`, () => {
      expect(() => render(<Component />)).not.toThrow();
    });

    it(`${name} renders real shared fields and action groups`, () => {
      const { container } = render(<Component />);
      const nativeFields = container.querySelectorAll<HTMLElement>(
        'textarea, select, input:not([type="hidden"]):not([aria-hidden="true"]):not(.hidden)',
      );
      const violations: string[] = [];
      nativeFields.forEach((control) => {
        const sharedField = control.closest('.fc-tool-field');
        if (!sharedField) violations.push(`${control.tagName.toLowerCase()}[${control.getAttribute('type') ?? ''}] missing ToolField`);
        if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby') && !control.id) {
          violations.push(`${control.tagName.toLowerCase()} missing accessible association`);
        }
        if (!(control?.classList.contains('fc-input')
          || control?.classList.contains('fc-select')
          || control?.classList.contains('fc-textarea')
          || control?.classList.contains('fc-check')
          || control?.classList.contains('fc-radio')
          || control?.classList.contains('fc-range')
          || control?.classList.contains('fc-color-input')
          || control?.classList.contains('fc-file-input'))) {
          violations.push(`${control.tagName.toLowerCase()} missing shared control class`);
        }
      });

      const buttons = screen.queryAllByRole('button').filter((button) => !button.classList.contains('fc-tool-drop-zone'));
      buttons.forEach((button) => {
        const actionGroup = button.closest('.fc-tool-actions');
        if (!actionGroup) violations.push(`button "${button.textContent?.trim()}" missing ToolActions`);
      });
      expect(violations, name).toEqual([]);
      const firstAction = container.querySelector('.fc-tool-actions > .fc-button');
      if (firstAction && !firstAction.parentElement?.hasAttribute('data-selection')) {
        expect(firstAction).toHaveClass('fc-button-primary');
      }
    });
  });

  it('covers every standard registry component', () => {
    expect(toolComponents.map(({ name }) => name).sort()).toEqual(
      toolsConfig.map(({ component }) => component).sort(),
    );
  });
});

describe('Tool Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Base64Tool has accessible form elements', () => {
    render(<Base64Tool />);
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('UnitConverter has accessible inputs', () => {
    render(<UnitConverter />);
    expect(screen.getAllByRole('spinbutton').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
  });

  it('PasswordGenerator has accessible controls', () => {
    render(<PasswordGenerator />);
    expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });
});

describe('Tool Functionality Patterns', () => {
  it('Tools with copy functionality have copy button', () => {
    render(<Base64Tool />);
    expect(screen.getByText('복사')).toBeInTheDocument();
  });

  it('Generator tools have generate button', () => {
    render(<PasswordGenerator />);
    expect(screen.getByText('생성')).toBeInTheDocument();
  });

  it('Converter tools have input and output areas', () => {
    render(<Base64Tool />);
    const textareas = screen.getAllByRole('textbox');
    expect(textareas.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Mobile viewport interaction contract', () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });
    Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, value: 1 });
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('max-width') || query.includes('pointer: coarse'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth });
    window.matchMedia = originalMatchMedia;
  });

  toolComponents.forEach(({ name, Component }) => {
    const timeout = name === 'BoxShadowGenerator' ? 30_000 : undefined;

    it(`${name} keeps a named keyboard-focusable primary control at 375px`, () => {
      render(<Component />);
      const primaryControl = [
        ...screen.queryAllByRole('button').filter((button) => !button.hasAttribute('disabled') && Boolean(button.textContent?.trim())),
        ...screen.queryAllByRole('textbox'),
        ...screen.queryAllByRole('spinbutton'),
        ...screen.queryAllByRole('slider'),
        ...Array.from(document.querySelectorAll<HTMLInputElement>('input:not([disabled])')),
      ][0];

      expect(primaryControl).toBeDefined();
      expect(primaryControl).toHaveAccessibleName();
      primaryControl!.focus();
      expect(primaryControl).toHaveFocus();
    }, timeout);
  });
});
