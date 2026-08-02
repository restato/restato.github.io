// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = fileURLToPath(new URL('../../../../../', import.meta.url));
const source = (name: 'support' | 'privacy') =>
  readFileSync(`${projectRoot}src/pages/apps/air-quality/${name}.astro`, 'utf8');
const workflow = (name: 'quality' | 'deploy') =>
  readFileSync(`${projectRoot}.github/workflows/${name}.yml`, 'utf8');
const privacySections = [
  '1. 처리 주체 및 연락처',
  '2. 현재 버전이 처리하는 데이터',
  '3. Open-Meteo로 전송되는 정보',
  '4. 기기 내 저장과 삭제',
  '5. 광고, 분석 및 추적',
  '6. Apple Watch',
  '7. 지원 문의 보관',
  '8. 이용자 권리와 정책 변경',
];

describe('air quality App Store pages', () => {
  it('publishes support contact and safe troubleshooting guidance', () => {
    const page = source('support');
    for (const text of [
      'canonical="/apps/air-quality/support"',
      'direcision@gmail.com',
      '건강 진단이나 응급 판단을 대신하지 않습니다',
      '현재 위치 또는 직접 찾은 장소',
      'PM2.5와 PM10',
      '시간대별 예보와 야외 활동 시간 창',
      '위젯',
      'Apple Watch',
      '민감정보는 보내지 마세요',
      '최종 갱신일: 2026년 8월 2일',
      '/apps/air-quality/privacy',
    ]) {
      expect(page).toContain(text);
    }
  });

  it('discloses the shipped privacy boundary', () => {
    const page = source('privacy');
    expect(page).toContain('canonical="/apps/air-quality/privacy"');
    expect(page).toContain('2026년 8월 2일');
    expect(page).toContain('https://open-meteo.com/');
    expect(page).toContain('https://open-meteo.com/en/terms');
    for (const heading of privacySections) {
      expect(page).toContain(heading);
    }
    for (const text of [
      'Open-Meteo',
      '광고를 포함하지 않습니다',
      '추적하지 않습니다',
      '계정을 사용하지 않습니다',
      '분석 SDK를 사용하지 않습니다',
      '위치 좌표·시간대·장소 검색어가 Open-Meteo의 공기질 및 지오코딩 API로 직접 전송될 수 있습니다',
      'CAMS(Copernicus Atmosphere Monitoring Service)',
      'Open-Meteo가 공개한 약관 및 개인정보 정책',
      '저장한 장소와 정규화된 공기질 캐시는 사용자의 기기와 App Group 저장소에만 보관됩니다',
      'CloudKit 동기화를 사용하지 않습니다',
      'Apple Watch에서 저장한 장소를 직접 새로고침하면',
      '개발자 운영 계정 서버가 없습니다',
      '답변과 분쟁 처리에 필요한 기간에만 보관합니다',
      'direcision@gmail.com',
    ]) {
      expect(page).toContain(text);
    }
    expect(page).toContain('/apps/air-quality/support');
  });

  it('runs the source contract before build and the rendered contract after build in CI', () => {
    for (const name of ['quality', 'deploy'] as const) {
      const page = workflow(name);
      const sourceTest = 'npx vitest run src/pages/apps/air-quality/__tests__/pages.test.ts';
      const build = 'npm run build';
      const renderedValidator = 'npm run verify:air-quality-app-pages';

      expect(page).toContain(sourceTest);
      expect(page).toContain(renderedValidator);
      expect(page.indexOf(sourceTest)).toBeLessThan(page.indexOf(build));
      expect(page.indexOf(build)).toBeLessThan(page.indexOf(renderedValidator));
    }
  });
});
