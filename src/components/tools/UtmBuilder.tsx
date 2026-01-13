import { useState, useMemo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface UtmParams {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

const SOURCES = [
  { value: 'google', label: 'Google' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'email', label: 'Email' },
  { value: 'newsletter', label: 'Newsletter' },
];

const MEDIUMS = [
  { value: 'cpc', label: 'CPC (Cost Per Click)' },
  { value: 'cpm', label: 'CPM (Cost Per Mille)' },
  { value: 'social', label: 'Social' },
  { value: 'email', label: 'Email' },
  { value: 'organic', label: 'Organic' },
  { value: 'referral', label: 'Referral' },
  { value: 'display', label: 'Display' },
  { value: 'affiliate', label: 'Affiliate' },
  { value: 'banner', label: 'Banner' },
];

export default function UtmBuilder() {
  const { t } = useTranslation();

  const [params, setParams] = useState<UtmParams>({
    url: '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  });
  const [copied, setCopied] = useState(false);

  const generatedUrl = useMemo(() => {
    if (!params.url) return '';

    try {
      const url = new URL(params.url.startsWith('http') ? params.url : `https://${params.url}`);

      if (params.source) url.searchParams.set('utm_source', params.source);
      if (params.medium) url.searchParams.set('utm_medium', params.medium);
      if (params.campaign) url.searchParams.set('utm_campaign', params.campaign);
      if (params.term) url.searchParams.set('utm_term', params.term);
      if (params.content) url.searchParams.set('utm_content', params.content);

      return url.toString();
    } catch {
      return '';
    }
  }, [params]);

  const isValid = params.url && params.source && params.medium && params.campaign;

  const copyToClipboard = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearAll = () => {
    setParams({
      url: '',
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: '',
    });
  };

  const loadExample = () => {
    setParams({
      url: 'https://example.com/product',
      source: 'facebook',
      medium: 'cpc',
      campaign: 'spring_sale_2024',
      term: '',
      content: 'banner_v1',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={loadExample}
          className="px-3 py-1.5 text-sm bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
            border border-[var(--color-border)] rounded-lg transition-colors"
        >
          {t({ ko: '예제 불러오기', en: 'Load Example', ja: 'サンプルを読み込む' })}
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-1.5 text-sm bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
            border border-[var(--color-border)] rounded-lg transition-colors"
        >
          {t({ ko: '초기화', en: 'Clear', ja: 'クリア' })}
        </button>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          {t({ ko: '웹사이트 URL', en: 'Website URL', ja: 'ウェブサイトURL' })} *
        </label>
        <input
          type="text"
          value={params.url}
          onChange={(e) => setParams({ ...params, url: e.target.value })}
          placeholder="https://example.com/page"
          className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)]
            bg-[var(--color-card)] text-[var(--color-text)]
            focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Required Parameters */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Source */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            utm_source * <span className="text-[var(--color-text-muted)] font-normal">({t({ ko: '트래픽 소스', en: 'Traffic Source', ja: 'トラフィックソース' })})</span>
          </label>
          <select
            value={params.source}
            onChange={(e) => setParams({ ...params, source: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)]
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t({ ko: '선택하세요', en: 'Select', ja: '選択' })}</option>
            {SOURCES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={params.source}
            onChange={(e) => setParams({ ...params, source: e.target.value })}
            placeholder={t({ ko: '또는 직접 입력', en: 'Or type custom', ja: 'または直接入力' })}
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)] text-sm
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Medium */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            utm_medium * <span className="text-[var(--color-text-muted)] font-normal">({t({ ko: '마케팅 매체', en: 'Marketing Medium', ja: 'マーケティング媒体' })})</span>
          </label>
          <select
            value={params.medium}
            onChange={(e) => setParams({ ...params, medium: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)]
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t({ ko: '선택하세요', en: 'Select', ja: '選択' })}</option>
            {MEDIUMS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={params.medium}
            onChange={(e) => setParams({ ...params, medium: e.target.value })}
            placeholder={t({ ko: '또는 직접 입력', en: 'Or type custom', ja: 'または直接入力' })}
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)] text-sm
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Campaign */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            utm_campaign * <span className="text-[var(--color-text-muted)] font-normal">({t({ ko: '캠페인 이름', en: 'Campaign Name', ja: 'キャンペーン名' })})</span>
          </label>
          <input
            type="text"
            value={params.campaign}
            onChange={(e) => setParams({ ...params, campaign: e.target.value })}
            placeholder="spring_sale_2024"
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)]
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-[var(--color-text-muted)]">
            {t({ ko: '공백 대신 언더스코어(_) 사용', en: 'Use underscores instead of spaces', ja: 'スペースの代わりにアンダースコア(_)を使用' })}
          </p>
        </div>
      </div>

      {/* Optional Parameters */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Term */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            utm_term <span className="text-[var(--color-text-muted)] font-normal">({t({ ko: '유료 검색 키워드', en: 'Paid Search Keywords', ja: '有料検索キーワード' })})</span>
          </label>
          <input
            type="text"
            value={params.term}
            onChange={(e) => setParams({ ...params, term: e.target.value })}
            placeholder="running+shoes"
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)]
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            utm_content <span className="text-[var(--color-text-muted)] font-normal">({t({ ko: '콘텐츠 식별자', en: 'Content Identifier', ja: 'コンテンツ識別子' })})</span>
          </label>
          <input
            type="text"
            value={params.content}
            onChange={(e) => setParams({ ...params, content: e.target.value })}
            placeholder="banner_v1"
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)]
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Generated URL */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            {t({ ko: '생성된 URL', en: 'Generated URL', ja: '生成されたURL' })}
          </label>
          <button
            onClick={copyToClipboard}
            disabled={!generatedUrl}
            className="px-3 py-1 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded
              transition-colors disabled:opacity-50"
          >
            {copied ? t({ ko: '복사됨!', en: 'Copied!', ja: 'コピーしました!' }) : t({ ko: '복사', en: 'Copy', ja: 'コピー' })}
          </button>
        </div>
        <div className="p-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] min-h-[60px]">
          {generatedUrl ? (
            <code className="text-sm font-mono text-[var(--color-text)] break-all">
              {generatedUrl}
            </code>
          ) : (
            <span className="text-sm text-[var(--color-text-muted)]">
              {t({ ko: 'URL과 필수 파라미터를 입력하세요', en: 'Enter URL and required parameters', ja: 'URLと必須パラメータを入力してください' })}
            </span>
          )}
        </div>
        {!isValid && params.url && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            {t({ ko: '* 표시된 필수 항목을 모두 입력하세요', en: 'Please fill in all required (*) fields', ja: '*マークの必須項目をすべて入力してください' })}
          </p>
        )}
      </div>

      {/* Info */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="text-sm font-medium text-[var(--color-text)] mb-2">
          {t({ ko: 'UTM 파라미터란?', en: 'What are UTM Parameters?', ja: 'UTMパラメータとは？' })}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          {t({
            ko: 'UTM(Urchin Tracking Module) 파라미터는 마케팅 캠페인의 트래픽 소스를 추적하는 데 사용됩니다. Google Analytics 등의 분석 도구에서 캠페인 성과를 측정할 수 있습니다.',
            en: 'UTM (Urchin Tracking Module) parameters are used to track marketing campaign traffic sources. They help measure campaign performance in analytics tools like Google Analytics.',
            ja: 'UTM（Urchin Tracking Module）パラメータは、マーケティングキャンペーンのトラフィックソースを追跡するために使用されます。Google Analyticsなどの分析ツールでキャンペーンのパフォーマンスを測定できます。',
          })}
        </p>
      </div>
    </div>
  );
}
