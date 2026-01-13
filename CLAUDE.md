# CLAUDE.md - AI Assistant Guide for Lucky Draw Games

This document provides comprehensive guidance for AI assistants working with this codebase.

## Project Overview

**Lucky Draw Games** is a multi-language static gaming website built with Next.js 15 and TypeScript. It features interactive random games (roulette, lottery, coin flip, dice roll) deployed on GitHub Pages.

**Live Site:** https://restato.github.io

## Technology Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15.5.3 with App Router |
| Language | TypeScript (strict mode) |
| Runtime | Node.js 18+ |
| UI Library | Chakra UI 2.10.4 |
| Styling | Emotion CSS-in-JS + Chakra theme |
| Animations | Framer Motion 12.23.x |
| Effects | Canvas Confetti |
| Forms | React Hook Form |
| i18n | next-i18next (9 languages) |
| Analytics | Google Analytics 4 |
| Deployment | GitHub Pages (static export) |

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout (SEO, GA, Web Vitals)
│   ├── page.tsx           # Home page with game gallery
│   ├── globals.css        # Global styles, CSS variables
│   ├── sitemap.ts         # Dynamic sitemap (9 languages)
│   ├── robots.ts          # robots.txt configuration
│   ├── manifest.ts        # PWA manifest
│   ├── opengraph-image.tsx # OG image generation
│   └── games/             # Game pages
│       ├── wheel-of-fortune/
│       ├── lottery/
│       ├── coinFlip/
│       └── dice/
│
├── components/            # Reusable components
│   ├── Providers.tsx      # Chakra UI provider
│   ├── Header.tsx         # Navigation with language selector
│   ├── LanguageProvider.tsx # i18n context
│   ├── LanguageSelector.tsx # Language dropdown
│   ├── GoogleAnalytics.tsx  # GA4 tracking
│   ├── WebVitals.tsx      # Core Web Vitals monitoring
│   ├── StructuredData.tsx # JSON-LD structured data
│   └── ui/                # UI utilities
│
└── lib/                   # Utilities
    ├── theme.ts           # Chakra theme customization
    ├── gtag.ts            # GA helper functions
    ├── metadata.ts        # SEO metadata generation
    └── naver-seo.ts       # Naver-specific SEO

public/
└── locales/               # Translation JSON files
    ├── ko/common.json     # Korean (default)
    ├── en/common.json     # English
    ├── ja/common.json     # Japanese
    ├── zh/common.json     # Chinese
    ├── es/common.json     # Spanish
    ├── fr/common.json     # French
    ├── de/common.json     # German
    ├── ru/common.json     # Russian
    └── hi/common.json     # Hindi

types/
└── gtag.d.ts              # Google Analytics types
```

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build static site (uses Turbopack, outputs to /out)
npm run lint     # Run ESLint checks
npm start        # Start production server (not used for static export)
```

## Code Conventions

### Component Patterns

1. **Server vs Client Components**
   - Root `layout.tsx` is a Server Component (handles metadata)
   - Game pages use `'use client'` directive for interactivity
   - Provider components are always client-side

2. **Game Component Structure**
   ```typescript
   'use client';

   export default function GamePage() {
     const { t } = useLanguage();  // Translation hook
     const toast = useToast();     // Notifications

     // Game state with useState
     // Animation with Framer Motion
     // Celebration with confetti()

     return (
       <Box minH="100vh" bg="gray.900" py={8}>
         {/* Game UI with Chakra components */}
       </Box>
     );
   }
   ```

3. **Path Alias**
   - Use `@/` for imports from `src/`: `import { theme } from '@/lib/theme'`

### TypeScript Conventions

- Strict mode enabled
- Define interfaces for component props
- Use Language type: `'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'ru' | 'hi'`
- Prefer `as const` for immutable literals

### Styling Guidelines

- Use Chakra UI components (`Box`, `Button`, `Text`, etc.)
- Wrap with Framer Motion for animations: `<motion.div>`
- Theme colors: `gray.900` (bg), `green.400` (Spotify green), `purple.400` (accent)
- Responsive props: `{{ base: 'sm', md: 'lg' }}`
- Dark mode is default theme

