// Tool translations
import type { Language } from '../index';

export const toolTranslations = {
  // Common
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

  // QR Code Generator
  qrCode: {
    title: { ko: 'QR 코드 생성기', en: 'QR Code Generator', ja: 'QRコード生成器' },
    description: { ko: 'URL이나 텍스트를 QR 코드로 변환', en: 'Convert URL or text to QR code', ja: 'URLやテキストをQRコードに変換' },
    inputPlaceholder: { ko: 'URL 또는 텍스트를 입력하세요', en: 'Enter URL or text', ja: 'URLまたはテキストを入力' },
    size: { ko: '크기', en: 'Size', ja: 'サイズ' },
    downloadPng: { ko: 'PNG 다운로드', en: 'Download PNG', ja: 'PNGダウンロード' },
  },

  // Password Generator
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

  // Color Converter
  color: {
    title: { ko: '색상 변환기', en: 'Color Converter', ja: 'カラー変換器' },
    description: { ko: 'HEX, RGB, HSL 색상 변환', en: 'Convert HEX, RGB, HSL colors', ja: 'HEX, RGB, HSLカラー変換' },
    hex: { ko: 'HEX', en: 'HEX', ja: 'HEX' },
    rgb: { ko: 'RGB', en: 'RGB', ja: 'RGB' },
    hsl: { ko: 'HSL', en: 'HSL', ja: 'HSL' },
    preview: { ko: '미리보기', en: 'Preview', ja: 'プレビュー' },
  },

  // Unit Converter
  unit: {
    title: { ko: '단위 변환기', en: 'Unit Converter', ja: '単位変換器' },
    description: { ko: '길이, 무게, 온도 단위 변환', en: 'Convert length, weight, temperature', ja: '長さ、重さ、温度の単位変換' },
    length: { ko: '길이', en: 'Length', ja: '長さ' },
    weight: { ko: '무게', en: 'Weight', ja: '重さ' },
    temperature: { ko: '온도', en: 'Temperature', ja: '温度' },
    area: { ko: '넓이', en: 'Area', ja: '面積' },
    volume: { ko: '부피', en: 'Volume', ja: '体積' },
    from: { ko: '변환 전', en: 'From', ja: '変換前' },
    to: { ko: '변환 후', en: 'To', ja: '変換後' },
  },

  // Text Counter
  textCounter: {
    title: { ko: '텍스트 카운터', en: 'Text Counter', ja: 'テキストカウンター' },
    description: { ko: '글자수, 단어수, 줄수 세기', en: 'Count characters, words, lines', ja: '文字数、単語数、行数をカウント' },
    characters: { ko: '글자수', en: 'Characters', ja: '文字数' },
    charactersNoSpace: { ko: '글자수 (공백 제외)', en: 'Characters (no spaces)', ja: '文字数 (空白除く)' },
    words: { ko: '단어수', en: 'Words', ja: '単語数' },
    lines: { ko: '줄수', en: 'Lines', ja: '行数' },
    sentences: { ko: '문장수', en: 'Sentences', ja: '文の数' },
    paragraphs: { ko: '문단수', en: 'Paragraphs', ja: '段落数' },
    placeholder: { ko: '텍스트를 입력하세요...', en: 'Enter your text...', ja: 'テキストを入力...' },
  },

  // Base64
  base64: {
    title: { ko: 'Base64 인코더/디코더', en: 'Base64 Encoder/Decoder', ja: 'Base64エンコーダー/デコーダー' },
    description: { ko: '텍스트를 Base64로 인코딩/디코딩', en: 'Encode/decode text to Base64', ja: 'テキストをBase64でエンコード/デコード' },
    encode: { ko: '인코딩', en: 'Encode', ja: 'エンコード' },
    decode: { ko: '디코딩', en: 'Decode', ja: 'デコード' },
    inputPlaceholder: { ko: '텍스트를 입력하세요', en: 'Enter text', ja: 'テキストを入力' },
    invalidBase64: { ko: '유효하지 않은 Base64입니다', en: 'Invalid Base64', ja: '無効なBase64です' },
  },

  // JSON Formatter
  json: {
    title: { ko: 'JSON 포매터', en: 'JSON Formatter', ja: 'JSONフォーマッター' },
    description: { ko: 'JSON 포매팅 및 검증', en: 'Format and validate JSON', ja: 'JSONのフォーマットと検証' },
    format: { ko: '포매팅', en: 'Format', ja: 'フォーマット' },
    minify: { ko: '압축', en: 'Minify', ja: '圧縮' },
    validate: { ko: '검증', en: 'Validate', ja: '検証' },
    valid: { ko: '유효한 JSON', en: 'Valid JSON', ja: '有効なJSON' },
    invalid: { ko: '유효하지 않은 JSON', en: 'Invalid JSON', ja: '無効なJSON' },
    inputPlaceholder: { ko: 'JSON을 입력하세요', en: 'Enter JSON', ja: 'JSONを入力' },
  },

  // Timer
  timer: {
    title: { ko: '타이머 / 스톱워치', en: 'Timer / Stopwatch', ja: 'タイマー / ストップウォッチ' },
    description: { ko: '타이머와 스톱워치', en: 'Timer and Stopwatch', ja: 'タイマーとストップウォッチ' },
    timerTab: { ko: '타이머', en: 'Timer', ja: 'タイマー' },
    stopwatchTab: { ko: '스톱워치', en: 'Stopwatch', ja: 'ストップウォッチ' },
    hours: { ko: '시', en: 'h', ja: '時' },
    minutes: { ko: '분', en: 'm', ja: '分' },
    seconds: { ko: '초', en: 's', ja: '秒' },
    lap: { ko: '랩', en: 'Lap', ja: 'ラップ' },
    timeUp: { ko: '시간 종료!', en: 'Time\'s up!', ja: '時間です!' },
  },

  // UUID Generator
  uuid: {
    title: { ko: 'UUID 생성기', en: 'UUID Generator', ja: 'UUID生成器' },
    description: { ko: 'UUID v4 생성', en: 'Generate UUID v4', ja: 'UUID v4を生成' },
    version: { ko: '버전', en: 'Version', ja: 'バージョン' },
    count: { ko: '개수', en: 'Count', ja: '個数' },
    uppercase: { ko: '대문자', en: 'Uppercase', ja: '大文字' },
    hyphens: { ko: '하이픈 포함', en: 'Include hyphens', ja: 'ハイフンを含む' },
  },

  // Hash Generator
  hash: {
    title: { ko: '해시 생성기', en: 'Hash Generator', ja: 'ハッシュ生成器' },
    description: { ko: 'MD5, SHA-1, SHA-256 해시 생성', en: 'Generate MD5, SHA-1, SHA-256 hash', ja: 'MD5, SHA-1, SHA-256ハッシュを生成' },
    algorithm: { ko: '알고리즘', en: 'Algorithm', ja: 'アルゴリズム' },
    inputPlaceholder: { ko: '해시할 텍스트를 입력하세요', en: 'Enter text to hash', ja: 'ハッシュするテキストを入力' },
  },

  // Regex Tester
  regex: {
    title: { ko: '정규식 테스터', en: 'Regex Tester', ja: '正規表現テスター' },
    description: { ko: '정규식 테스트 및 매치 확인', en: 'Test regex and check matches', ja: '正規表現のテストとマッチ確認' },
    pattern: { ko: '패턴', en: 'Pattern', ja: 'パターン' },
    flags: { ko: '플래그', en: 'Flags', ja: 'フラグ' },
    testString: { ko: '테스트 문자열', en: 'Test String', ja: 'テスト文字列' },
    matches: { ko: '매치', en: 'Matches', ja: 'マッチ' },
    noMatch: { ko: '매치 없음', en: 'No match', ja: 'マッチなし' },
    groups: { ko: '그룹', en: 'Groups', ja: 'グループ' },
  },

  // Lorem Ipsum
  loremIpsum: {
    title: { ko: 'Lorem Ipsum 생성기', en: 'Lorem Ipsum Generator', ja: 'Lorem Ipsum生成器' },
    description: { ko: '더미 텍스트 생성', en: 'Generate dummy text', ja: 'ダミーテキストを生成' },
    paragraphs: { ko: '문단', en: 'Paragraphs', ja: '段落' },
    sentences: { ko: '문장', en: 'Sentences', ja: '文' },
    words: { ko: '단어', en: 'Words', ja: '単語' },
    count: { ko: '개수', en: 'Count', ja: '個数' },
    startWithLorem: { ko: '"Lorem ipsum"으로 시작', en: 'Start with "Lorem ipsum"', ja: '「Lorem ipsum」で開始' },
  },

  // Markdown Preview
  markdown: {
    title: { ko: '마크다운 미리보기', en: 'Markdown Preview', ja: 'マークダウンプレビュー' },
    description: { ko: '마크다운 실시간 미리보기', en: 'Live markdown preview', ja: 'マークダウンのリアルタイムプレビュー' },
    editor: { ko: '편집기', en: 'Editor', ja: 'エディター' },
    preview: { ko: '미리보기', en: 'Preview', ja: 'プレビュー' },
    placeholder: { ko: '마크다운을 입력하세요...', en: 'Enter markdown...', ja: 'マークダウンを入力...' },
  },

  // Color Palette
  colorPalette: {
    title: { ko: '색상 팔레트 생성기', en: 'Color Palette Generator', ja: 'カラーパレット生成器' },
    description: { ko: '조화로운 색상 팔레트 생성', en: 'Generate harmonious color palettes', ja: '調和のとれたカラーパレットを生成' },
    baseColor: { ko: '기본 색상', en: 'Base Color', ja: 'ベースカラー' },
    harmony: { ko: '배색', en: 'Harmony', ja: '配色' },
    complementary: { ko: '보색', en: 'Complementary', ja: '補色' },
    triadic: { ko: '삼각배색', en: 'Triadic', ja: '三角配色' },
    analogous: { ko: '유사색', en: 'Analogous', ja: '類似色' },
    splitComplementary: { ko: '분할보색', en: 'Split Complementary', ja: '分割補色' },
    tetradic: { ko: '사각배색', en: 'Tetradic', ja: '四角配色' },
    monochromatic: { ko: '단색', en: 'Monochromatic', ja: 'モノクロマティック' },
  },

  // Image Resizer
  imageResizer: {
    title: { ko: '이미지 리사이저', en: 'Image Resizer', ja: '画像リサイザー' },
    description: { ko: '이미지 크기 조절 및 압축', en: 'Resize and compress images', ja: '画像のサイズ変更と圧縮' },
    dropzone: { ko: '이미지를 드래그하거나 클릭하여 업로드', en: 'Drag or click to upload image', ja: '画像をドラッグまたはクリックしてアップロード' },
    width: { ko: '너비', en: 'Width', ja: '幅' },
    height: { ko: '높이', en: 'Height', ja: '高さ' },
    keepAspectRatio: { ko: '비율 유지', en: 'Keep aspect ratio', ja: '比率を維持' },
    quality: { ko: '품질', en: 'Quality', ja: '品質' },
    format: { ko: '포맷', en: 'Format', ja: 'フォーマット' },
    original: { ko: '원본', en: 'Original', ja: 'オリジナル' },
    resized: { ko: '리사이즈됨', en: 'Resized', ja: 'リサイズ済み' },
  },

  // Tools page
  toolsPage: {
    title: { ko: '온라인 도구', en: 'Online Tools', ja: 'オンラインツール' },
    description: { ko: '유용한 웹 도구 모음', en: 'Collection of useful web tools', ja: '便利なウェブツール集' },
    allTools: { ko: '전체 도구', en: 'All Tools', ja: 'すべてのツール' },
    generators: { ko: '생성기', en: 'Generators', ja: '生成ツール' },
    converters: { ko: '변환기', en: 'Converters', ja: '変換ツール' },
    text: { ko: '텍스트', en: 'Text', ja: 'テキスト' },
    developer: { ko: '개발자', en: 'Developer', ja: '開発者' },
    image: { ko: '이미지', en: 'Image', ja: '画像' },
  },
} as const;

export type ToolTranslationKey = keyof typeof toolTranslations;
