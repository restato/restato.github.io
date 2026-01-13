import { useState } from 'react';

// Korean keyboard mapping
const engToKor: Record<string, string> = {
  q: 'ㅂ', w: 'ㅈ', e: 'ㄷ', r: 'ㄱ', t: 'ㅅ', y: 'ㅛ', u: 'ㅕ', i: 'ㅑ', o: 'ㅐ', p: 'ㅔ',
  a: 'ㅁ', s: 'ㄴ', d: 'ㅇ', f: 'ㄹ', g: 'ㅎ', h: 'ㅗ', j: 'ㅓ', k: 'ㅏ', l: 'ㅣ',
  z: 'ㅋ', x: 'ㅌ', c: 'ㅊ', v: 'ㅍ', b: 'ㅠ', n: 'ㅜ', m: 'ㅡ',
  Q: 'ㅃ', W: 'ㅉ', E: 'ㄸ', R: 'ㄲ', T: 'ㅆ', O: 'ㅒ', P: 'ㅖ',
};

const korToEng: Record<string, string> = Object.fromEntries(
  Object.entries(engToKor).map(([k, v]) => [v, k])
);

// 한글 자모음 조합/분해 상수
const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 복합 모음
const COMPLEX_JUNG: Record<string, [string, string]> = {
  'ㅘ': ['ㅗ', 'ㅏ'], 'ㅙ': ['ㅗ', 'ㅐ'], 'ㅚ': ['ㅗ', 'ㅣ'],
  'ㅝ': ['ㅜ', 'ㅓ'], 'ㅞ': ['ㅜ', 'ㅔ'], 'ㅟ': ['ㅜ', 'ㅣ'], 'ㅢ': ['ㅡ', 'ㅣ'],
};

// 복합 종성
const COMPLEX_JONG: Record<string, [string, string]> = {
  'ㄳ': ['ㄱ', 'ㅅ'], 'ㄵ': ['ㄴ', 'ㅈ'], 'ㄶ': ['ㄴ', 'ㅎ'],
  'ㄺ': ['ㄹ', 'ㄱ'], 'ㄻ': ['ㄹ', 'ㅁ'], 'ㄼ': ['ㄹ', 'ㅂ'], 'ㄽ': ['ㄹ', 'ㅅ'],
  'ㄾ': ['ㄹ', 'ㅌ'], 'ㄿ': ['ㄹ', 'ㅍ'], 'ㅀ': ['ㄹ', 'ㅎ'], 'ㅄ': ['ㅂ', 'ㅅ'],
};

// 한글 음절 분해
function decomposeHangul(char: string): string[] {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) {
    return [char];
  }

  const offset = code - 0xAC00;
  const choIdx = Math.floor(offset / 588);
  const jungIdx = Math.floor((offset % 588) / 28);
  const jongIdx = offset % 28;

  const result: string[] = [CHO[choIdx]];

  const jung = JUNG[jungIdx];
  if (COMPLEX_JUNG[jung]) {
    result.push(...COMPLEX_JUNG[jung]);
  } else {
    result.push(jung);
  }

  const jong = JONG[jongIdx];
  if (jong) {
    if (COMPLEX_JONG[jong]) {
      result.push(...COMPLEX_JONG[jong]);
    } else {
      result.push(jong);
    }
  }

  return result;
}

// 영타 -> 한글
function engToKorean(text: string): string {
  const jamos = text.split('').map((c) => engToKor[c] || c);
  return assembleHangul(jamos.join(''));
}

