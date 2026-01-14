import { useState, useEffect, useCallback } from 'react';

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';
const STORAGE_KEY = 'article-aggregator-data';
const GITHUB_TOKEN_KEY = 'article-aggregator-github-token';
const GITHUB_REPO = 'restato/restato.github.io';
const GITHUB_FILE_PATH = 'public/data/articles.json';

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
  category: 'global' | 'korea' | 'tech-blog' | 'social';
}

interface PickedArticle {
  id: string;
  title: string;
  link: string;
  description: string;
  memo?: string; // 선택적 메모
  addedAt: string;
}

interface StoredData {
  customSources: FeedSource[];
  pickedArticles: PickedArticle[];
  disabledSources: string[];
  lastUpdated?: string;
}

// 기본 RSS 피드 소스
const defaultFeedSources: FeedSource[] = [
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

const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

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

const formatDateKey = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

// GitHub API 헬퍼
const getGithubToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(GITHUB_TOKEN_KEY);
};

const setGithubToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GITHUB_TOKEN_KEY, token);
};

const removeGithubToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GITHUB_TOKEN_KEY);
};

// GitHub 토큰 유효성 검사
const validateGithubToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
};

const loadFromGithub = async (): Promise<StoredData | null> => {
  try {
    const response = await fetch('/data/articles.json');
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (e) {
    console.error('Failed to load from static file:', e);
  }
  return null;
};

const saveToGithub = async (data: StoredData): Promise<boolean> => {
  const token = getGithubToken();
  if (!token) return false;

  try {
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    let sha = '';
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update articles - ${new Date().toISOString()}`,
          content,
          sha: sha || undefined,
        }),
      }
    );

    return updateResponse.ok;
  } catch (e) {
    console.error('Failed to save to GitHub:', e);
    return false;
  }
};

const loadStoredData = (): StoredData => {
  if (typeof window === 'undefined') {
    return { customSources: [], pickedArticles: [], disabledSources: [] };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
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

// 날짜별 그룹화
const groupByDate = (articles: PickedArticle[]): Map<string, PickedArticle[]> => {
  const groups = new Map<string, PickedArticle[]>();

  articles.forEach((article) => {
    const dateKey = formatDateKey(article.addedAt);
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, article]);
  });

  return groups;
};

export default function ArticleAggregator() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'picks' | 'sources' | 'settings'>('feed');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 관리자 모드 (GitHub 토큰 유효성으로 결정)
  const [isAdmin, setIsAdmin] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const [customSources, setCustomSources] = useState<FeedSource[]>([]);
  const [pickedArticles, setPickedArticles] = useState<PickedArticle[]>([]);

  const [newSource, setNewSource] = useState({ name: '', rssUrl: '', icon: '📰', color: '#666666' });
  const [newPick, setNewPick] = useState({ title: '', link: '', description: '', memo: '' });

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // GitHub 설정
  const [githubToken, setGithubTokenState] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');

  const allFeedSources = [...defaultFeedSources, ...customSources];

  // 초기 데이터 로드 및 토큰 검증
  useEffect(() => {
    const initData = async () => {
      const token = getGithubToken();

      if (token) {
        setIsValidating(true);
        const isValid = await validateGithubToken(token);
        setIsAdmin(isValid);
        setIsValidating(false);

        if (!isValid) {
          removeGithubToken();
        }
      }

      const githubData = await loadFromGithub();
      if (githubData && (githubData.pickedArticles?.length > 0 || githubData.customSources?.length > 0)) {
        setCustomSources(githubData.customSources || []);
        setPickedArticles(githubData.pickedArticles || []);
        if (githubData.lastUpdated) setLastSaved(githubData.lastUpdated);
        saveStoredData(githubData);
      } else {
        const stored = loadStoredData();
        setCustomSources(stored.customSources || []);
        setPickedArticles(stored.pickedArticles || []);
      }

      const stored = loadStoredData();
      const enabledSources = [...defaultFeedSources, ...(stored.customSources || [])]
        .filter((s) => !(stored.disabledSources || []).includes(s.id))
        .map((s) => s.id);
      setSelectedSources(enabledSources);
    };

    initData();
  }, []);

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

  useEffect(() => {
    if (selectedSources.length > 0) {
      fetchAllFeeds();
    } else {
      setIsLoading(false);
    }
  }, [selectedSources.length > 0]);

  const toggleSource = (sourceId: string) => {
    setSelectedSources((prev) => {
      const newSelected = prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId];

      const stored = loadStoredData();
      stored.disabledSources = allFeedSources
        .filter((s) => !newSelected.includes(s.id))
        .map((s) => s.id);
      saveStoredData(stored);

      return newSelected;
    });
  };

  // GitHub 토큰 저장 및 검증
  const handleSaveGithubToken = async () => {
    if (!githubToken.trim()) return;

    setIsValidating(true);
    const isValid = await validateGithubToken(githubToken.trim());
    setIsValidating(false);

    if (isValid) {
      setGithubToken(githubToken.trim());
      setIsAdmin(true);
      setGithubTokenState('');
      alert('GitHub 연결 성공! 관리자 모드가 활성화되었습니다.');
    } else {
      alert('유효하지 않은 토큰입니다. 권한을 확인해주세요.');
    }
  };

  const handleSaveToGithub = async () => {
    if (!isAdmin) return;

    setIsSaving(true);
    const data: StoredData = {
      customSources,
      pickedArticles,
      disabledSources: allFeedSources
        .filter((s) => !selectedSources.includes(s.id))
        .map((s) => s.id),
      lastUpdated: new Date().toISOString(),
    };

    const success = await saveToGithub(data);
    setIsSaving(false);

    if (success) {
      setLastSaved(data.lastUpdated!);
      alert('GitHub에 저장되었습니다!');
    } else {
      alert('저장 실패. 토큰을 확인해주세요.');
    }
  };

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

    const stored = loadStoredData();
    stored.customSources = newCustomSources;
    saveStoredData(stored);

    setNewSource({ name: '', rssUrl: '', icon: '📰', color: '#666666' });
  };

  const handleDeleteSource = (sourceId: string) => {
    if (!confirm('이 소스를 삭제하시겠습니까?')) return;

    const newCustomSources = customSources.filter((s) => s.id !== sourceId);
    setCustomSources(newCustomSources);
    setSelectedSources((prev) => prev.filter((id) => id !== sourceId));

    const stored = loadStoredData();
    stored.customSources = newCustomSources;
    saveStoredData(stored);
  };

  const handleAddPick = () => {
    if (!newPick.link) {
      alert('링크를 입력해주세요.');
      return;
    }

    const pick: PickedArticle = {
      id: `pick-${Date.now()}`,
      title: newPick.title || newPick.link,
      link: newPick.link,
      description: newPick.description,
      memo: newPick.memo || undefined,
      addedAt: new Date().toISOString(),
    };

    const newPickedArticles = [pick, ...pickedArticles];
    setPickedArticles(newPickedArticles);

    const stored = loadStoredData();
    stored.pickedArticles = newPickedArticles;
    saveStoredData(stored);

    setNewPick({ title: '', link: '', description: '', memo: '' });
  };

  const handleDeletePick = (pickId: string) => {
    if (!confirm('이 아티클을 삭제하시겠습니까?')) return;

    const newPickedArticles = pickedArticles.filter((p) => p.id !== pickId);
    setPickedArticles(newPickedArticles);

    const stored = loadStoredData();
    stored.pickedArticles = newPickedArticles;
    saveStoredData(stored);
  };

  const handleExportData = () => {
    const data: StoredData = {
      customSources,
      pickedArticles,
      disabledSources: allFeedSources
        .filter((s) => !selectedSources.includes(s.id))
        .map((s) => s.id),
      lastUpdated: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `articles-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as StoredData;
        saveStoredData(data);
        setCustomSources(data.customSources || []);
        setPickedArticles(data.pickedArticles || []);
        alert('데이터를 가져왔습니다!');
        window.location.reload();
      } catch {
        alert('잘못된 파일 형식입니다.');
      }
    };
    reader.readAsText(file);
  };

  const filteredSources =
    categoryFilter === 'all'
      ? allFeedSources
      : allFeedSources.filter((s) => s.category === categoryFilter);

  // 날짜별 그룹화된 Pick
  const groupedPicks = groupByDate(pickedArticles);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">아티클 피드</h1>
          {isAdmin && (
            <span className="bg-white/20 px-2 py-1 rounded text-xs">✓ 관리자</span>
          )}
        </div>
        <p className="opacity-90 mb-4">개발/기술 뉴스를 한 곳에서 모아보세요</p>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="opacity-80">RSS</span>
            <span className="ml-2 font-bold">{allFeedSources.length}</span>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="opacity-80">아티클</span>
            <span className="ml-2 font-bold">{articles.length}</span>
          </div>
          {pickedArticles.length > 0 && (
            <div className="bg-white/20 rounded-lg px-3 py-2">
              <span className="opacity-80">수집</span>
              <span className="ml-2 font-bold">{pickedArticles.length}</span>
            </div>
          )}
          <button
            onClick={fetchAllFeeds}
            disabled={refreshing}
            className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
          >
            {refreshing ? '로딩...' : '🔄 새로고침'}
          </button>
          {isAdmin && (
            <button
              onClick={handleSaveToGithub}
              disabled={isSaving}
              className="bg-white/30 hover:bg-white/40 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
            >
              {isSaving ? '저장 중...' : '💾 저장'}
            </button>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-[var(--color-border)] overflow-x-auto">
        {[
          { id: 'feed', label: '📰 피드' },
          { id: 'picks', label: `⭐ 수집함${pickedArticles.length > 0 ? ` (${pickedArticles.length})` : ''}` },
          { id: 'sources', label: '🔗 소스' },
          { id: 'settings', label: '⚙️ 설정' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 피드 탭 */}
      {activeTab === 'feed' && (
        <div>
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
                style={selectedSources.includes(source.id) ? { backgroundColor: source.color } : {}}
              >
                {source.icon} {source.name}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
                  <div className="h-4 bg-[var(--color-border)] rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-[var(--color-border)] rounded w-full mb-2"></div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
              <p className="text-4xl mb-4">📭</p>
              <p>소스를 선택하고 새로고침 해주세요.</p>
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
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: article.sourceColor }}>
                          {article.source}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)]">{formatDate(article.pubDate)}</span>
                      </div>
                      <h3 className="font-semibold text-[var(--color-text)] group-hover:text-orange-600 transition-colors line-clamp-2 mb-1">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{article.description}</p>
                      )}
                    </div>
                    <span className="text-[var(--color-text-muted)] group-hover:text-orange-600 shrink-0">↗</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 수집함 탭 - 날짜별 히스토리 */}
      {activeTab === 'picks' && (
        <div className="space-y-6">
          {/* 관리자: 추가 폼 */}
          {isAdmin && (
            <div className="p-4 rounded-xl border-2 border-dashed border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
              <h3 className="font-semibold mb-3 text-[var(--color-text)]">⭐ 아티클 수집</h3>
              <div className="space-y-3">
                <input
                  type="url"
                  placeholder="링크 URL *"
                  value={newPick.link}
                  onChange={(e) => setNewPick({ ...newPick, link: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                />
                <input
                  type="text"
                  placeholder="제목 (선택 - 비워두면 링크 사용)"
                  value={newPick.title}
                  onChange={(e) => setNewPick({ ...newPick, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                />
                <textarea
                  placeholder="메모 (선택 - 왜 수집했는지, 나중에 읽을 때 참고할 내용)"
                  value={newPick.memo}
                  onChange={(e) => setNewPick({ ...newPick, memo: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] resize-none"
                />
                <button
                  onClick={handleAddPick}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  수집하기
                </button>
              </div>
            </div>
          )}

          {/* 날짜별 그룹화된 목록 */}
          {pickedArticles.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
              <p className="text-4xl mb-4">⭐</p>
              <p>아직 수집한 아티클이 없습니다.</p>
              {!isAdmin && <p className="text-sm mt-2">GitHub 토큰을 설정하면 아티클을 수집할 수 있습니다.</p>}
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from(groupedPicks.entries()).map(([dateKey, picks]) => (
                <div key={dateKey}>
                  {/* 날짜 헤더 */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <h3 className="font-semibold text-[var(--color-text)]">{dateKey}</h3>
                    <span className="text-sm text-[var(--color-text-muted)]">({picks.length}개)</span>
                  </div>

                  {/* 해당 날짜의 아티클들 */}
                  <div className="ml-6 border-l-2 border-orange-200 dark:border-orange-800 pl-4 space-y-3">
                    {picks.map((pick) => (
                      <div
                        key={pick.id}
                        className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <a
                              href={pick.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[var(--color-text)] hover:text-orange-600 transition-colors line-clamp-2"
                            >
                              {pick.title}
                            </a>
                            {pick.memo && (
                              <p className="text-sm text-orange-600 dark:text-orange-400 mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                💬 {pick.memo}
                              </p>
                            )}
                            <p className="text-xs text-[var(--color-text-muted)] mt-2">
                              {new Date(pick.addedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
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
                                className="text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
          {isAdmin && (
            <div className="p-4 rounded-xl border-2 border-dashed border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
              <h3 className="font-semibold mb-3 text-[var(--color-text)]">📡 RSS 소스 추가</h3>
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
                추가
              </button>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-3 text-[var(--color-text)]">📡 RSS 소스 ({allFeedSources.length}개)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allFeedSources.map((source) => (
                <div key={source.id} className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: `${source.color}20` }}>
                    {source.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--color-text)] text-sm truncate">{source.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{source.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={selectedSources.includes(source.id)} onChange={() => toggleSource(source.id)} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                    {isAdmin && source.id.startsWith('custom-') && (
                      <button onClick={() => handleDeleteSource(source.id)} className="text-red-500 hover:text-red-700 text-sm">✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-[var(--color-text)]">🔗 바로가기</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {linkOnlySources.map((source) => (
                <a key={source.id} href={source.directUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-orange-400 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${source.color}20` }}>{source.icon}</div>
                  <div className="font-medium text-[var(--color-text)] text-sm group-hover:text-orange-600 transition-colors">{source.name}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 설정 탭 */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-xl">
          {/* GitHub 연동 */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
            <h3 className="font-semibold mb-3 text-[var(--color-text)]">🔗 GitHub 연동</h3>

            {isAdmin ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <span>✓</span>
                  <span className="text-sm">연결됨 - 관리자 모드 활성화</span>
                </div>
                {lastSaved && (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    마지막 저장: {new Date(lastSaved).toLocaleString('ko-KR')}
                  </p>
                )}
                <button
                  onClick={() => {
                    removeGithubToken();
                    setIsAdmin(false);
                  }}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  연결 해제
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-[var(--color-text-muted)]">
                  GitHub 토큰을 입력하면 아티클 수집 및 RSS 소스 관리가 가능합니다.
                </p>
                <input
                  type="password"
                  placeholder="GitHub Personal Access Token"
                  value={githubToken}
                  onChange={(e) => setGithubTokenState(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveGithubToken()}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                />
                <button
                  onClick={handleSaveGithubToken}
                  disabled={isValidating}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {isValidating ? '확인 중...' : '연결'}
                </button>
                <p className="text-xs text-[var(--color-text-muted)]">
                  GitHub → Settings → Developer settings → Personal access tokens
                  <br />→ Fine-grained tokens → Contents (Read and write)
                </p>
              </div>
            )}
          </div>

          {/* 데이터 관리 */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
            <h3 className="font-semibold mb-3 text-[var(--color-text)]">📦 데이터</h3>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleExportData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                📥 내보내기
              </button>
              <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer text-sm">
                📤 가져오기
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
