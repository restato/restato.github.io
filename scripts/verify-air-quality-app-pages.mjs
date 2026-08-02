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
]) {
  assert.ok(support.includes(token), `Support page is missing: ${token}`);
}

for (const token of [
  'href="https://restato.github.io/apps/air-quality/privacy"',
  '2026년 8월 2일',
  'https://open-meteo.com/',
  'https://open-meteo.com/en/terms',
  ...privacySections,
]) {
  assert.ok(privacy.includes(token), `Privacy page is missing: ${token}`);
}

console.log('Air quality App Store rendered-page contract passed.');
