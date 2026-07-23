import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface Participant {
  id: string;
  name: string;
}

interface Result {
  id: string;
  name: string;
}

export default function LadderGame() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: '참가자 1' },
    { id: '2', name: '참가자 2' },
    { id: '3', name: '참가자 3' },
    { id: '4', name: '참가자 4' },
  ]);
  const [results, setResults] = useState<Result[]>([
    { id: '1', name: '당첨!' },
    { id: '2', name: '꽝' },
    { id: '3', name: '꽝' },
    { id: '4', name: '꽝' },
  ]);
  const [newParticipant, setNewParticipant] = useState('');
  const [newResult, setNewResult] = useState('');
  const [ladderData, setLadderData] = useState<number[][]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [finalResult, setFinalResult] = useState<{ participant: string; result: string } | null>(null);
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  // Generate ladder
  const generateLadder = () => {
    const count = participants.length;
    const rows = 10;
    const newLadder: number[][] = [];

    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < count - 1; j++) {
        // Random horizontal connection (30% chance)
        row.push(Math.random() < 0.3 ? 1 : 0);
      }
      newLadder.push(row);
    }

    setLadderData(newLadder);
    setSelectedIndex(null);
    setFinalResult(null);
  };

  // Draw ladder
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || ladderData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const count = participants.length;
    const width = canvas.width;
    const height = canvas.height;
    const colWidth = width / count;
    const rowHeight = height / (ladderData.length + 1);

    // Clear
    ctx.fillStyle = 'var(--color-bg)';
    ctx.fillRect(0, 0, width, height);

    // Draw vertical lines
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    for (let i = 0; i < count; i++) {
      const x = colWidth / 2 + i * colWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ladderData.forEach((row, rowIdx) => {
      const y = rowHeight * (rowIdx + 1);
      row.forEach((hasLine, colIdx) => {
        if (hasLine) {
          const x1 = colWidth / 2 + colIdx * colWidth;
          const x2 = colWidth / 2 + (colIdx + 1) * colWidth;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
        }
      });
    });
  }, [ladderData, participants.length]);

  // Animate path
  const animatePath = async (startIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas || ladderData.length === 0) return;

    setIsAnimating(true);
    setSelectedIndex(startIndex);
    setFinalResult(null);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const count = participants.length;
    const width = canvas.width;
    const height = canvas.height;
    const colWidth = width / count;
    const rowHeight = height / (ladderData.length + 1);

    let currentCol = startIndex;
    let currentY = 0;

    // Draw starting point
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(colWidth / 2 + currentCol * colWidth, 10, 8, 0, Math.PI * 2);
    ctx.stroke();

    for (let rowIdx = 0; rowIdx < ladderData.length; rowIdx++) {
      const nextY = rowHeight * (rowIdx + 1);
      const x = colWidth / 2 + currentCol * colWidth;

      // Draw vertical part
      await new Promise(resolve => setTimeout(resolve, 100));
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x, currentY);
      ctx.lineTo(x, nextY);
      ctx.stroke();

      currentY = nextY;

      // Check for horizontal line
      const row = ladderData[rowIdx];

      // Check left
      if (currentCol > 0 && row[currentCol - 1]) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const x1 = colWidth / 2 + currentCol * colWidth;
        const x2 = colWidth / 2 + (currentCol - 1) * colWidth;
        ctx.beginPath();
        ctx.moveTo(x1, currentY);
        ctx.lineTo(x2, currentY);
        ctx.stroke();
        currentCol--;
      }
      // Check right
      else if (currentCol < count - 1 && row[currentCol]) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const x1 = colWidth / 2 + currentCol * colWidth;
        const x2 = colWidth / 2 + (currentCol + 1) * colWidth;
        ctx.beginPath();
        ctx.moveTo(x1, currentY);
        ctx.lineTo(x2, currentY);
        ctx.stroke();
        currentCol++;
      }
    }

    // Draw to bottom
    await new Promise(resolve => setTimeout(resolve, 100));
    const finalX = colWidth / 2 + currentCol * colWidth;
    ctx.beginPath();
    ctx.moveTo(finalX, currentY);
    ctx.lineTo(finalX, height);
    ctx.stroke();

    // Show result
    setFinalResult({
      participant: participants[startIndex].name,
      result: results[currentCol]?.name || '?',
    });
    setIsAnimating(false);
  };

  // Add participant
  const addParticipant = () => {
    if (newParticipant.trim() && participants.length < 10) {
      setParticipants([
        ...participants,
        { id: Date.now().toString(), name: newParticipant.trim() },
      ]);
      setNewParticipant('');
      setLadderData([]);
    }
  };

  // Add result
  const addResult = () => {
    if (newResult.trim() && results.length < 10) {
      setResults([
        ...results,
        { id: Date.now().toString(), name: newResult.trim() },
      ]);
      setNewResult('');
    }
  };

  // Remove participant
  const removeParticipant = (id: string) => {
    if (participants.length > 2) {
      setParticipants(participants.filter(p => p.id !== id));
      setLadderData([]);
    }
  };

  // Remove result
  const removeResult = (id: string) => {
    if (results.length > 2) {
      setResults(results.filter(r => r.id !== id));
    }
  };

  // Bulk add participants
  const handleBulkAdd = () => {
    const names = bulkInput
      .split(/[\n,]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length > 0) {
      const newParticipants = names.slice(0, 10).map((name, idx) => ({
        id: `bulk-${Date.now()}-${idx}`,
        name,
      }));
      setParticipants(newParticipants);
      setBulkInput('');
      setShowBulkInput(false);
      setLadderData([]);
    }
  };

  return (
    <div className="fc-game mx-auto flex w-full max-w-6xl flex-col gap-6 px-0 lg:flex-row">
      {/* Ladder Display */}
      <div className="flex-1">
        {/* Participant Labels (Top) */}
        <div className="flex mb-2">
          {participants.map((p, idx) => (
            <button
              type="button"
              key={p.id}
              onClick={() => !isAnimating && ladderData.length > 0 && animatePath(idx)}
              disabled={isAnimating || ladderData.length === 0}
              className={`flex-1 py-2 text-center text-sm font-medium rounded-t-lg transition-colors ${
                selectedIndex === idx
                  ? 'bg-red-500 text-white'
                  : 'bg-[var(--color-card)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)]'
              } ${isAnimating || ladderData.length === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={participants.length * 80}
          height={300}
          className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg"
          style={{ aspectRatio: `${participants.length * 80} / 300` }}
        />

        {/* Result Labels (Bottom) */}
        <div className="flex mt-2">
          {results.slice(0, participants.length).map(r => (
            <div
              key={r.id}
              className="flex-1 py-2 text-center text-sm font-medium bg-[var(--color-card)] border border-[var(--color-border)] rounded-b-lg"
            >
              {r.name}
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={generateLadder}
          disabled={participants.length < 2 || results.length < participants.length}
          className="fc-button fc-button-primary mt-4 w-full"
        >
          {t({ ko: '사다리 생성', en: 'Generate Ladder', ja: 'はしご生成' })}
        </button>

        {/* Result Display */}
        {finalResult && (
          <div className="fc-surface fc-surface-soft mt-4 p-6 text-center" role="status">
            <div className="text-xl font-bold">{finalResult.participant}</div>
            <div className="text-3xl mt-2">👇</div>
            <div className="mt-2 text-2xl font-bold text-[var(--accent)]">{finalResult.result}</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full lg:w-80 space-y-4">
        {/* Participants */}
        <div className="fc-surface p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">
              {t({ ko: '참가자', en: 'Participants', ja: '参加者' })} ({participants.length})
            </h3>
            <button
              type="button"
              onClick={() => setShowBulkInput(!showBulkInput)}
              className="fc-button fc-button-quiet text-sm"
            >
              {t({ ko: '일괄 입력', en: 'Bulk Input', ja: '一括入力' })}
            </button>
          </div>

          {showBulkInput ? (
            <div className="space-y-2">
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={t({
                  ko: '이름을 줄바꿈 또는 쉼표로 구분하여 입력\n예: 홍길동, 김철수, 이영희',
                  en: 'Enter names separated by newlines or commas\ne.g.: John, Jane, Bob',
                  ja: '名前を改行またはカンマで区切って入力\n例: 太郎, 花子, 次郎',
                })}
                className="fc-textarea h-32 text-sm"
              />
              <button
                type="button"
                onClick={handleBulkAdd}
                className="fc-button fc-button-primary w-full"
              >
                {t({ ko: '적용', en: 'Apply', ja: '適用' })}
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                  placeholder={t({ ko: '이름 입력', en: 'Enter name', ja: '名前入力' })}
                  className="fc-input flex-1 text-sm"
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={addParticipant}
                  disabled={participants.length >= 10}
                  aria-label={t({ ko: '참가자 추가', en: 'Add participant', ja: '参加者を追加' })}
                  className="fc-button fc-button-primary px-3"
                >
                  +
                </button>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {participants.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-2 bg-[var(--color-bg)] rounded-lg">
                    <span className="text-sm truncate">{p.name}</span>
                    <button
                      type="button"
                      onClick={() => removeParticipant(p.id)}
                      disabled={participants.length <= 2}
                      aria-label={`${p.name} ${t({ ko: '삭제', en: 'Remove', ja: '削除' })}`}
                      className="fc-button fc-button-quiet min-h-11 px-3 text-[var(--accent)]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Results */}
        <div className="fc-surface p-4">
          <h3 className="font-bold mb-3">
            {t({ ko: '결과', en: 'Results', ja: '結果' })} ({results.length})
          </h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newResult}
              onChange={(e) => setNewResult(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addResult()}
              placeholder={t({ ko: '결과 입력', en: 'Enter result', ja: '結果入力' })}
              className="fc-input flex-1 text-sm"
              maxLength={20}
            />
            <button
              type="button"
              onClick={addResult}
              disabled={results.length >= 10}
              aria-label={t({ ko: '결과 추가', en: 'Add result', ja: '結果を追加' })}
              className="fc-button fc-button-primary px-3"
            >
              +
            </button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {results.map(r => (
              <div key={r.id} className="flex items-center justify-between p-2 bg-[var(--color-bg)] rounded-lg">
                <span className="text-sm truncate">{r.name}</span>
                <button
                  type="button"
                  onClick={() => removeResult(r.id)}
                  disabled={results.length <= 2}
                  aria-label={`${r.name} ${t({ ko: '삭제', en: 'Remove', ja: '削除' })}`}
                  className="fc-button fc-button-quiet min-h-11 px-3 text-[var(--accent)]"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <p className="text-sm text-[var(--color-text-muted)] text-center">
          {t({
            ko: '참가자 수와 결과 수가 같아야 합니다',
            en: 'Number of participants and results must match',
            ja: '参加者数と結果数は同じである必要があります',
          })}
        </p>
      </div>
    </div>
  );
}
