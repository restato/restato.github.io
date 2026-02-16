# Repository Guidelines

## Project Structure & Module Organization
Core application code lives in `src/`:
- `src/pages/`: Astro routes, including localized routes under `src/pages/[lang]/`.
- `src/components/`: UI components (`tools/`, `games/`, `jobs/`, `articles/`), mostly React islands plus some `.astro` components.
- `src/content/blog/`: MDX blog posts; content schema is configured in `src/content/config.ts`.
- `src/lib/`, `src/hooks/`, `src/i18n/`, `src/data/`, `src/types/`: shared logic and app data.

Static files are in `public/`; generated job data is `public/data/jobs.json`. Build/automation scripts are in `scripts/` (`scrape-jobs.mjs`, `generate-sitemaps.mjs`).

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start Astro dev server.
- `npm run build`: production build (`astro build` + sitemap generation).
- `npm run build:astro`: Astro build only.
- `npm run build:sitemaps`: regenerate split sitemaps from `dist/`.
- `npm run preview`: preview the built site.
- `npm test`: run Vitest in watch mode.
- `npm run test:coverage`: run tests with V8 coverage report.
- `node scripts/scrape-jobs.mjs`: refresh `public/data/jobs.json` manually.

## Coding Style & Naming Conventions
TypeScript is strict (`astro/tsconfigs/strict`). Follow existing style:
- 2-space indentation, semicolons, single quotes.
- React components and `.astro` component files use PascalCase (for example, `TextCounter.tsx`).
- Hooks use `use*` naming (for example, `useChatService.ts`).
- Tests use `*.test.ts` / `*.test.tsx`.
- Use path alias `@/*` for imports from `src/*` when it improves clarity.

No dedicated lint/format scripts are currently configured; match surrounding code style in edited files.

## Testing Guidelines
Testing stack: Vitest + Testing Library + `jsdom`, with setup in `src/test/setup.ts`. Keep tests close to feature code in `__tests__/` folders (for example, `src/components/tools/__tests__/`). Add or update tests for any behavior change; run `npm run test:coverage` before opening a PR.

## Commit & Pull Request Guidelines
Commit subjects in history follow prefix-based style: `feat:`, `fix:`, `chore:`, `docs:`, `blog:` (often with issue refs like `(#56)`). Use concise, imperative messages.

For PRs, include:
- what changed and why,
- linked issue(s) when applicable,
- test commands run,
- screenshots/GIFs for UI changes,
- notes for data/script changes (for example updates to `public/data/jobs.json`).

## Security & Configuration Tips
Use `.env.example` as the template for local `.env`. Only `PUBLIC_FIREBASE_*` values belong there; never commit private keys or tokens.
