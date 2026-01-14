#!/usr/bin/env node
/**
 * 채용공고 스크래핑 스크립트
 * GitHub Actions에서 빌드 전 실행되어 public/data/jobs.json 생성
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 스크래핑 가능한 사이트 (확인된 공개 API만)
const sites = [
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
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();

      const jobs = [];
      // 더 정확한 정규식으로 직무명 추출
      const regex = /<a[^>]*href="\/jobs\/([^"\/]+)\/?[^"]*"[^>]*>[\s\S]*?<h3[^>]*>([^<]+)<\/h3>/g;
      let match;
      const seen = new Set();
      while ((match = regex.exec(html)) !== null) {
        const id = match[1];
        const title = match[2].trim();
        if (!seen.has(id) && title) {
          seen.add(id);
          jobs.push({
            id: `daangn-${id}`,
            title: title,
            url: `https://about.daangn.com/jobs/${id}/`,
          });
        }
      }

      // 대안: 간단한 링크 추출
      if (jobs.length === 0) {
        const simpleRegex = /href="\/jobs\/([^"\/]+)\/?"/g;
        while ((match = simpleRegex.exec(html)) !== null) {
          const id = match[1];
          if (!seen.has(id) && !id.includes('.') && id.length > 3) {
            seen.add(id);
            jobs.push({
              id: `daangn-${id}`,
              title: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              url: `https://about.daangn.com/jobs/${id}/`,
            });
          }
        }
      }

      return jobs;
    },
  },
  {
    id: 'dunamu',
    name: '두나무',
    color: '#093687',
    url: 'https://www.dunamu.com/careers/jobs',
    scrape: async () => {
      // Greenhouse 공개 API
      const res = await fetch(
        'https://boards-api.greenhouse.io/v1/boards/dunamu/jobs',
        { headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return (data.jobs || []).map((item) => ({
        id: `dunamu-${item.id}`,
        title: item.title,
        url: item.absolute_url || `https://boards.greenhouse.io/dunamu/jobs/${item.id}`,
        department: item.departments?.[0]?.name,
        location: item.location?.name,
      }));
    },
  },
];

// 링크 전용 사이트 (봇 차단으로 스크래핑 불가)
const linkOnlySites = [
  {
    id: 'woowahan',
    name: '우아한형제들',
    color: '#2AC1BC',
    url: 'https://career.woowahan.com',
  },
  {
    id: 'naver',
    name: '네이버',
    color: '#03C75A',
    url: 'https://recruit.navercorp.com/rcrt/list.do?lang=ko',
  },
  {
    id: 'kakaobank',
    name: '카카오뱅크',
    color: '#FFCD00',
    url: 'https://recruit.kakaobank.com/jobs',
  },
  {
    id: 'toss',
    name: '토스',
    color: '#0064FF',
    url: 'https://toss.im/career/jobs',
  },
  {
    id: 'line',
    name: '라인',
    color: '#00C300',
    url: 'https://careers.linecorp.com/ko/jobs/?co=East%20Asia',
  },
  {
    id: 'samsung',
    name: '삼성',
    color: '#1428A0',
    url: 'https://www.samsungcareers.com/hr/',
  },
  {
    id: 'kakao',
    name: '카카오',
    color: '#FEE500',
    url: 'https://careers.kakao.com/jobs?part=TECHNOLOGY',
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    color: '#FF5A5F',
    url: 'https://careers.airbnb.com/positions/?_departments=engineering',
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
        status: jobs.length > 0 ? 'success' : 'error',
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
