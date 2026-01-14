# CLAUDE.md - AI 어시스턴트 가이드

이 문서는 Claude가 이 프로젝트를 효과적으로 이해하고 작업할 수 있도록 안내합니다.

## 프로젝트 개요

이것은 **Astro 5** 기반의 개인 블로그 및 프로젝트 포트폴리오 사이트입니다.

- **프레임워크**: Astro 5 (정적 사이트 생성)
- **UI 라이브러리**: React 19 (인터랙티브 컴포넌트용)
- **스타일링**: Tailwind CSS 3.4 + CSS Variables
- **콘텐츠**: MDX (블로그 포스트)
- **배포**: GitHub Pages

## 디렉토리 구조

```
src/
├── pages/              # 라우트 페이지 (.astro)
│   ├── index.astro     # 홈페이지
│   ├── about.astro     # 소개 페이지
│   ├── blog/           # 블로그 페이지
│   └── projects/       # 프로젝트 페이지 (게임 등)
├── components/         # React 컴포넌트 (.tsx)
├── layouts/            # 레이아웃 컴포넌트
├── styles/             # 글로벌 스타일
│   └── global.css      # Tailwind + CSS Variables
└── content/
    ├── blog/           # MDX 블로그 포스트
    └── config.ts       # 콘텐츠 스키마
```

## 주요 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 코딩 규칙

### Astro 페이지
- `.astro` 확장자 사용
- `MainLayout` 또는 `BaseLayout` 레이아웃 사용
- 한국어로 UI 텍스트 작성

### React 컴포넌트
- `.tsx` 확장자 사용
- TypeScript 타입 정의 필수
- `client:load` 또는 `client:visible` 지시어로 하이드레이션

### 스타일링
- Tailwind CSS 유틸리티 클래스 우선 사용
- CSS Variables 활용: `var(--color-bg)`, `var(--color-text)` 등
- 다크모드 지원: `dark:` 접두사

### 색상 변수 (global.css)
```css
--color-bg          /* 배경색 */
--color-text        /* 텍스트색 */
--color-text-muted  /* 보조 텍스트 */
--color-border      /* 테두리색 */
--color-card        /* 카드 배경 */
--color-card-hover  /* 카드 호버 */
```

## 게임 컴포넌트 작성 가이드

게임은 `/src/components/` 에 React 컴포넌트로 작성합니다.

### 기본 구조
```tsx
import { useState } from 'react';

export default function GameName() {
  // 상태 관리
  const [score, setScore] = useState(0);

  // 게임 로직

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 게임 UI */}
    </div>
  );
}
```

### 체크리스트
- [ ] TypeScript 타입 정의
- [ ] 반응형 디자인 (모바일 우선)
- [ ] 다크모드 지원
- [ ] 애니메이션 효과
- [ ] 접근성 고려

## 프로젝트 페이지 추가 방법

1. `/src/components/`에 게임 컴포넌트 생성
2. `/src/pages/projects/`에 `.astro` 페이지 생성
3. `/src/pages/projects/index.astro`의 `builtInProjects` 배열에 추가

## 콘텐츠 컬렉션

### 블로그 포스트 작성
```mdx
---
title: "포스트 제목"
description: "포스트 설명"
pubDate: 2024-01-01
tags: ["태그1", "태그2"]
---

포스트 내용...
```

## SEO 최적화

### 구현된 SEO 기능
- **메타태그**: title, description, canonical URL
- **Open Graph**: og:type, og:title, og:description, og:image, og:site_name
- **Twitter Card**: summary_large_image 형식
- **JSON-LD Schema**: WebSite, BlogPosting, ItemList (게임)
- **Sitemap**: 자동 생성 (`/sitemap-index.xml`)
- **RSS Feed**: `/rss.xml`
- **robots.txt**: AI 크롤러 허용 설정

### 블로그 포스트 SEO
```astro
<MainLayout
  title="포스트 제목 | Restato"
  description="설명"
  type="article"
  publishedTime={date}
/>
```

### JSON-LD 추가 방법
```astro
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

## Analytics 설정 가이드

### Google Analytics 4 (권장)
1. Google Analytics에서 GA4 속성 생성
2. 측정 ID 복사 (G-XXXXXXXXXX)
3. `src/layouts/BaseLayout.astro`의 `<head>`에 추가:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Google Search Console
1. [Search Console](https://search.google.com/search-console) 접속
2. URL 접두어로 `https://restato.github.io` 추가
3. HTML 태그 인증 선택 후 메타태그 추가:

```html
<meta name="google-site-verification" content="인증코드" />
```

4. sitemap 제출: `https://restato.github.io/sitemap-index.xml`

