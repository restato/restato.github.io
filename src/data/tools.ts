// Centralized tools configuration with SEO-optimized content
export type Language = 'ko' | 'en' | 'ja';

export interface ToolSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface ToolConfig {
  slug: string;
  icon: string;
  category: string;
  component: string;
  seo: Record<Language, ToolSEO>;
}

// SEO keywords templates
const seoKeywords = {
  ko: ['무료', '온라인', '간편한', '빠른', '무설치', '웹'],
  en: ['free', 'online', 'simple', 'fast', 'no installation', 'web'],
  ja: ['無料', 'オンライン', 'シンプル', '高速', 'インストール不要', 'ウェブ'],
};

export const toolsConfig: ToolConfig[] = [
  // Generators
  {
    slug: 'qr-code',
    icon: '📱',
    category: 'generators',
    component: 'QRCodeGenerator',
    seo: {
      ko: {
        title: 'QR 코드 생성기 - 무료 온라인 QR 코드 만들기',
        description: '무료 온라인 QR 코드 생성기. URL, 텍스트를 QR 코드로 간편하게 변환. 무설치, 회원가입 불필요.',
        keywords: ['qr코드', 'qr코드 생성', 'qr코드 만들기', ...seoKeywords.ko],
      },
      en: {
        title: 'QR Code Generator - Free Online QR Code Maker',
        description: 'Free online QR code generator. Easily convert URL and text to QR code. No installation, no signup required.',
        keywords: ['qr code', 'qr code generator', 'qr code maker', ...seoKeywords.en],
      },
      ja: {
        title: 'QRコード生成器 - 無料オンラインQRコード作成',
        description: '無料オンラインQRコード生成器。URL、テキストを簡単にQRコードに変換。インストール不要、会員登録不要。',
        keywords: ['qrコード', 'qrコード生成', 'qrコード作成', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'password',
    icon: '🔐',
    category: 'generators',
    component: 'PasswordGenerator',
    seo: {
      ko: {
        title: '비밀번호 생성기 - 무료 안전한 비밀번호 만들기',
        description: '무료 온라인 비밀번호 생성기. 안전하고 강력한 비밀번호를 간편하게 생성. 무설치, 데이터 저장 없음.',
        keywords: ['비밀번호', '비밀번호 생성', '패스워드', '보안', ...seoKeywords.ko],
      },
      en: {
        title: 'Password Generator - Free Secure Password Maker',
        description: 'Free online password generator. Create strong and secure passwords easily. No installation, no data stored.',
        keywords: ['password', 'password generator', 'secure password', 'security', ...seoKeywords.en],
      },
      ja: {
        title: 'パスワード生成器 - 無料で安全なパスワード作成',
        description: '無料オンラインパスワード生成器。安全で強力なパスワードを簡単に生成。インストール不要、データ保存なし。',
        keywords: ['パスワード', 'パスワード生成', 'セキュリティ', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'uuid',
    icon: '🔑',
    category: 'generators',
    component: 'UuidGenerator',
    seo: {
      ko: {
        title: 'UUID 생성기 - 무료 온라인 UUID v4 생성',
        description: '무료 온라인 UUID 생성기. UUID v4를 간편하게 생성하고 복사. 개발자를 위한 무료 도구.',
        keywords: ['uuid', 'uuid 생성', 'uuid v4', '개발자 도구', ...seoKeywords.ko],
      },
      en: {
        title: 'UUID Generator - Free Online UUID v4 Generator',
        description: 'Free online UUID generator. Easily generate and copy UUID v4. Free tool for developers.',
        keywords: ['uuid', 'uuid generator', 'uuid v4', 'developer tool', ...seoKeywords.en],
      },
      ja: {
        title: 'UUID生成器 - 無料オンラインUUID v4生成',
        description: '無料オンラインUUID生成器。UUID v4を簡単に生成してコピー。開発者向けの無料ツール。',
        keywords: ['uuid', 'uuid生成', 'uuid v4', '開発者ツール', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'lorem-ipsum',
    icon: '📝',
    category: 'generators',
    component: 'LoremIpsumGenerator',
    seo: {
      ko: {
        title: 'Lorem Ipsum 생성기 - 무료 더미 텍스트 생성',
        description: '무료 온라인 Lorem Ipsum 생성기. 더미 텍스트를 간편하게 생성. 디자이너, 개발자를 위한 무료 도구.',
        keywords: ['lorem ipsum', '더미 텍스트', '로렘 입숨', ...seoKeywords.ko],
      },
      en: {
        title: 'Lorem Ipsum Generator - Free Dummy Text Generator',
        description: 'Free online Lorem Ipsum generator. Easily generate dummy text. Free tool for designers and developers.',
        keywords: ['lorem ipsum', 'dummy text', 'placeholder text', ...seoKeywords.en],
      },
      ja: {
        title: 'Lorem Ipsum生成器 - 無料ダミーテキスト生成',
        description: '無料オンラインLorem Ipsum生成器。ダミーテキストを簡単に生成。デザイナー、開発者向けの無料ツール。',
        keywords: ['lorem ipsum', 'ダミーテキスト', 'プレースホルダー', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'color-palette',
    icon: '🎨',
    category: 'generators',
    component: 'ColorPalette',
    seo: {
      ko: {
        title: '색상 팔레트 생성기 - 무료 컬러 팔레트 만들기',
        description: '무료 온라인 색상 팔레트 생성기. 조화로운 컬러 팔레트를 간편하게 생성. 디자이너를 위한 무료 도구.',
        keywords: ['색상 팔레트', '컬러 팔레트', '색상 조합', ...seoKeywords.ko],
      },
      en: {
        title: 'Color Palette Generator - Free Color Scheme Maker',
        description: 'Free online color palette generator. Easily create harmonious color schemes. Free tool for designers.',
        keywords: ['color palette', 'color scheme', 'color generator', ...seoKeywords.en],
      },
      ja: {
        title: 'カラーパレット生成器 - 無料色の組み合わせ作成',
        description: '無料オンラインカラーパレット生成器。調和の取れた色の組み合わせを簡単に生成。デザイナー向けの無料ツール。',
        keywords: ['カラーパレット', '色の組み合わせ', '配色', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'hash',
    icon: '#️⃣',
    category: 'generators',
    component: 'HashGenerator',
    seo: {
      ko: {
        title: '해시 생성기 - 무료 MD5, SHA-256 해시 변환',
        description: '무료 온라인 해시 생성기. MD5, SHA-1, SHA-256 해시를 간편하게 생성. 개발자를 위한 무료 도구.',
        keywords: ['해시', 'md5', 'sha256', 'sha-1', '해시 생성', ...seoKeywords.ko],
      },
      en: {
        title: 'Hash Generator - Free MD5, SHA-256 Hash Tool',
        description: 'Free online hash generator. Easily generate MD5, SHA-1, SHA-256 hashes. Free tool for developers.',
        keywords: ['hash', 'md5', 'sha256', 'sha-1', 'hash generator', ...seoKeywords.en],
      },
      ja: {
        title: 'ハッシュ生成器 - 無料MD5, SHA-256ハッシュ変換',
        description: '無料オンラインハッシュ生成器。MD5, SHA-1, SHA-256ハッシュを簡単に生成。開発者向けの無料ツール。',
        keywords: ['ハッシュ', 'md5', 'sha256', 'sha-1', 'ハッシュ生成', ...seoKeywords.ja],
      },
    },
  },
  // Converters
  {
    slug: 'color',
    icon: '🌈',
    category: 'converters',
    component: 'ColorConverter',
    seo: {
      ko: {
        title: '색상 변환기 - 무료 HEX, RGB, HSL 변환',
        description: '무료 온라인 색상 변환기. HEX, RGB, HSL 색상 코드를 간편하게 변환. 디자이너를 위한 무료 도구.',
        keywords: ['색상 변환', 'hex', 'rgb', 'hsl', '컬러 코드', ...seoKeywords.ko],
      },
      en: {
        title: 'Color Converter - Free HEX, RGB, HSL Converter',
        description: 'Free online color converter. Easily convert HEX, RGB, HSL color codes. Free tool for designers.',
        keywords: ['color converter', 'hex', 'rgb', 'hsl', 'color code', ...seoKeywords.en],
      },
      ja: {
        title: 'カラー変換器 - 無料HEX, RGB, HSL変換',
        description: '無料オンラインカラー変換器。HEX, RGB, HSLカラーコードを簡単に変換。デザイナー向けの無料ツール。',
        keywords: ['カラー変換', 'hex', 'rgb', 'hsl', 'カラーコード', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'unit',
    icon: '📏',
    category: 'converters',
    component: 'UnitConverter',
    seo: {
      ko: {
        title: '단위 변환기 - 무료 길이, 무게, 온도 변환',
        description: '무료 온라인 단위 변환기. 길이, 무게, 온도 등 다양한 단위를 간편하게 변환. 무설치, 무료.',
        keywords: ['단위 변환', '길이 변환', '무게 변환', '온도 변환', ...seoKeywords.ko],
      },
      en: {
        title: 'Unit Converter - Free Length, Weight, Temperature Converter',
        description: 'Free online unit converter. Easily convert length, weight, temperature and more. No installation, free.',
        keywords: ['unit converter', 'length converter', 'weight converter', 'temperature converter', ...seoKeywords.en],
      },
      ja: {
        title: '単位変換器 - 無料長さ、重さ、温度変換',
        description: '無料オンライン単位変換器。長さ、重さ、温度などを簡単に変換。インストール不要、無料。',
        keywords: ['単位変換', '長さ変換', '重さ変換', '温度変換', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'base64',
    icon: '🔄',
    category: 'converters',
    component: 'Base64Tool',
    seo: {
      ko: {
        title: 'Base64 인코더/디코더 - 무료 Base64 변환',
        description: '무료 온라인 Base64 인코더/디코더. 텍스트를 Base64로 간편하게 인코딩/디코딩. 개발자를 위한 무료 도구.',
        keywords: ['base64', 'base64 인코딩', 'base64 디코딩', '인코더', '디코더', ...seoKeywords.ko],
      },
      en: {
        title: 'Base64 Encoder/Decoder - Free Base64 Converter',
        description: 'Free online Base64 encoder/decoder. Easily encode and decode Base64. Free tool for developers.',
        keywords: ['base64', 'base64 encoder', 'base64 decoder', 'encoder', 'decoder', ...seoKeywords.en],
      },
      ja: {
        title: 'Base64エンコーダー/デコーダー - 無料Base64変換',
        description: '無料オンラインBase64エンコーダー/デコーダー。テキストをBase64で簡単にエンコード/デコード。開発者向けの無料ツール。',
        keywords: ['base64', 'base64エンコード', 'base64デコード', 'エンコーダー', 'デコーダー', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'image-converter',
    icon: '🖼️',
    category: 'image',
    component: 'ImageConverter',
    seo: {
      ko: {
        title: '이미지 포맷 변환기 - 무료 JPEG, PNG, WebP 변환',
        description: '무료 온라인 이미지 포맷 변환기. JPEG, PNG, WebP 포맷을 간편하게 변환. 무설치, 무료.',
        keywords: ['이미지 변환', 'jpeg', 'png', 'webp', '이미지 포맷', ...seoKeywords.ko],
      },
      en: {
        title: 'Image Format Converter - Free JPEG, PNG, WebP Converter',
        description: 'Free online image format converter. Easily convert between JPEG, PNG, WebP. No installation, free.',
        keywords: ['image converter', 'jpeg', 'png', 'webp', 'image format', ...seoKeywords.en],
      },
      ja: {
        title: '画像フォーマット変換器 - 無料JPEG, PNG, WebP変換',
        description: '無料オンライン画像フォーマット変換器。JPEG, PNG, WebP形式を簡単に変換。インストール不要、無料。',
        keywords: ['画像変換', 'jpeg', 'png', 'webp', '画像フォーマット', ...seoKeywords.ja],
      },
    },
  },
  // Text
  {
    slug: 'text-counter',
    icon: '🔢',
    category: 'text',
    component: 'TextCounter',
    seo: {
      ko: {
        title: '글자수 세기 - 무료 텍스트 카운터',
        description: '무료 온라인 글자수 세기 도구. 글자수, 단어수, 줄수를 간편하게 카운트. 무설치, 무료.',
        keywords: ['글자수', '글자수 세기', '텍스트 카운터', '단어수', ...seoKeywords.ko],
      },
      en: {
        title: 'Character Counter - Free Text Counter Tool',
        description: 'Free online character counter. Easily count characters, words, and lines. No installation, free.',
        keywords: ['character counter', 'word counter', 'text counter', 'line counter', ...seoKeywords.en],
      },
      ja: {
        title: '文字数カウント - 無料テキストカウンター',
        description: '無料オンライン文字数カウントツール。文字数、単語数、行数を簡単にカウント。インストール不要、無料。',
        keywords: ['文字数', '文字数カウント', 'テキストカウンター', '単語数', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'markdown',
    icon: '📄',
    category: 'text',
    component: 'MarkdownPreview',
    seo: {
      ko: {
        title: '마크다운 미리보기 - 무료 마크다운 에디터',
        description: '무료 온라인 마크다운 미리보기. 마크다운 문서를 실시간으로 미리보기. 개발자를 위한 무료 도구.',
        keywords: ['마크다운', 'markdown', '마크다운 미리보기', '마크다운 에디터', ...seoKeywords.ko],
      },
      en: {
        title: 'Markdown Preview - Free Markdown Editor',
        description: 'Free online markdown preview. Preview markdown documents in real-time. Free tool for developers.',
        keywords: ['markdown', 'markdown preview', 'markdown editor', 'md editor', ...seoKeywords.en],
      },
      ja: {
        title: 'マークダウンプレビュー - 無料マークダウンエディタ',
        description: '無料オンラインマークダウンプレビュー。マークダウン文書をリアルタイムでプレビュー。開発者向けの無料ツール。',
        keywords: ['マークダウン', 'markdown', 'マークダウンプレビュー', 'マークダウンエディタ', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'diff',
    icon: '📊',
    category: 'developer',
    component: 'DiffTool',
    seo: {
      ko: {
        title: '텍스트 비교 (Diff) - 무료 텍스트 비교 도구',
        description: '무료 온라인 텍스트 비교 도구. 두 텍스트의 차이점을 간편하게 비교. 개발자를 위한 무료 도구.',
        keywords: ['텍스트 비교', 'diff', '비교 도구', '차이점', ...seoKeywords.ko],
      },
      en: {
        title: 'Text Diff Tool - Free Text Comparison',
        description: 'Free online text diff tool. Easily compare differences between two texts. Free tool for developers.',
        keywords: ['text diff', 'diff tool', 'text comparison', 'compare text', ...seoKeywords.en],
      },
      ja: {
        title: 'テキスト比較 (Diff) - 無料テキスト比較ツール',
        description: '無料オンラインテキスト比較ツール。2つのテキストの違いを簡単に比較。開発者向けの無料ツール。',
        keywords: ['テキスト比較', 'diff', '比較ツール', '差分', ...seoKeywords.ja],
      },
    },
  },
  // Developer
  {
    slug: 'json',
    icon: '{ }',
    category: 'developer',
    component: 'JsonFormatter',
    seo: {
      ko: {
        title: 'JSON 포매터 - 무료 JSON 뷰어 & 검증',
        description: '무료 온라인 JSON 포매터. JSON을 간편하게 포매팅하고 검증. 들여쓰기, 압축, 문법 검사 지원.',
        keywords: ['json', 'json 포매터', 'json 뷰어', 'json 검증', ...seoKeywords.ko],
      },
      en: {
        title: 'JSON Formatter - Free JSON Viewer & Validator',
        description: 'Free online JSON formatter. Easily format and validate JSON. Supports indentation, minification, and syntax checking.',
        keywords: ['json', 'json formatter', 'json viewer', 'json validator', ...seoKeywords.en],
      },
      ja: {
        title: 'JSONフォーマッター - 無料JSONビューアー & 検証',
        description: '無料オンラインJSONフォーマッター。JSONを簡単にフォーマットして検証。インデント、圧縮、構文チェックをサポート。',
        keywords: ['json', 'jsonフォーマッター', 'jsonビューアー', 'json検証', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'regex',
    icon: '🔍',
    category: 'developer',
    component: 'RegexTester',
    seo: {
      ko: {
        title: '정규식 테스터 - 무료 정규표현식 테스트',
        description: '무료 온라인 정규식 테스터. 정규표현식을 간편하게 테스트하고 매치 확인. 개발자를 위한 무료 도구.',
        keywords: ['정규식', '정규표현식', 'regex', '정규식 테스트', ...seoKeywords.ko],
      },
      en: {
        title: 'Regex Tester - Free Regular Expression Tester',
        description: 'Free online regex tester. Easily test regular expressions and check matches. Free tool for developers.',
        keywords: ['regex', 'regular expression', 'regex tester', 'pattern matching', ...seoKeywords.en],
      },
      ja: {
        title: '正規表現テスター - 無料正規表現テスト',
        description: '無料オンライン正規表現テスター。正規表現を簡単にテストしてマッチを確認。開発者向けの無料ツール。',
        keywords: ['正規表現', 'regex', '正規表現テスト', 'パターンマッチング', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'url-encoder',
    icon: '🔗',
    category: 'developer',
    component: 'UrlEncoder',
    seo: {
      ko: {
        title: 'URL 인코더/디코더 - 무료 URL 인코딩',
        description: '무료 온라인 URL 인코더/디코더. URL 문자열을 간편하게 인코딩/디코딩. 개발자를 위한 무료 도구.',
        keywords: ['url 인코딩', 'url 디코딩', 'url 인코더', 'url 디코더', ...seoKeywords.ko],
      },
      en: {
        title: 'URL Encoder/Decoder - Free URL Encoding Tool',
        description: 'Free online URL encoder/decoder. Easily encode and decode URL strings. Free tool for developers.',
        keywords: ['url encoder', 'url decoder', 'url encoding', 'url decoding', ...seoKeywords.en],
      },
      ja: {
        title: 'URLエンコーダー/デコーダー - 無料URLエンコード',
        description: '無料オンラインURLエンコーダー/デコーダー。URL文字列を簡単にエンコード/デコード。開発者向けの無料ツール。',
        keywords: ['urlエンコード', 'urlデコード', 'urlエンコーダー', 'urlデコーダー', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'jwt-decoder',
    icon: '🎫',
    category: 'developer',
    component: 'JwtDecoder',
    seo: {
      ko: {
        title: 'JWT 디코더 - 무료 JWT 토큰 분석',
        description: '무료 온라인 JWT 디코더. JWT 토큰을 간편하게 디코딩하고 분석. 개발자를 위한 무료 도구.',
        keywords: ['jwt', 'jwt 디코더', 'jwt 토큰', 'jwt 분석', ...seoKeywords.ko],
      },
      en: {
        title: 'JWT Decoder - Free JWT Token Analyzer',
        description: 'Free online JWT decoder. Easily decode and analyze JWT tokens. Free tool for developers.',
        keywords: ['jwt', 'jwt decoder', 'jwt token', 'jwt analyzer', ...seoKeywords.en],
      },
      ja: {
        title: 'JWTデコーダー - 無料JWTトークン分析',
        description: '無料オンラインJWTデコーダー。JWTトークンを簡単にデコードして分析。開発者向けの無料ツール。',
        keywords: ['jwt', 'jwtデコーダー', 'jwtトークン', 'jwt分析', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'cron',
    icon: '⏰',
    category: 'developer',
    component: 'CronGenerator',
    seo: {
      ko: {
        title: 'Cron 표현식 생성기 - 무료 크론 스케줄러',
        description: '무료 온라인 Cron 표현식 생성기. Cron 표현식을 간편하게 생성하고 설명 확인. 개발자를 위한 무료 도구.',
        keywords: ['cron', 'cron 표현식', '크론', '스케줄러', ...seoKeywords.ko],
      },
      en: {
        title: 'Cron Expression Generator - Free Cron Scheduler',
        description: 'Free online Cron expression generator. Easily generate and explain cron expressions. Free tool for developers.',
        keywords: ['cron', 'cron expression', 'cron generator', 'scheduler', ...seoKeywords.en],
      },
      ja: {
        title: 'Cron式ジェネレーター - 無料クロンスケジューラー',
        description: '無料オンラインCron式ジェネレーター。Cron式を簡単に生成して説明を確認。開発者向けの無料ツール。',
        keywords: ['cron', 'cron式', 'クロン', 'スケジューラー', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'timestamp',
    icon: '⏱️',
    category: 'developer',
    component: 'TimestampConverter',
    seo: {
      ko: {
        title: 'Unix Timestamp 변환기 - 무료 타임스탬프 변환',
        description: '무료 온라인 Unix Timestamp 변환기. Timestamp와 날짜를 간편하게 상호 변환. 개발자를 위한 무료 도구.',
        keywords: ['timestamp', '타임스탬프', 'unix timestamp', '날짜 변환', ...seoKeywords.ko],
      },
      en: {
        title: 'Unix Timestamp Converter - Free Timestamp Tool',
        description: 'Free online Unix timestamp converter. Easily convert between timestamp and date. Free tool for developers.',
        keywords: ['timestamp', 'unix timestamp', 'timestamp converter', 'date converter', ...seoKeywords.en],
      },
      ja: {
        title: 'Unixタイムスタンプ変換器 - 無料タイムスタンプツール',
        description: '無料オンラインUnixタイムスタンプ変換器。タイムスタンプと日付を簡単に相互変換。開発者向けの無料ツール。',
        keywords: ['タイムスタンプ', 'unixタイムスタンプ', 'タイムスタンプ変換', '日付変換', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'llm-cost',
    icon: '🤖',
    category: 'developer',
    component: 'LlmCostCalculator',
    seo: {
      ko: {
        title: 'LLM 비용 계산기 - 무료 AI API 비용 계산',
        description: '무료 온라인 LLM 비용 계산기. ChatGPT, Claude 등 AI 모델의 API 비용을 간편하게 계산.',
        keywords: ['llm', 'ai', 'chatgpt', 'claude', 'api 비용', ...seoKeywords.ko],
      },
      en: {
        title: 'LLM Cost Calculator - Free AI API Cost Calculator',
        description: 'Free online LLM cost calculator. Easily calculate API costs for ChatGPT, Claude and other AI models.',
        keywords: ['llm', 'ai', 'chatgpt', 'claude', 'api cost', ...seoKeywords.en],
      },
      ja: {
        title: 'LLMコスト計算機 - 無料AI APIコスト計算',
        description: '無料オンラインLLMコスト計算機。ChatGPT、ClaudeなどのAIモデルのAPIコストを簡単に計算。',
        keywords: ['llm', 'ai', 'chatgpt', 'claude', 'apiコスト', ...seoKeywords.ja],
      },
    },
  },
  // Designer
  {
    slug: 'gradient',
    icon: '🌈',
    category: 'designer',
    component: 'GradientGenerator',
    seo: {
      ko: {
        title: 'CSS 그라데이션 생성기 - 무료 그라데이션 만들기',
        description: '무료 온라인 CSS 그라데이션 생성기. CSS 그라데이션을 시각적으로 간편하게 생성. 디자이너를 위한 무료 도구.',
        keywords: ['css 그라데이션', 'gradient', '그라데이션 생성', 'css', ...seoKeywords.ko],
      },
      en: {
        title: 'CSS Gradient Generator - Free Gradient Maker',
        description: 'Free online CSS gradient generator. Visually create CSS gradients easily. Free tool for designers.',
        keywords: ['css gradient', 'gradient generator', 'gradient maker', 'css', ...seoKeywords.en],
      },
      ja: {
        title: 'CSSグラデーション生成器 - 無料グラデーション作成',
        description: '無料オンラインCSSグラデーション生成器。CSSグラデーションを視覚的に簡単に作成。デザイナー向けの無料ツール。',
        keywords: ['cssグラデーション', 'gradient', 'グラデーション生成', 'css', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'box-shadow',
    icon: '🎭',
    category: 'designer',
    component: 'BoxShadowGenerator',
    seo: {
      ko: {
        title: 'CSS Box Shadow 생성기 - 무료 그림자 효과',
        description: '무료 온라인 CSS box-shadow 생성기. 그림자 효과를 시각적으로 간편하게 생성. 디자이너를 위한 무료 도구.',
        keywords: ['box shadow', 'css shadow', '그림자', 'css', ...seoKeywords.ko],
      },
      en: {
        title: 'CSS Box Shadow Generator - Free Shadow Effect',
        description: 'Free online CSS box-shadow generator. Visually create shadow effects easily. Free tool for designers.',
        keywords: ['box shadow', 'css shadow', 'shadow generator', 'css', ...seoKeywords.en],
      },
      ja: {
        title: 'CSSボックスシャドウ生成器 - 無料シャドウ効果',
        description: '無料オンラインCSSボックスシャドウ生成器。シャドウ効果を視覚的に簡単に作成。デザイナー向けの無料ツール。',
        keywords: ['ボックスシャドウ', 'cssシャドウ', 'シャドウ生成', 'css', ...seoKeywords.ja],
      },
    },
  },
  // Image
  {
    slug: 'image-resizer',
    icon: '📐',
    category: 'image',
    component: 'ImageResizer',
    seo: {
      ko: {
        title: '이미지 리사이저 - 무료 이미지 크롭 & 프리셋 변환',
        description: '무료 온라인 이미지 리사이저. 실시간 크롭, 해상도 조절, Slack/YouTube/iPhone 프리셋 변환을 한 번에 처리. 무설치, 무료.',
        keywords: ['이미지 리사이즈', '이미지 크롭', '프리셋 리사이즈', '슬랙 이미지', '유튜브 썸네일', ...seoKeywords.ko],
      },
      en: {
        title: 'Image Resizer - Free Crop & Preset Resize Tool',
        description: 'Free online image resizer with live crop and preset sizes for Slack, YouTube thumbnails, iPhone App Store, and more.',
        keywords: ['image resizer', 'image crop', 'preset resize', 'slack image', 'youtube thumbnail', ...seoKeywords.en],
      },
      ja: {
        title: '画像リサイザー - 無料クロップ & プリセット変換',
        description: '無料オンライン画像リサイザー。リアルタイムクロップ、解像度調整、Slack/YouTube/iPhoneプリセット変換に対応。',
        keywords: ['画像リサイズ', '画像クロップ', 'プリセットリサイズ', 'slack画像', 'youtubeサムネイル', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'exif',
    icon: '📷',
    category: 'image',
    component: 'ExifViewer',
    seo: {
      ko: {
        title: 'EXIF 정보 뷰어 - 무료 사진 메타데이터 확인',
        description: '무료 온라인 EXIF 정보 뷰어. 사진의 촬영 정보, GPS 위치, 카메라 설정을 간편하게 확인.',
        keywords: ['exif', '사진 정보', '메타데이터', '카메라 정보', ...seoKeywords.ko],
      },
      en: {
        title: 'EXIF Viewer - Free Photo Metadata Viewer',
        description: 'Free online EXIF viewer. Easily view photo shooting info, GPS location, and camera settings.',
        keywords: ['exif', 'photo info', 'metadata', 'camera info', ...seoKeywords.en],
      },
      ja: {
        title: 'EXIF情報ビューアー - 無料写真メタデータ確認',
        description: '無料オンラインEXIF情報ビューアー。写真の撮影情報、GPS位置、カメラ設定を簡単に確認。',
        keywords: ['exif', '写真情報', 'メタデータ', 'カメラ情報', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'background-remover',
    icon: '✂️',
    category: 'image',
    component: 'BackgroundRemover',
    seo: {
      ko: {
        title: '배경 제거기 (누끼) - 무료 이미지 배경 제거',
        description: '무료 온라인 배경 제거기. 이미지에서 배경을 AI로 자동 제거. 누끼 따기, 무설치, 무료.',
        keywords: ['배경 제거', '누끼', '이미지 배경', 'ai 배경 제거', ...seoKeywords.ko],
      },
      en: {
        title: 'Background Remover - Free Image Background Removal',
        description: 'Free online background remover. Automatically remove image background with AI. No installation, free.',
        keywords: ['background remover', 'remove background', 'image background', 'ai background removal', ...seoKeywords.en],
      },
      ja: {
        title: '背景除去ツール - 無料画像背景削除',
        description: '無料オンライン背景除去ツール。AIで画像の背景を自動的に削除。インストール不要、無料。',
        keywords: ['背景除去', '背景削除', '画像背景', 'ai背景除去', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'image-metadata',
    icon: '🔍',
    category: 'image',
    component: 'ImageMetadataViewer',
    seo: {
      ko: {
        title: '이미지 메타데이터 분석기 - 무료 사진 정보 확인',
        description: '무료 온라인 이미지 메타데이터 분석기. 사진의 촬영 기기, GPS 위치, 설정 정보를 간편하게 확인.',
        keywords: ['이미지 메타데이터', '사진 정보', 'gps 위치', '촬영 정보', ...seoKeywords.ko],
      },
      en: {
        title: 'Image Metadata Viewer - Free Photo Info Analyzer',
        description: 'Free online image metadata viewer. Easily view photo device, GPS location, and camera settings.',
        keywords: ['image metadata', 'photo info', 'gps location', 'camera settings', ...seoKeywords.en],
      },
      ja: {
        title: '画像メタデータビューア - 無料写真情報分析',
        description: '無料オンライン画像メタデータビューア。撮影デバイス、GPS位置、カメラ設定を簡単に確認。',
        keywords: ['画像メタデータ', '写真情報', 'gps位置', 'カメラ設定', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'appstore-screenshot',
    icon: '📱',
    category: 'image',
    component: 'AppStoreScreenshotResizer',
    seo: {
      ko: {
        title: '앱스토어 스크린샷 리사이저 - 무료 iOS 스크린샷 크기 조절',
        description: '무료 온라인 앱스토어 스크린샷 리사이저. 간단하게 iPhone, iPad 앱스토어 규격에 맞게 이미지 크롭 및 리사이즈. 설치 없이 브라우저에서 바로 사용.',
        keywords: ['앱스토어 스크린샷', 'app store screenshot', 'iOS 스크린샷', 'iPhone 스크린샷', 'iPad 스크린샷', '무료', '심플', ...seoKeywords.ko],
      },
      en: {
        title: 'App Store Screenshot Resizer - Free iOS Screenshot Tool',
        description: 'Free online App Store screenshot resizer. Simple & fast way to crop and resize images for iPhone and iPad App Store requirements. No installation, browser-based.',
        keywords: ['app store screenshot', 'iOS screenshot resizer', 'iPhone screenshot size', 'iPad screenshot', 'free', 'simple', ...seoKeywords.en],
      },
      ja: {
        title: 'App Storeスクリーンショットリサイザー - 無料iOS スクリーンショットツール',
        description: '無料オンラインApp Storeスクリーンショットリサイザー。シンプルで素早くiPhoneとiPadのApp Store要件に合わせて画像をクロップ＆リサイズ。インストール不要。',
        keywords: ['app store スクリーンショット', 'iOS スクリーンショット', 'iPhone スクリーンショット サイズ', '無料', 'シンプル', ...seoKeywords.ja],
      },
    },
  },
  // Marketer
  {
    slug: 'utm',
    icon: '📊',
    category: 'marketer',
    component: 'UtmBuilder',
    seo: {
      ko: {
        title: 'UTM 링크 생성기 - 무료 UTM 파라미터 빌더',
        description: '무료 온라인 UTM 링크 생성기. 캠페인 추적용 UTM 링크를 간편하게 생성. 마케터를 위한 무료 도구.',
        keywords: ['utm', 'utm 링크', 'utm 파라미터', '캠페인 추적', ...seoKeywords.ko],
      },
      en: {
        title: 'UTM Link Builder - Free UTM Parameter Generator',
        description: 'Free online UTM link builder. Easily create UTM links for campaign tracking. Free tool for marketers.',
        keywords: ['utm', 'utm link', 'utm parameter', 'campaign tracking', ...seoKeywords.en],
      },
      ja: {
        title: 'UTMリンクビルダー - 無料UTMパラメータ生成',
        description: '無料オンラインUTMリンクビルダー。キャンペーン追跡用UTMリンクを簡単に作成。マーケター向けの無料ツール。',
        keywords: ['utm', 'utmリンク', 'utmパラメータ', 'キャンペーン追跡', ...seoKeywords.ja],
      },
    },
  },
  // Productivity
  {
    slug: 'timer',
    icon: '⏱️',
    category: 'productivity',
    component: 'TimerStopwatch',
    seo: {
      ko: {
        title: '타이머 / 스톱워치 - 무료 온라인 타이머',
        description: '무료 온라인 타이머와 스톱워치. 간편하게 시간 측정. 무설치, 무료.',
        keywords: ['타이머', '스톱워치', '시간 측정', '알람', ...seoKeywords.ko],
      },
      en: {
        title: 'Timer / Stopwatch - Free Online Timer',
        description: 'Free online timer and stopwatch. Easily measure time. No installation, free.',
        keywords: ['timer', 'stopwatch', 'time measurement', 'alarm', ...seoKeywords.en],
      },
      ja: {
        title: 'タイマー / ストップウォッチ - 無料オンラインタイマー',
        description: '無料オンラインタイマーとストップウォッチ。簡単に時間を測定。インストール不要、無料。',
        keywords: ['タイマー', 'ストップウォッチ', '時間測定', 'アラーム', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'pomodoro',
    icon: '🍅',
    category: 'productivity',
    component: 'PomodoroTimer',
    seo: {
      ko: {
        title: '포모도로 타이머 - 무료 집중력 향상 도구',
        description: '무료 온라인 포모도로 타이머. 포모도로 기법으로 생산성 향상. 무설치, 무료.',
        keywords: ['포모도로', 'pomodoro', '집중', '생산성', '시간 관리', ...seoKeywords.ko],
      },
      en: {
        title: 'Pomodoro Timer - Free Focus Enhancement Tool',
        description: 'Free online Pomodoro timer. Boost productivity with Pomodoro technique. No installation, free.',
        keywords: ['pomodoro', 'focus', 'productivity', 'time management', ...seoKeywords.en],
      },
      ja: {
        title: 'ポモドーロタイマー - 無料集中力向上ツール',
        description: '無料オンラインポモドーロタイマー。ポモドーロ・テクニックで生産性向上。インストール不要、無料。',
        keywords: ['ポモドーロ', 'pomodoro', '集中', '生産性', '時間管理', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'world-clock',
    icon: '🌍',
    category: 'productivity',
    component: 'WorldClock',
    seo: {
      ko: {
        title: '세계 시계 - 무료 세계 시간 확인',
        description: '무료 온라인 세계 시계. 전 세계 시간대를 간편하게 확인하고 변환. 무설치, 무료.',
        keywords: ['세계 시계', '세계 시간', '시간대', '타임존', ...seoKeywords.ko],
      },
      en: {
        title: 'World Clock - Free World Time Viewer',
        description: 'Free online world clock. Easily check and convert world time zones. No installation, free.',
        keywords: ['world clock', 'world time', 'time zone', 'timezone', ...seoKeywords.en],
      },
      ja: {
        title: 'ワールドクロック - 無料世界時間確認',
        description: '無料オンラインワールドクロック。世界のタイムゾーンを簡単に確認して変換。インストール不要、無料。',
        keywords: ['ワールドクロック', '世界時間', 'タイムゾーン', '時差', ...seoKeywords.ja],
      },
    },
  },
  // Calculator
  {
    slug: 'percent',
    icon: '%',
    category: 'calculator',
    component: 'PercentCalculator',
    seo: {
      ko: {
        title: '퍼센트 계산기 - 무료 % 계산',
        description: '무료 온라인 퍼센트 계산기. 퍼센트, 증감률, 할인율을 간편하게 계산. 무설치, 무료.',
        keywords: ['퍼센트', '% 계산', '증감률', '할인율', ...seoKeywords.ko],
      },
      en: {
        title: 'Percent Calculator - Free % Calculator',
        description: 'Free online percent calculator. Easily calculate percentages, rates, and discounts. No installation, free.',
        keywords: ['percent', '% calculator', 'percentage', 'rate calculator', ...seoKeywords.en],
      },
      ja: {
        title: 'パーセント計算機 - 無料%計算',
        description: '無料オンラインパーセント計算機。パーセント、増減率、割引率を簡単に計算。インストール不要、無料。',
        keywords: ['パーセント', '%計算', '増減率', '割引率', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'discount',
    icon: '🏷️',
    category: 'calculator',
    component: 'DiscountCalculator',
    seo: {
      ko: {
        title: '할인 계산기 - 무료 할인가 계산',
        description: '무료 온라인 할인 계산기. 할인가와 할인율을 간편하게 계산. 무설치, 무료.',
        keywords: ['할인', '할인 계산', '할인가', '할인율', ...seoKeywords.ko],
      },
      en: {
        title: 'Discount Calculator - Free Sale Price Calculator',
        description: 'Free online discount calculator. Easily calculate discount price and rate. No installation, free.',
        keywords: ['discount', 'discount calculator', 'sale price', 'discount rate', ...seoKeywords.en],
      },
      ja: {
        title: '割引計算機 - 無料割引価格計算',
        description: '無料オンライン割引計算機。割引価格と割引率を簡単に計算。インストール不要、無料。',
        keywords: ['割引', '割引計算', '割引価格', '割引率', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'bmi',
    icon: '⚖️',
    category: 'calculator',
    component: 'BmiCalculator',
    seo: {
      ko: {
        title: 'BMI 계산기 - 무료 체질량 지수 계산',
        description: '무료 온라인 BMI 계산기. 체질량 지수와 적정 체중을 간편하게 계산. 무설치, 무료.',
        keywords: ['bmi', '체질량 지수', '적정 체중', '비만도', ...seoKeywords.ko],
      },
      en: {
        title: 'BMI Calculator - Free Body Mass Index Calculator',
        description: 'Free online BMI calculator. Easily calculate BMI and ideal weight. No installation, free.',
        keywords: ['bmi', 'body mass index', 'ideal weight', 'bmi calculator', ...seoKeywords.en],
      },
      ja: {
        title: 'BMI計算機 - 無料体格指数計算',
        description: '無料オンラインBMI計算機。BMIと適正体重を簡単に計算。インストール不要、無料。',
        keywords: ['bmi', '体格指数', '適正体重', 'bmi計算', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'age',
    icon: '🎂',
    category: 'calculator',
    component: 'AgeCalculator',
    seo: {
      ko: {
        title: '나이 계산기 - 무료 만 나이 계산',
        description: '무료 온라인 나이 계산기. 만 나이, 띠, 별자리를 간편하게 계산. 무설치, 무료.',
        keywords: ['나이 계산', '만 나이', '띠', '별자리', ...seoKeywords.ko],
      },
      en: {
        title: 'Age Calculator - Free Age & Zodiac Calculator',
        description: 'Free online age calculator. Easily calculate age, zodiac signs. No installation, free.',
        keywords: ['age calculator', 'age', 'zodiac', 'birthday', ...seoKeywords.en],
      },
      ja: {
        title: '年齢計算機 - 無料年齢・干支計算',
        description: '無料オンライン年齢計算機。年齢、干支、星座を簡単に計算。インストール不要、無料。',
        keywords: ['年齢計算', '年齢', '干支', '星座', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'dday',
    icon: '📅',
    category: 'calculator',
    component: 'DdayCalculator',
    seo: {
      ko: {
        title: 'D-Day 계산기 - 무료 디데이 계산',
        description: '무료 온라인 D-Day 계산기. 특정 날짜까지 남은 일수를 간편하게 계산. 무설치, 무료.',
        keywords: ['디데이', 'd-day', '날짜 계산', '남은 일수', ...seoKeywords.ko],
      },
      en: {
        title: 'D-Day Calculator - Free Date Counter',
        description: 'Free online D-Day calculator. Easily calculate days until a date. No installation, free.',
        keywords: ['d-day', 'date calculator', 'days until', 'countdown', ...seoKeywords.en],
      },
      ja: {
        title: 'D-Day計算機 - 無料日数カウント',
        description: '無料オンラインD-Day計算機。特定日までの日数を簡単に計算。インストール不要、無料。',
        keywords: ['d-day', '日付計算', '残り日数', 'カウントダウン', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'dutch-pay',
    icon: '💸',
    category: 'calculator',
    component: 'DutchPayCalculator',
    seo: {
      ko: {
        title: '더치페이 계산기 - 무료 N분의 1 정산',
        description: '무료 온라인 더치페이 계산기. N분의 1 정산과 송금액을 간편하게 계산. 무설치, 무료.',
        keywords: ['더치페이', 'n분의1', '정산', '송금', ...seoKeywords.ko],
      },
      en: {
        title: 'Split Bill Calculator - Free Bill Splitter',
        description: 'Free online split bill calculator. Easily split bills and calculate payments. No installation, free.',
        keywords: ['split bill', 'bill splitter', 'dutch pay', 'payment calculator', ...seoKeywords.en],
      },
      ja: {
        title: '割り勘計算機 - 無料割り勘ツール',
        description: '無料オンライン割り勘計算機。割り勘と送金額を簡単に計算。インストール不要、無料。',
        keywords: ['割り勘', '割り勘計算', '送金', '精算', ...seoKeywords.ja],
      },
    },
  },
  // Random
  {
    slug: 'coin-flip',
    icon: '🪙',
    category: 'random',
    component: 'CoinFlip',
    seo: {
      ko: {
        title: '동전 던지기 - 무료 온라인 동전 플립',
        description: '무료 온라인 동전 던지기. 공정한 동전 던지기로 간편하게 결정. 무설치, 무료.',
        keywords: ['동전 던지기', '동전', '앞면 뒷면', '결정', ...seoKeywords.ko],
      },
      en: {
        title: 'Coin Flip - Free Online Coin Toss',
        description: 'Free online coin flip. Make decisions with a fair coin toss. No installation, free.',
        keywords: ['coin flip', 'coin toss', 'heads tails', 'decision maker', ...seoKeywords.en],
      },
      ja: {
        title: 'コイントス - 無料オンラインコイン投げ',
        description: '無料オンラインコイントス。公平なコイン投げで簡単に決定。インストール不要、無料。',
        keywords: ['コイントス', 'コイン', '表裏', '決定', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'dice',
    icon: '🎲',
    category: 'random',
    component: 'DiceRoller',
    seo: {
      ko: {
        title: '주사위 굴리기 - 무료 온라인 주사위',
        description: '무료 온라인 주사위 굴리기. D4부터 D100까지 다양한 주사위. 무설치, 무료.',
        keywords: ['주사위', '주사위 굴리기', 'd6', 'd20', ...seoKeywords.ko],
      },
      en: {
        title: 'Dice Roller - Free Online Dice',
        description: 'Free online dice roller. Roll various dice from D4 to D100. No installation, free.',
        keywords: ['dice', 'dice roller', 'd6', 'd20', 'roll dice', ...seoKeywords.en],
      },
      ja: {
        title: 'サイコロ - 無料オンラインダイスローラー',
        description: '無料オンラインサイコロ。D4からD100まで様々なダイス。インストール不要、無料。',
        keywords: ['サイコロ', 'ダイス', 'd6', 'd20', ...seoKeywords.ja],
      },
    },
  },
  // Text
  {
    slug: 'kor-eng',
    icon: '⌨️',
    category: 'text',
    component: 'KorEngConverter',
    seo: {
      ko: {
        title: '한영 타자 변환기 - 무료 영타 한타 변환',
        description: '무료 온라인 한영 타자 변환기. 영타로 친 한글, 한타로 친 영어를 간편하게 변환.',
        keywords: ['한영 변환', '영타', '한타', '타자 변환', ...seoKeywords.ko],
      },
      en: {
        title: 'Korean-English Converter - Free Keyboard Converter',
        description: 'Free online Korean-English keyboard converter. Easily convert mistyped Korean/English text.',
        keywords: ['korean english', 'keyboard converter', 'typing converter', ...seoKeywords.en],
      },
      ja: {
        title: '韓英タイピング変換 - 無料キーボード変換',
        description: '無料オンライン韓英タイピング変換。誤入力の韓国語/英語を簡単に変換。',
        keywords: ['韓英変換', 'キーボード変換', 'タイピング変換', ...seoKeywords.ja],
      },
    },
  },
];

// Categories configuration
export const categories = [
  { id: 'all', label: { ko: '전체', en: 'All', ja: 'すべて' } },
  { id: 'calculator', label: { ko: '계산기', en: 'Calculator', ja: '計算機' } },
  { id: 'generators', label: { ko: '생성기', en: 'Generators', ja: '生成ツール' } },
  { id: 'converters', label: { ko: '변환기', en: 'Converters', ja: '変換ツール' } },
  { id: 'text', label: { ko: '텍스트', en: 'Text', ja: 'テキスト' } },
  { id: 'developer', label: { ko: '개발자', en: 'Developer', ja: '開発者' } },
  { id: 'designer', label: { ko: '디자이너', en: 'Designer', ja: 'デザイナー' } },
  { id: 'image', label: { ko: '이미지/사진', en: 'Image/Photo', ja: '画像/写真' } },
  { id: 'random', label: { ko: '랜덤/뽑기', en: 'Random/Pick', ja: 'ランダム' } },
  { id: 'marketer', label: { ko: '마케터', en: 'Marketer', ja: 'マーケター' } },
  { id: 'productivity', label: { ko: '생산성', en: 'Productivity', ja: '生産性' } },
];

// Anonymous chat SEO config (special case - not in /tools/)
export const anonymousChatSeo = {
  ko: {
    title: '익명 채팅 - 무료 온라인 1:1 실시간 채팅',
    description: '무료 익명 1:1 실시간 채팅. P2P 연결로 서버에 저장되지 않는 안전한 채팅. 회원가입 불필요.',
    keywords: ['익명 채팅', '1:1 채팅', '실시간 채팅', 'p2p 채팅', ...seoKeywords.ko],
  },
  en: {
    title: 'Anonymous Chat - Free Online 1:1 Real-time Chat',
    description: 'Free anonymous 1:1 real-time chat. Secure P2P connection, nothing stored on servers. No signup required.',
    keywords: ['anonymous chat', '1:1 chat', 'real-time chat', 'p2p chat', ...seoKeywords.en],
  },
  ja: {
    title: '匿名チャット - 無料オンライン1:1リアルタイムチャット',
    description: '無料匿名1:1リアルタイムチャット。P2P接続でサーバーに保存されない安全なチャット。会員登録不要。',
    keywords: ['匿名チャット', '1:1チャット', 'リアルタイムチャット', 'p2pチャット', ...seoKeywords.ja],
  },
};

// Helper function to get tool by slug
export function getToolBySlug(slug: string): ToolConfig | undefined {
  return toolsConfig.find(tool => tool.slug === slug);
}

// Helper function to get all slugs
export function getAllToolSlugs(): string[] {
  return toolsConfig.map(tool => tool.slug);
}
