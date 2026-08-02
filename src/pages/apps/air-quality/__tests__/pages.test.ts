// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = fileURLToPath(new URL('../../../../../', import.meta.url));
const source = (name: 'support' | 'privacy') =>
  readFileSync(`${projectRoot}src/pages/apps/air-quality/${name}.astro`, 'utf8');
const rendered = (name: 'support' | 'privacy') => {
  const path = `${projectRoot}dist/apps/air-quality/${name}/index.html`;
  expect(existsSync(path), `run npm run build before this rendered-page contract`).toBe(true);
  return readFileSync(path, 'utf8');
};

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
    expect(page).toContain('canonical="/apps/air-quality/support"');
    expect(page).toContain('direcision@gmail.com');
    expect(page).toContain('건강 진단이나 응급 판단을 대신하지 않습니다');
    expect(page).toContain('/apps/air-quality/privacy');
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
      'CloudKit 동기화를 사용하지 않습니다',
      '개발자 운영 계정 서버가 없습니다',
      'direcision@gmail.com',
    ]) {
      expect(page).toContain(text);
    }
    expect(page).toContain('/apps/air-quality/support');
  });

  it('renders the App Store routes and public page contract after a production build', () => {
    const support = rendered('support');
    const privacy = rendered('privacy');

    expect(support).toContain('href="https://restato.github.io/apps/air-quality/support"');
    expect(support).toContain('direcision@gmail.com');
    expect(support).toContain('건강 진단이나 응급 판단을 대신하지 않습니다');

    expect(privacy).toContain('href="https://restato.github.io/apps/air-quality/privacy"');
    expect(privacy).toContain('2026년 8월 2일');
    expect(privacy).toContain('https://open-meteo.com/');
    expect(privacy).toContain('https://open-meteo.com/en/terms');
    for (const heading of privacySections) {
      expect(privacy).toContain(heading);
    }
  });
});
