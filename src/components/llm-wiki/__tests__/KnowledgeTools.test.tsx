import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { llmWikiScenarios } from '@/data/llm-wiki/scenarios';
import { OkfExplorer } from '../OkfExplorer';
import { OpenWikiTerminal } from '../OpenWikiTerminal';
import { RagComparison } from '../RagComparison';

function ComparisonHarness() {
  const scenario = llmWikiScenarios.repository;
  const [questionId, setQuestionId] = useState<string | null>(null);
  return <RagComparison scenario={scenario} selectedQuestionId={questionId} onSelectQuestion={setQuestionId} />;
}

describe('guided knowledge tools', () => {
  it('compares disposable retrieval with a maintained answer and evidence', () => {
    render(<ComparisonHarness />);

    fireEvent.click(screen.getByRole('button', { name: /where is authentication handled/i }));
    expect(screen.getByText(/evidence used/i)).toBeVisible();
    expect(screen.getByText(/authentication starts at POST \/session/i)).toBeVisible();
    expect(screen.getByText(/compose a fresh answer/i)).toBeVisible();
  });

  it('can complete and replay the OpenWiki terminal sequence', () => {
    render(<OpenWikiTerminal scenario={llmWikiScenarios.repository} />);

    fireEvent.click(screen.getByRole('button', { name: /run simulation/i }));
    fireEvent.click(screen.getByRole('button', { name: /skip animation/i }));
    expect(screen.getByText(/wiki ready in openwiki\//i)).toBeVisible();
    expect(screen.getByRole('button', { name: /replay simulation/i })).toBeVisible();
  });

  it('switches between plain language and raw OKF while changing consumers', () => {
    render(<OkfExplorer scenario={llmWikiScenarios.repository} />);

    fireEvent.click(screen.getByRole('tab', { name: /raw yaml/i }));
    expect(screen.getByText(/type: architecture/i)).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: /send bundle to research agent/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/research agent can read the same bundle/i);
  });
});
