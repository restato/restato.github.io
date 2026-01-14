#!/usr/bin/env node
/**
 * 채용공고 스크래핑 스크립트
 * GitHub Actions에서 빌드 전 실행되어 public/data/jobs.json 생성
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 사이트 설정
const sites = [
  {
    id: 'woowahan',
    name: '우아한형제들',
    color: '#2AC1BC',
    url: 'https://career.woowahan.com',
    scrape: async () => {
      const res = await fetch(
        'https://career.woowahan.com/w1/recruits?category=jobGroupCodes%3ABA005001&recruitCampaignSeq=0&page=1&size=100&sort=updateDate,desc',
        { headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return (data.data?.list || []).map((item) => ({
        id: `woowahan-${item.recruitIdx}`,
        title: item.recruitName,
        url: `https://career.woowahan.com/recruitment/${item.recruitIdx}/detail`,
        department: item.jobGroupName,
        location: item.placeNames?.join(', '),
        employmentType: item.recruitTypeName,
        deadline: item.closeDate,
      }));
    },
  },
  {
    id: 'naver',
    name: '네이버',
    color: '#03C75A',
    url: 'https://recruit.navercorp.com',
    scrape: async () => {
      const res = await fetch(
        'https://recruit.navercorp.com/rcrt/loadJobList.do',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0',
          },
          body: 'subJobCdArr=1010001,1010002,1010003,1010004,1010005,1010006,1010007,1010008,1010009,1010010,1010011,1010012',
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return (data.list || []).map((item) => ({
        id: `naver-${item.annoId}`,
        title: item.jobNm,
        url: `https://recruit.navercorp.com/rcrt/view.do?annoId=${item.annoId}`,
        department: item.subJobCdNm,
        location: item.workAreaNm,
        employmentType: item.empTypeCdNm,
        deadline: item.endDt,
      }));
    },
  },
  {
    id: 'toss',
    name: '토스',
    color: '#0064FF',
    url: 'https://toss.im/career/jobs',
    scrape: async () => {
      const res = await fetch('https://toss.im/career/jobs', {
        headers: {
          Accept: 'text/html',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const match = html.match(
        /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
      );
      if (match) {
        const nextData = JSON.parse(match[1]);
        const jobs = nextData.props?.pageProps?.jobs || [];
        return jobs.map((item) => ({
          id: `toss-${item.id}`,
          title: item.title,
          url: `https://toss.im/career/job-detail?job_id=${item.id}`,
          department: item.category,
          location: item.team,
        }));
      }
      return [];
    },
  },
  {
    id: 'line',
    name: '라인',
    color: '#00C300',
    url: 'https://careers.linecorp.com/ko/jobs',
    scrape: async () => {
      const res = await fetch(
        'https://careers.linecorp.com/api/v1/jobs?co=East%20Asia&locale=ko_KR&page=1&limit=100',
        { headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return (data.jobs || []).map((item) => ({
        id: `line-${item.id}`,
        title: item.title,
        url: `https://careers.linecorp.com/ko/jobs/${item.id}`,
        department: item.department,
        location: item.location,
        employmentType: item.employmentType,
      }));
    },
  },
  {
    id: 'kakao',
    name: '카카오',
    color: '#FEE500',
    url: 'https://careers.kakao.com/jobs',
    scrape: async () => {
      const res = await fetch(
        'https://careers.kakao.com/public-api/jobs?skilset=&part=TECHNOLOGY&company=&keyword=&page=0&orderBy=recent',
        { headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return (data.content || []).map((item) => ({
        id: `kakao-${item.id}`,
        title: item.title,
        url: `https://careers.kakao.com/jobs/${item.id}`,
        department: item.skilset,
        location: item.companyName,
        employmentType: item.careerPeriod,
      }));
    },
  },
  {
    id: 'daangn',
    name: '당근',
    color: '#FF6F0F',
    url: 'https://about.daangn.com/jobs',
    scrape: async () => {
      const res = await fetch('https://about.daangn.com/jobs/', {
        headers: {
          Accept: 'text/html',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();

      // Gatsby 데이터 추출 시도
      const jobs = [];
      const regex = /href="\/jobs\/([^"\/]+)\/?"/g;
      let match;
      const seen = new Set();
      while ((match = regex.exec(html)) !== null) {
        if (!seen.has(match[1])) {
          seen.add(match[1]);
          jobs.push({
            id: `daangn-${match[1]}`,
            title: match[1].replace(/-/g, ' '),
            url: `https://about.daangn.com/jobs/${match[1]}/`,
          });
        }
      }
      return jobs;
    },
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    color: '#FF5A5F',
    url: 'https://careers.airbnb.com/positions',
    scrape: async () => {
      const res = await fetch(
        'https://careers.airbnb.com/wp-json/api/v1/jobs?_departments=engineering&per_page=100',
        { headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return (data || []).map((item) => ({
        id: `airbnb-${item.id}`,
        title: item.title,
        url: `https://careers.airbnb.com/positions/${item.id}`,
        department: item.department,
        location: item.location,
        employmentType: item.workplace_type,
      }));
    },
  },
];

// 링크 전용 사이트 (스크래핑 불가)
const linkOnlySites = [
  {
    id: 'kakaobank',
    name: '카카오뱅크',
    color: '#FFCD00',
    url: 'https://recruit.kakaobank.com/jobs',
  },
  {
    id: 'dunamu',
    name: '두나무',
    color: '#093687',
    url: 'https://www.dunamu.com/careers/jobs?category=engineering',
  },
  {
    id: 'samsung',
    name: '삼성',
    color: '#1428A0',
    url: 'https://www.samsungcareers.com/hr/',
  },
];

async function main() {
  console.log('🚀 채용공고 스크래핑 시작...\n');

  const results = {
    jobs: [],
    sites: [],
    lastUpdated: new Date().toISOString(),
  };

  // 스크래핑 가능한 사이트
  for (const site of sites) {
    console.log(`📡 ${site.name} 스크래핑 중...`);
    try {
      const jobs = await site.scrape();
      const jobsWithMeta = jobs.map((job) => ({
        ...job,
        company: site.name,
        companyId: site.id,
        companyColor: site.color,
      }));
      results.jobs.push(...jobsWithMeta);
      results.sites.push({
        id: site.id,
        name: site.name,
        color: site.color,
        url: site.url,
        status: 'success',
        jobCount: jobs.length,
      });
      console.log(`   ✅ ${jobs.length}개 채용공고 수집\n`);
    } catch (error) {
      console.log(`   ❌ 실패: ${error.message}\n`);
      results.sites.push({
        id: site.id,
        name: site.name,
        color: site.color,
        url: site.url,
        status: 'error',
        jobCount: 0,
        error: error.message,
      });
    }
  }

  // 링크 전용 사이트 추가
  for (const site of linkOnlySites) {
    results.sites.push({
      id: site.id,
      name: site.name,
      color: site.color,
      url: site.url,
      status: 'link-only',
      jobCount: 0,
    });
  }

  // 결과 저장
  const outputDir = path.join(__dirname, '..', 'public', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'jobs.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 총 ${results.jobs.length}개 채용공고 수집 완료`);
  console.log(`📁 저장 위치: ${outputPath}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch((error) => {
  console.error('스크래핑 실패:', error);
  process.exit(1);
});