### Internationalization (i18n)

**Adding translations:**
1. Add key to all `public/locales/{lang}/common.json` files
2. Use nested keys: `games.wheelOfFortune`, `buttons.spin`
3. Access via `const { t } = useLanguage(); t('games.wheelOfFortune')`

**Translation file structure:**
```json
{
  "games": { "wheelOfFortune": "Wheel of Fortune" },
  "gameDescriptions": { "wheelOfFortune": "Spin the wheel..." },
  "buttons": { "spin": "Spin", "reset": "Reset" }
}
```

### SEO Implementation

- Metadata defined in `src/app/games/{game}/metadata.ts`
- Multi-language support via `generateMetadata()` function in `src/lib/metadata.ts`
- Structured data (JSON-LD) for rich search results
- Sitemap auto-generates URLs for all 9 languages

## Build & Deployment

### Static Export Configuration (next.config.ts)
```typescript
output: 'export'           // Static site generation
trailingSlash: true        // URLs end with /
images: { unoptimized: true } // Required for GitHub Pages
```

### GitHub Actions Pipeline
- Triggers on push to `master` branch
- Builds with `npm ci --legacy-peer-deps`
- Deploys `/out` directory to GitHub Pages

### Environment Variables
- `NEXT_PUBLIC_GA_ID`: Google Analytics 4 ID (set in build)

## Important Notes for AI Assistants

### Do's
- Follow existing component patterns when adding new games
- Add translations to ALL 9 language files when adding new text
- Use Chakra UI components instead of raw HTML
- Wrap animations with Framer Motion
- Use `useLanguage()` hook for translations
- Add `'use client'` directive for interactive components
- Test responsive design at multiple breakpoints
- Update sitemap.ts when adding new pages

### Don'ts
- Don't use `<img>` tags - use Next.js `Image` component or Chakra `Image`
- Don't hardcode text strings - use translation keys
- Don't skip TypeScript types
- Don't use external state management (useState/useContext is sufficient)
- Don't add testing dependencies (not currently in use)
- Don't modify the CI/CD workflow without explicit request

### Common Patterns

**Adding a new game:**
1. Create directory: `src/app/games/{game-name}/`
2. Create files: `page.tsx`, `metadata.ts`, `opengraph-image.tsx`
3. Add game card to home page (`src/app/page.tsx`)
4. Add translations to all locale files
5. Update sitemap.ts to include new game URLs

**Adding confetti celebration:**
```typescript
import confetti from 'canvas-confetti';
confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
```

**Toast notifications:**
```typescript
const toast = useToast();
toast({ title: 'Success!', status: 'success', duration: 2000 });
```

**Framer Motion animation:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

## Files to Reference

| Purpose | File |
|---------|------|
| Theme customization | `src/lib/theme.ts` |
| Translation loading | `src/components/LanguageProvider.tsx` |
| SEO metadata | `src/lib/metadata.ts` |
| GA tracking | `src/lib/gtag.ts` |
| Example game | `src/app/games/coinFlip/page.tsx` |
| Root layout | `src/app/layout.tsx` |

## Supported Languages

| Code | Language | Flag |
|------|----------|------|
| ko | Korean (default) | KR |
| en | English | US |
| ja | Japanese | JP |
| zh | Chinese | CN |
| es | Spanish | ES |
| fr | French | FR |
| de | German | DE |
| ru | Russian | RU |
| hi | Hindi | IN |

## Game Status

| Game | Status | Path |
|------|--------|------|
| Wheel of Fortune | Complete | `/games/wheel-of-fortune` |
| Lottery | Complete | `/games/lottery` |
| Coin Flip | Complete | `/games/coinFlip` |
| Dice Roll | Complete | `/games/dice` |
| Bingo | Planned | - |
| Card Draw | Planned | - |
| Name Picker | Planned | - |
| Number Range | Planned | - |
| Rock Paper Scissors | Planned | - |
| Team Divider | Planned | - |

## Quick Reference

```bash
# Development
npm run dev                    # Start dev server

# Build & verify
npm run build                  # Build static site
npx serve out                  # Preview build locally

# Code quality
npm run lint                   # Check for issues
```
