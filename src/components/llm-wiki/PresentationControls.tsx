import { useState } from 'react';
import { Icon } from './icons';

interface Props {
  onReset: () => void;
}

const sections = [
  ['lab', 'Lab'],
  ['compare', 'Compare'],
  ['openwiki', 'OpenWiki'],
  ['okf', 'OKF'],
  ['start', 'Start'],
];

export function PresentationControls({ onReset }: Props) {
  const [presenting, setPresenting] = useState(false);

  async function togglePresentation() {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setPresenting(true);
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
        setPresenting(false);
      }
    } catch {
      setPresenting((value) => !value);
    }
  }

  return (
    <nav className="llmw-presentation-controls" aria-label="Learning journey controls" data-presenting={presenting}>
      <a className="llmw-mini-brand" href="#llm-wiki-top" aria-label="Back to LLM Wiki introduction"><Icon name="spark" /> LW</a>
      <div>
        {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
      </div>
      <button type="button" onClick={onReset}>Reset lab</button>
      <button type="button" onClick={togglePresentation} aria-pressed={presenting}><Icon name="play" /> Present</button>
    </nav>
  );
}