### Naver Search Advisor
1. [Naver Search Advisor](https://searchadvisor.naver.com/) 접속
2. 사이트 등록 후 HTML 태그 인증
3. RSS 피드 제출: `https://restato.github.io/rss.xml`

## 주의사항

- 새 의존성 추가 시 `npm install` 후 빌드 테스트
- 이미지는 `/public/` 디렉토리에 저장
- 배포는 `main` 브랜치 푸시 시 자동 실행 (GitHub Actions)

## 유용한 패턴

### 애니메이션
```tsx
// Tailwind 애니메이션
className="animate-bounce"
className="animate-pulse"
className="animate-spin"

// 커스텀 트랜지션
className="transition-all duration-300"
```

### 조건부 스타일링
```tsx
className={`base-class ${condition ? 'active-class' : ''}`}
```

### 반응형 디자인
```tsx
className="w-full md:w-1/2 lg:w-1/3"
className="text-sm md:text-base lg:text-lg"
```

## 온라인 도구 추가 가이드

새로운 온라인 도구를 추가할 때는 다음 단계를 **반드시** 따라야 합니다:

### 1. React 컴포넌트 생성
`/src/components/tools/` 디렉토리에 새 도구 컴포넌트를 생성합니다.

```tsx
// /src/components/tools/NewTool.tsx
import { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

export default function NewTool() {
  const { t, translations } = useTranslation();
  const tc = translations.tools.common;

  // 도구 로직

  return (
    <div className="flex flex-col gap-6">
      {/* 도구 UI */}
    </div>
  );
}
```

### 2. 번역 추가
`/src/i18n/translations/tools.ts`에 새 도구의 번역을 추가합니다.

```ts
newTool: {
  title: { ko: '새 도구', en: 'New Tool', ja: '新しいツール' },
  description: { ko: '도구 설명', en: 'Tool description', ja: 'ツールの説明' },
  // ... 기타 번역 키
},
```

### 3. Astro 페이지 생성
`/src/pages/tools/` 디렉토리에 새 페이지를 생성합니다.

```astro
---
// /src/pages/tools/new-tool.astro
import MainLayout from '../../layouts/MainLayout.astro';
import NewTool from '../../components/tools/NewTool';
---

<MainLayout
  title="새 도구 | Restato"
  description="도구 설명"
>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">새 도구</h1>
    <NewTool client:load />
  </div>
</MainLayout>
```

### 4. 도구 목록에 추가
`/src/pages/tools/index.astro`의 `tools` 배열에 새 도구를 추가합니다.

```ts
{
  slug: 'new-tool',
  title: { ko: '새 도구', en: 'New Tool', ja: '新しいツール' },
  description: { ko: '도구 설명', en: 'Tool description', ja: 'ツールの説明' },
  icon: '🔧',
  category: 'developer', // 적절한 카테고리 선택
},
```

### 5. 테스트 코드 작성 (필수!)
`/src/components/tools/__tests__/` 디렉토리에 테스트 파일을 생성합니다.

```tsx
// /src/components/tools/__tests__/NewTool.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewTool from '../NewTool';
import './testUtils';

describe('NewTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<NewTool />);
    // 기본 렌더링 검증
  });

  it('핵심 기능 테스트', async () => {
    render(<NewTool />);
    const user = userEvent.setup();
    // 기능 테스트
  });

  // 추가 테스트 케이스...
});
```

### 6. 마케팅 콘텐츠 추가 (필수!)
`/src/content/blog/online-tools-guide.mdx`에 새 도구 마케팅 설명을 추가합니다.

```mdx
### 새 도구
**핵심 기능 한 줄 설명**

- 주요 기능 1
- 주요 기능 2
- 사용 사례

[새 도구 사용하기 →](/tools/new-tool)
```

### 도구 추가 체크리스트

- [ ] React 컴포넌트 생성 (`/src/components/tools/`)
- [ ] 번역 추가 (`/src/i18n/translations/tools.ts`)
- [ ] Astro 페이지 생성 (`/src/pages/tools/`)
- [ ] 도구 목록에 추가 (`/src/pages/tools/index.astro`)
- [ ] **테스트 코드 작성** (`/src/components/tools/__tests__/`)
- [ ] **마케팅 콘텐츠 추가** (`/src/content/blog/online-tools-guide.mdx`)
- [ ] TypeScript 타입 정의
- [ ] 다국어 지원 (한국어, 영어, 일본어)
- [ ] 반응형 디자인
- [ ] 다크모드 지원
- [ ] 접근성 고려

### 테스트 실행
```bash
# 전체 테스트 실행
npm run test

# 특정 파일 테스트
npm run test NewTool

# UI 모드로 테스트
npm run test:ui

# 커버리지 확인
npm run test:coverage
```

## 다국어 지원 (i18n)

### 번역 시스템 구조
- `/src/i18n/index.ts` - 언어 설정 및 유틸리티
- `/src/i18n/useTranslation.ts` - React 훅
- `/src/i18n/translations/` - 번역 파일

### 번역 사용 방법
```tsx
import { useTranslation } from '../../i18n/useTranslation';

function Component() {
  const { t, lang, translations } = useTranslation();

  return (
    <div>
      {/* 인라인 번역 */}
      <p>{t({ ko: '한국어', en: 'English', ja: '日本語' })}</p>

      {/* 번역 파일 사용 */}
      <p>{t(translations.tools.common.copy)}</p>
    </div>
  );
}
```

### 지원 언어
- `ko`: 한국어 (기본)
- `en`: English
- `ja`: 日本語
