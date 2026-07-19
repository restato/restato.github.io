import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import CoinFlip from '../CoinFlip';
import DiceRoller from '../DiceRoller';
import LoremIpsumGenerator from '../LoremIpsumGenerator';
import PercentCalculator from '../PercentCalculator';
import KorEngConverter from '../KorEngConverter';
import AgeCalculator from '../AgeCalculator';
import UtmBuilder from '../UtmBuilder';
import QRCodeGenerator from '../QRCodeGenerator';
import TimerStopwatch from '../TimerStopwatch';
import PomodoroTimer from '../PomodoroTimer';
import WorldClock from '../WorldClock';
import MarkdownPreview from '../MarkdownPreview';
import DiffTool from '../DiffTool';
import GradientGenerator from '../GradientGenerator';
import BoxShadowGenerator from '../BoxShadowGenerator';
import ColorPalette from '../ColorPalette';
import TimestampConverter from '../TimestampConverter';
import JwtDecoder from '../JwtDecoder';
import CronGenerator from '../CronGenerator';
import './testUtils';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('legacy simple tool behavior', () => {
  it('records a deterministic coin flip and clears its history', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    render(<CoinFlip />);

    fireEvent.click(screen.getByRole('button', { name: '🪙 동전 던지기' }));
    expect(screen.getByRole('button', { name: '던지는 중...' })).toBeDisabled();
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('앞면!')).toBeInTheDocument();
    expect(screen.getByText(/앞면: 1회/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '초기화' }));
    expect(screen.queryByText('앞면!')).not.toBeInTheDocument();
  });

  it('rolls a configured dice preset within its advertised boundary', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    render(<DiceRoller />);

    fireEvent.click(screen.getByRole('button', { name: '2D6' }));
    fireEvent.click(screen.getByRole('button', { name: '🎲 2D6 굴리기' }));
    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByText('12', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('(범위: 2 ~ 12)')).toBeInTheDocument();
  });

  it('calculates a percentage and suppresses output for empty input', () => {
    const { container } = render(<PercentCalculator />);
    const inputs = container.querySelectorAll('input[type="number"]');

    fireEvent.change(inputs[0], { target: { value: '25' } });
    fireEvent.change(inputs[1], { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: '계산하기' }));
    expect(screen.getByText('25은(는) 100의 25.00%입니다')).toBeInTheDocument();

    fireEvent.change(inputs[0], { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: '계산하기' }));
    expect(screen.queryByText(/25\.00%입니다/)).not.toBeInTheDocument();
  });

  it('generates the requested number of lorem words', () => {
    const { container } = render(<LoremIpsumGenerator />);
    fireEvent.click(screen.getByRole('button', { name: '단어' }));
    const count = container.querySelector('input[type="number"]')!;
    fireEvent.change(count, { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: '생성' }));

    expect(screen.getByText((text, element) => element?.tagName === 'P' && /^Lorem ipsum \S+$/.test(text))).toBeInTheDocument();
  });

  it('converts English keyboard input to Korean and swaps the direction', () => {
    const { container } = render(<KorEngConverter />);
    const textareas = container.querySelectorAll('textarea');
    fireEvent.change(textareas[0], { target: { value: 'dk' } });

    expect(textareas[1]).toHaveValue('아');
    fireEvent.click(screen.getByRole('button', { name: '🔄' }));
    expect(textareas[0]).toHaveValue('아');
    expect(textareas[1]).toHaveValue('dk');
  });

  it('calculates international age from a selected birth date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-20T12:00:00'));
    render(<AgeCalculator />);

    fireEvent.change(screen.getByLabelText('생년월일'), { target: { value: '2000-07-20' } });

    expect(screen.getByText('26세')).toBeInTheDocument();
    expect(screen.getByText('게자리')).toBeInTheDocument();
  });

  it('builds an example UTM URL and clears it again', () => {
    render(<UtmBuilder />);
    fireEvent.click(screen.getByRole('button', { name: '예제 불러오기' }));

    expect(screen.getByText(/utm_source=facebook/)).toBeInTheDocument();
    expect(screen.getByText(/utm_content=banner_v1/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '초기화' }));
    expect(screen.getByText('URL과 필수 파라미터를 입력하세요')).toBeInTheDocument();
  });

  it('redraws a QR canvas when text and size change', () => {
    const context = { fillStyle: '', fillRect: vi.fn() } as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
    const { container } = render(<QRCodeGenerator />);
    const input = screen.getByPlaceholderText('URL 또는 텍스트를 입력하세요');
    const size = container.querySelector('input[type="range"]')!;

    fireEvent.change(input, { target: { value: '한글 QR' } });
    fireEvent.change(size, { target: { value: '128' } });

    expect(container.querySelector('canvas')).toHaveAttribute('width', '128');
    expect(context.fillRect).toHaveBeenCalled();
  });

  it('runs, records, and resets a stopwatch', () => {
    vi.useFakeTimers();
    render(<TimerStopwatch />);

    fireEvent.click(screen.getByRole('button', { name: '시작' }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.click(screen.getByRole('button', { name: '랩' }));
    fireEvent.click(screen.getByRole('button', { name: '일시정지' }));

    expect(screen.getByText('#1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '초기화' }));
    expect(screen.queryByText('#1')).not.toBeInTheDocument();
  });

  it('switches Pomodoro modes and resets the selected duration', () => {
    render(<PomodoroTimer />);

    expect(screen.getByText('25:00')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '짧은 휴식' }));
    expect(screen.getByText('05:00')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '시작' }));
    fireEvent.click(screen.getByRole('button', { name: '리셋' }));
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('converts a local KST date-time into the world-clock rows', () => {
    const { container } = render(<WorldClock />);
    const date = container.querySelector('input[type="date"]')!;
    const time = container.querySelector('input[type="time"]')!;

    fireEvent.change(date, { target: { value: '2026-07-20' } });
    fireEvent.change(time, { target: { value: '09:00' } });

    expect(screen.getAllByText('Tokyo').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('09:00').length).toBeGreaterThanOrEqual(2);
  });

  it('renders markdown, including non-Latin headings, and clears it', () => {
    const { container } = render(<MarkdownPreview />);
    const input = container.querySelector('textarea')!;
    fireEvent.change(input, { target: { value: '# 제목\n\n**굵게**' } });

    expect(screen.getByRole('heading', { name: '제목' })).toBeInTheDocument();
    expect(screen.getByText('굵게', { selector: 'strong' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '지우기' }));
    expect(screen.queryByRole('heading', { name: '제목' })).not.toBeInTheDocument();
  });

  it('reports line additions and removals, then swaps diff input', () => {
    const { container } = render(<DiffTool />);
    const inputs = container.querySelectorAll('textarea');
    fireEvent.change(inputs[0], { target: { value: 'before' } });
    fireEvent.change(inputs[1], { target: { value: 'after' } });

    expect(screen.getByText('+1 추가')).toBeInTheDocument();
    expect(screen.getByText('-1 삭제')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '교환' }));
    expect(inputs[0]).toHaveValue('after');
  });

  it('changes a gradient angle and exposes the generated CSS', () => {
    const { container } = render(<GradientGenerator />);
    const angle = container.querySelector('input[type="range"]')!;
    fireEvent.change(angle, { target: { value: '45' } });

    expect(screen.getByText(/linear-gradient\(45deg/)).toBeInTheDocument();
  });

  it('updates a box shadow layer and renders its CSS output', () => {
    const { container } = render(<BoxShadowGenerator />);
    const numericInputs = container.querySelectorAll('input[type="number"]');
    fireEvent.change(numericInputs[1], { target: { value: '12' } });

    expect(screen.getByText(/box-shadow:/)).toBeInTheDocument();
    expect(screen.getByText(/12px/)).toBeInTheDocument();
  });

  it('creates a complementary palette from a chosen base color', () => {
    const { container } = render(<ColorPalette />);
    const hexInput = container.querySelector('input[type="text"]')!;
    fireEvent.change(hexInput, { target: { value: '#ff0000' } });
    fireEvent.click(screen.getByRole('button', { name: '보색' }));

    expect(screen.getAllByText('#ff0000').length).toBeGreaterThan(0);
    expect(screen.getAllByText('#00ffff').length).toBeGreaterThan(0);
  });

  it('converts a Unix timestamp into its ISO date representation', () => {
    const { container } = render(<TimestampConverter />);
    const timestamp = container.querySelector('input[type="text"]')!;
    fireEvent.change(timestamp, { target: { value: '1704067200' } });

    expect(screen.getByText('2024-01-01T00:00:00.000Z')).toBeInTheDocument();
  });

  it('decodes a JWT example and presents malformed-token feedback', () => {
    render(<JwtDecoder />);
    fireEvent.click(screen.getByRole('button', { name: '예제 불러오기' }));
    expect(screen.getByText('HS256')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'), { target: { value: 'broken' } });
    expect(screen.getByText('Invalid JWT format (should have 3 parts)')).toBeInTheDocument();
  });

  it('updates cron expression and its human-readable schedule from controls', () => {
    render(<CronGenerator />);
    fireEvent.click(screen.getByRole('button', { name: '평일 9시' }));

    expect(screen.getByText('0 9 * * 1-5')).toBeInTheDocument();
    expect(screen.getByText(/평일에/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '*/15' }));
    expect(screen.getByText('*/15 9 * * 1-5')).toBeInTheDocument();
  });
});
