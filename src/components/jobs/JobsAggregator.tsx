import { useState, useEffect, useMemo, useCallback } from 'react';
import type { JobPosting, JobSiteStatus } from '../../types/jobs';
import JobCard from './JobCard';
import JobSiteCard from './JobSiteCard';

// 정적 JSON 데이터 경로
const JOBS_DATA_URL = '/data/jobs.json';

interface JobsData {
  jobs: JobPosting[];
  sites: {
    id: string;
    name: string;
    color: string;
    url: string;
    status: 'success' | 'error' | 'link-only';
    jobCount: number;
    error?: string;
  }[];
  lastUpdated: string;
}

export default function JobsAggregator() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [siteStatuses, setSiteStatuses] = useState<JobSiteStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'company' | 'recent'>('company');

  // 데이터 로드
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(JOBS_DATA_URL);
        if (!response.ok) throw new Error('데이터 로딩 실패');

        const data: JobsData = await response.json();

        setJobs(data.jobs);
        setSiteStatuses(
          data.sites.map((site) => ({
            siteId: site.id,
            siteName: site.name,
            status: site.status,
            jobCount: site.jobCount,
            error: site.error,
          }))
        );
        setLastUpdated(data.lastUpdated);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        // 데이터 로딩 실패 시 링크 전용 모드
        setSiteStatuses([
          { siteId: 'woowahan', siteName: '우아한형제들', status: 'link-only', jobCount: 0 },
          { siteId: 'naver', siteName: '네이버', status: 'link-only', jobCount: 0 },
          { siteId: 'kakaobank', siteName: '카카오뱅크', status: 'link-only', jobCount: 0 },
          { siteId: 'toss', siteName: '토스', status: 'link-only', jobCount: 0 },
          { siteId: 'line', siteName: '라인', status: 'link-only', jobCount: 0 },
          { siteId: 'dunamu', siteName: '두나무', status: 'link-only', jobCount: 0 },
          { siteId: 'daangn', siteName: '당근', status: 'link-only', jobCount: 0 },
          { siteId: 'samsung', siteName: '삼성', status: 'link-only', jobCount: 0 },
          { siteId: 'kakao', siteName: '카카오', status: 'link-only', jobCount: 0 },
          { siteId: 'airbnb', siteName: 'Airbnb', status: 'link-only', jobCount: 0 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // 사이트 색상/URL 매핑
  const siteConfig: Record<string, { color: string; url: string }> = {
    woowahan: { color: '#2AC1BC', url: 'https://career.woowahan.com' },
    naver: { color: '#03C75A', url: 'https://recruit.navercorp.com/rcrt/list.do?lang=ko' },
    kakaobank: { color: '#FFCD00', url: 'https://recruit.kakaobank.com/jobs' },
    toss: { color: '#0064FF', url: 'https://toss.im/career/jobs' },
    line: { color: '#00C300', url: 'https://careers.linecorp.com/ko/jobs/?co=East%20Asia' },
    dunamu: { color: '#093687', url: 'https://www.dunamu.com/careers/jobs?category=engineering' },
    daangn: { color: '#FF6F0F', url: 'https://about.daangn.com/jobs' },
    samsung: { color: '#1428A0', url: 'https://www.samsungcareers.com/hr/' },
    kakao: { color: '#FEE500', url: 'https://careers.kakao.com/jobs?part=TECHNOLOGY' },
    airbnb: { color: '#FF5A5F', url: 'https://careers.airbnb.com/positions/?_departments=engineering' },
  };

  // 필터 옵션 계산
  const filterOptions = useMemo(() => {
    const companies: Map<string, number> = new Map();
    const departments: Map<string, number> = new Map();

    jobs.forEach((job) => {
      companies.set(job.company, (companies.get(job.company) || 0) + 1);
      if (job.department) {
        departments.set(job.department, (departments.get(job.department) || 0) + 1);
      }
    });

    return {
      companies: Array.from(companies.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => b.count - a.count),
      departments: Array.from(departments.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20),
    };
  }, [jobs]);

  // 필터링된 채용공고
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.department?.toLowerCase().includes(query)
      );
    }

    if (selectedCompanies.length > 0) {
      result = result.filter((job) => selectedCompanies.includes(job.company));
    }

    if (selectedDepartments.length > 0) {
      result = result.filter((job) => job.department && selectedDepartments.includes(job.department));
    }

    if (sortBy === 'company') {
      result.sort((a, b) => a.company.localeCompare(b.company));
    }

    return result;
  }, [jobs, searchQuery, selectedCompanies, selectedDepartments, sortBy]);

  const toggleCompany = useCallback((company: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]
    );
  }, []);

  const toggleDepartment = useCallback((dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCompanies([]);
    setSelectedDepartments([]);
  }, []);

  const stats = useMemo(() => {
    const total = jobs.length;
    const successCount = siteStatuses.filter((s) => s.status === 'success').length;
    return { total, successCount };
  }, [jobs, siteStatuses]);

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
      {/* 헤더 통계 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">IT 채용공고 모음</h1>
        <p className="opacity-90 mb-4">국내외 IT 기업들의 채용공고를 한눈에</p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="opacity-80">총 채용공고</span>
            <span className="ml-2 font-bold">{stats.total}개</span>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="opacity-80">연동 사이트</span>
            <span className="ml-2 font-bold">{stats.successCount}개</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {siteStatuses.map((status) => {
            const config = siteConfig[status.siteId];
            const isSelected = selectedCompanies.includes(status.siteName);

            if (status.status === 'link-only' || status.status === 'error') {
              return (
                <a
                  key={status.siteId}
                  href={config?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-text-muted)] bg-[var(--color-card)] transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: config?.color || '#666' }}
                  >
                    {status.siteName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-[var(--color-text)] text-sm block truncate">
                      {status.siteName}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">직접 방문</span>
                  </div>
                  <span className="text-[var(--color-text-muted)]">↗</span>
                </a>
              );
            }

            return (
              <JobSiteCard
                key={status.siteId}
                status={status}
                onClick={() => toggleCompany(status.siteName)}
                isSelected={isSelected}
              />
            );
          })}
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="채용공고 검색 (제목, 회사, 직군)"
              className="w-full px-4 py-2 pl-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              🔍
            </span>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showFilters || selectedDepartments.length > 0
                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'border-[var(--color-border)] text-[var(--color-text)]'
            }`}
          >
            필터 {selectedDepartments.length > 0 && `(${selectedDepartments.length})`}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'company' | 'recent')}
            className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
          >
            <option value="company">회사별</option>
            <option value="recent">최신순</option>
          </select>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-[var(--color-text)]">직군 필터</h3>
              {(selectedCompanies.length > 0 || selectedDepartments.length > 0) && (
                <button onClick={clearFilters} className="text-sm text-blue-500 hover:text-blue-600">
                  필터 초기화
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.departments.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleDepartment(opt.value)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedDepartments.includes(opt.value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)]'
                  }`}
                >
                  {opt.label} ({opt.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {(selectedCompanies.length > 0 || selectedDepartments.length > 0 || searchQuery) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-[var(--color-text-muted)]">활성 필터:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-sm">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-blue-800">
                  ×
                </button>
              </span>
            )}
            {selectedCompanies.map((company) => (
              <span
                key={company}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-sm"
              >
                {company}
                <button onClick={() => toggleCompany(company)} className="hover:text-green-800">
                  ×
                </button>
              </span>
            ))}
            {selectedDepartments.map((dept) => (
              <span
                key={dept}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-sm"
              >
                {dept}
                <button onClick={() => toggleDepartment(dept)} className="hover:text-purple-800">
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 결과 개수 */}
      <div className="flex items-center justify-between">
        <p className="text-[var(--color-text-muted)]">
          {filteredJobs.length === jobs.length
            ? `총 ${jobs.length}개 채용공고`
            : `${filteredJobs.length}개 채용공고 (전체 ${jobs.length}개 중)`}
        </p>
      </div>

      {/* 채용공고 목록 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-border)]"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--color-border)] rounded w-3/4"></div>
                  <div className="h-3 bg-[var(--color-border)] rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-[var(--color-border)] rounded w-16"></div>
                    <div className="h-5 bg-[var(--color-border)] rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">📋</p>
          <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
            채용공고 데이터 준비 중
          </h3>
          <p className="text-[var(--color-text-muted)] mb-4">
            채용공고 데이터가 아직 수집되지 않았습니다.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            위 사이트 카드를 클릭하면 해당 채용 페이지로 이동합니다.
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-[var(--color-text-muted)]">다른 검색어나 필터를 시도해보세요.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            필터 초기화
          </button>
        </div>
      )}

      {/* 안내 */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>참고:</strong> 채용공고 데이터는 매일 자동 업데이트됩니다. 일부 사이트는 봇 차단
          정책으로 인해 "직접 방문" 링크를 클릭하여 확인해주세요.
        </p>
      </div>
    </div>
  );
}
