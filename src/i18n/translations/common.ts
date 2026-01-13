// Common UI translations
import type { Language } from '../index';

export const commonTranslations = {
  // Navigation
  nav: {
    home: { ko: '홈', en: 'Home', ja: 'ホーム' },
    blog: { ko: '블로그', en: 'Blog', ja: 'ブログ' },
    projects: { ko: '프로젝트', en: 'Projects', ja: 'プロジェクト' },
    about: { ko: '소개', en: 'About', ja: '紹介' },
    tools: { ko: '도구', en: 'Tools', ja: 'ツール' },
    games: { ko: '게임', en: 'Games', ja: 'ゲーム' },
  },

  // Footer
  footer: {
    copyright: { ko: '© 2024 Restato. All rights reserved.', en: '© 2024 Restato. All rights reserved.', ja: '© 2024 Restato. All rights reserved.' },
    builtWith: { ko: 'Built with', en: 'Built with', ja: 'Built with' },
  },

  // Common UI
  ui: {
    loading: { ko: '로딩 중...', en: 'Loading...', ja: '読み込み中...' },
    error: { ko: '오류가 발생했습니다', en: 'An error occurred', ja: 'エラーが発生しました' },
    retry: { ko: '다시 시도', en: 'Retry', ja: '再試行' },
    close: { ko: '닫기', en: 'Close', ja: '閉じる' },
    back: { ko: '뒤로', en: 'Back', ja: '戻る' },
    next: { ko: '다음', en: 'Next', ja: '次へ' },
    prev: { ko: '이전', en: 'Previous', ja: '前へ' },
    save: { ko: '저장', en: 'Save', ja: '保存' },
    cancel: { ko: '취소', en: 'Cancel', ja: 'キャンセル' },
    confirm: { ko: '확인', en: 'Confirm', ja: '確認' },
    delete: { ko: '삭제', en: 'Delete', ja: '削除' },
    edit: { ko: '편집', en: 'Edit', ja: '編集' },
    search: { ko: '검색', en: 'Search', ja: '検索' },
    share: { ko: '공유', en: 'Share', ja: '共有' },
    language: { ko: '언어', en: 'Language', ja: '言語' },
    darkMode: { ko: '다크 모드', en: 'Dark Mode', ja: 'ダークモード' },
    lightMode: { ko: '라이트 모드', en: 'Light Mode', ja: 'ライトモード' },
  },

  // Home page
  home: {
    welcome: { ko: '환영합니다', en: 'Welcome', ja: 'ようこそ' },
    subtitle: { ko: '개발자 블로그 & 프로젝트', en: 'Developer Blog & Projects', ja: '開発者ブログ＆プロジェクト' },
    latestPosts: { ko: '최신 포스트', en: 'Latest Posts', ja: '最新の投稿' },
    viewAll: { ko: '전체 보기', en: 'View All', ja: 'すべて見る' },
    featuredProjects: { ko: '추천 프로젝트', en: 'Featured Projects', ja: 'おすすめプロジェクト' },
    tryTools: { ko: '도구 사용해보기', en: 'Try Our Tools', ja: 'ツールを試す' },
    playGames: { ko: '게임 플레이하기', en: 'Play Games', ja: 'ゲームをプレイ' },
  },

  // Projects page
  projects: {
    title: { ko: '프로젝트', en: 'Projects', ja: 'プロジェクト' },
    description: { ko: '다양한 프로젝트들을 확인해보세요', en: 'Check out various projects', ja: '様々なプロジェクトをご覧ください' },
    viewProject: { ko: '프로젝트 보기', en: 'View Project', ja: 'プロジェクトを見る' },
    allProjects: { ko: '전체 프로젝트', en: 'All Projects', ja: 'すべてのプロジェクト' },
  },

  // Blog
  blog: {
    title: { ko: '블로그', en: 'Blog', ja: 'ブログ' },
    readMore: { ko: '더 읽기', en: 'Read More', ja: '続きを読む' },
    publishedOn: { ko: '게시일', en: 'Published on', ja: '公開日' },
    tags: { ko: '태그', en: 'Tags', ja: 'タグ' },
    noPosts: { ko: '게시물이 없습니다', en: 'No posts yet', ja: '投稿がありません' },
    minuteRead: { ko: '분 읽기', en: 'min read', ja: '分で読めます' },
  },

  // About
  about: {
    title: { ko: '소개', en: 'About', ja: '紹介' },
    description: { ko: '안녕하세요, 개발자입니다', en: 'Hello, I am a developer', ja: 'こんにちは、開発者です' },
  },

  // Breadcrumb
  breadcrumb: {
    home: { ko: '홈', en: 'Home', ja: 'ホーム' },
  },

  // FAQ
  faq: {
    title: { ko: '자주 묻는 질문', en: 'FAQ', ja: 'よくある質問' },
  },
} as const;

export type CommonTranslationKey = keyof typeof commonTranslations;
