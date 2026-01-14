import { useState, useEffect, useCallback } from 'react';

// RSS to JSON API (CORS 지원)
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';
const ADMIN_PASSWORD = 'restato2024'; // 간단한 관리자 비밀번호
const STORAGE_KEY = 'article-aggregator-data';

interface Article {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceColor: string;
  thumbnail?: string;
  isPick?: boolean; // MD's Pick 여부
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
  category: 'global' | 'korea' | 'tech-blog' | 'social';
}

interface PickedArticle {
  id: string;
  title: string;
  link: string;
  description: string;
  addedAt: string;
}

interface StoredData {
  customSources: FeedSource[];
  pickedArticles: PickedArticle[];
  disabledSources: string[];
}

// 기본 RSS 피드 소스
const defaultFeedSources: FeedSource[] = [
  // 글로벌 뉴스
  {
    id: 'geeknews',
    name: 'GeekNews',
    color: '#FF6B6B',
    rssUrl: 'https://news.hada.io/rss',
    directUrl: 'https://news.hada.io',
    icon: '📰',
    description: '개발/기술/스타트업 뉴스',
    type: 'rss',
    category: 'korea',
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
    category: 'global',
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
    category: 'global',
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
    category: 'global',
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
    category: 'global',
  },
  // 한국 미디어
  {
    id: 'yozm',
    name: '요즘IT',
    color: '#5B4FFF',
    rssUrl: 'https://yozm.wishket.com/magazine/feed/',
    directUrl: 'https://yozm.wishket.com',
    icon: '💜',
    description: '개발자 매거진',
    type: 'rss',
    category: 'korea',
  },
  // 기술 블로그 - 글로벌
  {
    id: 'netflix',
    name: 'Netflix Tech',
    color: '#E50914',
    rssUrl: 'https://netflixtechblog.com/feed',
    directUrl: 'https://netflixtechblog.com',
    icon: '🎬',
    description: 'Netflix 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'uber',
    name: 'Uber Engineering',
    color: '#000000',
    rssUrl: 'https://eng.uber.com/feed/',
    directUrl: 'https://eng.uber.com',
    icon: '🚗',
    description: 'Uber 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'doordash',
    name: 'DoorDash',
    color: '#FF3008',
    rssUrl: 'https://doordash.engineering/feed/',
    directUrl: 'https://doordash.engineering',
    icon: '🚪',
    description: 'DoorDash 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'airbnb',
    name: 'Airbnb Tech',
    color: '#FF5A5F',
    rssUrl: 'https://medium.com/feed/airbnb-engineering',
    directUrl: 'https://medium.com/airbnb-engineering',
    icon: '🏠',
    description: 'Airbnb 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'spotify',
    name: 'Spotify Engineering',
    color: '#1DB954',
    rssUrl: 'https://engineering.atspotify.com/feed/',
    directUrl: 'https://engineering.atspotify.com',
    icon: '🎵',
    description: 'Spotify 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  // 기술 블로그 - 한국
  {
    id: 'kakao',
    name: '카카오 기술블로그',
    color: '#FEE500',
    rssUrl: 'https://tech.kakao.com/feed/',
    directUrl: 'https://tech.kakao.com',
    icon: '💬',
    description: '카카오 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'woowahan',
    name: '우아한형제들',
    color: '#2AC1BC',
    rssUrl: 'https://techblog.woowahan.com/feed/',
    directUrl: 'https://techblog.woowahan.com',
    icon: '🍔',
    description: '배민 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'toss',
    name: '토스 기술블로그',
    color: '#0064FF',
    rssUrl: 'https://toss.tech/rss.xml',
    directUrl: 'https://toss.tech',
    icon: '💙',
    description: '토스 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'line',
    name: 'LINE Engineering',
    color: '#00C300',
    rssUrl: 'https://engineering.linecorp.com/ko/feed/',
    directUrl: 'https://engineering.linecorp.com/ko',
    icon: '💚',
    description: '라인 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'naver',
    name: 'NAVER D2',
    color: '#03C75A',
    rssUrl: 'https://d2.naver.com/d2.atom',
    directUrl: 'https://d2.naver.com',
    icon: '🟢',
    description: '네이버 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
];

// 직접 링크만 제공하는 소스
const linkOnlySources: FeedSource[] = [
  {
    id: 'twitter',
    name: 'X (Twitter)',
    color: '#000000',
    directUrl: 'https://x.com',
    icon: '𝕏',
    description: '실시간 소셜 미디어',
    type: 'link-only',
    category: 'social',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    directUrl: 'https://www.linkedin.com/feed/',
    icon: '💼',
    description: '비즈니스 SNS',
    type: 'link-only',
    category: 'social',
  },
  {
    id: 'threads',
    name: 'Threads',
    color: '#000000',
    directUrl: 'https://www.threads.net',
    icon: '🧵',
    description: 'Meta 소셜 미디어',
    type: 'link-only',
    category: 'social',
  },
  {
    id: 'medium',
    name: 'Medium',
    color: '#000000',
    directUrl: 'https://medium.com',
    icon: '📝',
    description: '블로그 플랫폼',
    type: 'link-only',
    category: 'social',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    color: '#FF4500',
    directUrl: 'https://www.reddit.com/r/programming/',
    icon: '🤖',
    description: 'r/programming',
    type: 'link-only',
    category: 'social',
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

// 로컬 스토리지 헬퍼
const loadStoredData = (): StoredData => {
  if (typeof window === 'undefined') {
    return { customSources: [], pickedArticles: [], disabledSources: [] };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load stored data:', e);
  }
  return { customSources: [], pickedArticles: [], disabledSources: [] };
};

const saveStoredData = (data: StoredData) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};

export default function ArticleAggregator() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'picks' | 'sources' | 'admin'>('feed');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 관리자 모드
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // 커스텀 데이터
  const [customSources, setCustomSources] = useState<FeedSource[]>([]);
  const [pickedArticles, setPickedArticles] = useState<PickedArticle[]>([]);

  // 새 소스/아티클 추가 폼
  const [newSource, setNewSource] = useState({ name: '', rssUrl: '', icon: '📰', color: '#666666' });
  const [newPick, setNewPick] = useState({ title: '', link: '', description: '' });

  // 카테고리 필터
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // 모든 소스 합치기
  const allFeedSources = [...defaultFeedSources, ...customSources];

  // 초기 데이터 로드
  useEffect(() => {
    const stored = loadStoredData();
    setCustomSources(stored.customSources);
    setPickedArticles(stored.pickedArticles);
    // 비활성화되지 않은 소스만 선택
    const enabledSources = allFeedSources
      .filter((s) => !stored.disabledSources.includes(s.id))
      .map((s) => s.id);
    setSelectedSources(enabledSources);
  }, []);

  // RSS 피드 가져오기
  const fetchRssFeed = async (source: FeedSource): Promise<Article[]> => {
    if (!source.rssUrl) return [];

    try {
      const response = await fetch(`${RSS2JSON_API}${encodeURIComponent(source.rssUrl)}`);
      if (!response.ok) throw new Error('피드 로딩 실패');

      const data = await response.json();
      if (data.status !== 'ok') throw new Error(data.message || '피드 파싱 실패');

      return data.items.slice(0, 8).map(
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
      const activeSources = allFeedSources.filter((s) => selectedSources.includes(s.id));
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
  }, [selectedSources, customSources]);

  // 초기 로드
  useEffect(() => {
    if (selectedSources.length > 0) {
      fetchAllFeeds();
    } else {
      setIsLoading(false);
    }
  }, [selectedSources.length > 0]);

  // 소스 토글
  const toggleSource = (sourceId: string) => {
    setSelectedSources((prev) => {
      const newSelected = prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId];

      // 저장
      const stored = loadStoredData();
      stored.disabledSources = allFeedSources
        .filter((s) => !newSelected.includes(s.id))
        .map((s) => s.id);
      saveStoredData(stored);

      return newSelected;
    });
  };

  // 관리자 로그인
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminPassword('');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // 새 소스 추가
  const handleAddSource = () => {
    if (!newSource.name || !newSource.rssUrl) {
      alert('이름과 RSS URL을 입력해주세요.');
      return;
    }

    const source: FeedSource = {
      id: `custom-${Date.now()}`,
      name: newSource.name,
      color: newSource.color,
      rssUrl: newSource.rssUrl,
      directUrl: newSource.rssUrl.replace('/feed', '').replace('/rss', ''),
      icon: newSource.icon,
      description: '사용자 추가 소스',
      type: 'rss',
      category: 'global',
    };

    const newCustomSources = [...customSources, source];
    setCustomSources(newCustomSources);
    setSelectedSources((prev) => [...prev, source.id]);

    // 저장
    const stored = loadStoredData();
    stored.customSources = newCustomSources;
    saveStoredData(stored);

    setNewSource({ name: '', rssUrl: '', icon: '📰', color: '#666666' });
    alert('소스가 추가되었습니다!');
  };

  // 소스 삭제
  const handleDeleteSource = (sourceId: string) => {
    if (!confirm('이 소스를 삭제하시겠습니까?')) return;

    const newCustomSources = customSources.filter((s) => s.id !== sourceId);
    setCustomSources(newCustomSources);
    setSelectedSources((prev) => prev.filter((id) => id !== sourceId));

    // 저장
    const stored = loadStoredData();
    stored.customSources = newCustomSources;
    saveStoredData(stored);
  };

  // MD's Pick 추가
  const handleAddPick = () => {
    if (!newPick.title || !newPick.link) {
      alert('제목과 링크를 입력해주세요.');
      return;
    }

    const pick: PickedArticle = {
      id: `pick-${Date.now()}`,
      title: newPick.title,
      link: newPick.link,
      description: newPick.description,
      addedAt: new Date().toISOString(),
    };

    const newPickedArticles = [pick, ...pickedArticles];
    setPickedArticles(newPickedArticles);

    // 저장
    const stored = loadStoredData();
    stored.pickedArticles = newPickedArticles;
    saveStoredData(stored);

    setNewPick({ title: '', link: '', description: '' });
    alert('아티클이 추가되었습니다!');
  };

  // MD's Pick 삭제
  const handleDeletePick = (pickId: string) => {
    if (!confirm('이 아티클을 삭제하시겠습니까?')) return;

    const newPickedArticles = pickedArticles.filter((p) => p.id !== pickId);
    setPickedArticles(newPickedArticles);

    // 저장
    const stored = loadStoredData();
    stored.pickedArticles = newPickedArticles;
    saveStoredData(stored);
  };

  // 데이터 내보내기
  const handleExportData = () => {
    const data = loadStoredData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `article-aggregator-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 데이터 가져오기
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as StoredData;
        saveStoredData(data);
        setCustomSources(data.customSources);
        setPickedArticles(data.pickedArticles);
        alert('데이터를 가져왔습니다!');
        window.location.reload();
      } catch (err) {
        alert('잘못된 파일 형식입니다.');
      }
    };
    reader.readAsText(file);
  };

  // 필터링된 소스
  const filteredSources =
    categoryFilter === 'all'
      ? allFeedSources
      : allFeedSources.filter((s) => s.category === categoryFilter);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">아티클 피드</h1>
          {isAdmin && (
            <span className="bg-white/20 px-2 py-1 rounded text-xs">관리자 모드</span>
          )}
        </div>
        <p className="opacity-90 mb-4">개발/기술 뉴스를 한 곳에서 모아보세요</p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="opacity-80">RSS 소스</span>
            <span className="ml-2 font-bold">{allFeedSources.length}개</span>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="opacity-80">총 아티클</span>
            <span className="ml-2 font-bold">{articles.length}개</span>
          </div>
          {pickedArticles.length > 0 && (
            <div className="bg-white/20 rounded-lg px-3 py-2">
              <span className="opacity-80">MD's Pick</span>
              <span className="ml-2 font-bold">{pickedArticles.length}개</span>
            </div>
          )}
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
      <div className="flex gap-2 border-b border-[var(--color-border)] overflow-x-auto">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'feed'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          📰 피드
        </button>
        <button
          onClick={() => setActiveTab('picks')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'picks'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          ⭐ MD's Pick {pickedArticles.length > 0 && `(${pickedArticles.length})`}
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'sources'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          🔗 소스 관리
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'admin'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          ⚙️ 관리
        </button>
      </div>

      {/* 피드 탭 */}
      {activeTab === 'feed' && (
        <div>
          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: 'all', label: '전체' },
              { id: 'korea', label: '🇰🇷 한국' },
              { id: 'global', label: '🌍 글로벌' },
              { id: 'tech-blog', label: '🏢 기술블로그' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-[var(--color-card)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 소스 필터 칩 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filteredSources.map((source) => (
              <button
                key={source.id}
                onClick={() => toggleSource(source.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedSources.includes(source.id)
                    ? 'text-white'
                    : 'bg-[var(--color-card)] text-[var(--color-text-muted)] border border-[var(--color-border)] opacity-50'
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
              <p className="text-sm mt-2">소스를 선택하고 새로고침 해주세요.</p>
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

      {/* MD's Pick 탭 */}
      {activeTab === 'picks' && (
        <div className="space-y-4">
          {/* 관리자: Pick 추가 폼 */}
          {isAdmin && (
            <div className="p-4 rounded-xl border-2 border-dashed border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
              <h3 className="font-semibold mb-3 text-[var(--color-text)]">⭐ 새 아티클 추가</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="제목"
                  value={newPick.title}
                  onChange={(e) => setNewPick({ ...newPick, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                />
                <input
                  type="url"
                  placeholder="링크 URL"
                  value={newPick.link}
                  onChange={(e) => setNewPick({ ...newPick, link: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                />
                <input
                  type="text"
                  placeholder="설명 (선택)"
                  value={newPick.description}
                  onChange={(e) => setNewPick({ ...newPick, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                />
                <button
                  onClick={handleAddPick}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  추가
                </button>
              </div>
            </div>
          )}

          {/* Pick 목록 */}
          {pickedArticles.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
              <p className="text-4xl mb-4">⭐</p>
              <p>아직 추가된 Pick이 없습니다.</p>
              {!isAdmin && <p className="text-sm mt-2">관리자 모드에서 추가할 수 있습니다.</p>}
            </div>
          ) : (
            <div className="space-y-3">
              {pickedArticles.map((pick) => (
                <div
                  key={pick.id}
                  className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500 text-white">
                          MD's Pick
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {formatDate(pick.addedAt)}
                        </span>
                      </div>
                      <a
                        href={pick.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[var(--color-text)] hover:text-orange-600 transition-colors line-clamp-2 mb-1"
                      >
                        {pick.title}
                      </a>
                      {pick.description && (
                        <p className="text-sm text-[var(--color-text-muted)]">{pick.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={pick.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-text-muted)] hover:text-orange-600 transition-colors"
                      >
                        ↗
                      </a>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeletePick(pick.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 소스 관리 탭 */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          {/* 관리자: 소스 추가 폼 */}
          {isAdmin && (
            <div className="p-4 rounded-xl border-2 border-dashed border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
              <h3 className="font-semibold mb-3 text-[var(--color-text)]">📡 새 RSS 소스 추가</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="소스 이름"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                />
                <input
                  type="url"
                  placeholder="RSS URL"
                  value={newSource.rssUrl}
                  onChange={(e) => setNewSource({ ...newSource, rssUrl: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                />
                <input
                  type="text"
                  placeholder="아이콘 (이모지)"
                  value={newSource.icon}
                  onChange={(e) => setNewSource({ ...newSource, icon: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                />
                <input
                  type="color"
                  value={newSource.color}
                  onChange={(e) => setNewSource({ ...newSource, color: e.target.value })}
                  className="h-10 rounded-lg border border-[var(--color-border)] cursor-pointer"
                />
              </div>
              <button
                onClick={handleAddSource}
                className="mt-3 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                소스 추가
              </button>
            </div>
          )}

          {/* RSS 피드 소스 */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-[var(--color-text)]">
              📡 RSS 피드 소스 ({allFeedSources.length}개)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allFeedSources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: `${source.color}20` }}
                  >
                    {source.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--color-text)] text-sm truncate">
                      {source.name}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">{source.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source.id)}
                        onChange={() => toggleSource(source.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                    </label>
                    {isAdmin && source.id.startsWith('custom-') && (
                      <button
                        onClick={() => handleDeleteSource(source.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 직접 링크 소스 */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-[var(--color-text)]">🔗 바로가기</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {linkOnlySources.map((source) => (
                <a
                  key={source.id}
                  href={source.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-orange-400 hover:shadow-md transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${source.color}20` }}
                  >
                    {source.icon}
                  </div>
                  <div className="font-medium text-[var(--color-text)] text-sm group-hover:text-orange-600 transition-colors">
                    {source.name}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 관리 탭 */}
      {activeTab === 'admin' && (
        <div className="space-y-6">
          {!isAdmin ? (
            <div className="max-w-md mx-auto p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
              <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)] text-center">
                🔐 관리자 로그인
              </h2>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                />
                <button
                  onClick={handleAdminLogin}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  로그인
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  ✅ 관리자로 로그인되었습니다.
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  이제 소스 추가/삭제, MD's Pick 관리가 가능합니다.
                </p>
              </div>

              {/* 데이터 내보내기/가져오기 */}
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
                <h3 className="font-semibold mb-3 text-[var(--color-text)]">📦 데이터 관리</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📥 데이터 내보내기
                  </button>
                  <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                    📤 데이터 가져오기
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  내보낸 JSON 파일을 코드에 반영하면 모든 사용자가 볼 수 있습니다.
                </p>
              </div>

              {/* 로그아웃 */}
              <button
                onClick={() => setIsAdmin(false)}
                className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-card)] transition-colors"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      )}

      {/* 푸터 */}
      <div className="text-center text-sm text-[var(--color-text-muted)] py-4">
        <p>RSS 피드를 통해 최신 기술 뉴스를 모아봅니다.</p>
      </div>
    </div>
  );
}
