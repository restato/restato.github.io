import { useState, useEffect, useCallback } from 'react';

// RSS to JSON API (CORS 지원)
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

interface Article {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceColor: string;
  thumbnail?: string;
}

interface FeedSource {
  id: string;
  name: string;
  color: string;
  rssUrl?: string;
  directUrl: string;
  icon: string;
  description: string;
  type: 'rss' | 'link-only';
}

// RSS 피드 지원 소스
const feedSources: FeedSource[] = [
  {
    id: 'geeknews',
    name: 'GeekNews',
    color: '#FF6B6B',
    rssUrl: 'https://news.hada.io/rss',
    directUrl: 'https://news.hada.io',
    icon: '📰',
    description: '개발/기술/스타트업 뉴스',
    type: 'rss',
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    color: '#FF6600',
    rssUrl: 'https://hnrss.org/frontpage',
    directUrl: 'https://news.ycombinator.com',
    icon: '🔶',
    description: 'Y Combinator 뉴스',
    type: 'rss',
  },
  {
    id: 'devto',
    name: 'DEV.to',
    color: '#0A0A0A',
    rssUrl: 'https://dev.to/feed',
    directUrl: 'https://dev.to',
    icon: '👩‍💻',
    description: '개발자 커뮤니티',
    type: 'rss',
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    color: '#00A562',
    rssUrl: 'https://techcrunch.com/feed/',
    directUrl: 'https://techcrunch.com',
    icon: '💚',
    description: '테크 뉴스',
    type: 'rss',
  },
  {
    id: 'producthunt',
    name: 'Product Hunt',
    color: '#DA552F',
    rssUrl: 'https://www.producthunt.com/feed',
    directUrl: 'https://www.producthunt.com',
    icon: '🐱',
    description: '신규 제품/서비스',
    type: 'rss',
  },
];

// 직접 링크만 제공하는 소스 (RSS/API 제한)
const linkOnlySources: FeedSource[] = [
  {
    id: 'twitter',
    name: 'X (Twitter)',
    color: '#000000',
    directUrl: 'https://x.com',
    icon: '𝕏',
    description: '실시간 소셜 미디어',
    type: 'link-only',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    directUrl: 'https://www.linkedin.com/feed/',
    icon: '💼',
    description: '비즈니스 SNS',
    type: 'link-only',
  },
  {
    id: 'threads',
    name: 'Threads',
    color: '#000000',
    directUrl: 'https://www.threads.net',
    icon: '🧵',
    description: 'Meta 소셜 미디어',
    type: 'link-only',
  },
  {
    id: 'medium',
    name: 'Medium',
    color: '#000000',
    directUrl: 'https://medium.com',
    icon: '📝',
    description: '블로그 플랫폼',
    type: 'link-only',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    color: '#FF4500',
    directUrl: 'https://www.reddit.com/r/programming/',
    icon: '🤖',
    description: 'r/programming',
    type: 'link-only',
  },
];

// HTML 태그 제거 함수
const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// 날짜 포맷팅
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return '방금 전';
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
};

