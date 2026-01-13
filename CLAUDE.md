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
