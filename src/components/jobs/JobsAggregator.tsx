import { useState, useEffect } from 'react';

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

// 사이트별 추가 정보
const siteDetails: Record<string, { description: string; features: string[] }> = {
  daangn: {
    description: '당근마켓 운영사. 지역 기반 중고거래 플랫폼.',
    features: ['하이퍼로컬 서비스', '빠른 성장', '수평적 문화'],
  },
  dunamu: {
    description: '업비트 운영사. 국내 최대 암호화폐 거래소.',
    features: ['핀테크', '블록체인', '빠른 의사결정'],
  },
  woowahan: {
    description: '배달의민족 운영사. 국내 최대 배달 플랫폼.',
    features: ['음식 배달', '물류 혁신', '좋은 복지'],
  },
  naver: {
    description: '국내 최대 검색 포털 및 IT 대기업.',
    features: ['검색/AI', '커머스', '클라우드'],
  },
  kakaobank: {
    description: '국내 대표 인터넷 전문은행.',
    features: ['핀테크', '혁신 금융', '안정적 성장'],
  },
  toss: {
    description: '금융 슈퍼앱. 종합 핀테크 서비스.',
    features: ['핀테크', '스타트업 문화', '빠른 성장'],
  },
  line: {
    description: '글로벌 메신저 앱. 일본/아시아 중심.',
    features: ['글로벌 서비스', '메신저', '다양한 사업'],
  },
  samsung: {
    description: '글로벌 테크 대기업.',
    features: ['반도체', '스마트폰', '가전'],
  },
  kakao: {
    description: '국내 대표 IT 플랫폼 기업.',
    features: ['메신저', '콘텐츠', '모빌리티'],
  },
  airbnb: {
    description: '글로벌 숙박 공유 플랫폼.',
    features: ['글로벌 서비스', '여행/숙박', '리모트 근무'],
  },
};

export default function JobsAggregator() {
  const [sites, setSites] = useState<SiteInfo[]>(defaultSites);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedSite, setSelectedSite] = useState<SiteInfo | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  // 사이트 클릭 핸들러
  const handleSiteClick = (site: SiteInfo) => {
    setSelectedSite(site);
    setIsSheetOpen(true);
  };

  // Bottom Sheet 닫기
  const closeSheet = () => {
    setIsSheetOpen(false);
    setTimeout(() => setSelectedSite(null), 300);
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSheetOpen) {
        closeSheet();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSheetOpen]);

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
          <strong>안내:</strong> 사이트 카드를 클릭하면 상세 정보를 확인할 수 있습니다.
        </p>
      </div>

      {/* 추가 정보 */}
      <div className="text-center text-sm text-[var(--color-text-muted)] py-4">
        <p>새로운 채용 사이트 추가 요청은 GitHub Issue로 남겨주세요.</p>
      </div>

      {/* Bottom Sheet Overlay */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
          onClick={closeSheet}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[var(--color-bg)] rounded-t-3xl z-50 transform transition-transform duration-300 ease-out ${
          isSheetOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85vh' }}
      >
        {selectedSite && (
          <div className="p-6 max-w-2xl mx-auto">
            {/* Handle */}
            <div className="w-12 h-1.5 bg-[var(--color-border)] rounded-full mx-auto mb-6" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
                style={{ backgroundColor: selectedSite.color }}
              >
                {selectedSite.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]">{selectedSite.name}</h2>
                <p className="text-[var(--color-text-muted)]">
                  {siteDetails[selectedSite.id]?.description || 'IT 기업'}
                </p>
              </div>
            </div>

            {/* Features */}
            {siteDetails[selectedSite.id]?.features && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">특징</h3>
                <div className="flex flex-wrap gap-2">
                  {siteDetails[selectedSite.id].features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full text-sm text-[var(--color-text)]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* URL Preview */}
            <div className="mb-6 p-4 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]">
              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">
                채용 페이지
              </h3>
              <p className="text-sm text-[var(--color-text)] break-all font-mono">
                {selectedSite.url}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeSheet}
                className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-[var(--color-card)] transition-colors"
              >
                닫기
              </button>
              <a
                href={selectedSite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 rounded-xl text-white font-medium text-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: selectedSite.color }}
              >
                채용 페이지 방문 ↗
              </a>
            </div>

            {/* Safe area padding for mobile */}
            <div className="h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
