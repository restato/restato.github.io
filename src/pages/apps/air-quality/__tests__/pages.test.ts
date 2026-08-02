// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = fileURLToPath(new URL('../../../../../', import.meta.url));
const source = (name: 'support' | 'privacy') =>
  readFileSync(`${projectRoot}src/pages/apps/air-quality/${name}.astro`, 'utf8');

describe('air quality App Store pages', () => {
  it('publishes support contact and safe troubleshooting guidance', () => {
    const page = source('support');
    expect(page).toContain('direcision@gmail.com');
    expect(page).toContain('건강 진단이나 응급 판단을 대신하지 않습니다');
    expect(page).toContain('/apps/air-quality/privacy');
  });

  it('discloses the shipped privacy boundary', () => {
    const page = source('privacy');
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
});
