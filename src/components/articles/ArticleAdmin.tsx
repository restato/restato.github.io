import { useState, useEffect } from 'react';

const STORAGE_KEY = 'article-aggregator-data';
const GITHUB_TOKEN_KEY = 'article-aggregator-github-token';
const GITHUB_REPO = 'restato/restato.github.io';
const GITHUB_FILE_PATH = 'public/data/articles.json';

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
  memo?: string;
  addedAt: string;
}

interface StoredData {
  customSources: FeedSource[];
  pickedArticles: PickedArticle[];
  disabledSources: string[];
  lastUpdated?: string;
}

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
      return await response.json();
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

const formatDateKey = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const groupByDate = (articles: PickedArticle[]): Map<string, PickedArticle[]> => {
  const groups = new Map<string, PickedArticle[]>();
  articles.forEach((article) => {
    const dateKey = formatDateKey(article.addedAt);
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, article]);
  });
  return groups;
};

export default function ArticleAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenInput, setTokenInput] = useState('');

  const [activeTab, setActiveTab] = useState<'sources' | 'articles'>('sources');
  const [customSources, setCustomSources] = useState<FeedSource[]>([]);
  const [pickedArticles, setPickedArticles] = useState<PickedArticle[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');

  const [newSource, setNewSource] = useState({ name: '', rssUrl: '', icon: '📰', color: '#666666', category: 'global' as 'global' | 'korea' | 'tech-blog' });
  const [newPick, setNewPick] = useState({ title: '', link: '', description: '', memo: '' });

  // 초기 토큰 검증
  useEffect(() => {
    const checkAuth = async () => {
      const token = getGithubToken();
      if (token) {
        const isValid = await validateGithubToken(token);
        setIsAuthenticated(isValid);
        if (!isValid) {
          removeGithubToken();
        }
      }
      setIsValidating(false);
    };
    checkAuth();
  }, []);

  // 데이터 로드
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      const githubData = await loadFromGithub();
      if (githubData) {
        setCustomSources(githubData.customSources || []);
        setPickedArticles(githubData.pickedArticles || []);
        if (githubData.lastUpdated) setLastSaved(githubData.lastUpdated);
        saveStoredData(githubData);
      } else {
        const stored = loadStoredData();
        setCustomSources(stored.customSources || []);
        setPickedArticles(stored.pickedArticles || []);
      }
    };
    loadData();
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!tokenInput.trim()) return;

    setIsValidating(true);
    const isValid = await validateGithubToken(tokenInput.trim());
    setIsValidating(false);

    if (isValid) {
      setGithubToken(tokenInput.trim());
      setIsAuthenticated(true);
      setTokenInput('');
    } else {
      alert('유효하지 않은 토큰입니다. 권한을 확인해주세요.');
    }
  };

  const handleLogout = () => {
    removeGithubToken();
    setIsAuthenticated(false);
  };

  const handleSaveToGithub = async () => {
    setIsSaving(true);
    const stored = loadStoredData();
    const data: StoredData = {
      customSources,
      pickedArticles,
      disabledSources: stored.disabledSources || [],
      lastUpdated: new Date().toISOString(),
    };

    const success = await saveToGithub(data);
    setIsSaving(false);

    if (success) {
      setLastSaved(data.lastUpdated!);
      saveStoredData(data);
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
      category: newSource.category,
    };

    const newCustomSources = [...customSources, source];
    setCustomSources(newCustomSources);

    const stored = loadStoredData();
    stored.customSources = newCustomSources;
    saveStoredData(stored);

    setNewSource({ name: '', rssUrl: '', icon: '📰', color: '#666666', category: 'global' });
  };

  const handleDeleteSource = (sourceId: string) => {
    if (!confirm('이 소스를 삭제하시겠습니까?')) return;

    const newCustomSources = customSources.filter((s) => s.id !== sourceId);
    setCustomSources(newCustomSources);

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

  const groupedPicks = groupByDate(pickedArticles);

  // 로딩 중
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand)] border-t-transparent"></div>
          <p className="text-[var(--text-muted)]">확인 중...</p>
        </div>
      </div>
    );
  }

  // 로그인 폼
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="fc-surface w-full max-w-sm p-6">
          <div className="space-y-4">
            <input
              type="password"
              placeholder="비밀번호"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="fc-input"
            />
            <button
              onClick={handleLogin}
              disabled={!tokenInput.trim()}
              className="fc-button fc-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 관리자 대시보드
  return (
    <div className="space-y-6">
      <section className="fc-surface fc-surface-padding-md">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">관리자 패널</h1>
          <div className="flex items-center gap-3">
            <span className="fc-chip text-xs text-emerald-700 dark:text-emerald-300">✓ 인증됨</span>
            <button
              onClick={handleLogout}
              className="fc-button fc-button-quiet px-2 text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>
        <p className="mb-4 text-[var(--text-muted)]">RSS 소스 및 아티클 수집 관리</p>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="fc-chip">
            <span className="text-[var(--text-muted)]">커스텀 소스</span>
            <span className="ml-2 font-bold">{customSources.length}</span>
          </div>
          <div className="fc-chip">
            <span className="text-[var(--text-muted)]">수집 아티클</span>
            <span className="ml-2 font-bold">{pickedArticles.length}</span>
          </div>
          <button
            onClick={handleSaveToGithub}
            disabled={isSaving}
            className="fc-button fc-button-primary text-sm disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : '💾 GitHub 저장'}
          </button>
        </div>

        {lastSaved && (
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            마지막 저장: {new Date(lastSaved).toLocaleString('ko-KR')}
          </p>
        )}
      </section>

      {/* 탭 */}
      <div className="flex gap-2 overflow-x-auto border-b border-[var(--border-subtle)]">
        {[
          { id: 'sources', label: '📡 RSS 소스 관리' },
          { id: 'articles', label: `⭐ 아티클 수집 (${pickedArticles.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`fc-button fc-button-quiet whitespace-nowrap rounded-b-none ${
              activeTab === tab.id
                ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                : 'text-[var(--text-muted)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RSS 소스 관리 탭 */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          {/* 추가 폼 */}
          <div className="fc-surface fc-surface-soft border-dashed p-6">
            <h3 className="mb-4 font-semibold text-[var(--text-primary)]">📡 새 RSS 소스 추가</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="소스 이름 *"
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                className="fc-input"
              />
              <input
                type="url"
                placeholder="RSS URL *"
                value={newSource.rssUrl}
                onChange={(e) => setNewSource({ ...newSource, rssUrl: e.target.value })}
                className="fc-input"
              />
              <input
                type="text"
                placeholder="아이콘 (이모지)"
                value={newSource.icon}
                onChange={(e) => setNewSource({ ...newSource, icon: e.target.value })}
                className="fc-input"
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newSource.color}
                  onChange={(e) => setNewSource({ ...newSource, color: e.target.value })}
                  className="fc-color-input h-11 w-16"
                />
                <select
                  value={newSource.category}
                  onChange={(e) => setNewSource({ ...newSource, category: e.target.value as typeof newSource.category })}
                  className="fc-select flex-1"
                >
                  <option value="global">🌍 글로벌</option>
                  <option value="korea">🇰🇷 한국</option>
                  <option value="tech-blog">🏢 기술블로그</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleAddSource}
              className="fc-button fc-button-primary mt-4 w-full"
            >
              소스 추가
            </button>
          </div>

          {/* 소스 목록 */}
          <div>
            <h3 className="mb-4 font-semibold text-[var(--text-primary)]">
              커스텀 소스 ({customSources.length}개)
            </h3>
            {customSources.length === 0 ? (
              <div className="fc-empty-state py-8">
                <p className="text-4xl mb-4">📡</p>
                <p>추가된 커스텀 소스가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customSources.map((source) => (
                  <div
                    key={source.id}
                    className="fc-surface group flex items-center gap-3 p-4"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: `${source.color}20` }}
                    >
                      {source.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium text-[var(--text-primary)]">{source.name}</div>
                      <div className="truncate text-xs text-[var(--text-muted)]">{source.rssUrl}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteSource(source.id)}
                      className="fc-button fc-button-quiet w-11 px-0 text-red-600 opacity-0 group-hover:opacity-100 dark:text-red-300"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 아티클 수집 탭 */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* 추가 폼 */}
          <div className="fc-surface fc-surface-soft border-dashed p-6">
            <h3 className="mb-4 font-semibold text-[var(--text-primary)]">⭐ 새 아티클 수집</h3>
            <div className="space-y-3">
              <input
                type="url"
                placeholder="링크 URL *"
                value={newPick.link}
                onChange={(e) => setNewPick({ ...newPick, link: e.target.value })}
                className="fc-input"
              />
              <input
                type="text"
                placeholder="제목 (선택 - 비워두면 링크 사용)"
                value={newPick.title}
                onChange={(e) => setNewPick({ ...newPick, title: e.target.value })}
                className="fc-input"
              />
              <textarea
                placeholder="메모 (선택 - 왜 수집했는지, 나중에 읽을 때 참고할 내용)"
                value={newPick.memo}
                onChange={(e) => setNewPick({ ...newPick, memo: e.target.value })}
                rows={2}
                className="fc-textarea resize-none"
              />
              <button
                onClick={handleAddPick}
                className="fc-button fc-button-primary w-full"
              >
                수집하기
              </button>
            </div>
          </div>

          {/* 아티클 목록 */}
          {pickedArticles.length === 0 ? (
            <div className="fc-empty-state">
              <p className="text-4xl mb-4">⭐</p>
              <p>아직 수집한 아티클이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from(groupedPicks.entries()).map(([dateKey, picks]) => (
                <div key={dateKey}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-3 w-3 rounded-full bg-[var(--accent)]"></div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{dateKey}</h3>
                    <span className="text-sm text-[var(--text-muted)]">({picks.length}개)</span>
                  </div>

                  <div className="ml-6 space-y-3 border-l-2 border-[var(--accent)] pl-4">
                    {picks.map((pick) => (
                      <div
                        key={pick.id}
                        className="fc-surface group p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <a
                              href={pick.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="line-clamp-2 font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--brand)]"
                            >
                              {pick.title}
                            </a>
                            {pick.memo && (
                              <p className="fc-surface-soft mt-2 rounded-lg p-2 text-sm text-[var(--accent)]">
                                💬 {pick.memo}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-[var(--text-muted)]">
                              {new Date(pick.addedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={pick.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--text-muted)] transition-colors hover:text-[var(--brand)]"
                            >
                              ↗
                            </a>
                            <button
                              onClick={() => handleDeletePick(pick.id)}
                              className="text-red-600 opacity-0 transition-colors group-hover:opacity-100 dark:text-red-300"
                            >
                              🗑️
                            </button>
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
    </div>
  );
}
