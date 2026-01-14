// Cloudflare Workers - 채용공고 스크래핑 서버

interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyId: string;
  companyColor: string;
  url: string;
  department?: string;
  location?: string;
  employmentType?: string;
  deadline?: string;
  postedAt?: string;
}

interface ScrapeResult {
  success: boolean;
  siteId: string;
  siteName: string;
  jobs: JobPosting[];
  error?: string;
  timestamp: string;
}

// CORS 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

// 우아한형제들 스크래퍼
async function scrapeWoowahan(): Promise<ScrapeResult> {
  const siteId = 'woowahan';
  const siteName = '우아한형제들';
  const color = '#2AC1BC';

  try {
    const response = await fetch(
      'https://career.woowahan.com/w1/recruits?category=jobGroupCodes%3ABA005001&recruitCampaignSeq=0&page=1&size=100&sort=updateDate,desc',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      data?: {
        list?: Array<{
          recruitIdx: number;
          recruitName: string;
          jobGroupName?: string;
          placeNames?: string[];
          recruitTypeName?: string;
          closeDate?: string;
        }>;
      };
    };
    const jobs: JobPosting[] = (data.data?.list || []).map((item) => ({
      id: `${siteId}-${item.recruitIdx}`,
      title: item.recruitName,
      company: siteName,
      companyId: siteId,
      companyColor: color,
      url: `https://career.woowahan.com/recruitment/${item.recruitIdx}/detail`,
      department: item.jobGroupName,
      location: item.placeNames?.join(', '),
      employmentType: item.recruitTypeName,
      deadline: item.closeDate,
    }));

    return { success: true, siteId, siteName, jobs, timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      success: false,
      siteId,
      siteName,
      jobs: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// 네이버 스크래퍼
async function scrapeNaver(): Promise<ScrapeResult> {
  const siteId = 'naver';
  const siteName = '네이버';
  const color = '#03C75A';

  try {
    // 네이버 채용 API 호출
    const response = await fetch(
      'https://recruit.navercorp.com/rcrt/loadJobList.do?subJobCdArr=1010001,1010002,1010003,1010004,1010005,1010006,1010007,1010008,1010009,1010010,1010011,1010012&sysCompanyCdArr=&empTypeCdArr=&entTypeCdArr=&workAreaCdArr=',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      list?: Array<{
        annoId: string;
        jobNm: string;
        subJobCdNm?: string;
        workAreaNm?: string;
        empTypeCdNm?: string;
        endDt?: string;
      }>;
    };
    const jobs: JobPosting[] = (data.list || []).map((item) => ({
      id: `${siteId}-${item.annoId}`,
      title: item.jobNm,
      company: siteName,
      companyId: siteId,
      companyColor: color,
      url: `https://recruit.navercorp.com/rcrt/view.do?annoId=${item.annoId}`,
      department: item.subJobCdNm,
      location: item.workAreaNm,
      employmentType: item.empTypeCdNm,
      deadline: item.endDt,
    }));

    return { success: true, siteId, siteName, jobs, timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      success: false,
      siteId,
      siteName,
      jobs: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// 토스 스크래퍼
async function scrapeToss(): Promise<ScrapeResult> {
  const siteId = 'toss';
  const siteName = '토스';
  const color = '#0064FF';

  try {
    // 토스 채용 페이지에서 데이터 추출 시도
    const response = await fetch('https://toss.im/career/jobs', {
      headers: {
        Accept: 'text/html',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Next.js __NEXT_DATA__ 스크립트에서 데이터 추출
    const scriptMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
      const nextData = JSON.parse(scriptMatch[1]) as {
        props?: {
          pageProps?: {
            jobs?: Array<{
              id: string;
              title: string;
              category?: string;
              team?: string;
            }>;
          };
        };
      };
      const jobsData = nextData.props?.pageProps?.jobs || [];

      const jobs: JobPosting[] = jobsData.map((item) => ({
        id: `${siteId}-${item.id}`,
        title: item.title,
        company: siteName,
        companyId: siteId,
        companyColor: color,
        url: `https://toss.im/career/job-detail?job_id=${item.id}`,
        department: item.category,
        location: item.team,
      }));

      return { success: true, siteId, siteName, jobs, timestamp: new Date().toISOString() };
    }

    throw new Error('Could not parse job data');
  } catch (error) {
    return {
      success: false,
      siteId,
      siteName,
      jobs: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// 라인 스크래퍼
async function scrapeLine(): Promise<ScrapeResult> {
  const siteId = 'line';
  const siteName = '라인';
  const color = '#00C300';

  try {
    const response = await fetch(
      'https://careers.linecorp.com/api/v1/jobs?co=East%20Asia&locale=ko_KR&page=1&limit=100',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      jobs?: Array<{
        id: string;
        title: string;
        department?: string;
        location?: string;
        employmentType?: string;
      }>;
    };
    const jobs: JobPosting[] = (data.jobs || []).map((item) => ({
      id: `${siteId}-${item.id}`,
      title: item.title,
      company: siteName,
      companyId: siteId,
      companyColor: color,
      url: `https://careers.linecorp.com/ko/jobs/${item.id}`,
      department: item.department,
      location: item.location,
      employmentType: item.employmentType,
    }));

    return { success: true, siteId, siteName, jobs, timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      success: false,
      siteId,
      siteName,
      jobs: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// 당근 스크래퍼
async function scrapeDaangn(): Promise<ScrapeResult> {
  const siteId = 'daangn';
  const siteName = '당근';
  const color = '#FF6F0F';

  try {
    const response = await fetch('https://about.daangn.com/jobs/', {
      headers: {
        Accept: 'text/html',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Gatsby 데이터 추출 시도
    const scriptMatch = html.match(/window\.__STATIC_JOB_POSTS__\s*=\s*(\[[\s\S]*?\]);/);
    if (scriptMatch) {
      const jobsData = JSON.parse(scriptMatch[1]) as Array<{
        id: string;
        title: string;
        chapter?: string;
        corporate?: string;
        employmentType?: string;
      }>;

      const jobs: JobPosting[] = jobsData.map((item) => ({
        id: `${siteId}-${item.id}`,
        title: item.title,
        company: siteName,
        companyId: siteId,
        companyColor: color,
        url: `https://about.daangn.com/jobs/${item.id}/`,
        department: item.chapter,
        location: item.corporate,
        employmentType: item.employmentType,
      }));

      return { success: true, siteId, siteName, jobs, timestamp: new Date().toISOString() };
    }

    // 정규식으로 잡 데이터 추출 시도
    const jobLinks = html.matchAll(/href="\/jobs\/([^"]+)\/?"[^>]*>([^<]+)</g);
    const jobs: JobPosting[] = [];
    for (const match of jobLinks) {
      jobs.push({
        id: `${siteId}-${match[1]}`,
        title: match[2].trim(),
        company: siteName,
        companyId: siteId,
        companyColor: color,
        url: `https://about.daangn.com/jobs/${match[1]}/`,
      });
    }

    if (jobs.length > 0) {
      return { success: true, siteId, siteName, jobs, timestamp: new Date().toISOString() };
    }

    throw new Error('Could not parse job data');
  } catch (error) {
    return {
      success: false,
      siteId,
      siteName,
      jobs: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// 카카오 스크래퍼
async function scrapeKakao(): Promise<ScrapeResult> {
  const siteId = 'kakao';
  const siteName = '카카오';
  const color = '#FEE500';

  try {
    const response = await fetch('https://careers.kakao.com/jobs?part=TECHNOLOGY', {
      headers: {
        Accept: 'text/html',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // 카카오 채용 데이터 추출
    const jobMatches = html.matchAll(
      /<a[^>]*href="\/jobs\/(\d+)"[^>]*>[\s\S]*?<h4[^>]*>([^<]+)<\/h4>[\s\S]*?<\/a>/g
    );
    const jobs: JobPosting[] = [];

    for (const match of jobMatches) {
      jobs.push({
        id: `${siteId}-${match[1]}`,
        title: match[2].trim(),
        company: siteName,
        companyId: siteId,
        companyColor: color,
        url: `https://careers.kakao.com/jobs/${match[1]}`,
        department: 'Technology',
      });
    }

    if (jobs.length > 0) {
      return { success: true, siteId, siteName, jobs, timestamp: new Date().toISOString() };
    }

    // 대안: API 엔드포인트 시도
    const apiResponse = await fetch(
      'https://careers.kakao.com/public-api/jobs?skilset=&part=TECHNOLOGY&company=&keyword=&page=0&orderBy=recent',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)',
        },
      }
    );

    if (apiResponse.ok) {
      const apiData = (await apiResponse.json()) as {
        content?: Array<{
          id: string;
          title: string;
          skilset?: string;
          companyName?: string;
          careerPeriod?: string;
        }>;
      };
      const apiJobs: JobPosting[] = (apiData.content || []).map((item) => ({
        id: `${siteId}-${item.id}`,
        title: item.title,
        company: siteName,
        companyId: siteId,
        companyColor: color,
        url: `https://careers.kakao.com/jobs/${item.id}`,
        department: item.skilset,
        location: item.companyName,
        employmentType: item.careerPeriod,
      }));

      return { success: true, siteId, siteName, jobs: apiJobs, timestamp: new Date().toISOString() };
    }

    throw new Error('Could not parse job data');
  } catch (error) {
    return {
      success: false,
      siteId,
      siteName,
      jobs: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// Airbnb 스크래퍼
async function scrapeAirbnb(): Promise<ScrapeResult> {
  const siteId = 'airbnb';
  const siteName = 'Airbnb';
  const color = '#FF5A5F';

  try {
    const response = await fetch(
      'https://careers.airbnb.com/wp-json/api/v1/jobs?_departments=engineering&per_page=100',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as Array<{
      id: string;
      title: string;
      department?: string;
      location?: string;
      workplace_type?: string;
    }>;
    const jobs: JobPosting[] = (data || []).map((item) => ({
      id: `${siteId}-${item.id}`,
      title: item.title,
      company: siteName,
      companyId: siteId,
      companyColor: color,
      url: `https://careers.airbnb.com/positions/${item.id}`,
      department: item.department,
      location: item.location,
      employmentType: item.workplace_type,
    }));

    return { success: true, siteId, siteName, jobs, timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      success: false,
      siteId,
      siteName,
      jobs: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// 링크 전용 사이트 (스크래핑 불가)
function getLinkOnlySites(): ScrapeResult[] {
  return [
    {
      success: true,
      siteId: 'kakaobank',
      siteName: '카카오뱅크',
      jobs: [],
      timestamp: new Date().toISOString(),
    },
    {
      success: true,
      siteId: 'dunamu',
      siteName: '두나무',
      jobs: [],
      timestamp: new Date().toISOString(),
    },
    {
      success: true,
      siteId: 'samsung',
      siteName: '삼성',
      jobs: [],
      timestamp: new Date().toISOString(),
    },
  ];
}

// 메인 핸들러
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 특정 사이트만 스크래핑
    if (url.pathname.startsWith('/scrape/')) {
      const siteId = url.pathname.replace('/scrape/', '');
      let result: ScrapeResult;

      switch (siteId) {
        case 'woowahan':
          result = await scrapeWoowahan();
          break;
        case 'naver':
          result = await scrapeNaver();
          break;
        case 'toss':
          result = await scrapeToss();
          break;
        case 'line':
          result = await scrapeLine();
          break;
        case 'daangn':
          result = await scrapeDaangn();
          break;
        case 'kakao':
          result = await scrapeKakao();
          break;
        case 'airbnb':
          result = await scrapeAirbnb();
          break;
        default:
          result = {
            success: false,
            siteId,
            siteName: siteId,
            jobs: [],
            error: 'Unknown site',
            timestamp: new Date().toISOString(),
          };
      }

      return new Response(JSON.stringify(result), { headers: corsHeaders });
    }

    // 모든 사이트 스크래핑
    if (url.pathname === '/scrape-all' || url.pathname === '/') {
      const results = await Promise.all([
        scrapeWoowahan(),
        scrapeNaver(),
        scrapeToss(),
        scrapeLine(),
        scrapeDaangn(),
        scrapeKakao(),
        scrapeAirbnb(),
      ]);

      // 링크 전용 사이트 추가
      const linkOnlySites = getLinkOnlySites();

      return new Response(
        JSON.stringify({
          results: [...results, ...linkOnlySites],
          timestamp: new Date().toISOString(),
        }),
        { headers: corsHeaders }
      );
    }

    // 건강 체크
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: corsHeaders,
    });
  },
};
