import { useState, useEffect, useRef } from 'react';

// 정적 JSON 데이터 경로
const JOBS_DATA_URL = '/data/jobs.json';

interface SiteInfo {
  id: string;
  name: string;
  color: string;
  url: string;
  status: 'link-only';
  jobCount: number;
}

interface JobsData {
  jobs: [];
  sites: SiteInfo[];
  lastUpdated: string;
}

// 기본 사이트 정보 (데이터 로딩 실패 시 사용)
const defaultSites: SiteInfo[] = [
  { id: 'daangn', name: '당근', color: '#FF6F0F', url: 'https://about.daangn.com/jobs', status: 'link-only', jobCount: 0 },
  { id: 'dunamu', name: '두나무', color: '#093687', url: 'https://www.dunamu.com/careers/jobs', status: 'link-only', jobCount: 0 },
  { id: 'woowahan', name: '우아한형제들', color: '#2AC1BC', url: 'https://career.woowahan.com', status: 'link-only', jobCount: 0 },
  { id: 'naver', name: '네이버', color: '#03C75A', url: 'https://recruit.navercorp.com/rcrt/list.do?lang=ko', status: 'link-only', jobCount: 0 },
  { id: 'kakaobank', name: '카카오뱅크', color: '#FFCD00', url: 'https://recruit.kakaobank.com/jobs', status: 'link-only', jobCount: 0 },
  { id: 'toss', name: '토스', color: '#0064FF', url: 'https://toss.im/career/jobs', status: 'link-only', jobCount: 0 },
  { id: 'line', name: '라인', color: '#00C300', url: 'https://careers.linecorp.com/ko/jobs/?co=East%20Asia', status: 'link-only', jobCount: 0 },
  { id: 'samsung', name: '삼성', color: '#1428A0', url: 'https://www.samsungcareers.com/hr/', status: 'link-only', jobCount: 0 },
  { id: 'kakao', name: '카카오', color: '#FEE500', url: 'https://careers.kakao.com/jobs?part=TECHNOLOGY', status: 'link-only', jobCount: 0 },
  { id: 'airbnb', name: 'Airbnb', color: '#FF5A5F', url: 'https://careers.airbnb.com/positions/?_departments=engineering', status: 'link-only', jobCount: 0 },
];

export default function JobsAggregator() {
  const [sites, setSites] = useState<SiteInfo[]>(defaultSites);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedSite, setSelectedSite] = useState<SiteInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(JOBS_DATA_URL);
        if (!response.ok) throw new Error('데이터 로딩 실패');

        const data: JobsData = await response.json();
        setSites(data.sites);
        setLastUpdated(data.lastUpdated);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 사이트 클릭 핸들러 - 바로 모달 열기
  const handleSiteClick = (site: SiteInfo) => {
    setSelectedSite(site);
    setIframeLoading(true);
    setIframeError(false);
    setIsModalOpen(true);
    // body 스크롤 방지
    document.body.style.overflow = 'hidden';
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => {
      setSelectedSite(null);
      setIframeError(false);
    }, 300);
  };

  // iframe 로드 완료 핸들러
  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  // iframe 에러 핸들러
  const handleIframeError = () => {
    setIframeLoading(false);
    setIframeError(true);
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // iframe 로드 타임아웃 (대부분의 사이트가 X-Frame-Options로 차단)
  useEffect(() => {
    if (isModalOpen && iframeLoading) {
      const timeout = setTimeout(() => {
        if (iframeLoading) {
          setIframeLoading(false);
          setIframeError(true);
        }
      }, 5000); // 5초 후 타임아웃
      return () => clearTimeout(timeout);
    }
  }, [isModalOpen, iframeLoading]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">IT 채용공고 모음</h1>
        <p className="opacity-90 mb-4">국내외 IT 기업들의 채용 페이지 바로가기</p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="opacity-80">등록 사이트</span>
            <span className="ml-2 font-bold">{sites.length}개</span>
          </div>
          {lastUpdated && (
            <div className="bg-white/20 rounded-lg px-3 py-2">
              <span className="opacity-80">업데이트</span>
              <span className="ml-2">{formatDate(lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>

      {/* 사이트 목록 */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-[var(--color-text)]">채용 사이트</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-border)]"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--color-border)] rounded w-3/4"></div>
                  <div className="h-3 bg-[var(--color-border)] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => handleSiteClick(site)}
                className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:border-blue-400 hover:shadow-md bg-[var(--color-card)] transition-all duration-200 group text-left"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: site.color }}
                >
                  {site.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[var(--color-text)] text-sm block truncate">
                    {site.name}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">채용공고 보기</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 안내 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>안내:</strong> 사이트 카드를 클릭하면 채용 페이지를 바로 확인할 수 있습니다.
        </p>
      </div>

      {/* 추가 정보 */}
      <div className="text-center text-sm text-[var(--color-text-muted)] py-4">
        <p>새로운 채용 사이트 추가 요청은 GitHub Issue로 남겨주세요.</p>
      </div>

      {/* 전체 화면 모달 */}
      {isModalOpen && selectedSite && (
        <>
          {/* 모달 오버레이 */}
          <div
            className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-300"
            onClick={closeModal}
          />

          {/* 모달 컨테이너 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div
              className="bg-[var(--color-bg)] rounded-2xl w-full h-full max-w-[98vw] max-h-[98vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 모달 헤더 */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] shrink-0"
                style={{ backgroundColor: selectedSite.color }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {selectedSite.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedSite.name} 채용공고</h2>
                    <p className="text-xs text-white/80 hidden sm:block truncate max-w-md">
                      {selectedSite.url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedSite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span className="hidden sm:inline">새 탭에서 열기</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <button
                    onClick={closeModal}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                    aria-label="닫기"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* iframe 컨테이너 */}
              <div className="flex-1 relative bg-white">
                {/* 로딩 표시 */}
                {iframeLoading && !iframeError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]">
                    <div className="text-center">
                      <div
                        className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        style={{ borderColor: selectedSite.color, borderTopColor: 'transparent' }}
                      />
                      <p className="text-[var(--color-text-muted)]">채용 페이지 로딩 중...</p>
                    </div>
                  </div>
                )}

                {/* iframe 로드 실패 시 대안 UI */}
                {iframeError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]">
                    <div className="text-center px-6 max-w-md">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6"
                        style={{ backgroundColor: selectedSite.color }}
                      >
                        {selectedSite.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">
                        {selectedSite.name} 채용 페이지
                      </h3>
                      <p className="text-[var(--color-text-muted)] mb-6">
                        보안 정책으로 인해 이 페이지에서 직접 표시할 수 없습니다.
                        <br />
                        아래 버튼을 눌러 새 탭에서 확인하세요.
                      </p>
                      <a
                        href={selectedSite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-xl transition-opacity hover:opacity-90"
                        style={{ backgroundColor: selectedSite.color }}
                      >
                        채용 페이지 열기
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}

                {/* iframe */}
                <iframe
                  ref={iframeRef}
                  src={selectedSite.url}
                  className={`w-full h-full border-0 ${iframeError ? 'hidden' : ''}`}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  title={`${selectedSite.name} 채용 페이지`}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
