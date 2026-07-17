import { scenarioOrder, llmWikiScenarios } from '@/data/llm-wiki/scenarios';
import type { ScenarioId } from '@/types/llm-wiki';
import { Icon, type IconName } from './icons';

interface Props {
  currentId: ScenarioId;
  onChange: (id: ScenarioId) => void;
}

const icons: Record<ScenarioId, IconName> = {
  repository: 'code',
  research: 'research',
  company: 'building',
};

export function ScenarioSwitcher({ currentId, onChange }: Props) {
  return (
    <div className="llmw-scenario-switcher" role="tablist" aria-label="Choose a knowledge scenario">
      {scenarioOrder.map((id, index) => {
        const scenario = llmWikiScenarios[id];
        const selected = id === currentId;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="knowledge-workbench-panel"
            tabIndex={selected ? 0 : -1}
            className="llmw-scenario-tab"
            data-active={selected}
            onClick={() => onChange(id)}
          >
            <span className="llmw-scenario-number">0{index + 1}</span>
            <Icon name={icons[id]} className="llmw-icon" />
            <span>
              <strong>{scenario.shortTitle}</strong>
              <small>{scenario.audience}</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}

