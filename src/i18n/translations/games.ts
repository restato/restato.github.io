// Game translations
import type { Language } from '../index';

export const gameTranslations = {
  // Common game terms
  common: {
    score: { ko: '점수', en: 'Score', ja: 'スコア' },
    highScore: { ko: '최고 점수', en: 'High Score', ja: 'ハイスコア' },
    level: { ko: '레벨', en: 'Level', ja: 'レベル' },
    time: { ko: '시간', en: 'Time', ja: '時間' },
    start: { ko: '시작', en: 'Start', ja: 'スタート' },
    restart: { ko: '다시 시작', en: 'Restart', ja: 'もう一度' },
    gameOver: { ko: '게임 오버', en: 'Game Over', ja: 'ゲームオーバー' },
    win: { ko: '승리!', en: 'You Win!', ja: '勝利！' },
    lose: { ko: '패배', en: 'You Lose', ja: '敗北' },
    draw: { ko: '무승부', en: 'Draw', ja: '引き分け' },
    easy: { ko: '쉬움', en: 'Easy', ja: '簡単' },
    medium: { ko: '보통', en: 'Medium', ja: '普通' },
    hard: { ko: '어려움', en: 'Hard', ja: '難しい' },
    difficulty: { ko: '난이도', en: 'Difficulty', ja: '難易度' },
    wins: { ko: '승', en: 'Wins', ja: '勝' },
    losses: { ko: '패', en: 'Losses', ja: '敗' },
    draws: { ko: '무', en: 'Draws', ja: '引分' },
    tries: { ko: '시도', en: 'Tries', ja: '試行' },
    attempts: { ko: '시도 횟수', en: 'Attempts', ja: '試行回数' },
    correct: { ko: '정답!', en: 'Correct!', ja: '正解！' },
    wrong: { ko: '오답!', en: 'Wrong!', ja: '不正解！' },
    hint: { ko: '힌트', en: 'Hint', ja: 'ヒント' },
    play: { ko: '플레이', en: 'Play', ja: 'プレイ' },
    pause: { ko: '일시정지', en: 'Pause', ja: '一時停止' },
    resume: { ko: '계속', en: 'Resume', ja: '続ける' },
  },

  // Number Guess Game
  numberGuess: {
    title: { ko: '숫자 맞추기', en: 'Number Guess', ja: '数字当てゲーム' },
    description: { ko: '업다운 숫자 맞추기 게임', en: 'Up-down number guessing game', ja: 'アップダウン数字当てゲーム' },
    guess: { ko: '추측', en: 'Guess', ja: '予想' },
    higher: { ko: 'UP! 더 높아요', en: 'UP! Go higher', ja: 'UP! もっと上' },
    lower: { ko: 'DOWN! 더 낮아요', en: 'DOWN! Go lower', ja: 'DOWN! もっと下' },
    enterNumber: { ko: '숫자를 입력하세요', en: 'Enter a number', ja: '数字を入力' },
    range: { ko: '범위', en: 'Range', ja: '範囲' },
    between: { ko: '~', en: 'to', ja: '〜' },
  },

  // Reaction Test
  reactionTest: {
    title: { ko: '반응속도 테스트', en: 'Reaction Test', ja: '反応速度テスト' },
    description: { ko: '반응속도 측정 게임', en: 'Test your reaction speed', ja: '反応速度測定ゲーム' },
    wait: { ko: '기다리세요...', en: 'Wait...', ja: '待って...' },
    click: { ko: '클릭!', en: 'Click!', ja: 'クリック！' },
    tooEarly: { ko: '너무 빨라요!', en: 'Too early!', ja: '早すぎ！' },
    yourTime: { ko: '반응 시간', en: 'Your time', ja: '反応時間' },
    average: { ko: '평균', en: 'Average', ja: '平均' },
    best: { ko: '최고', en: 'Best', ja: '最高' },
    clickToStart: { ko: '클릭하여 시작', en: 'Click to start', ja: 'クリックしてスタート' },
    ms: { ko: 'ms', en: 'ms', ja: 'ms' },
  },

  // Rock Paper Scissors
  rockPaperScissors: {
    title: { ko: '가위바위보', en: 'Rock Paper Scissors', ja: 'じゃんけん' },
    description: { ko: 'AI와 가위바위보 대결', en: 'Play against AI', ja: 'AIとじゃんけん勝負' },
    rock: { ko: '바위', en: 'Rock', ja: 'グー' },
    paper: { ko: '보', en: 'Paper', ja: 'パー' },
    scissors: { ko: '가위', en: 'Scissors', ja: 'チョキ' },
    you: { ko: '나', en: 'You', ja: 'あなた' },
    computer: { ko: '컴퓨터', en: 'Computer', ja: 'コンピュータ' },
    choose: { ko: '선택하세요', en: 'Make your choice', ja: '選んでください' },
    streak: { ko: '연승', en: 'Streak', ja: '連勝' },
  },

  // Memory Game
  memoryGame: {
    title: { ko: '메모리 게임', en: 'Memory Game', ja: 'メモリーゲーム' },
    description: { ko: '카드 짝 맞추기 게임', en: 'Match card pairs', ja: 'カードペアマッチゲーム' },
    moves: { ko: '이동', en: 'Moves', ja: '手数' },
    pairs: { ko: '쌍', en: 'Pairs', ja: 'ペア' },
    matched: { ko: '맞춤', en: 'Matched', ja: 'マッチ' },
    complete: { ko: '완료!', en: 'Complete!', ja: '完了！' },
  },

  // Roulette
  roulette: {
    title: { ko: '룰렛', en: 'Roulette', ja: 'ルーレット' },
    description: { ko: '커스텀 룰렛 돌리기', en: 'Spin custom roulette', ja: 'カスタムルーレット' },
    spin: { ko: '돌리기', en: 'Spin', ja: '回す' },
    addItem: { ko: '항목 추가', en: 'Add Item', ja: '項目追加' },
    removeItem: { ko: '항목 삭제', en: 'Remove Item', ja: '項目削除' },
    result: { ko: '결과', en: 'Result', ja: '結果' },
    spinning: { ko: '돌아가는 중...', en: 'Spinning...', ja: '回転中...' },
    itemPlaceholder: { ko: '항목 입력...', en: 'Enter item...', ja: '項目を入力...' },
  },

  // Slot Machine
  slotMachine: {
    title: { ko: '슬롯 머신', en: 'Slot Machine', ja: 'スロットマシン' },
    description: { ko: '슬롯 머신 게임', en: 'Slot machine game', ja: 'スロットマシンゲーム' },
    spin: { ko: '스핀', en: 'Spin', ja: 'スピン' },
    jackpot: { ko: '잭팟!', en: 'Jackpot!', ja: 'ジャックポット！' },
    credits: { ko: '크레딧', en: 'Credits', ja: 'クレジット' },
    bet: { ko: '베팅', en: 'Bet', ja: 'ベット' },
    autoSpin: { ko: '자동 스핀', en: 'Auto Spin', ja: 'オートスピン' },
  },

  // Games page
  gamesPage: {
    title: { ko: '게임 센터', en: 'Game Center', ja: 'ゲームセンター' },
    description: { ko: '재미있는 미니 게임 모음', en: 'Fun mini game collection', ja: '楽しいミニゲーム集' },
    allGames: { ko: '전체 게임', en: 'All Games', ja: 'すべてのゲーム' },
    featured: { ko: '추천', en: 'Featured', ja: 'おすすめ' },
    playNow: { ko: '지금 플레이', en: 'Play Now', ja: '今すぐプレイ' },
  },
} as const;

export type GameTranslationKey = keyof typeof gameTranslations;
