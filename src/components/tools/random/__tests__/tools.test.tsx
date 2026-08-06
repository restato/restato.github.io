import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import LadderGameTool from '../LadderGameTool';

const buildLadder = () => fireEvent.click(screen.getByRole('button', { name: 'Build ladder' }));

describe('LadderGameTool', () => {
  it('renders shared field controls for players and results', () => {
    render(<LadderGameTool />);
    const count = screen.getByLabelText('Number of players');
    expect(count).toHaveClass('fc-select');
    expect(count.closest('.fc-tool-field')).not.toBeNull();
    expect(screen.getByLabelText('Player 1 name')).toHaveClass('fc-input');
    expect(screen.getByLabelText('Result 1')).toHaveClass('fc-input');
  });

  it('resizes name and result fields when the player count changes', () => {
    render(<LadderGameTool />);
    fireEvent.change(screen.getByLabelText('Number of players'), { target: { value: '5' } });
    expect(screen.getByLabelText('Player 5 name')).toBeInTheDocument();
    expect(screen.getByLabelText('Result 5')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Number of players'), { target: { value: '2' } });
    expect(screen.queryByLabelText('Player 3 name')).not.toBeInTheDocument();
  });

  it('builds an SVG ladder with one rail per player', () => {
    render(<LadderGameTool />);
    buildLadder();
    expect(screen.getByTestId('ladder-svg').querySelectorAll('[data-rail]')).toHaveLength(4);
  });

  it('reveals a single result when a player is picked', () => {
    render(<LadderGameTool />);
    buildLadder();
    fireEvent.click(screen.getByRole('button', { name: 'Trace Player 1' }));
    const outcomes = screen.getByTestId('ladder-outcomes');
    expect(outcomes.textContent).toContain('Player 1');
    expect(screen.getByTestId('ladder-svg').querySelector('[data-path]')).not.toBeNull();
  });

  it('reveals every result at once', () => {
    render(<LadderGameTool />);
    buildLadder();
    fireEvent.click(screen.getByRole('button', { name: 'Reveal all' }));
    const outcomes = screen.getByTestId('ladder-outcomes');
    for (let player = 1; player <= 4; player += 1) {
      expect(outcomes.textContent).toContain(`Player ${player}`);
    }
  });

  it('assigns every result exactly once when all are revealed', () => {
    render(<LadderGameTool />);
    for (let index = 1; index <= 4; index += 1) {
      fireEvent.change(screen.getByLabelText(`Result ${index}`), { target: { value: `Prize ${index}` } });
    }
    buildLadder();
    fireEvent.click(screen.getByRole('button', { name: 'Reveal all' }));
    const items = screen.getAllByTestId('ladder-outcome-item');
    const results = items.map(item => item.textContent?.split('→')[1]?.trim());
    expect(new Set(results).size).toBe(4);
  });

  it('clears revealed outcomes when the ladder is shuffled', () => {
    render(<LadderGameTool />);
    buildLadder();
    fireEvent.click(screen.getByRole('button', { name: 'Reveal all' }));
    fireEvent.click(screen.getByRole('button', { name: 'Shuffle again' }));
    expect(screen.queryAllByTestId('ladder-outcome-item')).toHaveLength(0);
  });
});
