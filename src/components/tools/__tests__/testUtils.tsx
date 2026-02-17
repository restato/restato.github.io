// Test utilities for tool components
import { render, RenderResult } from '@testing-library/react';
import { vi, beforeEach, afterEach } from 'vitest';
import type { ReactElement } from 'react';

// Mock translations
vi.mock('../../../i18n/useTranslation', () => ({
  useTranslation: () => ({
    lang: 'ko',
    t: (obj: Record<string, string>) => obj.ko || obj.en || Object.values(obj)[0],
    changeLanguage: vi.fn(),
    translations: {
      tools: {
        common: {
          copy: { ko: '복사', en: 'Copy', ja: 'コピー' },
          copied: { ko: '복사됨!', en: 'Copied!', ja: 'コピーしました!' },
          generate: { ko: '생성', en: 'Generate', ja: '生成' },
          reset: { ko: '초기화', en: 'Reset', ja: 'リセット' },
          download: { ko: '다운로드', en: 'Download', ja: 'ダウンロード' },
          clear: { ko: '지우기', en: 'Clear', ja: 'クリア' },
          input: { ko: '입력', en: 'Input', ja: '入力' },
          output: { ko: '출력', en: 'Output', ja: '出力' },
          result: { ko: '결과', en: 'Result', ja: '結果' },
          error: { ko: '오류', en: 'Error', ja: 'エラー' },
          start: { ko: '시작', en: 'Start', ja: 'スタート' },
          stop: { ko: '정지', en: 'Stop', ja: '停止' },
          pause: { ko: '일시정지', en: 'Pause', ja: '一時停止' },
          resume: { ko: '재개', en: 'Resume', ja: '再開' },
        },
        qrCode: {
          title: { ko: 'QR 코드 생성기', en: 'QR Code Generator', ja: 'QRコード生成器' },
          description: { ko: 'URL이나 텍스트를 QR 코드로 변환', en: 'Convert URL or text to QR code', ja: 'URLやテキストをQRコードに変換' },
          inputPlaceholder: { ko: 'URL 또는 텍스트를 입력하세요', en: 'Enter URL or text', ja: 'URLまたはテキストを入力' },
          size: { ko: '크기', en: 'Size', ja: 'サイズ' },
          downloadPng: { ko: 'PNG 다운로드', en: 'Download PNG', ja: 'PNGダウンロード' },
        },
        password: {
          title: { ko: '비밀번호 생성기', en: 'Password Generator', ja: 'パスワード生成器' },
          description: { ko: '안전한 비밀번호 생성', en: 'Generate secure passwords', ja: '安全なパスワードを生成' },
          length: { ko: '길이', en: 'Length', ja: '文字数' },
          uppercase: { ko: '대문자 (A-Z)', en: 'Uppercase (A-Z)', ja: '大文字 (A-Z)' },
          lowercase: { ko: '소문자 (a-z)', en: 'Lowercase (a-z)', ja: '小文字 (a-z)' },
          numbers: { ko: '숫자 (0-9)', en: 'Numbers (0-9)', ja: '数字 (0-9)' },
          symbols: { ko: '특수문자 (!@#$...)', en: 'Symbols (!@#$...)', ja: '記号 (!@#$...)' },
          strength: { ko: '강도', en: 'Strength', ja: '強度' },
          weak: { ko: '약함', en: 'Weak', ja: '弱い' },
          medium: { ko: '보통', en: 'Medium', ja: '普通' },
          strong: { ko: '강함', en: 'Strong', ja: '強い' },
          veryStrong: { ko: '매우 강함', en: 'Very Strong', ja: 'とても強い' },
        },
        base64: {
          title: { ko: 'Base64 인코더/디코더', en: 'Base64 Encoder/Decoder', ja: 'Base64エンコーダー/デコーダー' },
          encode: { ko: '인코딩', en: 'Encode', ja: 'エンコード' },
          decode: { ko: '디코딩', en: 'Decode', ja: 'デコード' },
          inputPlaceholder: { ko: '텍스트를 입력하세요', en: 'Enter text', ja: 'テキストを入力' },
          invalidBase64: { ko: '유효하지 않은 Base64입니다', en: 'Invalid Base64', ja: '無効なBase64です' },
        },
        json: {
          title: { ko: 'JSON 포매터', en: 'JSON Formatter', ja: 'JSONフォーマッター' },
          format: { ko: '포매팅', en: 'Format', ja: 'フォーマット' },
          minify: { ko: '압축', en: 'Minify', ja: '圧縮' },
          validate: { ko: '검증', en: 'Validate', ja: '検証' },
          valid: { ko: '유효한 JSON', en: 'Valid JSON', ja: '有効なJSON' },
          invalid: { ko: '유효하지 않은 JSON', en: 'Invalid JSON', ja: '無効なJSON' },
          inputPlaceholder: { ko: 'JSON을 입력하세요', en: 'Enter JSON', ja: 'JSONを入力' },
        },
        unit: {
          title: { ko: '단위 변환기', en: 'Unit Converter', ja: '単位変換器' },
          from: { ko: '변환 전', en: 'From', ja: '変換前' },
          to: { ko: '변환 후', en: 'To', ja: '変換後' },
        },
        textCounter: {
          title: { ko: '텍스트 카운터', en: 'Text Counter', ja: 'テキストカウンター' },
          characters: { ko: '글자수', en: 'Characters', ja: '文字数' },
          charactersNoSpace: { ko: '글자수 (공백 제외)', en: 'Characters (no spaces)', ja: '文字数 (空白除く)' },
          words: { ko: '단어수', en: 'Words', ja: '単語数' },
          lines: { ko: '줄수', en: 'Lines', ja: '行数' },
          sentences: { ko: '문장수', en: 'Sentences', ja: '文の数' },
          paragraphs: { ko: '문단수', en: 'Paragraphs', ja: '段落数' },
          placeholder: { ko: '텍스트를 입력하세요...', en: 'Enter your text...', ja: 'テキストを入力...' },
        },
        uuid: {
          title: { ko: 'UUID 생성기', en: 'UUID Generator', ja: 'UUID生成器' },
          version: { ko: '버전', en: 'Version', ja: 'バージョン' },
          count: { ko: '개수', en: 'Count', ja: '個数' },
          uppercase: { ko: '대문자', en: 'Uppercase', ja: '大文字' },
          hyphens: { ko: '하이픈 포함', en: 'Include hyphens', ja: 'ハイフンを含む' },
        },
        hash: {
          title: { ko: '해시 생성기', en: 'Hash Generator', ja: 'ハッシュ生成器' },
          algorithm: { ko: '알고리즘', en: 'Algorithm', ja: 'アルゴリズム' },
          inputPlaceholder: { ko: '해시할 텍스트를 입력하세요', en: 'Enter text to hash', ja: 'ハッシュするテキストを入力' },
        },
        regex: {
          title: { ko: '정규식 테스터', en: 'Regex Tester', ja: '正規表現テスター' },
          pattern: { ko: '패턴', en: 'Pattern', ja: 'パターン' },
          flags: { ko: '플래그', en: 'Flags', ja: 'フラグ' },
          testString: { ko: '테스트 문자열', en: 'Test String', ja: 'テスト文字列' },
          matches: { ko: '매치', en: 'Matches', ja: 'マッチ' },
          noMatch: { ko: '매치 없음', en: 'No match', ja: 'マッチなし' },
        },
        color: {
          title: { ko: '색상 변환기', en: 'Color Converter', ja: 'カラー変換器' },
          hex: { ko: 'HEX', en: 'HEX', ja: 'HEX' },
          rgb: { ko: 'RGB', en: 'RGB', ja: 'RGB' },
          hsl: { ko: 'HSL', en: 'HSL', ja: 'HSL' },
          preview: { ko: '미리보기', en: 'Preview', ja: 'プレビュー' },
        },
        timer: {
          title: { ko: '타이머 / 스톱워치', en: 'Timer / Stopwatch', ja: 'タイマー / ストップウォッチ' },
          timerTab: { ko: '타이머', en: 'Timer', ja: 'タイマー' },
          stopwatchTab: { ko: '스톱워치', en: 'Stopwatch', ja: 'ストップウォッチ' },
          hours: { ko: '시', en: 'h', ja: '時' },
          minutes: { ko: '분', en: 'm', ja: '分' },
          seconds: { ko: '초', en: 's', ja: '秒' },
          lap: { ko: '랩', en: 'Lap', ja: 'ラップ' },
          timeUp: { ko: '시간 종료!', en: 'Time\'s up!', ja: '時間です!' },
        },
        loremIpsum: {
          title: { ko: 'Lorem Ipsum 생성기', en: 'Lorem Ipsum Generator', ja: 'Lorem Ipsum生成器' },
          paragraphs: { ko: '문단', en: 'Paragraphs', ja: '段落' },
          sentences: { ko: '문장', en: 'Sentences', ja: '文' },
          words: { ko: '단어', en: 'Words', ja: '単語' },
          count: { ko: '개수', en: 'Count', ja: '個数' },
          startWithLorem: { ko: '"Lorem ipsum"으로 시작', en: 'Start with "Lorem ipsum"', ja: '「Lorem ipsum」で開始' },
        },
        markdown: {
          title: { ko: '마크다운 미리보기', en: 'Markdown Preview', ja: 'マークダウンプレビュー' },
          editor: { ko: '편집기', en: 'Editor', ja: 'エディター' },
          preview: { ko: '미리보기', en: 'Preview', ja: 'プレビュー' },
          placeholder: { ko: '마크다운을 입력하세요...', en: 'Enter markdown...', ja: 'マークダウンを入力...' },
        },
        colorPalette: {
          title: { ko: '색상 팔레트 생성기', en: 'Color Palette Generator', ja: 'カラーパレット生成器' },
          baseColor: { ko: '기본 색상', en: 'Base Color', ja: 'ベースカラー' },
          harmony: { ko: '배색', en: 'Harmony', ja: '配色' },
          complementary: { ko: '보색', en: 'Complementary', ja: '補色' },
          triadic: { ko: '삼각배색', en: 'Triadic', ja: '三角配色' },
          analogous: { ko: '유사색', en: 'Analogous', ja: '類似色' },
        },
        imageResizer: {
          title: { ko: '이미지 리사이저', en: 'Image Resizer', ja: '画像リサイザー' },
          dropzone: { ko: '이미지를 드래그하거나 클릭하여 업로드', en: 'Drag or click to upload image', ja: '画像をドラッグまたはクリックしてアップロード' },
          width: { ko: '너비', en: 'Width', ja: '幅' },
          height: { ko: '높이', en: 'Height', ja: '高さ' },
          keepAspectRatio: { ko: '비율 유지', en: 'Keep aspect ratio', ja: '比率を維持' },
          quality: { ko: '품질', en: 'Quality', ja: '品質' },
          format: { ko: '포맷', en: 'Format', ja: 'フォーマット' },
          crop: { ko: '크롭', en: 'Crop', ja: 'クロップ' },
          cropFree: { ko: '자유 비율', en: 'Free Ratio', ja: '自由比率' },
          cropLocked: { ko: '출력 비율 잠금', en: 'Lock to Output Ratio', ja: '出力比率に固定' },
          autoApplied: {
            ko: '크롭/설정 변경 사항이 결과 미리보기에 자동 적용됩니다.',
            en: 'Crop and setting changes are automatically applied to the preview.',
            ja: 'クロップと設定の変更はプレビューに自動反映されます。',
          },
          livePreview: {
            ko: '크롭하거나 설정을 변경하면 결과가 실시간으로 반영됩니다.',
            en: 'Adjust crop or settings to update the result in real time.',
            ja: 'クロップや設定を変更すると結果がリアルタイムで更新されます。',
          },
          outputSize: { ko: '출력 크기', en: 'Output Size', ja: '出力サイズ' },
          original: { ko: '원본', en: 'Original', ja: 'オリジナル' },
          resized: { ko: '리사이즈됨', en: 'Resized', ja: 'リサイズ済み' },
        },
        backgroundRemover: {
          title: { ko: '배경 제거기 (누끼)', en: 'Background Remover', ja: '背景除去ツール' },
          dropzone: { ko: '이미지를 드래그하거나 클릭하여 업로드', en: 'Drag or click to upload image', ja: '画像をドラッグまたはクリックしてアップロード' },
          removeButton: { ko: '배경 제거하기', en: 'Remove Background', ja: '背景を削除' },
          processing: { ko: '처리 중', en: 'Processing', ja: '処理中' },
        },
        appStoreScreenshot: {
          title: { ko: '앱스토어 스크린샷 리사이저', en: 'App Store Screenshot Resizer', ja: 'App Storeスクリーンショットリサイザー' },
          description: { ko: '무료 iOS 앱스토어 스크린샷 크기 조절', en: 'Free iOS App Store screenshot resizer', ja: '無料iOS App Storeスクリーンショットリサイザー' },
          dropzone: { ko: '이미지를 드래그하거나 클릭하여 업로드 (최대 10장)', en: 'Drag or click to upload images (max 10)', ja: '画像をドラッグまたはクリック (最大10枚)' },
          selectDevice: { ko: '기기 선택', en: 'Select Device', ja: 'デバイスを選択' },
          selectSize: { ko: '해상도 선택', en: 'Select Size', ja: '解像度を選択' },
          orientation: { ko: '방향', en: 'Orientation', ja: '向き' },
          portrait: { ko: '세로', en: 'Portrait', ja: '縦向き' },
          landscape: { ko: '가로', en: 'Landscape', ja: '横向き' },
          adjustCrop: { ko: '크롭 영역 조정', en: 'Adjust Crop Area', ja: 'クロップ範囲を調整' },
          applyToAll: { ko: '모든 이미지에 적용', en: 'Apply to All', ja: '全画像に適用' },
          downloadAll: { ko: '모두 다운로드', en: 'Download All', ja: 'すべてダウンロード' },
          processAll: { ko: '모두 처리', en: 'Process All', ja: 'すべて処理' },
        },
        toolsPage: {
          title: { ko: '온라인 도구', en: 'Online Tools', ja: 'オンラインツール' },
        },
      },
    },
  }),
}));

// Custom render function
export function renderTool(component: ReactElement): RenderResult {
  return render(component);
}

// Reset mocks before each test
export function setupTestEnvironment() {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
}
