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

export default function JobsAggregator() {
  const [sites, setSites] = useState<SiteInfo[]>(defaultSites);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(JOBS_DATA_URL);
        if (!response.ok) throw new Error('데이터 로딩 실패');

        const data: JobsData = await response.json();
        setSites(data.sites);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">IT 채용공고 모음</h1>
        <p className="opacity-90">국내외 IT 기업들의 채용 페이지 바로가기</p>
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
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:border-blue-400 hover:shadow-md bg-[var(--color-card)] transition-all duration-200 group"
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
                  <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                    채용공고 보기
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
