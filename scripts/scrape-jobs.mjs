#!/usr/bin/env node
/**
 * 채용공고 스크래핑 스크립트
 * GitHub Actions에서 빌드 전 실행되어 public/data/jobs.json 생성
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 모든 사이트를 직접 방문 링크로 제공 (일관성 있는 UX)
const linkOnlySites = [
  {
    id: 'daangn',
    name: '당근',
    color: '#FF6F0F',
    url: 'https://about.daangn.com/jobs',
  },
  {
    id: 'dunamu',
    name: '두나무',
    color: '#093687',
    url: 'https://www.dunamu.com/careers/jobs',
  },
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
  console.log('🚀 채용사이트 목록 생성 중...\n');

  const results = {
    jobs: [],
    sites: [],
    lastUpdated: new Date().toISOString(),
  };

  // 모든 사이트를 직접 방문 링크로 추가
  for (const site of linkOnlySites) {
    results.sites.push({
      id: site.id,
      name: site.name,
      color: site.color,
      url: site.url,
      status: 'link-only',
      jobCount: 0,
    });
    console.log(`📎 ${site.name} 링크 추가`);
  }

  // 결과 저장
  const outputDir = path.join(__dirname, '..', 'public', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'jobs.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 총 ${results.sites.length}개 채용사이트 링크 생성 완료`);
  console.log(`📁 저장 위치: ${outputPath}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch((error) => {
  console.error('생성 실패:', error);
  process.exit(1);
});
