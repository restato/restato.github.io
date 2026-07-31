// Game SEO data and configuration
import type { Language } from '../i18n/index';

export interface GameSeoData {
  title: string;
  description: string;
  keywords: string[];
}

export const gameLanguages = ['ko', 'en', 'ja'] as const;
export type GameLanguage = (typeof gameLanguages)[number];
type GameSeoByLanguage = Record<GameLanguage, GameSeoData> & Partial<Record<Language, GameSeoData>>;

export interface GameConfig {
  slug: string;
  icon: string;
  category: 'arcade' | 'puzzle' | 'event' | 'classic';
  featured?: boolean;
  seo: GameSeoByLanguage;
}

// Common SEO keywords
const seoKeywords = {
  ko: ['무료', '온라인', '무설치', '심플', '간단한', '브라우저 게임'],
  en: ['free', 'online', 'no install', 'simple', 'browser game'],
  ja: ['無料', 'オンライン', 'インストール不要', 'シンプル', 'ブラウザゲーム'],
};

export const gamesConfig: GameConfig[] = [
  // Classic/Arcade Games
  {
    slug: 'snake',
    icon: '🐍',
    category: 'arcade',
    featured: true,
    seo: {
      ko: {
        title: '스네이크 게임 - 무료 온라인 뱀 게임',
        description: '무료 온라인 스네이크 게임. 클래식 뱀 게임을 브라우저에서 바로 플레이하세요. 무설치, 회원가입 불필요.',
        keywords: ['스네이크', '뱀 게임', '클래식 게임', ...seoKeywords.ko],
      },
      en: {
        title: 'Snake Game - Free Online Classic Snake',
        description: 'Free online snake game. Play the classic snake game directly in your browser. No installation required.',
        keywords: ['snake', 'snake game', 'classic game', ...seoKeywords.en],
      },
      ja: {
        title: 'スネークゲーム - 無料オンラインヘビゲーム',
        description: '無料オンラインスネークゲーム。ブラウザで直接クラシックなヘビゲームをプレイ。インストール不要。',
        keywords: ['スネーク', 'ヘビゲーム', 'クラシックゲーム', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: '2048',
    icon: '🔢',
    category: 'puzzle',
    featured: true,
    seo: {
      ko: {
        title: '2048 게임 - 무료 온라인 숫자 퍼즐',
        description: '무료 2048 퍼즐 게임. 숫자를 합쳐 2048을 만들어보세요. 중독성 강한 두뇌 게임.',
        keywords: ['2048', '숫자 퍼즐', '두뇌 게임', '퍼즐 게임', ...seoKeywords.ko],
      },
      en: {
        title: '2048 Game - Free Online Number Puzzle',
        description: 'Free 2048 puzzle game. Merge numbers to reach 2048. Addictive brain game.',
        keywords: ['2048', 'number puzzle', 'brain game', 'puzzle game', ...seoKeywords.en],
      },
      ja: {
        title: '2048ゲーム - 無料オンライン数字パズル',
        description: '無料2048パズルゲーム。数字を合わせて2048を作ろう。中毒性のある脳トレゲーム。',
        keywords: ['2048', '数字パズル', '脳トレ', 'パズルゲーム', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'hangman',
    icon: '🪢',
    category: 'puzzle',
    featured: true,
    seo: {
      ko: {
        title: '행맨 게임 - 무료 온라인 단어 맞추기',
        description: '무료 온라인 행맨 게임. 알파벳을 추리해 숨겨진 단어를 맞춰보세요. 간단하지만 중독성 있는 단어 게임.',
        keywords: ['행맨', '단어 맞추기', '영단어 게임', '스펠링 게임', ...seoKeywords.ko],
      },
      en: {
        title: 'Hangman Game - Free Online Word Guess',
        description: 'Free online hangman game. Guess letters and solve the hidden word. Simple but addictive word puzzle.',
        keywords: ['hangman', 'word guess', 'spelling game', 'word puzzle', ...seoKeywords.en],
      },
      ja: {
        title: 'ハングマンゲーム - 無料オンライン単語当て',
        description: '無料オンラインハングマンゲーム。文字を推理して隠れた単語を当てよう。シンプルで中毒性のある単語パズル。',
        keywords: ['ハングマン', '単語当て', 'スペルゲーム', '単語パズル', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'typing',
    icon: '⌨️',
    category: 'arcade',
    featured: true,
    seo: {
      ko: {
        title: '타이핑 게임 - 무료 온라인 타자 연습',
        description: '무료 온라인 타이핑 게임. WPM 측정, 타자 속도 향상. 재미있게 타자 연습하세요.',
        keywords: ['타이핑', '타자 연습', 'WPM', '타자 게임', ...seoKeywords.ko],
      },
      en: {
        title: 'Typing Game - Free Online Typing Practice',
        description: 'Free online typing game. Measure WPM, improve typing speed. Practice typing in a fun way.',
        keywords: ['typing', 'typing practice', 'WPM', 'typing game', ...seoKeywords.en],
      },
      ja: {
        title: 'タイピングゲーム - 無料オンラインタイピング練習',
        description: '無料オンラインタイピングゲーム。WPM測定、タイピング速度向上。楽しくタイピング練習。',
        keywords: ['タイピング', 'タイピング練習', 'WPM', 'タイピングゲーム', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'dino-runner',
    icon: '🦖',
    category: 'arcade',
    seo: {
      ko: {
        title: '공룡 점프 게임 - 무료 온라인 러너 게임',
        description: '무료 공룡 점프 게임. Chrome 공룡 게임 스타일의 심플한 러너 게임. 장애물을 피해 달리세요!',
        keywords: ['공룡 게임', '점프 게임', '러너 게임', '크롬 공룡', ...seoKeywords.ko],
      },
      en: {
        title: 'Dino Runner - Free Online Jump Game',
        description: 'Free dino runner game. Chrome dinosaur style simple runner game. Jump over obstacles!',
        keywords: ['dino game', 'jump game', 'runner game', 'chrome dinosaur', ...seoKeywords.en],
      },
      ja: {
        title: '恐竜ジャンプゲーム - 無料オンラインランナーゲーム',
        description: '無料恐竜ジャンプゲーム。Chrome恐竜スタイルのシンプルなランナーゲーム。障害物を避けて走ろう！',
        keywords: ['恐竜ゲーム', 'ジャンプゲーム', 'ランナーゲーム', 'Chrome恐竜', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'flappy',
    icon: '🐦',
    category: 'arcade',
    seo: {
      ko: {
        title: '플래피 버드 - 무료 온라인 파이프 피하기 게임',
        description: '무료 플래피 버드 스타일 게임. 파이프를 피해 날아가세요. 심플하지만 중독성 강한 게임.',
        keywords: ['플래피 버드', '파이프 게임', '날기 게임', ...seoKeywords.ko],
      },
      en: {
        title: 'Flappy Bird - Free Online Pipe Dodging Game',
        description: 'Free Flappy Bird style game. Fly through pipes. Simple but addictive game.',
        keywords: ['flappy bird', 'pipe game', 'flying game', ...seoKeywords.en],
      },
      ja: {
        title: 'フラッピーバード - 無料オンラインパイプ回避ゲーム',
        description: '無料フラッピーバードスタイルゲーム。パイプを避けて飛ぼう。シンプルだけど中毒性のあるゲーム。',
        keywords: ['フラッピーバード', 'パイプゲーム', '飛行ゲーム', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'breakout',
    icon: '🧱',
    category: 'arcade',
    seo: {
      ko: {
        title: '벽돌깨기 게임 - 무료 온라인 브레이크아웃',
        description: '무료 온라인 벽돌깨기 게임. 클래식 브레이크아웃을 브라우저에서 플레이하세요.',
        keywords: ['벽돌깨기', '브레이크아웃', '아케이드 게임', ...seoKeywords.ko],
      },
      en: {
        title: 'Breakout Game - Free Online Brick Breaker',
        description: 'Free online breakout game. Play classic brick breaker in your browser.',
        keywords: ['breakout', 'brick breaker', 'arcade game', ...seoKeywords.en],
      },
      ja: {
        title: 'ブロック崩し - 無料オンラインブレイクアウト',
        description: '無料オンラインブロック崩しゲーム。ブラウザでクラシックなブレイクアウトをプレイ。',
        keywords: ['ブロック崩し', 'ブレイクアウト', 'アーケードゲーム', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'minesweeper',
    icon: '💣',
    category: 'puzzle',
    seo: {
      ko: {
        title: '지뢰찾기 - 무료 온라인 마인스위퍼',
        description: '무료 온라인 지뢰찾기 게임. 클래식 마인스위퍼를 브라우저에서 플레이하세요.',
        keywords: ['지뢰찾기', '마인스위퍼', '퍼즐 게임', ...seoKeywords.ko],
      },
      en: {
        title: 'Minesweeper - Free Online Mine Sweeper',
        description: 'Free online Minesweeper game. Play classic mine sweeper in your browser.',
        keywords: ['minesweeper', 'mine sweeper', 'puzzle game', ...seoKeywords.en],
      },
      ja: {
        title: 'マインスイーパー - 無料オンライン地雷探し',
        description: '無料オンラインマインスイーパーゲーム。ブラウザでクラシックな地雷探しをプレイ。',
        keywords: ['マインスイーパー', '地雷探し', 'パズルゲーム', ...seoKeywords.ja],
      },
    },
  },
  // Puzzle/Brain Games
  {
    slug: 'tic-tac-toe',
    icon: '⭕',
    category: 'classic',
    seo: {
      ko: {
        title: '틱택토 - 무료 온라인 삼목 게임',
        description: '무료 온라인 틱택토 게임. AI와 대결하는 삼목 게임.',
        keywords: ['틱택토', '삼목', 'OX 게임', ...seoKeywords.ko],
      },
      en: {
        title: 'Tic Tac Toe - Free Online Game',
        description: 'Free online Tic Tac Toe game. Play against AI.',
        keywords: ['tic tac toe', 'noughts and crosses', 'x and o', ...seoKeywords.en],
      },
      ja: {
        title: '三目並べ - 無料オンラインゲーム',
        description: '無料オンライン三目並べゲーム。AIと対戦。',
        keywords: ['三目並べ', 'マルバツゲーム', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'color-match',
    icon: '🎨',
    category: 'puzzle',
    seo: {
      ko: {
        title: '컬러 매치 - 무료 색상 맞추기 게임',
        description: '무료 색상 맞추기 게임. 빠르게 색상을 구별하는 두뇌 게임.',
        keywords: ['컬러 매치', '색상 게임', '색깔 맞추기', ...seoKeywords.ko],
      },
      en: {
        title: 'Color Match - Free Color Matching Game',
        description: 'Free color matching game. Quick brain game to distinguish colors.',
        keywords: ['color match', 'color game', 'matching game', ...seoKeywords.en],
      },
      ja: {
        title: 'カラーマッチ - 無料色合わせゲーム',
        description: '無料色合わせゲーム。素早く色を見分ける脳トレゲーム。',
        keywords: ['カラーマッチ', '色ゲーム', 'マッチングゲーム', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'math-quiz',
    icon: '🧮',
    category: 'puzzle',
    seo: {
      ko: {
        title: '수학 퀴즈 - 무료 온라인 암산 게임',
        description: '무료 수학 퀴즈 게임. 시간 제한 내에 문제를 풀어보세요. 두뇌 트레이닝.',
        keywords: ['수학 퀴즈', '암산', '수학 게임', '두뇌 트레이닝', ...seoKeywords.ko],
      },
      en: {
        title: 'Math Quiz - Free Online Mental Math Game',
        description: 'Free math quiz game. Solve problems within time limit. Brain training.',
        keywords: ['math quiz', 'mental math', 'math game', 'brain training', ...seoKeywords.en],
      },
      ja: {
        title: '数学クイズ - 無料オンライン暗算ゲーム',
        description: '無料数学クイズゲーム。制限時間内に問題を解こう。脳トレ。',
        keywords: ['数学クイズ', '暗算', '数学ゲーム', '脳トレ', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'whack-a-mole',
    icon: '🔨',
    category: 'arcade',
    featured: true,
    seo: {
      ko: {
        title: '두더지 잡기 - 무료 온라인 순발력 게임',
        description: '무료 온라인 두더지 잡기 게임. 30초 동안 최대한 많이 두더지를 잡아 점수를 올려보세요.',
        keywords: ['두더지 잡기', '순발력 게임', '클릭 게임', ...seoKeywords.ko],
      },
      en: {
        title: 'Whack-a-Mole - Free Online Reflex Game',
        description: 'Free online whack-a-mole game. Catch as many moles as possible in 30 seconds.',
        keywords: ['whack a mole', 'reflex game', 'click game', ...seoKeywords.en],
      },
      ja: {
        title: 'モグラたたき - 無料オンライン反射神経ゲーム',
        description: '無料オンラインモグラたたきゲーム。30秒でできるだけ多くモグラを叩いてスコアを伸ばそう。',
        keywords: ['モグラたたき', '反射神経ゲーム', 'クリックゲーム', ...seoKeywords.ja],
      },
    },
  },
  // Event/Raffle Games
  {
    slug: 'roulette',
    icon: '🎡',
    category: 'event',
    featured: true,
    seo: {
      ko: {
        title: '룰렛 돌리기 - 무료 온라인 랜덤 선택 룰렛',
        description: '무료 온라인 룰렛 돌리기. 점심 메뉴, 이벤트 추첨, 의사결정에 활용하세요. 대량 입력 지원.',
        keywords: ['룰렛', '룰렛 돌리기', '랜덤 선택', '추첨', '점심 메뉴', '회사', '학교', '이벤트', ...seoKeywords.ko],
      },
      en: {
        title: 'Spin the Wheel - Free Online Random Picker Roulette',
        description: 'Free online spin the wheel. Use for lunch menu, event raffles, decision making. Bulk input supported.',
        keywords: ['roulette', 'spin the wheel', 'random picker', 'raffle', 'lunch menu', 'company', 'school', 'event', ...seoKeywords.en],
      },
      ja: {
        title: 'ルーレット回し - 無料オンラインランダム選択',
        description: '無料オンラインルーレット。ランチメニュー、イベント抽選、意思決定に活用。大量入力対応。',
        keywords: ['ルーレット', 'ルーレット回し', 'ランダム選択', '抽選', 'ランチメニュー', '会社', '学校', 'イベント', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'ladder',
    icon: '🪜',
    category: 'event',
    featured: true,
    seo: {
      ko: {
        title: '사다리 타기 - 무료 온라인 사다리 게임',
        description: '무료 온라인 사다리 타기 게임. 회사, 학교 추첨에 완벽한 공정한 랜덤 선택 도구.',
        keywords: ['사다리 타기', '사다리 게임', '추첨', '랜덤 선택', '회사', '학교', '이벤트', ...seoKeywords.ko],
      },
      en: {
        title: 'Ladder Game - Free Online Ghost Leg',
        description: 'Free online ladder game. Perfect fair random selection tool for company, school raffles.',
        keywords: ['ladder game', 'ghost leg', 'raffle', 'random selection', 'company', 'school', 'event', ...seoKeywords.en],
      },
      ja: {
        title: 'あみだくじ - 無料オンラインはしごゲーム',
        description: '無料オンラインあみだくじ。会社、学校の抽選に最適な公平なランダム選択ツール。',
        keywords: ['あみだくじ', 'はしごゲーム', '抽選', 'ランダム選択', '会社', '学校', 'イベント', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'team-randomizer',
    icon: '👥',
    category: 'event',
    seo: {
      ko: {
        title: '랜덤 팀 나누기 - 무료 온라인 팀 분배 도구',
        description: '무료 랜덤 팀 나누기. 회사 팀빌딩, 학교 조편성에 활용하세요. 공정한 팀 분배.',
        keywords: ['팀 나누기', '팀 분배', '조 편성', '팀빌딩', '랜덤 팀', '회사', '학교', ...seoKeywords.ko],
      },
      en: {
        title: 'Team Randomizer - Free Online Team Splitter',
        description: 'Free team randomizer. Use for company team building, school group assignments. Fair team distribution.',
        keywords: ['team randomizer', 'team splitter', 'group maker', 'team building', 'random team', 'company', 'school', ...seoKeywords.en],
      },
      ja: {
        title: 'ランダムチーム分け - 無料オンラインチーム分配ツール',
        description: '無料ランダムチーム分け。会社のチームビルディング、学校のグループ分けに活用。公平なチーム分配。',
        keywords: ['チーム分け', 'チーム分配', 'グループ分け', 'チームビルディング', 'ランダムチーム', '会社', '学校', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'bingo',
    icon: '🎱',
    category: 'event',
    seo: {
      ko: {
        title: '빙고 게임 - 무료 온라인 빙고 추첨',
        description: '무료 온라인 빙고 게임. 대규모 이벤트, 파티에 완벽한 빙고 추첨 도구.',
        keywords: ['빙고', '빙고 게임', '빙고 추첨', '이벤트', '파티 게임', ...seoKeywords.ko],
      },
      en: {
        title: 'Bingo Game - Free Online Bingo Caller',
        description: 'Free online bingo game. Perfect bingo calling tool for large events, parties.',
        keywords: ['bingo', 'bingo game', 'bingo caller', 'event', 'party game', ...seoKeywords.en],
      },
      ja: {
        title: 'ビンゴゲーム - 無料オンラインビンゴ抽選',
        description: '無料オンラインビンゴゲーム。大規模イベント、パーティーに最適なビンゴ抽選ツール。',
        keywords: ['ビンゴ', 'ビンゴゲーム', 'ビンゴ抽選', 'イベント', 'パーティーゲーム', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'spinner',
    icon: '🌀',
    category: 'event',
    seo: {
      ko: {
        title: '스피너 휠 - 무료 온라인 돌림판',
        description: '무료 온라인 스피너 휠. 당첨자 추첨, 벌칙 선정 등 다목적 돌림판.',
        keywords: ['스피너', '돌림판', '휠 돌리기', '추첨', '벌칙', ...seoKeywords.ko],
      },
      en: {
        title: 'Spinner Wheel - Free Online Spinning Wheel',
        description: 'Free online spinner wheel. Multi-purpose spinning wheel for raffles, penalties, etc.',
        keywords: ['spinner', 'spinning wheel', 'wheel spin', 'raffle', 'penalty', ...seoKeywords.en],
      },
      ja: {
        title: 'スピナーホイール - 無料オンライン回転盤',
        description: '無料オンラインスピナーホイール。抽選、罰ゲーム選定など多目的回転盤。',
        keywords: ['スピナー', '回転盤', 'ホイール回し', '抽選', '罰ゲーム', ...seoKeywords.ja],
      },
    },
  },
  // Existing games (keep for compatibility)
  {
    slug: 'memory-game',
    icon: '🧠',
    category: 'puzzle',
    seo: {
      ko: {
        title: '기억력 게임 - 무료 온라인 카드 짝 맞추기',
        description: '무료 기억력 게임. 카드 짝을 맞춰 기억력을 테스트하세요.',
        keywords: ['기억력 게임', '메모리 게임', '카드 맞추기', ...seoKeywords.ko],
      },
      en: {
        title: 'Memory Game - Free Online Card Matching',
        description: 'Free memory game. Match card pairs to test your memory.',
        keywords: ['memory game', 'card matching', 'brain game', ...seoKeywords.en],
      },
      ja: {
        title: '記憶力ゲーム - 無料オンラインカードマッチング',
        description: '無料記憶力ゲーム。カードペアを合わせて記憶力をテスト。',
        keywords: ['記憶力ゲーム', 'メモリーゲーム', 'カードマッチング', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'reaction-test',
    icon: '⚡',
    category: 'arcade',
    seo: {
      ko: {
        title: '반응속도 테스트 - 무료 온라인 반응 측정',
        description: '무료 반응속도 테스트. 당신의 반응속도를 측정해보세요.',
        keywords: ['반응속도', '반응 테스트', '반응 측정', ...seoKeywords.ko],
      },
      en: {
        title: 'Reaction Test - Free Online Reaction Speed',
        description: 'Free reaction test. Measure your reaction speed.',
        keywords: ['reaction test', 'reaction speed', 'reflex test', ...seoKeywords.en],
      },
      ja: {
        title: '反応速度テスト - 無料オンライン反応測定',
        description: '無料反応速度テスト。あなたの反応速度を測定しよう。',
        keywords: ['反応速度', '反応テスト', '反応測定', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'rock-paper-scissors',
    icon: '✊',
    category: 'classic',
    seo: {
      ko: {
        title: '가위바위보 - 무료 온라인 AI 대결',
        description: '무료 가위바위보 게임. AI와 대결해보세요.',
        keywords: ['가위바위보', 'AI 게임', '대결 게임', ...seoKeywords.ko],
      },
      en: {
        title: 'Rock Paper Scissors - Free Online AI Battle',
        description: 'Free rock paper scissors game. Battle against AI.',
        keywords: ['rock paper scissors', 'AI game', 'battle game', ...seoKeywords.en],
      },
      ja: {
        title: 'じゃんけん - 無料オンラインAI対戦',
        description: '無料じゃんけんゲーム。AIと対戦しよう。',
        keywords: ['じゃんけん', 'AIゲーム', '対戦ゲーム', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'number-guess',
    icon: '🔮',
    category: 'puzzle',
    seo: {
      ko: {
        title: '숫자 맞추기 - 무료 온라인 업다운 게임',
        description: '무료 숫자 맞추기 게임. Up & Down 게임으로 숫자를 맞춰보세요.',
        keywords: ['숫자 맞추기', '업다운', '숫자 게임', ...seoKeywords.ko],
      },
      en: {
        title: 'Number Guess - Free Online Up Down Game',
        description: 'Free number guessing game. Guess the number with Up & Down hints.',
        keywords: ['number guess', 'up down', 'number game', ...seoKeywords.en],
      },
      ja: {
        title: '数字当て - 無料オンラインアップダウンゲーム',
        description: '無料数字当てゲーム。Up & Downヒントで数字を当てよう。',
        keywords: ['数字当て', 'アップダウン', '数字ゲーム', ...seoKeywords.ja],
      },
    },
  },
  {
    slug: 'slot-machine',
    icon: '🎰',
    category: 'arcade',
    seo: {
      ko: {
        title: '슬롯머신 - 무료 온라인 슬롯 게임',
        description: '무료 슬롯머신 게임. 777 잭팟을 노려보세요!',
        keywords: ['슬롯머신', '슬롯 게임', '777', '잭팟', ...seoKeywords.ko],
      },
      en: {
        title: 'Slot Machine - Free Online Slots Game',
        description: 'Free slot machine game. Try your luck for 777 jackpot!',
        keywords: ['slot machine', 'slots game', '777', 'jackpot', ...seoKeywords.en],
      },
      ja: {
        title: 'スロットマシン - 無料オンラインスロットゲーム',
        description: '無料スロットマシンゲーム。777ジャックポットを狙おう！',
        keywords: ['スロットマシン', 'スロットゲーム', '777', 'ジャックポット', ...seoKeywords.ja],
      },
    },
  },
];

// Helper to get game by slug
export function getGameConfig(slug: string): GameConfig | undefined {
  return gamesConfig.find(game => game.slug === slug);
}

export function isGameLanguage(language: string): language is GameLanguage {
  return gameLanguages.includes(language as GameLanguage);
}

export function getGameSeo(game: GameConfig, language: Language): GameSeoData {
  return game.seo[language] ?? game.seo.en;
}

// Helper to get games by category
export function getGamesByCategory(category: GameConfig['category']): GameConfig[] {
  return gamesConfig.filter(game => game.category === category);
}

// Helper to get featured games
export function getFeaturedGames(): GameConfig[] {
  return gamesConfig.filter(game => game.featured);
}
