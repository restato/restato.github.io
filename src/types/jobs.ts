// 채용 사이트 정보 타입 정의

export interface JobSite {
  id: string;
  name: string;
  color: string;
  url: string;
  status: 'link-only';
  jobCount: number;
}

export interface JobsData {
  jobs: [];
  sites: JobSite[];
  lastUpdated: string;
}
