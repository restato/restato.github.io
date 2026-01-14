// Common UI translations
import type { Language } from '../index';

export const commonTranslations = {
  // Navigation
  nav: {
    home: { ko: '홈', en: 'Home', ja: 'ホーム' },
    blog: { ko: '블로그', en: 'Blog', ja: 'ブログ' },
    jobs: { ko: '채용', en: 'Jobs', ja: '採用' },
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
    description: { ko: 'Claude와 함께 만든 다양한 프로젝트들', en: 'Various projects created with Claude', ja: 'Claudeと一緒に作った様々なプロジェクト' },
    viewProject: { ko: '프로젝트 보기', en: 'View Project', ja: 'プロジェクトを見る' },
    allProjects: { ko: '전체 프로젝트', en: 'All Projects', ja: 'すべてのプロジェクト' },
    newProject: { ko: '새 프로젝트', en: 'New Project', ja: '新しいプロジェクト' },
    comingSoon: { ko: 'Coming Soon...', en: 'Coming Soon...', ja: 'Coming Soon...' },
    // Project items
    gameCenter: { ko: '게임센터', en: 'Game Center', ja: 'ゲームセンター' },
    gameCenterDesc: { ko: '재미있는 미니게임 모음', en: 'Fun mini game collection', ja: '楽しいミニゲームコレクション' },
    roulette: { ko: '룰렛', en: 'Roulette', ja: 'ルーレット' },
    rouletteDesc: { ko: '커스텀 항목으로 돌리는 랜덤 룰렛 게임', en: 'Random roulette game with custom items', ja: 'カスタム項目で回すランダムルーレットゲーム' },
    slotMachine: { ko: '슬롯머신', en: 'Slot Machine', ja: 'スロットマシン' },
    slotMachineDesc: { ko: '행운의 777을 노려보세요!', en: 'Try your luck for 777!', ja: 'ラッキー777を狙おう！' },
    rockPaperScissors: { ko: '가위바위보', en: 'Rock Paper Scissors', ja: 'じゃんけん' },
    rockPaperScissorsDesc: { ko: 'AI와 대결하는 가위바위보', en: 'Rock paper scissors against AI', ja: 'AIと対決するじゃんけん' },
    numberGuess: { ko: '숫자 맞추기', en: 'Number Guess', ja: '数字当て' },
    numberGuessDesc: { ko: 'Up & Down 숫자 맞추기 게임', en: 'Up & Down number guessing game', ja: 'Up & Down数字当てゲーム' },
    memoryGame: { ko: '기억력 게임', en: 'Memory Game', ja: '記憶力ゲーム' },
    memoryGameDesc: { ko: '카드 짝 맞추기 두뇌 게임', en: 'Card matching brain game', ja: 'カードマッチング脳トレゲーム' },
    reactionTest: { ko: '반응속도', en: 'Reaction Test', ja: '反応速度' },
    reactionTestDesc: { ko: '당신의 반응속도를 측정하세요', en: 'Measure your reaction speed', ja: 'あなたの反応速度を測定' },
    gallery: { ko: '갤러리', en: 'Gallery', ja: 'ギャラリー' },
    galleryDesc: { ko: '사진 갤러리', en: 'Photo Gallery', ja: 'フォトギャラリー' },
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
    subtitle: { ko: 'Developer & Vibe Coder', en: 'Developer & Vibe Coder', ja: 'Developer & Vibe Coder' },
    greeting: { ko: '안녕하세요! 👋', en: 'Hello! 👋', ja: 'こんにちは！👋' },
    intro: {
      ko: 'Claude와 함께 <strong>Vibe Coding</strong>을 하며 다양한 프로젝트를 만들고 있습니다. 이 블로그는 그 과정에서 배운 것들, 만든 것들, 그리고 생각들을 기록하는 공간입니다.',
      en: "I'm creating various projects with Claude through <strong>Vibe Coding</strong>. This blog is a space to record what I've learned, what I've made, and my thoughts along the way.",
      ja: 'Claudeと一緒に<strong>Vibe Coding</strong>をしながら様々なプロジェクトを作っています。このブログは、その過程で学んだこと、作ったもの、そして考えを記録する場所です。'
    },
    whatIsVibeCoding: { ko: 'Vibe Coding이란?', en: 'What is Vibe Coding?', ja: 'Vibe Codingとは？' },
    vibeCodingDesc: {
      ko: 'AI와 함께 코딩하며 아이디어를 빠르게 구현하는 방식입니다. 완벽한 코드보다는 <em>동작하는 것</em>을 우선으로, 배움의 과정 자체를 즐기는 개발 스타일이에요.',
      en: "It's a way of coding with AI to quickly implement ideas. It's a development style that prioritizes <em>working code</em> over perfect code and enjoys the learning process itself.",
      ja: 'AIと一緒にコーディングしてアイデアを素早く実装する方式です。完璧なコードよりも<em>動くこと</em>を優先し、学びのプロセス自体を楽しむ開発スタイルです。'
    },
    whatWeCover: { ko: '이 블로그에서 다루는 것들', en: 'What We Cover', ja: 'このブログで扱う内容' },
    devLog: { ko: '개발 일지', en: 'Dev Log', ja: '開発日誌' },
    devLogDesc: { ko: '프로젝트 진행 과정과 삽질기', en: 'Project progress and troubleshooting', ja: 'プロジェクトの進行過程とトラブルシューティング' },
    til: { ko: 'TIL', en: 'TIL', ja: 'TIL' },
    tilDesc: { ko: '오늘 배운 것들', en: 'Today I Learned', ja: '今日学んだこと' },
    claudeUsage: { ko: 'Claude 활용법', en: 'Claude Usage', ja: 'Claude活用法' },
    claudeUsageDesc: { ko: 'AI와 효과적으로 협업하는 방법', en: 'How to collaborate effectively with AI', ja: 'AIと効果的に協力する方法' },
    showcase: { ko: '프로젝트 쇼케이스', en: 'Project Showcase', ja: 'プロジェクトショーケース' },
    showcaseDesc: { ko: '만든 것들 소개', en: 'Introduction to creations', ja: '作ったものの紹介' },
    contact: { ko: '연락처', en: 'Contact', ja: '連絡先' },
    contactDesc: { ko: '궁금한 점이나 피드백이 있으시면 언제든 연락주세요!', en: 'Feel free to reach out if you have questions or feedback!', ja: 'ご質問やフィードバックがあればいつでもご連絡ください！' },
  },

  // 404 Page
  notFound: {
    title: { ko: '페이지를 찾을 수 없습니다', en: 'Page Not Found', ja: 'ページが見つかりません' },
    description: { ko: '요청하신 페이지가 존재하지 않거나 이동되었습니다.', en: 'The page you requested does not exist or has been moved.', ja: 'リクエストされたページは存在しないか、移動されました。' },
    backHome: { ko: '홈으로 돌아가기', en: 'Back to Home', ja: 'ホームに戻る' },
  },

  // Index page
  index: {
    welcome: { ko: 'Welcome to my blog', en: 'Welcome to my blog', ja: 'ブログへようこそ' },
    greeting: { ko: "안녕하세요, 저는", en: "Hi, I'm", ja: 'こんにちは、私は' },
    heroDescription: {
      ko: '개발하며 배운 것들을 기록하고, 작은 프로젝트들을 만들어가는 공간입니다.',
      en: 'A space where I document what I learn while developing and create small projects.',
      ja: '開発しながら学んだことを記録し、小さなプロジェクトを作っていく場所です。'
    },
    readBlog: { ko: '블로그 읽기', en: 'Read Blog', ja: 'ブログを読む' },
    latestPosts: { ko: 'Latest Posts', en: 'Latest Posts', ja: '最新の投稿' },
    recentPosts: { ko: '최근 글', en: 'Recent Posts', ja: '最近の投稿' },
    viewAll: { ko: '전체 보기', en: 'View All', ja: 'すべて見る' },
    noPosts: { ko: '아직 작성된 글이 없습니다', en: 'No posts yet', ja: 'まだ投稿がありません' },
    comingSoon: { ko: '곧 첫 번째 글이 올라올 거예요!', en: 'The first post will be up soon!', ja: '最初の投稿がまもなく公開されます！' },
    webTools: { ko: 'Web Tools', en: 'Web Tools', ja: 'Webツール' },
    popularTools: { ko: '인기 도구', en: 'Popular Tools', ja: '人気ツール' },
    seeAllTools: { ko: '개 도구 모두 보기', en: ' tools available', ja: 'つのツールをすべて見る' },
    gameCenterOpen: { ko: '게임센터 오픈!', en: 'Game Center Open!', ja: 'ゲームセンターオープン！' },
    gameCenterDesc: {
      ko: '룰렛, 슬롯머신, 가위바위보, 숫자 맞추기, 기억력 게임, 반응속도 테스트까지! 무료로 즐기는 6가지 미니게임',
      en: 'Roulette, slot machine, rock-paper-scissors, number guessing, memory game, and reaction test! 6 free mini games to enjoy',
      ja: 'ルーレット、スロットマシン、じゃんけん、数字当て、記憶力ゲーム、反応速度テストまで！無料で楽しめる6つのミニゲーム'
    },
    playNow: { ko: '지금 플레이하기', en: 'Play Now', ja: '今すぐプレイ' },
    sideProjects: { ko: 'Side Projects', en: 'Side Projects', ja: 'サイドプロジェクト' },
    gameCenter: { ko: '게임센터', en: 'Game Center', ja: 'ゲームセンター' },
    sixFreeGames: { ko: '6가지 무료 미니게임', en: '6 Free Mini Games', ja: '6つの無料ミニゲーム' },
    roulette: { ko: '룰렛', en: 'Roulette', ja: 'ルーレット' },
    rouletteDesc: { ko: '커스텀 항목으로 돌리는 랜덤 룰렛', en: 'Custom random roulette wheel', ja: 'カスタム項目で回すランダムルーレット' },
    seeMore: { ko: '더 보기', en: 'See More', ja: 'もっと見る' },
    // Tool names
    jsonFormatter: { ko: 'JSON 포매터', en: 'JSON Formatter', ja: 'JSONフォーマッタ' },
    qrCode: { ko: 'QR 코드', en: 'QR Code', ja: 'QRコード' },
    colorConverter: { ko: '색상 변환', en: 'Color Converter', ja: '色変換' },
    imageResizer: { ko: '이미지 리사이저', en: 'Image Resizer', ja: '画像リサイザー' },
    base64: { ko: 'Base64', en: 'Base64', ja: 'Base64' },
    utmBuilder: { ko: 'UTM 빌더', en: 'UTM Builder', ja: 'UTMビルダー' },
    regexTester: { ko: '정규식 테스터', en: 'Regex Tester', ja: '正規表現テスター' },
    passwordGenerator: { ko: '비밀번호 생성', en: 'Password Generator', ja: 'パスワード生成' },
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
