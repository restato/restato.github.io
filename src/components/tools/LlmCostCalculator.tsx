import { useState, useMemo } from 'react';

interface ModelPrice {
  name: string;
  displayName: string;
  provider: string;
  inputCost: number; // per 1K tokens
  outputCost: number; // per 1K tokens
  maxInputTokens: number;
  maxOutputTokens: number;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
  defaultRate: number;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: '달러', defaultRate: 1 },
  { code: 'KRW', symbol: '₩', name: '원화', defaultRate: 1450 },
  { code: 'JPY', symbol: '¥', name: '엔화', defaultRate: 157 },
  { code: 'EUR', symbol: '€', name: '유로', defaultRate: 0.92 },
];

// Prices per 1K tokens (data from litellm pricing)
const MODEL_PRICES: ModelPrice[] = [
  // OpenAI
  { name: 'gpt-4o', displayName: 'GPT-4o', provider: 'OpenAI', inputCost: 0.0025, outputCost: 0.01, maxInputTokens: 128000, maxOutputTokens: 16384 },
  { name: 'gpt-4o-mini', displayName: 'GPT-4o Mini', provider: 'OpenAI', inputCost: 0.00015, outputCost: 0.0006, maxInputTokens: 128000, maxOutputTokens: 16384 },
  { name: 'gpt-4-turbo', displayName: 'GPT-4 Turbo', provider: 'OpenAI', inputCost: 0.01, outputCost: 0.03, maxInputTokens: 128000, maxOutputTokens: 4096 },
  { name: 'gpt-4', displayName: 'GPT-4', provider: 'OpenAI', inputCost: 0.03, outputCost: 0.06, maxInputTokens: 8192, maxOutputTokens: 8192 },
  { name: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo', provider: 'OpenAI', inputCost: 0.0005, outputCost: 0.0015, maxInputTokens: 16385, maxOutputTokens: 4096 },
  { name: 'o1', displayName: 'o1', provider: 'OpenAI', inputCost: 0.015, outputCost: 0.06, maxInputTokens: 200000, maxOutputTokens: 100000 },
  { name: 'o1-mini', displayName: 'o1 Mini', provider: 'OpenAI', inputCost: 0.003, outputCost: 0.012, maxInputTokens: 128000, maxOutputTokens: 65536 },
  { name: 'o3-mini', displayName: 'o3 Mini', provider: 'OpenAI', inputCost: 0.00113, outputCost: 0.00452, maxInputTokens: 200000, maxOutputTokens: 100000 },

  // Anthropic
  { name: 'claude-opus-4-5', displayName: 'Claude Opus 4.5', provider: 'Anthropic', inputCost: 0.015, outputCost: 0.075, maxInputTokens: 200000, maxOutputTokens: 32000 },
  { name: 'claude-sonnet-4', displayName: 'Claude Sonnet 4', provider: 'Anthropic', inputCost: 0.003, outputCost: 0.015, maxInputTokens: 200000, maxOutputTokens: 64000 },
  { name: 'claude-3.5-sonnet', displayName: 'Claude 3.5 Sonnet', provider: 'Anthropic', inputCost: 0.003, outputCost: 0.015, maxInputTokens: 200000, maxOutputTokens: 8192 },
  { name: 'claude-3-opus', displayName: 'Claude 3 Opus', provider: 'Anthropic', inputCost: 0.015, outputCost: 0.075, maxInputTokens: 200000, maxOutputTokens: 4096 },
  { name: 'claude-3-haiku', displayName: 'Claude 3 Haiku', provider: 'Anthropic', inputCost: 0.00025, outputCost: 0.00125, maxInputTokens: 200000, maxOutputTokens: 4096 },
  { name: 'claude-3.5-haiku', displayName: 'Claude 3.5 Haiku', provider: 'Anthropic', inputCost: 0.0008, outputCost: 0.004, maxInputTokens: 200000, maxOutputTokens: 8192 },

  // Google
  { name: 'gemini-2.0-flash', displayName: 'Gemini 2.0 Flash', provider: 'Google', inputCost: 0.0001, outputCost: 0.0004, maxInputTokens: 1048576, maxOutputTokens: 8192 },
  { name: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro', provider: 'Google', inputCost: 0.00125, outputCost: 0.005, maxInputTokens: 2097152, maxOutputTokens: 8192 },
  { name: 'gemini-1.5-flash', displayName: 'Gemini 1.5 Flash', provider: 'Google', inputCost: 0.000075, outputCost: 0.0003, maxInputTokens: 1048576, maxOutputTokens: 8192 },

  // Meta (via providers)
  { name: 'llama-3.3-70b', displayName: 'Llama 3.3 70B', provider: 'Meta', inputCost: 0.00059, outputCost: 0.00079, maxInputTokens: 128000, maxOutputTokens: 128000 },
  { name: 'llama-3.1-405b', displayName: 'Llama 3.1 405B', provider: 'Meta', inputCost: 0.003, outputCost: 0.003, maxInputTokens: 128000, maxOutputTokens: 128000 },
  { name: 'llama-3.1-70b', displayName: 'Llama 3.1 70B', provider: 'Meta', inputCost: 0.00059, outputCost: 0.00079, maxInputTokens: 128000, maxOutputTokens: 128000 },
  { name: 'llama-3.1-8b', displayName: 'Llama 3.1 8B', provider: 'Meta', inputCost: 0.00006, outputCost: 0.00006, maxInputTokens: 128000, maxOutputTokens: 128000 },

  // Mistral
  { name: 'mistral-large', displayName: 'Mistral Large', provider: 'Mistral', inputCost: 0.002, outputCost: 0.006, maxInputTokens: 128000, maxOutputTokens: 128000 },
  { name: 'mistral-small', displayName: 'Mistral Small', provider: 'Mistral', inputCost: 0.0002, outputCost: 0.0006, maxInputTokens: 32000, maxOutputTokens: 32000 },

  // DeepSeek
  { name: 'deepseek-chat', displayName: 'DeepSeek V3', provider: 'DeepSeek', inputCost: 0.00027, outputCost: 0.0011, maxInputTokens: 64000, maxOutputTokens: 8192 },
  { name: 'deepseek-reasoner', displayName: 'DeepSeek R1', provider: 'DeepSeek', inputCost: 0.00055, outputCost: 0.00219, maxInputTokens: 64000, maxOutputTokens: 8192 },

  // xAI
  { name: 'grok-2', displayName: 'Grok 2', provider: 'xAI', inputCost: 0.002, outputCost: 0.01, maxInputTokens: 131072, maxOutputTokens: 131072 },
];

// Simple tokenizer estimation (GPT-like: ~4 chars per token for English, ~2 chars for Korean)
function estimateTokens(text: string): number {
  if (!text) return 0;

  let tokens = 0;
  for (const char of text) {
    // Korean characters (Hangul)
    if (/[\uac00-\ud7af]/.test(char)) {
      tokens += 0.5; // ~2 chars per token for Korean
    }
    // Chinese/Japanese
    else if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/.test(char)) {
      tokens += 0.5;
    }
    // Spaces and punctuation
    else if (/\s/.test(char)) {
      tokens += 0.25;
    }
    // Regular characters
    else {
      tokens += 0.25; // ~4 chars per token for English
    }
  }

  return Math.ceil(tokens);
}

export default function LlmCostCalculator() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [inputTokensManual, setInputTokensManual] = useState('');
  const [outputTokensManual, setOutputTokensManual] = useState('1000');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set(MODEL_PRICES.map(m => m.name)));
  const [useManualTokens, setUseManualTokens] = useState(false);
  const [requestCount, setRequestCount] = useState('1');
  const [showModelSelector, setShowModelSelector] = useState(false);

  // Currency settings
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [showExchangeRates, setShowExchangeRates] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(() => {
    const rates: Record<string, number> = {};
    CURRENCIES.forEach(c => { rates[c.code] = c.defaultRate; });
    return rates;
  });

  const inputTokens = useManualTokens
    ? parseInt(inputTokensManual) || 0
    : estimateTokens(inputText);

  const outputTokens = useManualTokens
    ? parseInt(outputTokensManual) || 0
    : estimateTokens(outputText) || parseInt(outputTokensManual) || 0;

  const requests = parseInt(requestCount) || 1;

  const providers = useMemo(() => {
    const uniqueProviders = [...new Set(MODEL_PRICES.map((m) => m.provider))];
    return ['all', ...uniqueProviders];
  }, []);

  const filteredModels = useMemo(() => {
    let models = MODEL_PRICES;
    if (selectedProvider !== 'all') {
      models = models.filter((m) => m.provider === selectedProvider);
    }
    return models.filter((m) => selectedModels.has(m.name));
  }, [selectedProvider, selectedModels]);

  const calculateCost = (model: ModelPrice) => {
    const inputCost = (inputTokens / 1000) * model.inputCost * requests;
    const outputCost = (outputTokens / 1000) * model.outputCost * requests;
    return { inputCost, outputCost, totalCost: inputCost + outputCost };
  };

  const sortedModels = useMemo(() => {
    return [...filteredModels].sort((a, b) => {
      const costA = calculateCost(a).totalCost;
      const costB = calculateCost(b).totalCost;
      return costA - costB;
    });
  }, [filteredModels, inputTokens, outputTokens, requests]);

  const cheapestCost = useMemo(() => {
    if (sortedModels.length === 0) return 0;
    return calculateCost(sortedModels[0]).totalCost;
  }, [sortedModels, inputTokens, outputTokens, requests]);

  const currentCurrency = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
  const currentRate = exchangeRates[selectedCurrency] || 1;

  const formatCost = (usdCost: number): string => {
    const cost = selectedCurrency === 'USD' ? usdCost : usdCost * currentRate;
    const symbol = currentCurrency.symbol;

    if (cost === 0) return `${symbol}0`;
    if (selectedCurrency === 'USD') {
      if (cost < 0.0001) return `${symbol}${cost.toExponential(2)}`;
      if (cost < 0.01) return `${symbol}${cost.toFixed(4)}`;
      if (cost < 1) return `${symbol}${cost.toFixed(3)}`;
      return `${symbol}${cost.toFixed(2)}`;
    }
    // For other currencies
    if (cost < 1) return `${symbol}${cost.toFixed(2)}`;
    if (cost < 1000) return `${symbol}${Math.round(cost).toLocaleString()}`;
    return `${symbol}${Math.round(cost).toLocaleString()}`;
  };

  const formatComparison = (totalCost: number): string => {
    if (cheapestCost === 0 || totalCost === cheapestCost) return '-';
    const diff = ((totalCost - cheapestCost) / cheapestCost) * 100;
    return `+${diff.toFixed(0)}%`;
  };

  const toggleModel = (modelName: string) => {
    const newSet = new Set(selectedModels);
    if (newSet.has(modelName)) {
      newSet.delete(modelName);
    } else {
      newSet.add(modelName);
    }
    setSelectedModels(newSet);
  };

  const selectAllModels = () => {
    setSelectedModels(new Set(MODEL_PRICES.map(m => m.name)));
  };

  const deselectAllModels = () => {
    setSelectedModels(new Set());
  };

  const selectProviderModels = (provider: string) => {
    const newSet = new Set(selectedModels);
    MODEL_PRICES.filter(m => m.provider === provider).forEach(m => newSet.add(m.name));
    setSelectedModels(newSet);
  };

  const deselectProviderModels = (provider: string) => {
    const newSet = new Set(selectedModels);
    MODEL_PRICES.filter(m => m.provider === provider).forEach(m => newSet.delete(m.name));
    setSelectedModels(newSet);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Input Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setUseManualTokens(false)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${!useManualTokens
              ? 'bg-primary-500 text-white'
              : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
            }`}
        >
          텍스트로 토큰 계산
        </button>
        <button
          onClick={() => setUseManualTokens(true)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${useManualTokens
              ? 'bg-primary-500 text-white'
              : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
            }`}
        >
          토큰 수 직접 입력
        </button>
      </div>

      {/* Text Input Mode */}
      {!useManualTokens && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text)]">
              입력 텍스트 (Input)
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="프롬프트를 입력하세요..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-card)] text-[var(--color-text)]
                focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
              <span>{inputText.length.toLocaleString()}자</span>
              <span>≈ {estimateTokens(inputText).toLocaleString()} 토큰 (추정)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text)]">
              출력 텍스트 (Output) - 예상 응답
            </label>
            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder="예상되는 출력 텍스트를 입력하거나, 아래에서 출력 토큰 수를 직접 입력하세요..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-card)] text-[var(--color-text)]
                focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
              <span>{outputText.length.toLocaleString()}자</span>
              <span>≈ {estimateTokens(outputText).toLocaleString()} 토큰 (추정)</span>
            </div>
          </div>

          {!outputText && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-text)]">
                  또는 출력 토큰 수 직접 입력
                </label>
                <input
                  type="number"
                  value={outputTokensManual}
                  onChange={(e) => setOutputTokensManual(e.target.value)}
                  placeholder="1000"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
                    bg-[var(--color-card)] text-[var(--color-text)]
                    focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-text)]">
                  요청 횟수
                </label>
                <input
                  type="number"
                  value={requestCount}
                  onChange={(e) => setRequestCount(e.target.value)}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
                    bg-[var(--color-card)] text-[var(--color-text)]
                    focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          {outputText && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-text)]">
                요청 횟수
              </label>
              <input
                type="number"
                value={requestCount}
                onChange={(e) => setRequestCount(e.target.value)}
                placeholder="1"
                min="1"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
                  bg-[var(--color-card)] text-[var(--color-text)]
                  focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
        </div>
      )}

      {/* Manual Token Input Mode */}
      {useManualTokens && (
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text)]">
              입력 토큰 수
            </label>
            <input
              type="number"
              value={inputTokensManual}
              onChange={(e) => setInputTokensManual(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-card)] text-[var(--color-text)]
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text)]">
              출력 토큰 수
            </label>
            <input
              type="number"
              value={outputTokensManual}
              onChange={(e) => setOutputTokensManual(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-card)] text-[var(--color-text)]
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text)]">
              요청 횟수
            </label>
            <input
              type="number"
              value={requestCount}
              onChange={(e) => setRequestCount(e.target.value)}
              placeholder="1"
              min="1"
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-card)] text-[var(--color-text)]
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: '짧은 답변', input: 500, output: 500 },
          { label: '일반 대화', input: 1000, output: 1000 },
          { label: '긴 글 작성', input: 2000, output: 4000 },
          { label: '코드 생성', input: 3000, output: 2000 },
          { label: '문서 분석', input: 10000, output: 2000 },
          { label: '대량 처리 (1000건)', input: 1000, output: 500, requests: 1000 },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setUseManualTokens(true);
              setInputTokensManual(String(preset.input));
              setOutputTokensManual(String(preset.output));
              if (preset.requests) setRequestCount(String(preset.requests));
            }}
            className="px-3 py-1 text-sm rounded-lg bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
              border border-[var(--color-border)] text-[var(--color-text-muted)]"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Token Summary */}
      <div className="p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">입력 토큰</p>
            <p className="text-2xl font-bold text-[var(--color-text)]">{inputTokens.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">출력 토큰</p>
            <p className="text-2xl font-bold text-[var(--color-text)]">{outputTokens.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">요청 횟수</p>
            <p className="text-2xl font-bold text-[var(--color-text)]">{requests.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Currency Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--color-text)]">통화 선택</label>
          <button
            onClick={() => setShowExchangeRates(!showExchangeRates)}
            className="text-sm text-primary-500 hover:underline"
          >
            {showExchangeRates ? '환율 설정 닫기' : '환율 설정'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {CURRENCIES.map((currency) => (
            <button
              key={currency.code}
              onClick={() => setSelectedCurrency(currency.code)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                ${selectedCurrency === currency.code
                  ? 'bg-primary-500 text-white'
                  : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
                }`}
            >
              {currency.symbol} {currency.name}
            </button>
          ))}
        </div>

        {showExchangeRates && (
          <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] mt-2">
            <p className="text-sm text-[var(--color-text-muted)] mb-3">$1 USD 기준 환율 입력</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CURRENCIES.filter(c => c.code !== 'USD').map((currency) => (
                <div key={currency.code} className="space-y-1">
                  <label className="block text-xs text-[var(--color-text-muted)]">
                    {currency.symbol} {currency.name}
                  </label>
                  <input
                    type="number"
                    value={exchangeRates[currency.code]}
                    onChange={(e) => setExchangeRates({
                      ...exchangeRates,
                      [currency.code]: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)]
                      bg-[var(--color-bg)] text-[var(--color-text)]
                      focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Provider Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--color-text)]">제공업체 필터</label>
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="text-sm text-primary-500 hover:underline"
          >
            {showModelSelector ? '모델 선택 닫기' : '모델 개별 선택'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {providers.map((provider) => (
            <button
              key={provider}
              onClick={() => setSelectedProvider(provider)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                ${selectedProvider === provider
                  ? 'bg-primary-500 text-white'
                  : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
                }`}
            >
              {provider === 'all' ? '전체' : provider}
            </button>
          ))}
        </div>
      </div>

      {/* Model Selector */}
      {showModelSelector && (
        <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="flex gap-2 mb-4">
            <button
              onClick={selectAllModels}
              className="px-3 py-1 text-sm rounded-lg bg-primary-500/10 text-primary-500 hover:bg-primary-500/20"
            >
              전체 선택
            </button>
            <button
              onClick={deselectAllModels}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--color-card-hover)] text-[var(--color-text-muted)]"
            >
              전체 해제
            </button>
          </div>

          {[...new Set(MODEL_PRICES.map(m => m.provider))].map((provider) => (
            <div key={provider} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-[var(--color-text)]">{provider}</span>
                <button
                  onClick={() => selectProviderModels(provider)}
                  className="text-xs text-primary-500 hover:underline"
                >
                  선택
                </button>
                <button
                  onClick={() => deselectProviderModels(provider)}
                  className="text-xs text-[var(--color-text-muted)] hover:underline"
                >
                  해제
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {MODEL_PRICES.filter(m => m.provider === provider).map((model) => (
                  <label
                    key={model.name}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm cursor-pointer transition-colors
                      ${selectedModels.has(model.name)
                        ? 'bg-primary-500/10 text-primary-500 border border-primary-500/30'
                        : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedModels.has(model.name)}
                      onChange={() => toggleModel(model.name)}
                      className="hidden"
                    />
                    {model.displayName}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cost Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left py-3 px-2 text-[var(--color-text-muted)] font-medium">모델</th>
              <th className="text-right py-3 px-2 text-[var(--color-text-muted)] font-medium">입력 비용</th>
              <th className="text-right py-3 px-2 text-[var(--color-text-muted)] font-medium">출력 비용</th>
              <th className="text-right py-3 px-2 text-[var(--color-text-muted)] font-medium">총 비용</th>
              <th className="text-right py-3 px-2 text-[var(--color-text-muted)] font-medium">비교</th>
            </tr>
          </thead>
          <tbody>
            {sortedModels.map((model, index) => {
              const { inputCost, outputCost, totalCost } = calculateCost(model);
              const isFirst = index === 0;
              const isOverLimit = inputTokens > model.maxInputTokens || outputTokens > model.maxOutputTokens;

              return (
                <tr
                  key={model.name}
                  className={`border-b border-[var(--color-border)] ${isOverLimit ? 'opacity-50' : ''} ${isFirst ? 'bg-green-500/5' : ''}`}
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {isFirst && <span className="text-green-500">1</span>}
                      {index === 1 && <span className="text-[var(--color-text-muted)]">2</span>}
                      {index === 2 && <span className="text-[var(--color-text-muted)]">3</span>}
                      <div>
                        <p className="font-medium text-[var(--color-text)]">{model.displayName}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{model.provider}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-3 px-2 font-mono text-[var(--color-text)]">
                    {formatCost(inputCost)}
                  </td>
                  <td className="text-right py-3 px-2 font-mono text-[var(--color-text)]">
                    {formatCost(outputCost)}
                  </td>
                  <td className="text-right py-3 px-2 font-mono font-bold text-primary-500">
                    {formatCost(totalCost)}
                  </td>
                  <td className="text-right py-3 px-2 font-mono text-[var(--color-text-muted)]">
                    {isFirst ? (
                      <span className="text-green-500">최저가</span>
                    ) : (
                      <span className="text-red-400">{formatComparison(totalCost)}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sortedModels.length === 0 && (
          <p className="text-center py-8 text-[var(--color-text-muted)]">
            비교할 모델을 선택하세요.
          </p>
        )}
      </div>

      {/* Pricing Info */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-medium text-[var(--color-text)] mb-2">참고 사항</h3>
        <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
          <li>• 가격은 2025년 1월 기준이며 실제 가격은 공식 사이트에서 확인하세요.</li>
          <li>• 토큰 수 추정은 GPT 토크나이저 기준 대략적인 값입니다.</li>
          <li>• 한국어는 영어보다 토큰을 더 많이 사용합니다 (~1.5-2배).</li>
          <li>• 기본 환율: $1 = ₩{CURRENCIES.find(c => c.code === 'KRW')?.defaultRate.toLocaleString()}, ¥{CURRENCIES.find(c => c.code === 'JPY')?.defaultRate}, €{CURRENCIES.find(c => c.code === 'EUR')?.defaultRate}</li>
        </ul>
      </div>
    </div>
  );
}
