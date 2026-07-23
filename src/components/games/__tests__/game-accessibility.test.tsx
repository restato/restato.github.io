import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MemoryGame from '../../MemoryGame';
import ReactionTest from '../../ReactionTest';
import Roulette from '../../Roulette';
import SlotMachine from '../../SlotMachine';
import LadderGame from '../LadderGame';
import MathQuiz from '../MathQuiz';
import Minesweeper from '../Minesweeper';
import TeamRandomizer from '../TeamRandomizer';
import TypingGame from '../TypingGame';
import WhackAMole from '../WhackAMole';
import EventRoulette from '../roulette/EventRoulette';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('game field labels and selected states', () => {
  it('provides associated labels for ladder fields', async () => {
    const user = userEvent.setup();
    render(<LadderGame />);

    expect(screen.getByRole('textbox', { name: '이름 입력' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '결과 입력' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '일괄 입력' }));
    expect(screen.getByRole('textbox', { name: '참가자 일괄 입력' })).toBeInTheDocument();
  });

  it('provides associated labels for team, math, typing, and event roulette fields', async () => {
    const user = userEvent.setup();
    let view = render(<TeamRandomizer />);
    expect(screen.getByRole('textbox', { name: '이름 입력' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '일괄 입력' }));
    expect(screen.getByRole('textbox', { name: '참가자 일괄 입력' })).toBeInTheDocument();
    view.unmount();

    view = render(<MathQuiz />);
    await user.click(screen.getByRole('button', { name: '시작' }));
    expect(screen.getByRole('spinbutton', { name: '정답' })).toBeInTheDocument();
    view.unmount();

    view = render(<TypingGame />);
    expect(screen.getByRole('textbox', { name: '타이핑 입력' })).toBeInTheDocument();
    view.unmount();

    render(<EventRoulette />);
    expect(screen.getByRole('textbox', { name: '참가자 입력' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '당첨자 자동 제외' })).toBeInTheDocument();
  });

  it('announces visual difficulty and language selection with aria-pressed', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<MemoryGame />);
    const hard = screen.getByRole('button', { name: /어려움/ });
    expect(hard).toHaveAttribute('aria-pressed', 'false');
    await user.click(hard);
    expect(hard).toHaveAttribute('aria-pressed', 'true');
    unmount();

    render(<TypingGame />);
    const korean = screen.getByRole('button', { name: '한국어' });
    expect(korean).toHaveAttribute('aria-pressed', 'false');
    await user.click(korean);
    expect(korean).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('IME-safe text entry', () => {
  it.each([
    ['ladder participant', <LadderGame />, '이름 입력', '참가자 추가'],
    ['team member', <TeamRandomizer />, '이름 입력', '추가'],
    ['legacy roulette item', <Roulette />, '새 항목', '추가'],
  ])('does not submit %s while Korean or Japanese composition is active', (_, component, fieldName, addName) => {
    render(component);
    const input = screen.getByRole('textbox', { name: fieldName });
    fireEvent.change(input, { target: { value: '한글かな' } });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });

    expect(input).toHaveValue('한글かな');
    expect(screen.getByRole('button', { name: addName })).toBeInTheDocument();
  });
});

describe('dynamic game semantics', () => {
  it('announces the reaction-test Now state', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<ReactionTest />);

    fireEvent.click(screen.getByRole('button', { name: /클릭하여 시작/ }));
    act(() => vi.advanceTimersByTime(2000));

    expect(screen.getByRole('status')).toHaveTextContent('지금!');
  });

  it('announces slot-machine outcomes', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<SlotMachine />);

    fireEvent.click(screen.getByRole('button', { name: /SPIN/ }));
    act(() => vi.advanceTimersByTime(2000));

    expect(screen.getByRole('status')).toHaveTextContent('체리!');
  });

  it('labels mole and empty holes according to their current state', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<WhackAMole />);
    fireEvent.click(screen.getByRole('button', { name: '게임 시작' }));

    expect(screen.getByRole('button', { name: /1번 구멍.*두더지/ })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /빈 구멍/ })).toHaveLength(8);
  });

  it('supports keyboard flag mode and exposes cell flag state', async () => {
    const user = userEvent.setup();
    render(<Minesweeper />);

    const flagMode = screen.getByRole('button', { name: '깃발 모드' });
    expect(flagMode).toHaveAttribute('aria-pressed', 'false');
    await user.click(flagMode);
    expect(flagMode).toHaveAttribute('aria-pressed', 'true');

    const firstCell = screen.getAllByRole('button', { name: /행.*열/ })[0];
    await user.click(firstCell);
    expect(firstCell).toHaveAccessibleName(/깃발/);
  });

  it('uses a named fullscreen region and restores the inline experience on Escape', async () => {
    const user = userEvent.setup();
    render(<EventRoulette />);
    await user.click(screen.getByRole('button', { name: '전체화면' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: '이벤트 룰렛 전체화면' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: '이벤트 룰렛 전체화면' })).not.toBeInTheDocument();
  });
});
