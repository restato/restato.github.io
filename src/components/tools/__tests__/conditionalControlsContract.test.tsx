import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DutchPayCalculator from '../DutchPayCalculator';
import LlmCostCalculator from '../LlmCostCalculator';
import PomodoroTimer from '../PomodoroTimer';
import TimerStopwatch from '../TimerStopwatch';
import './testUtils';

function expectSharedField(control: HTMLElement) {
  expect(control.closest('.fc-tool-field')).not.toBeNull();
  expect(control).toHaveClass('fc-input');
}

describe('conditionally rendered tool controls', () => {
  it('labels each advanced Dutch-pay name and payment field', () => {
    render(<DutchPayCalculator />);
    fireEvent.click(screen.getByRole('button', { name: /각자 낸 금액 입력하기/ }));

    expectSharedField(screen.getByLabelText('참가자 1 이름'));
    expectSharedField(screen.getByLabelText('참가자 1 결제 금액'));
    expectSharedField(screen.getByLabelText('참가자 2 이름'));
    expectSharedField(screen.getByLabelText('참가자 2 결제 금액'));
  });

  it('labels every Pomodoro settings field through ToolField', () => {
    render(<PomodoroTimer />);
    fireEvent.click(screen.getByRole('button', { name: '설정' }));

    for (const label of ['집중 시간', '짧은 휴식', '긴 휴식', '긴 휴식까지']) {
      expectSharedField(screen.getByLabelText(label));
    }
  });

  it('labels timer duration inputs through ToolField', () => {
    render(<TimerStopwatch />);
    fireEvent.click(screen.getByRole('button', { name: '타이머' }));

    for (const label of ['시', '분', '초']) {
      expectSharedField(screen.getByLabelText(label));
    }
  });

  it('uses keyboard-operable pressed buttons for LLM model selection', () => {
    render(<LlmCostCalculator />);
    fireEvent.click(screen.getByRole('button', { name: '모델 개별 선택' }));

    const [model] = screen.getAllByRole('button', { name: 'GPT-4o' });
    expect(model).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(model);
    expect(model).toHaveAttribute('aria-pressed', 'false');
    expect(document.querySelector('input.hidden[type="checkbox"]')).toBeNull();
  });
});
