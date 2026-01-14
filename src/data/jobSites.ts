// 채용 사이트 설정 파일
// 새로운 사이트 추가 시 이 배열에 추가하면 자동으로 반영됩니다.

export interface JobSite {
  id: string;
  name: string;
  logo?: string;
  url: string;
  apiEndpoint?: string;
  category: 'korean' | 'global';
  color: string;
  // 스크래핑 설정
  scrapeConfig: {
    type: 'api' | 'html' | 'link-only';
    // API 타입일 경우
    apiPath?: string;
    method?: 'GET' | 'POST';
    headers?: Record<string, string>;
    bodyTemplate?: string;
    // 응답 파싱 설정
    responseMapping?: {
      list: string; // JSON path to job list
      title: string;
      url: string;
      department?: string;
      location?: string;
      employmentType?: string;
      deadline?: string;
    };
  };
  // 필터 파라미터 (쿼리스트링으로 전달)
  defaultFilters?: Record<string, string>;
}

export const jobSites: JobSite[] = [
  {
    id: 'woowahan',
    name: '우아한형제들',
    url: 'https://career.woowahan.com',
    category: 'korean',
    color: '#2AC1BC',
    scrapeConfig: {
      type: 'api',
      apiPath: '/w1/recruits?category=jobGroupCodes%3ABA005001&recruitCampaignSeq=0&jobGroupCodes=BA005001&page=1&size=100&sort=updateDate,desc',
      method: 'GET',
      responseMapping: {
        list: 'data.list',
        title: 'recruitName',
        url: 'recruitIdx',
        department: 'jobGroupName',
        location: 'placeNames',
        employmentType: 'recruitTypeName',
        deadline: 'closeDate',
      },
    },
  },
  {
    id: 'naver',
    name: '네이버',
    url: 'https://recruit.navercorp.com',
    category: 'korean',
    color: '#03C75A',
    scrapeConfig: {
      type: 'api',
      apiPath: '/rcrt/list.do?lang=ko&subJobCdArr=1010001%2C1010002%2C1010003%2C1010004%2C1010005%2C1010006%2C1010007%2C1010008%2C1010009%2C1010010%2C1010011%2C1010012%2C1020001%2C1020002%2C1020003&sysCompanyCdArr=&empTypeCdArr=&entTypeCdArr=&workAreaCdArr=',
      method: 'GET',
      responseMapping: {
        list: 'list',
        title: 'jobNm',
        url: 'annoId',
        department: 'subJobCdNm',
        location: 'workAreaNm',
        employmentType: 'empTypeCdNm',
        deadline: 'endDt',
      },
    },
  },
  {
    id: 'kakaobank',
    name: '카카오뱅크',
    url: 'https://recruit.kakaobank.com/jobs',
    category: 'korean',
    color: '#FFCD00',
    scrapeConfig: {
      type: 'link-only',
    },
  },
  {
    id: 'toss',
    name: '토스',
    url: 'https://toss.im/career/jobs',
    category: 'korean',
    color: '#0064FF',
    scrapeConfig: {
      type: 'api',
      apiPath: '/_next/data/BUILD_ID/career/jobs.json',
      method: 'GET',
      responseMapping: {
        list: 'pageProps.jobs',
        title: 'title',
        url: 'id',
        department: 'category',
        location: 'location',
        employmentType: 'type',
      },
    },
  },
  {
    id: 'line',
    name: '라인',
    url: 'https://careers.linecorp.com/ko/jobs',
    category: 'korean',
    color: '#00C300',
    scrapeConfig: {
      type: 'api',
      apiPath: '/api/v1/jobs?co=East%20Asia&locale=ko_KR',
      method: 'GET',
      responseMapping: {
        list: 'jobs',
        title: 'title',
        url: 'id',
        department: 'department',
        location: 'location',
        employmentType: 'employmentType',
      },
    },
    defaultFilters: {
      co: 'East Asia',
    },
  },
  {
    id: 'dunamu',
    name: '두나무',
    url: 'https://www.dunamu.com/careers/jobs',
    category: 'korean',
    color: '#093687',
    scrapeConfig: {
      type: 'link-only',
    },
    defaultFilters: {
      category: 'engineering',
    },
  },
  {
    id: 'daangn',
    name: '당근',
    url: 'https://about.daangn.com/jobs',
    category: 'korean',
    color: '#FF6F0F',
    scrapeConfig: {
      type: 'api',
      apiPath: '/api/jobs',
      method: 'GET',
      responseMapping: {
        list: 'jobs',
        title: 'title',
        url: 'id',
        department: 'team',
        location: 'location',
        employmentType: 'employmentType',
      },
    },
  },
  {
    id: 'samsung',
    name: '삼성',
    url: 'https://www.samsungcareers.com/hr',
    category: 'korean',
    color: '#1428A0',
    scrapeConfig: {
      type: 'link-only',
    },
  },
  {
    id: 'kakao',
    name: '카카오',
    url: 'https://careers.kakao.com/jobs',
    category: 'korean',
    color: '#FEE500',
    scrapeConfig: {
      type: 'api',
      apiPath: '/api/jobs?part=TECHNOLOGY',
      method: 'GET',
      responseMapping: {
        list: 'jobs',
        title: 'title',
        url: 'id',
        department: 'category',
        location: 'location',
        employmentType: 'employmentType',
      },
    },
    defaultFilters: {
      part: 'TECHNOLOGY',
    },
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    url: 'https://careers.airbnb.com/positions',
    category: 'global',
    color: '#FF5A5F',
    scrapeConfig: {
      type: 'api',
      apiPath: '/api/positions?_departments=engineering',
      method: 'GET',
      responseMapping: {
        list: 'positions',
        title: 'title',
        url: 'id',
        department: 'department',
        location: 'location',
        employmentType: 'type',
      },
    },
    defaultFilters: {
      _departments: 'engineering',
      _offices: 'united-states',
      _workplace_type: 'live-and-work-anywhere',
    },
  },
];

// 카테고리별 사이트 그룹핑
export const getJobSitesByCategory = () => {
  return {
    korean: jobSites.filter((site) => site.category === 'korean'),
    global: jobSites.filter((site) => site.category === 'global'),
  };
};

// ID로 사이트 찾기
export const getJobSiteById = (id: string) => {
  return jobSites.find((site) => site.id === id);
};
