import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rendered = (name) => {
  const filePath = path.join(projectRoot, 'dist', 'apps', 'air-quality', name, 'index.html');
  assert.ok(existsSync(filePath), `Missing generated route: ${filePath}. Run npm run build first.`);
  return readFileSync(filePath, 'utf8');
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

const support = rendered('support');
const privacy = rendered('privacy');

for (const token of [
  'href="https://restato.github.io/apps/air-quality/support"',
  'direcision@gmail.com',
  '건강 진단이나 응급 판단을 대신하지 않습니다',
  '현재 위치 또는 직접 찾은 장소',
  'PM2.5와 PM10',
  '시간대별 예보와 야외 활동 시간 창',
  '위젯',
  'Apple Watch',
  '민감정보는 보내지 마세요',
  '최종 갱신일: 2026년 8월 2일',
]) {
  assert.ok(support.includes(token), `Support page is missing: ${token}`);
}

for (const token of [
  'href="https://restato.github.io/apps/air-quality/privacy"',
  '2026년 8월 2일',
  'https://open-meteo.com/',
  'https://open-meteo.com/en/terms',
  '광고를 포함하지 않습니다',
  '추적하지 않습니다',
  '위치 좌표·시간대·장소 검색어가 Open-Meteo의 공기질 및 지오코딩 API로 직접 전송될 수 있습니다',
  'CAMS(Copernicus Atmosphere Monitoring Service)',
  'Open-Meteo가 공개한 약관 및 개인정보 정책',
  '저장한 장소와 정규화된 공기질 캐시는 사용자의 기기와 App Group 저장소에만 보관됩니다',
  'CloudKit 동기화를 사용하지 않습니다',
  'Apple Watch에서 저장한 장소를 직접 새로고침하면',
  '답변과 분쟁 처리에 필요한 기간에만 보관합니다',
  ...privacySections,
]) {
  assert.ok(privacy.includes(token), `Privacy page is missing: ${token}`);
}

console.log('Air quality App Store rendered-page contract passed.');
