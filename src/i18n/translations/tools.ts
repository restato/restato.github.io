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
    // RelatedTools, FavoriteButton, ShareButton
    relatedTools: { ko: '관련 도구', en: 'Related Tools', ja: '関連ツール' },
    favorite: { ko: '즐겨찾기', en: 'Favorite', ja: 'お気に入り' },
    favorited: { ko: '즐겨찾기됨', en: 'Favorited', ja: 'お気に入り済み' },
    addToFavorite: { ko: '즐겨찾기에 추가', en: 'Add to favorites', ja: 'お気に入りに追加' },
    removeFromFavorite: { ko: '즐겨찾기에서 제거', en: 'Remove from favorites', ja: 'お気に入りから削除' },
    share: { ko: '공유', en: 'Share', ja: '共有' },
    copyLink: { ko: '링크 복사', en: 'Copy link', ja: 'リンクをコピー' },
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
    description: {
      ko: '실시간 크롭과 프리셋 변환을 지원하는 이미지 리사이저',
      en: 'Image resizer with live crop and preset size conversion',
      ja: 'リアルタイムクロップとプリセット変換に対応した画像リサイザー',
    },
    dropzone: { ko: '이미지를 드래그하거나 클릭하여 업로드', en: 'Drag or click to upload image', ja: '画像をドラッグまたはクリックしてアップロード' },
    mode: { ko: '모드', en: 'Mode', ja: 'モード' },
    customMode: { ko: '기본 편집', en: 'Custom', ja: 'カスタム' },
    presetMode: { ko: '프리셋', en: 'Preset', ja: 'プリセット' },
    preset: { ko: '프리셋 선택', en: 'Preset', ja: 'プリセット' },
    presetOutput: { ko: '선택 프리셋', en: 'Selected preset', ja: '選択プリセット' },
    presetHint: {
      ko: '프리셋 모드에서는 선택한 해상도로 자동 리사이즈됩니다.',
      en: 'Preset mode automatically resizes to the selected output dimensions.',
      ja: 'プリセットモードでは選択した解像度に自動リサイズされます。',
    },
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

  // Background Remover
  backgroundRemover: {
    title: { ko: '배경 제거기 (누끼)', en: 'Background Remover', ja: '背景除去ツール' },
    description: { ko: '이미지에서 배경을 자동으로 제거', en: 'Automatically remove background from images', ja: '画像から背景を自動的に削除' },
    dropzone: { ko: '이미지를 드래그하거나 클릭하여 업로드', en: 'Drag or click to upload image', ja: '画像をドラッグまたはクリックしてアップロード' },
    removeButton: { ko: '배경 제거하기', en: 'Remove Background', ja: '背景を削除' },
    processing: { ko: '처리 중', en: 'Processing', ja: '処理中' },
    original: { ko: '원본', en: 'Original', ja: 'オリジナル' },
    result: { ko: '결과', en: 'Result', ja: '結果' },
    clickRemove: { ko: '배경 제거 버튼을 클릭하세요', en: 'Click remove background button', ja: '背景削除ボタンをクリック' },
    backgroundColor: { ko: '배경색 선택', en: 'Background Color', ja: '背景色を選択' },
    transparent: { ko: '투명', en: 'Transparent', ja: '透明' },
    white: { ko: '흰색', en: 'White', ja: '白' },
    black: { ko: '검정색', en: 'Black', ja: '黒' },
    customColor: { ko: '사용자 정의', en: 'Custom', ja: 'カスタム' },
    errorMessage: { ko: '배경 제거 중 오류가 발생했습니다. 다시 시도해주세요.', en: 'Error occurred while removing background. Please try again.', ja: '背景削除中にエラーが発生しました。もう一度お試しください。' },
    infoNote: { ko: '모든 이미지 처리는 브라우저에서 로컬로 수행됩니다. 이미지는 서버로 전송되지 않습니다.', en: 'All image processing is done locally in your browser. Images are not sent to any server.', ja: 'すべての画像処理はブラウザでローカルに行われます。画像はサーバーに送信されません。' },
  },

  // LLM Cost Calculator
  llmCost: {
    title: { ko: 'LLM 비용 계산기', en: 'LLM Cost Calculator', ja: 'LLMコスト計算機' },
    description: { ko: 'AI 모델별 API 사용 비용 비교', en: 'Compare API costs across AI models', ja: 'AIモデル別APIコストを比較' },

    // Input modes
    textMode: { ko: '텍스트로 토큰 계산', en: 'Calculate tokens from text', ja: 'テキストからトークン計算' },
    manualMode: { ko: '토큰 수 직접 입력', en: 'Enter token count manually', ja: 'トークン数を直接入力' },

    // Labels
    inputText: { ko: '입력 텍스트 (Input)', en: 'Input Text', ja: '入力テキスト' },
    outputText: { ko: '출력 텍스트 (Output) - 예상 응답', en: 'Output Text - Expected Response', ja: '出力テキスト - 予想応答' },
    inputTokens: { ko: '입력 토큰 수', en: 'Input Tokens', ja: '入力トークン数' },
    outputTokens: { ko: '출력 토큰 수', en: 'Output Tokens', ja: '出力トークン数' },
    outputTokensAlt: { ko: '또는 출력 토큰 수 직접 입력', en: 'Or enter output tokens manually', ja: 'または出力トークン数を直接入力' },
    requestCount: { ko: '요청 횟수', en: 'Request Count', ja: 'リクエスト回数' },

    // Placeholders
    inputPlaceholder: { ko: '프롬프트를 입력하세요...', en: 'Enter your prompt...', ja: 'プロンプトを入力...' },
    outputPlaceholder: { ko: '예상되는 출력 텍스트를 입력하거나, 아래에서 출력 토큰 수를 직접 입력하세요...', en: 'Enter expected output text, or manually enter output token count below...', ja: '予想される出力テキストを入力するか、下で出力トークン数を直接入力...' },

    // Presets
    presetShort: { ko: '짧은 답변', en: 'Short Answer', ja: '短い回答' },
    presetNormal: { ko: '일반 대화', en: 'Normal Chat', ja: '通常の会話' },
    presetLong: { ko: '긴 글 작성', en: 'Long Writing', ja: '長文作成' },
    presetCode: { ko: '코드 생성', en: 'Code Generation', ja: 'コード生成' },
    presetDoc: { ko: '문서 분석', en: 'Document Analysis', ja: 'ドキュメント分析' },
    presetBulk: { ko: '대량 처리 (1000건)', en: 'Bulk Processing (1000)', ja: '大量処理 (1000件)' },

    // Token summary
    inputTokensSummary: { ko: '입력 토큰', en: 'Input Tokens', ja: '入力トークン' },
    outputTokensSummary: { ko: '출력 토큰', en: 'Output Tokens', ja: '出力トークン' },
    requestsSummary: { ko: '요청 횟수', en: 'Requests', ja: 'リクエスト数' },

    // Currency
    currencySelect: { ko: '통화 선택', en: 'Select Currency', ja: '通貨を選択' },
    exchangeSettings: { ko: '환율 설정', en: 'Exchange Rate Settings', ja: '為替レート設定' },
    exchangeClose: { ko: '환율 설정 닫기', en: 'Close Exchange Settings', ja: '為替レート設定を閉じる' },
    exchangeRate: { ko: '$1 USD 기준 환율', en: 'Exchange rate per $1 USD', ja: '$1 USDあたりの為替レート' },
    fetchRates: { ko: '실시간 환율 가져오기', en: 'Fetch Live Rates', ja: 'リアルタイムレートを取得' },
    fetchingRates: { ko: '가져오는 중...', en: 'Fetching...', ja: '取得中...' },
    ratesError: { ko: '환율 데이터를 가져올 수 없습니다.', en: 'Could not fetch exchange rates.', ja: '為替レートを取得できませんでした。' },
    networkError: { ko: '네트워크 오류가 발생했습니다.', en: 'Network error occurred.', ja: 'ネットワークエラーが発生しました。' },
    lastUpdated: { ko: '마지막 업데이트', en: 'Last updated', ja: '最終更新' },
    defaultRates: { ko: '기본 환율 사용 중', en: 'Using default rates', ja: 'デフォルトレートを使用中' },
    exchangeSource: { ko: '출처', en: 'Source', ja: '出典' },

    // Currency names
    currencyUsd: { ko: '달러', en: 'USD', ja: 'ドル' },
    currencyKrw: { ko: '원화', en: 'KRW', ja: 'ウォン' },
    currencyJpy: { ko: '엔화', en: 'JPY', ja: '円' },
    currencyEur: { ko: '유로', en: 'EUR', ja: 'ユーロ' },

    // Provider filter
    providerFilter: { ko: '제공업체 필터 (복수 선택)', en: 'Provider Filter (Multi-select)', ja: 'プロバイダーフィルター (複数選択)' },
    selectAll: { ko: '전체 선택', en: 'Select All', ja: 'すべて選択' },
    deselectAll: { ko: '전체 해제', en: 'Deselect All', ja: 'すべて解除' },
    modelSelect: { ko: '모델 개별 선택', en: 'Select Models', ja: 'モデルを個別選択' },
    modelSelectClose: { ko: '모델 선택 닫기', en: 'Close Model Selection', ja: 'モデル選択を閉じる' },
    select: { ko: '선택', en: 'Select', ja: '選択' },
    deselect: { ko: '해제', en: 'Deselect', ja: '解除' },

    // Table headers
    model: { ko: '모델', en: 'Model', ja: 'モデル' },
    inputCost: { ko: '입력 비용', en: 'Input Cost', ja: '入力コスト' },
    outputCost: { ko: '출력 비용', en: 'Output Cost', ja: '出力コスト' },
    totalCost: { ko: '총 비용', en: 'Total Cost', ja: '合計コスト' },
    comparison: { ko: '비교', en: 'Comparison', ja: '比較' },
    lowest: { ko: '최저가', en: 'Lowest', ja: '最安' },
    selectModels: { ko: '비교할 모델을 선택하세요.', en: 'Select models to compare.', ja: '比較するモデルを選択してください。' },

    // Pricing table
    pricingTable: { ko: '모델별 토큰당 가격', en: 'Price per Token by Model', ja: 'モデル別トークン単価' },
    pricePer1kInput: { ko: '입력 1K당', en: 'Per 1K Input', ja: '入力1Kあたり' },
    pricePer1kOutput: { ko: '출력 1K당', en: 'Per 1K Output', ja: '出力1Kあたり' },
    maxInput: { ko: '최대 입력', en: 'Max Input', ja: '最大入力' },
    maxOutput: { ko: '최대 출력', en: 'Max Output', ja: '最大出力' },

    // Notes section
    notes: { ko: '참고 사항', en: 'Notes', ja: '注意事項' },
    priceDate: { ko: '가격은 2025년 1월 기준이며 실제 가격은 공식 사이트에서 확인하세요.', en: 'Prices as of January 2025. Check official sites for current pricing.', ja: '価格は2025年1月時点のものです。最新価格は公式サイトでご確認ください。' },
    tokenEstimation: { ko: '토큰 수 추정: 영어 약 4자당 1토큰, 한국어 약 2자당 1토큰', en: 'Token estimation: ~4 English chars per token, ~2 Korean chars per token', ja: 'トークン推定: 英語約4文字で1トークン、韓国語約2文字で1トークン' },
    koreanTokenNote: { ko: '한국어는 영어보다 토큰을 더 많이 사용합니다 (~1.5-2배).', en: 'Korean uses more tokens than English (~1.5-2x).', ja: '韓国語は英語より多くのトークンを使用します（約1.5-2倍）。' },
    exchangeNote: { ko: '환율은 페이지 로드 시 자동으로', en: 'Exchange rates are auto-fetched from', ja: '為替レートはページ読み込み時に' },
    exchangeNoteSuffix: { ko: '에서 가져옵니다.', en: 'on page load.', ja: 'から自動取得されます。' },

    // Token references
    tokenReference: { ko: '토큰 계산 레퍼런스', en: 'Token Calculation Reference', ja: 'トークン計算リファレンス' },
    openaiTokenizer: { ko: 'GPT 모델용 토큰 계산기', en: 'Tokenizer for GPT models', ja: 'GPTモデル用トークナイザー' },
    anthropicTokens: { ko: 'Claude 모델 토큰 계산 API', en: 'Token counting API for Claude models', ja: 'ClaudeモデルのトークンカウントAPI' },
    geminiTokens: { ko: 'Gemini 모델 토큰 가이드', en: 'Token guide for Gemini models', ja: 'Geminiモデルのトークンガイド' },

    // Price sources
    priceSources: { ko: '가격 정보 출처', en: 'Pricing Sources', ja: '価格情報ソース' },
    priceSourceNote: { ko: '아래 공식 가격 페이지에서 최신 정보를 확인하세요:', en: 'Check the official pricing pages below for latest information:', ja: '以下の公式価格ページで最新情報をご確認ください:' },

    // Character count
    characters: { ko: '자', en: 'chars', ja: '文字' },
    tokensEstimated: { ko: '토큰 (추정)', en: 'tokens (est.)', ja: 'トークン（推定）' },
  },

  // Age Calculator
  age: {
    title: { ko: '나이 계산기', en: 'Age Calculator', ja: '年齢計算機' },
    description: { ko: '생년월일로 나이 계산', en: 'Calculate age from birthdate', ja: '生年月日から年齢を計算' },
    birthDate: { ko: '생년월일', en: 'Birth Date', ja: '生年月日' },
    internationalAge: { ko: '만 나이', en: 'International Age', ja: '満年齢' },
    koreanAge: { ko: '세는 나이', en: 'Korean Age', ja: '数え年' },
    years: { ko: '세', en: ' years old', ja: '歳' },
    exactAge: { ko: '정확한 나이', en: 'Exact Age', ja: '正確な年齢' },
    yearsMonthsDays: { ko: '년', en: ' years ', ja: '年' },
    monthsUnit: { ko: '개월', en: ' months ', ja: 'ヶ月' },
    daysUnit: { ko: '일', en: ' days', ja: '日' },
    daysLived: { ko: '살아온 날', en: 'Days Lived', ja: '生きた日数' },
    untilBirthday: { ko: '다음 생일까지', en: 'Until Birthday', ja: '次の誕生日まで' },
    todayBirthday: { ko: '오늘!', en: 'Today!', ja: '今日!' },
    zodiac: { ko: '별자리', en: 'Zodiac', ja: '星座' },
    chineseZodiac: { ko: '띠', en: 'Chinese Zodiac', ja: '干支' },
    funStats: { ko: '재미있는 통계', en: 'Fun Statistics', ja: '楽しい統計' },
    hoursLived: { ko: '시간을 살았어요', en: 'hours lived', ja: '時間を生きました' },
    minutesPassed: { ko: '분이 지났어요', en: 'minutes passed', ja: '分が経ちました' },
    weeksSpent: { ko: '주를 보냈어요', en: 'weeks spent', ja: '週を過ごしました' },
    heartbeats: { ko: '번 뛰었어요', en: 'heartbeats', ja: '回鼓動しました' },
    // Zodiac signs
    capricorn: { ko: '염소자리', en: 'Capricorn', ja: '山羊座' },
    aquarius: { ko: '물병자리', en: 'Aquarius', ja: '水瓶座' },
    pisces: { ko: '물고기자리', en: 'Pisces', ja: '魚座' },
    aries: { ko: '양자리', en: 'Aries', ja: '牡羊座' },
    taurus: { ko: '황소자리', en: 'Taurus', ja: '牡牛座' },
    gemini: { ko: '쌍둥이자리', en: 'Gemini', ja: '双子座' },
    cancer: { ko: '게자리', en: 'Cancer', ja: '蟹座' },
    leo: { ko: '사자자리', en: 'Leo', ja: '獅子座' },
    virgo: { ko: '처녀자리', en: 'Virgo', ja: '乙女座' },
    libra: { ko: '천칭자리', en: 'Libra', ja: '天秤座' },
    scorpio: { ko: '전갈자리', en: 'Scorpio', ja: '蠍座' },
    sagittarius: { ko: '사수자리', en: 'Sagittarius', ja: '射手座' },
    // Chinese zodiac
    monkey: { ko: '원숭이', en: 'Monkey', ja: '申' },
    rooster: { ko: '닭', en: 'Rooster', ja: '酉' },
    dog: { ko: '개', en: 'Dog', ja: '戌' },
    pig: { ko: '돼지', en: 'Pig', ja: '亥' },
    rat: { ko: '쥐', en: 'Rat', ja: '子' },
    ox: { ko: '소', en: 'Ox', ja: '丑' },
    tiger: { ko: '호랑이', en: 'Tiger', ja: '寅' },
    rabbit: { ko: '토끼', en: 'Rabbit', ja: '卯' },
    dragon: { ko: '용', en: 'Dragon', ja: '辰' },
    snake: { ko: '뱀', en: 'Snake', ja: '巳' },
    horse: { ko: '말', en: 'Horse', ja: '午' },
    sheep: { ko: '양', en: 'Sheep', ja: '未' },
  },

  // BMI Calculator
  bmi: {
    title: { ko: 'BMI 계산기', en: 'BMI Calculator', ja: 'BMI計算機' },
    description: { ko: '체질량지수 계산', en: 'Calculate Body Mass Index', ja: '体格指数を計算' },
    height: { ko: '키 (cm)', en: 'Height (cm)', ja: '身長 (cm)' },
    weight: { ko: '몸무게 (kg)', en: 'Weight (kg)', ja: '体重 (kg)' },
    calculate: { ko: 'BMI 계산하기', en: 'Calculate BMI', ja: 'BMIを計算' },
    myBmi: { ko: '나의 BMI', en: 'My BMI', ja: '私のBMI' },
    idealWeight: { ko: '적정 체중 범위', en: 'Ideal Weight Range', ja: '理想体重範囲' },
    underweight: { ko: '저체중', en: 'Underweight', ja: '低体重' },
    normal: { ko: '정상', en: 'Normal', ja: '普通' },
    overweight: { ko: '과체중', en: 'Overweight', ja: '過体重' },
    obese1: { ko: '비만 1단계', en: 'Obese Class I', ja: '肥満1度' },
    obese2: { ko: '비만 2단계', en: 'Obese Class II', ja: '肥満2度' },
    extremelyObese: { ko: '고도비만', en: 'Extremely Obese', ja: '高度肥満' },
    underweightDesc: { ko: '체중이 부족합니다. 균형 잡힌 식단으로 건강한 체중을 유지하세요.', en: 'You are underweight. Maintain a healthy weight with a balanced diet.', ja: '体重が不足しています。バランスの取れた食事で健康的な体重を維持してください。' },
    normalDesc: { ko: '건강한 체중입니다. 현재 상태를 유지하세요!', en: 'You have a healthy weight. Keep it up!', ja: '健康的な体重です。この状態を維持しましょう！' },
    overweightDesc: { ko: '비만 전 단계입니다. 식이조절과 운동을 권장합니다.', en: 'Pre-obesity stage. Diet and exercise recommended.', ja: '肥満予備軍です。食事制限と運動をお勧めします。' },
    obese1Desc: { ko: '건강 관리가 필요합니다. 전문가 상담을 권장합니다.', en: 'Health management needed. Professional consultation recommended.', ja: '健康管理が必要です。専門家への相談をお勧めします。' },
    obese2Desc: { ko: '건강 위험이 높습니다. 의료 전문가와 상담하세요.', en: 'High health risk. Consult a medical professional.', ja: '健康リスクが高いです。医療専門家にご相談ください。' },
    extremelyObeseDesc: { ko: '심각한 건강 위험이 있습니다. 즉시 의료 상담이 필요합니다.', en: 'Serious health risk. Immediate medical consultation needed.', ja: '深刻な健康リスクがあります。直ちに医療相談が必要です。' },
    bmiTable: { ko: 'BMI 기준표 (아시아-태평양 기준)', en: 'BMI Reference (Asia-Pacific)', ja: 'BMI基準表（アジア太平洋基準）' },
    disclaimer: { ko: 'BMI는 참고용 지표입니다. 정확한 건강 상태는 전문가와 상담하세요.', en: 'BMI is for reference only. Consult a professional for accurate health status.', ja: 'BMIは参考指標です。正確な健康状態は専門家にご相談ください。' },
    lessThan: { ko: '미만', en: 'under', ja: '未満' },
    orMore: { ko: '이상', en: 'or more', ja: '以上' },
  },

  // Timestamp Converter
  timestamp: {
    title: { ko: '타임스탬프 변환기', en: 'Timestamp Converter', ja: 'タイムスタンプ変換器' },
    description: { ko: 'Unix 타임스탬프 변환', en: 'Convert Unix timestamps', ja: 'Unixタイムスタンプを変換' },
    currentTimestamp: { ko: '현재 Unix Timestamp', en: 'Current Unix Timestamp', ja: '現在のUnixタイムスタンプ' },
    copyAndUse: { ko: '복사 & 사용', en: 'Copy & Use', ja: 'コピー＆使用' },
    seconds: { ko: '초 (Seconds)', en: 'Seconds', ja: '秒 (Seconds)' },
    milliseconds: { ko: '밀리초 (Milliseconds)', en: 'Milliseconds', ja: 'ミリ秒 (Milliseconds)' },
    timestampToDate: { ko: 'Timestamp → 날짜', en: 'Timestamp → Date', ja: 'タイムスタンプ → 日付' },
    dateToTimestamp: { ko: '날짜 → Timestamp', en: 'Date → Timestamp', ja: '日付 → タイムスタンプ' },
    localTime: { ko: '로컬 시간', en: 'Local Time', ja: 'ローカル時間' },
    relativeTime: { ko: '상대 시간', en: 'Relative Time', ja: '相対時間' },
    commonTimestamps: { ko: '자주 사용하는 시간', en: 'Common Timestamps', ja: 'よく使う時間' },
    inOneHour: { ko: '1시간 후', en: 'In 1 hour', ja: '1時間後' },
    tomorrow: { ko: '내일', en: 'Tomorrow', ja: '明日' },
    inOneWeek: { ko: '1주일 후', en: 'In 1 week', ja: '1週間後' },
    inOneMonth: { ko: '1개월 후', en: 'In 1 month', ja: '1ヶ月後' },
    whatIsTimestamp: { ko: 'Unix Timestamp란?', en: 'What is Unix Timestamp?', ja: 'Unixタイムスタンプとは？' },
    timestampExplanation: { ko: '1970년 1월 1일 00:00:00 UTC부터 경과한 시간을 초(또는 밀리초)로 표현한 값입니다. 프로그래밍에서 시간을 다룰 때 널리 사용됩니다.', en: 'A value representing the time elapsed since January 1, 1970 00:00:00 UTC in seconds (or milliseconds). Widely used in programming for handling time.', ja: '1970年1月1日 00:00:00 UTCからの経過時間を秒（またはミリ秒）で表した値です。プログラミングで時間を扱う際に広く使用されています。' },
    ago: { ko: '전', en: 'ago', ja: '前' },
    later: { ko: '후', en: 'later', ja: '後' },
    yearsAgo: { ko: '년', en: ' year(s)', ja: '年' },
    monthsAgo: { ko: '개월', en: ' month(s)', ja: 'ヶ月' },
    daysAgo: { ko: '일', en: ' day(s)', ja: '日' },
    hoursAgo: { ko: '시간', en: ' hour(s)', ja: '時間' },
    minutesAgo: { ko: '분', en: ' minute(s)', ja: '分' },
    secondsAgo: { ko: '초', en: ' second(s)', ja: '秒' },
  },

  // D-Day Calculator
  dday: {
    title: { ko: 'D-Day 계산기', en: 'D-Day Calculator', ja: 'D-Day計算機' },
    description: { ko: '특정 날짜까지 남은 일수 계산', en: 'Calculate days until a specific date', ja: '特定の日付までの日数を計算' },
    targetDate: { ko: '목표 날짜', en: 'Target Date', ja: '目標日' },
    eventName: { ko: '이벤트 이름 (선택)', en: 'Event Name (Optional)', ja: 'イベント名（任意）' },
    daysRemaining: { ko: '남은 일수', en: 'Days Remaining', ja: '残り日数' },
    daysPassed: { ko: '지난 일수', en: 'Days Passed', ja: '経過日数' },
    today: { ko: '오늘', en: 'Today', ja: '今日' },
    addEvent: { ko: '이벤트 추가', en: 'Add Event', ja: 'イベント追加' },
    savedEvents: { ko: '저장된 이벤트', en: 'Saved Events', ja: '保存されたイベント' },
    noEvents: { ko: '저장된 이벤트가 없습니다', en: 'No saved events', ja: '保存されたイベントがありません' },
  },

  // Discount Calculator
  discount: {
    title: { ko: '할인 계산기', en: 'Discount Calculator', ja: '割引計算機' },
    description: { ko: '할인 금액 및 최종 가격 계산', en: 'Calculate discount amount and final price', ja: '割引額と最終価格を計算' },
    originalPrice: { ko: '원래 가격', en: 'Original Price', ja: '元の価格' },
    discountRate: { ko: '할인율 (%)', en: 'Discount Rate (%)', ja: '割引率 (%)' },
    discountAmount: { ko: '할인 금액', en: 'Discount Amount', ja: '割引額' },
    finalPrice: { ko: '최종 가격', en: 'Final Price', ja: '最終価格' },
    youSave: { ko: '절약 금액', en: 'You Save', ja: '節約額' },
  },

  // Dutch Pay Calculator
  dutchPay: {
    title: { ko: '더치페이 계산기', en: 'Split Bill Calculator', ja: '割り勘計算機' },
    description: { ko: '총 금액을 인원수로 나누기', en: 'Split total amount by number of people', ja: '合計金額を人数で分割' },
    totalAmount: { ko: '총 금액', en: 'Total Amount', ja: '合計金額' },
    numberOfPeople: { ko: '인원 수', en: 'Number of People', ja: '人数' },
    perPerson: { ko: '1인당 금액', en: 'Per Person', ja: '一人当たり' },
    remainder: { ko: '나머지', en: 'Remainder', ja: '余り' },
    addExtra: { ko: '추가 금액', en: 'Additional Amount', ja: '追加金額' },
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

  // App Store Screenshot Resizer
  appStoreScreenshot: {
    title: {
      ko: '앱스토어 스크린샷 리사이저',
      en: 'App Store Screenshot Resizer',
      ja: 'App Storeスクリーンショットリサイザー'
    },
    description: {
      ko: '무료 iOS 앱스토어 스크린샷 크기 조절',
      en: 'Free iOS App Store screenshot resizer',
      ja: '無料iOS App Storeスクリーンショットリサイザー'
    },
    dropzone: {
      ko: '이미지를 드래그하거나 클릭하여 업로드 (최대 10장)',
      en: 'Drag or click to upload images (max 10)',
      ja: '画像をドラッグまたはクリック (最大10枚)'
    },
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
} as const;

export type ToolTranslationKey = keyof typeof toolTranslations;
