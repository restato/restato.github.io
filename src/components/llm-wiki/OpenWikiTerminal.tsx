import { useEffect, useState } from 'react';
import type { Scenario } from '@/types/llm-wiki';
import { Icon } from './icons';

interface Props {
  scenario: Scenario;
}

type TerminalState = 'idle' | 'running' | 'complete';

export function OpenWikiTerminal({ scenario }: Props) {
  const [state, setState] = useState<TerminalState>('idle');
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (state !== 'running') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setVisibleLines(scenario.terminalLines.length);
      setState('complete');
      return;
    }

    const timer = window.setInterval(() => {
      setVisibleLines((current) => {
        const next = current + 1;
        if (next >= scenario.terminalLines.length) {
          window.clearInterval(timer);
          setState('complete');
        }
        return next;
      });
    }, 420);
    return () => window.clearInterval(timer);
  }, [scenario.terminalLines, state]);

  function run() {
    setVisibleLines(1);
    setState('running');
  }

  function skip() {
    setVisibleLines(scenario.terminalLines.length);
    setState('complete');
  }

  return (
    <div className="llmw-terminal-shell">
      <div className="llmw-terminal-bar">
        <span className="llmw-window-controls" aria-hidden="true"><i /><i /><i /></span>
        <span><Icon name="terminal" /> openwiki — {scenario.id}</span>
        <span className="llmw-terminal-state">{state}</span>
      </div>

      <div className="llmw-terminal-body" aria-label="OpenWiki command simulation">
        {state === 'idle' ? (
          <div className="llmw-terminal-intro">
            <Icon name="play" />
            <p>Run a deterministic OpenWiki simulation. No repository or API key is used.</p>
          </div>
        ) : (
          <pre aria-live="off">{scenario.terminalLines.slice(0, visibleLines).map((line, index) => (
            <code key={`${scenario.id}-${index}`} data-command={line.startsWith('$')}>{line}</code>
          ))}</pre>
        )}
      </div>

      <div className="llmw-terminal-actions">
        {state === 'idle' && <button type="button" onClick={run}><Icon name="play" /> Run simulation</button>}
        {state === 'running' && <button type="button" onClick={skip}>Skip animation</button>}
        {state === 'complete' && <button type="button" onClick={run}><Icon name="play" /> Replay simulation</button>}
        <span>Guided simulation · precomputed output</span>
      </div>
    </div>
  );
}

