import { useState, useMemo, useRef, useEffect } from 'react';

interface Tool {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  keywords: string[];
}

const tools: Tool[] = [
  // Generators
  { slug: 'qr-code', title: 'QR 코드 생성기', description: 'URL이나 텍스트를 QR 코드로 변환', icon: '📱', category: 'generators', keywords: ['qr', 'qrcode', '큐알', '큐알코드'] },
  { slug: 'password', title: '비밀번호 생성기', description: '안전한 비밀번호 생성', icon: '🔐', category: 'generators', keywords: ['password', '패스워드', '암호'] },
  { slug: 'uuid', title: 'UUID 생성기', description: 'UUID v4 생성', icon: '🔑', category: 'generators', keywords: ['uuid', 'guid', '유니크'] },
  { slug: 'lorem-ipsum', title: 'Lorem Ipsum 생성기', description: '더미 텍스트 생성', icon: '📝', category: 'generators', keywords: ['lorem', 'ipsum', '더미', '텍스트', 'dummy'] },
  { slug: 'color-palette', title: '색상 팔레트 생성기', description: '조화로운 색상 팔레트 생성', icon: '🎨', category: 'generators', keywords: ['color', 'palette', '컬러', '팔레트', '색상'] },
  { slug: 'hash', title: '해시 생성기', description: 'MD5, SHA-1, SHA-256 해시 생성', icon: '#️⃣', category: 'generators', keywords: ['hash', 'md5', 'sha', '해시', '암호화'] },
  // Converters
  { slug: 'color', title: '색상 변환기', description: 'HEX, RGB, HSL 색상 변환', icon: '🌈', category: 'converters', keywords: ['color', 'hex', 'rgb', 'hsl', '컬러', '색상'] },
  { slug: 'unit', title: '단위 변환기', description: '길이, 무게, 온도 단위 변환', icon: '📏', category: 'converters', keywords: ['unit', 'length', 'weight', 'temperature', '단위', '길이', '무게', '온도', 'cm', 'inch', 'kg', 'lb'] },
  { slug: 'base64', title: 'Base64 인코더/디코더', description: '텍스트를 Base64로 인코딩/디코딩', icon: '🔄', category: 'converters', keywords: ['base64', 'encode', 'decode', '인코딩', '디코딩'] },
  { slug: 'image-converter', title: '이미지 포맷 변환기', description: 'JPEG, PNG, WebP 포맷 간 변환', icon: '🖼️', category: 'image', keywords: ['image', 'convert', 'jpeg', 'png', 'webp', '이미지', '변환', '포맷'] },
  // Text
  { slug: 'text-counter', title: '텍스트 카운터', description: '글자수, 단어수, 줄수 세기', icon: '🔢', category: 'text', keywords: ['text', 'count', 'character', 'word', '글자수', '단어수', '문자수'] },
  { slug: 'markdown', title: '마크다운 미리보기', description: '마크다운 실시간 미리보기', icon: '📄', category: 'text', keywords: ['markdown', 'md', 'preview', '마크다운'] },
  { slug: 'diff', title: '텍스트 비교기', description: '두 텍스트의 차이점 비교', icon: '📊', category: 'developer', keywords: ['diff', 'compare', 'text', '비교', '차이'] },
  // Developer
  { slug: 'json', title: 'JSON 포매터', description: 'JSON 포매팅 및 검증', icon: '{ }', category: 'developer', keywords: ['json', 'format', 'beautify', 'validate', '제이슨', '포맷'] },
  { slug: 'regex', title: '정규식 테스터', description: '정규식 테스트 및 매치 확인', icon: '🔍', category: 'developer', keywords: ['regex', 'regular expression', '정규식', '정규표현식'] },
  { slug: 'url-encoder', title: 'URL 인코더/디코더', description: 'URL 문자열 인코딩/디코딩', icon: '🔗', category: 'developer', keywords: ['url', 'encode', 'decode', 'percent', '인코딩'] },
  { slug: 'jwt-decoder', title: 'JWT 디코더', description: 'JWT 토큰 디코딩 및 분석', icon: '🎫', category: 'developer', keywords: ['jwt', 'token', 'decode', '토큰', '디코더'] },
  { slug: 'cron', title: 'Cron 표현식 생성기', description: 'Cron 표현식 생성 및 설명', icon: '⏰', category: 'developer', keywords: ['cron', 'schedule', 'expression', '크론', '스케줄'] },
  // Designer
  { slug: 'gradient', title: 'CSS 그라데이션 생성기', description: 'CSS 그라데이션 시각적 생성', icon: '🌈', category: 'designer', keywords: ['css', 'gradient', '그라데이션', '그라디언트'] },
  { slug: 'box-shadow', title: 'CSS Box Shadow 생성기', description: 'CSS box-shadow 시각적 생성', icon: '🎭', category: 'designer', keywords: ['css', 'shadow', 'box-shadow', '그림자'] },
  // Photographer
  { slug: 'image-resizer', title: '이미지 리사이저', description: '이미지 크기 조절 및 압축', icon: '📐', category: 'image', keywords: ['image', 'resize', 'compress', '이미지', '크기', '리사이즈', '압축'] },
  { slug: 'image-crop-resizer', title: '이미지 크롭 & 리사이즈', description: '슬랙/아이폰/썸네일 프리셋 변환', icon: '✂️', category: 'image', keywords: ['image', 'crop', 'resize', 'slack', 'iphone', 'thumbnail', '이미지', '크롭', '썸네일'] },
  { slug: 'exif', title: 'EXIF 정보 뷰어', description: '사진 EXIF 메타데이터 확인', icon: '📷', category: 'image', keywords: ['exif', 'metadata', 'photo', '사진', '메타데이터'] },
  // Marketer
  { slug: 'utm', title: 'UTM 링크 생성기', description: '캠페인 추적용 UTM 링크 생성', icon: '📊', category: 'marketer', keywords: ['utm', 'campaign', 'tracking', '캠페인', '마케팅', '추적'] },
  // Productivity
  { slug: 'timer', title: '타이머 / 스톱워치', description: '타이머와 스톱워치', icon: '⏱️', category: 'productivity', keywords: ['timer', 'stopwatch', '타이머', '스톱워치', '초시계'] },
  { slug: 'pomodoro', title: '포모도로 타이머', description: '포모도로 기법으로 생산성 향상', icon: '🍅', category: 'productivity', keywords: ['pomodoro', '포모도로', '집중', '생산성'] },
  { slug: 'world-clock', title: '세계 시계', description: '전 세계 시간대 확인 및 변환', icon: '🌍', category: 'productivity', keywords: ['world', 'clock', 'timezone', '세계시간', '시차', '타임존'] },
];