export default function ArticleAggregator() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'sources'>('feed');
  const [selectedSources, setSelectedSources] = useState<string[]>(feedSources.map((s) => s.id));
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // RSS 피드 가져오기
  const fetchRssFeed = async (source: FeedSource): Promise<Article[]> => {
    if (!source.rssUrl) return [];

    try {
      const response = await fetch(`${RSS2JSON_API}${encodeURIComponent(source.rssUrl)}`);
      if (!response.ok) throw new Error('피드 로딩 실패');

      const data = await response.json();
      if (data.status !== 'ok') throw new Error(data.message || '피드 파싱 실패');

      return data.items.slice(0, 10).map(
        (item: {
          guid?: string;
          link: string;
          title: string;
          description?: string;
          content?: string;
          pubDate: string;
          thumbnail?: string;
          enclosure?: { link?: string };
        }) => ({
          id: `${source.id}-${item.guid || item.link}`,
          title: item.title,
          link: item.link,
          description: stripHtml(item.description || item.content || '').slice(0, 200),
          pubDate: item.pubDate,
          source: source.name,
          sourceColor: source.color,
          thumbnail: item.thumbnail || item.enclosure?.link,
        })
      );
    } catch (err) {
      console.error(`Failed to fetch ${source.name}:`, err);
      return [];
    }
  };

  // 모든 피드 가져오기
  const fetchAllFeeds = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      const activeSources = feedSources.filter((s) => selectedSources.includes(s.id));
      const results = await Promise.all(activeSources.map(fetchRssFeed));

      const allArticles = results.flat().sort((a, b) => {
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      });

      setArticles(allArticles);
    } catch (err) {
      setError('피드를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [selectedSources]);

  // 초기 로드
  useEffect(() => {
    fetchAllFeeds();
  }, [fetchAllFeeds]);

  // 소스 토글
  const toggleSource = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]
    );
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">아티클 피드</h1>
        <p className="opacity-90 mb-4">개발/기술 뉴스를 한 곳에서 모아보세요</p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="opacity-80">RSS 소스</span>
            <span className="ml-2 font-bold">{feedSources.length}개</span>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="opacity-80">총 아티클</span>
            <span className="ml-2 font-bold">{articles.length}개</span>
          </div>
          <button
            onClick={fetchAllFeeds}
            disabled={refreshing}
            className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
          >
            {refreshing ? '새로고침 중...' : '🔄 새로고침'}
          </button>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'feed'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          📰 피드
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'sources'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          🔗 소스 관리
        </button>
      </div>

      {/* 피드 탭 */}
      {activeTab === 'feed' && (
        <div>
          {/* 소스 필터 칩 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {feedSources.map((source) => (
              <button
                key={source.id}
                onClick={() => toggleSource(source.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedSources.includes(source.id)
                    ? 'text-white'
                    : 'bg-[var(--color-card)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                }`}
                style={
                  selectedSources.includes(source.id) ? { backgroundColor: source.color } : {}
                }
              >
                {source.icon} {source.name}
              </button>
            ))}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* 로딩 */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
                >
                  <div className="h-4 bg-[var(--color-border)] rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-[var(--color-border)] rounded w-full mb-2"></div>
                  <div className="h-3 bg-[var(--color-border)] rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
              <p className="text-4xl mb-4">📭</p>
              <p>표시할 아티클이 없습니다.</p>
              <p className="text-sm mt-2">소스를 선택해주세요.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <a
                  key={article.id}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-orange-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {article.thumbnail && (
                      <img
                        src={article.thumbnail}
                        alt=""
                        className="w-20 h-20 object-cover rounded-lg shrink-0 hidden sm:block"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: article.sourceColor }}
                        >
                          {article.source}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {formatDate(article.pubDate)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[var(--color-text)] group-hover:text-orange-600 transition-colors line-clamp-2 mb-1">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
                          {article.description}
                        </p>
                      )}
                    </div>
                    <span className="text-[var(--color-text-muted)] group-hover:text-orange-600 transition-colors shrink-0">
                      ↗
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 소스 관리 탭 */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          {/* RSS 피드 소스 */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-[var(--color-text)]">
              📡 RSS 피드 소스
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              자동으로 최신 아티클을 가져오는 소스입니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {feedSources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: `${source.color}20` }}
                  >
                    {source.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--color-text)]">{source.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {source.description}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source.id)}
                      onChange={() => toggleSource(source.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 직접 링크 소스 */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-[var(--color-text)]">
              🔗 바로가기 링크
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              RSS/API 제한으로 직접 방문이 필요한 소스입니다.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {linkOnlySources.map((source) => (
                <a
                  key={source.id}
                  href={source.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-orange-400 hover:shadow-md transition-all group"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${source.color}20` }}
                  >
                    {source.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-[var(--color-text)] text-sm group-hover:text-orange-600 transition-colors">
                      {source.name}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {source.description}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 안내 */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              <strong>참고:</strong> X(Twitter), LinkedIn, Threads 등은 API 접근이 제한되어 직접
              방문해야 합니다. RSS 피드가 있는 소스만 자동으로 아티클을 가져올 수 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <div className="text-center text-sm text-[var(--color-text-muted)] py-4">
        <p>새로운 RSS 소스 추가 요청은 GitHub Issue로 남겨주세요.</p>
      </div>
    </div>
  );
}
