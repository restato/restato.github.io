// 채용공고 데이터 타입 정의

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyId: string;
  companyLogo?: string;
  companyColor: string;
  url: string;
  department?: string;
  location?: string;
  employmentType?: string;
  deadline?: string;
  postedAt?: string;
  tags?: string[];
}

export interface JobFilter {
  companies: string[];
  departments: string[];
  locations: string[];
  employmentTypes: string[];
  searchQuery: string;
}

export interface JobSiteStatus {
  siteId: string;
  siteName: string;
  status: 'loading' | 'success' | 'error' | 'link-only';
  jobCount: number;
  error?: string;
  lastUpdated?: string;
}

export interface JobsState {
  jobs: JobPosting[];
  siteStatuses: JobSiteStatus[];
  isLoading: boolean;
  filter: JobFilter;
}

// 필터 옵션 타입
export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

// 정렬 옵션
export type SortOption = 'company' | 'recent' | 'deadline';

// API 응답 타입
export interface ScrapeResponse {
  success: boolean;
  siteId: string;
  jobs?: JobPosting[];
  error?: string;
  timestamp: string;
}