export default function ToolSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredTools = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return tools.filter(tool =>
      tool.title.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.keywords.some(k => k.toLowerCase().includes(lowerQuery))
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredTools]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredTools.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredTools.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          window.location.href = `/tools/${filteredTools[selectedIndex].slug}`;
        }
        break;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="도구 검색... (⌘K)"
          className="w-full pl-10 pr-4 py-3 rounded-xl
            bg-[var(--color-card)] border border-[var(--color-border)]
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
            outline-none transition-all
            text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
        />
        <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2
          items-center gap-1 px-2 py-1 rounded
          bg-[var(--color-card-hover)] text-[var(--color-text-muted)]
          text-xs font-mono border border-[var(--color-border)]"
        >
          ⌘K
        </kbd>
      </div>

      {isOpen && filteredTools.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-2 py-2 rounded-xl
            bg-[var(--color-card)] border border-[var(--color-border)]
            shadow-xl max-h-96 overflow-auto"
        >
          {filteredTools.map((tool, index) => (
            <a
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className={`flex items-center gap-3 px-4 py-3 transition-colors
                ${index === selectedIndex
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'hover:bg-[var(--color-card-hover)]'
                }`}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="text-xl">{tool.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{tool.title}</div>
                <div className="text-sm text-[var(--color-text-muted)] truncate">
                  {tool.description}
                </div>
              </div>
              <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      )}

      {isOpen && query && filteredTools.length === 0 && (
        <div className="absolute z-50 w-full mt-2 py-8 rounded-xl
          bg-[var(--color-card)] border border-[var(--color-border)]
          shadow-xl text-center text-[var(--color-text-muted)]"
        >
          <p>검색 결과가 없습니다</p>
          <p className="text-sm mt-1">다른 키워드로 검색해보세요</p>
        </div>
      )}
    </div>
  );
}