// 한글 자모 조합
function assembleHangul(jamos: string): string {
  let result = '';
  let buffer: string[] = [];

  const isJa = (c: string) => CHO.includes(c) || 'ㄲㄸㅃㅆㅉ'.includes(c);
  const isMo = (c: string) => JUNG.includes(c) || Object.keys(COMPLEX_JUNG).some(k => COMPLEX_JUNG[k].includes(c as any));

  const flush = () => {
    if (buffer.length === 0) return;

    // Try to form a syllable
    if (buffer.length >= 2 && isJa(buffer[0]) && isMo(buffer[1])) {
      const choIdx = CHO.indexOf(buffer[0]);
      if (choIdx === -1) {
        result += buffer.shift();
        return;
      }

      let jungStr = buffer[1];
      let jungIdx = JUNG.indexOf(jungStr);

      // Check for complex vowel
      if (buffer.length >= 3 && isMo(buffer[2])) {
        const combined = Object.entries(COMPLEX_JUNG).find(
          ([_, [a, b]]) => a === buffer[1] && b === buffer[2]
        );
        if (combined) {
          jungStr = combined[0];
          jungIdx = JUNG.indexOf(jungStr);
          buffer.splice(1, 2, jungStr);
        }
      }

      if (jungIdx === -1) {
        result += buffer.shift();
        return;
      }

      let jongIdx = 0;
      let jongConsumed = 0;

      // Check for final consonant
      if (buffer.length >= 3 && isJa(buffer[2])) {
        // Check if next char is vowel (then this consonant is next syllable's cho)
        if (buffer.length >= 4 && isMo(buffer[3])) {
          // Don't use as jong
        } else {
          let jongStr = buffer[2];
          jongIdx = JONG.indexOf(jongStr);

          // Check for complex final
          if (buffer.length >= 4 && isJa(buffer[3])) {
            if (buffer.length >= 5 && isMo(buffer[4])) {
              // Next is vowel, only use single jong
            } else {
              const combined = Object.entries(COMPLEX_JONG).find(
                ([_, [a, b]]) => a === buffer[2] && b === buffer[3]
              );
              if (combined) {
                jongStr = combined[0];
                const idx = JONG.indexOf(jongStr);
                if (idx !== -1) {
                  jongIdx = idx;
                  jongConsumed = 2;
                }
              }
            }
          }

          if (jongIdx === -1) jongIdx = 0;
          if (jongConsumed === 0 && jongIdx > 0) jongConsumed = 1;
        }
      }

      const syllable = String.fromCharCode(0xAC00 + choIdx * 588 + jungIdx * 28 + jongIdx);
      result += syllable;
      buffer.splice(0, 2 + jongConsumed);
    } else {
      result += buffer.shift();
    }
  };

  for (const char of jamos) {
    buffer.push(char);
    while (buffer.length >= 2) {
      const prevLen = buffer.length;
      flush();
      if (buffer.length === prevLen) break;
    }
  }

  result += buffer.join('');
  return result;
}

// 한타 -> 영어
function korToEnglish(text: string): string {
  let result = '';

  for (const char of text) {
    const decomposed = decomposeHangul(char);
    for (const jamo of decomposed) {
      result += korToEng[jamo] || jamo;
    }
  }

  return result;
}

export default function KorEngConverter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'engToKor' | 'korToEng'>('engToKor');
  const [copied, setCopied] = useState(false);

  const result = mode === 'engToKor' ? engToKorean(input) : korToEnglish(input);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const swap = () => {
    setMode(mode === 'engToKor' ? 'korToEng' : 'engToKor');
    setInput(result);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('engToKor')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors
            ${mode === 'engToKor'
              ? 'bg-primary-500 text-white'
              : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
            }`}
        >
          🔤 영타 → 한글
        </button>
        <button
          onClick={() => setMode('korToEng')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors
            ${mode === 'korToEng'
              ? 'bg-primary-500 text-white'
              : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
            }`}
        >
          🇰🇷 한타 → 영어
        </button>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          {mode === 'engToKor' ? '영어로 입력된 텍스트' : '한글로 입력된 텍스트'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'engToKor' ? 'dkssudgktpdy (안녕하세요)' : 'ㅗ디ㅣㅐ (hello)'}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
            bg-[var(--color-card)] text-[var(--color-text)]
            focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      {/* Swap Button */}
      <button
        onClick={swap}
        className="self-center p-2 rounded-full bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
          border border-[var(--color-border)] transition-colors"
      >
        🔄
      </button>

      {/* Output */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          변환 결과
        </label>
        <div className="relative">
          <textarea
            value={result}
            readOnly
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-bg)] text-[var(--color-text)] resize-none"
          />
          <button
            onClick={copy}
            className="absolute top-2 right-2 px-3 py-1 rounded-lg text-sm
              bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
              border border-[var(--color-border)] transition-colors"
          >
            {copied ? '✓ 복사됨' : '복사'}
          </button>
        </div>
      </div>

      {/* Examples */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-medium text-[var(--color-text)] mb-3">💡 예시</h3>
        <div className="space-y-2 text-sm">
          {mode === 'engToKor' ? (
            <>
              <button
                onClick={() => setInput('dkssudgktpdy')}
                className="block w-full text-left p-2 rounded hover:bg-[var(--color-bg)] text-[var(--color-text-muted)]"
              >
                dkssudgktpdy → 안녕하세요
              </button>
              <button
                onClick={() => setInput('rkskekfk')}
                className="block w-full text-left p-2 rounded hover:bg-[var(--color-bg)] text-[var(--color-text-muted)]"
              >
                rkskekfk → 가나다라
              </button>
              <button
                onClick={() => setInput('tkatjdeh')}
                className="block w-full text-left p-2 rounded hover:bg-[var(--color-bg)] text-[var(--color-text-muted)]"
              >
                tkatjdeh → 사랑해
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setInput('ㅗ디ㅣㅐ')}
                className="block w-full text-left p-2 rounded hover:bg-[var(--color-bg)] text-[var(--color-text-muted)]"
              >
                ㅗ디ㅣㅐ → hello
              </button>
              <button
                onClick={() => setInput('ㅈㅐㅐㅇ')}
                className="block w-full text-left p-2 rounded hover:bg-[var(--color-bg)] text-[var(--color-text-muted)]"
              >
                ㅈㅐㅐㅇ → good
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
