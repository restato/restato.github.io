import { Metadata } from 'next';

export interface LocalizedContent {
  ko: string;
  en: string;
  ja: string;
  zh: string;
  es: string;
  fr: string;
  de: string;
  ru: string;
  hi: string;
}

export interface SEOConfig {
  title: LocalizedContent;
  description: LocalizedContent;
  keywords: LocalizedContent;
  ogImage?: string;
  path?: string;
}

export const defaultSEO: SEOConfig = {
  title: {
    ko: "럭키 드로우 게임 - 재미있는 랜덤 게임",
    en: "Lucky Draw Games - Fun Random Games",
    ja: "ラッキードローゲーム - 楽しいランダムゲーム",
    zh: "幸运抽奖游戏 - 有趣的随机游戏",
    es: "Juegos de Sorteo - Juegos Aleatorios Divertidos",
    fr: "Jeux de Tirage au Sort - Jeux Aléatoires Amusants",
    de: "Glücksspiele - Lustige Zufallsspiele",
    ru: "Игры на Удачу - Веселые Случайные Игры",
    hi: "भाग्यशाली ड्रॉ गेम्स - मजेदार रैंडम गेम्स"
  },
  description: {
    ko: "온라인에서 즐기는 재미있고 공정한 랜덤 게임들! 룰렛, 빙고, 복권, 주사위, 카드 게임 등 다양한 게임을 무료로 플레이하세요.",
    en: "Fun and fair random games online! Play roulette, bingo, lottery, dice, card games and more for free.",
    ja: "オンラインで楽しめる公平なランダムゲーム！ルーレット、ビンゴ、宝くじ、サイコロ、カードゲームなどを無料でプレイ。",
    zh: "在线享受有趣公平的随机游戏！免费玩轮盘、宾果、彩票、骰子、纸牌游戏等。",
    es: "¡Juegos aleatorios divertidos y justos en línea! Juega ruleta, bingo, lotería, dados, cartas y más gratis.",
    fr: "Jeux aléatoires amusants et équitables en ligne ! Jouez à la roulette, bingo, loterie, dés, cartes et plus gratuitement.",
    de: "Lustige und faire Zufallsspiele online! Spielen Sie Roulette, Bingo, Lotterie, Würfel, Kartenspiele und mehr kostenlos.",
    ru: "Веселые и честные случайные игры онлайн! Играйте в рулетку, бинго, лотерею, кости, карточные игры и многое другое бесплатно.",
    hi: "मज़ेदार और निष्पक्ष ऑनलाइन रैंडम गेम्स! रूले, बिंगो, लॉटरी, पासा, कार्ड गेम्स और बहुत कुछ मुफ्त में खेलें।"
  },
  keywords: {
    ko: "룰렛, 빙고, 복권, 주사위, 랜덤 게임, 럭키 드로우, 추첨, 온라인 게임, 무료 게임",
    en: "roulette, bingo, lottery, dice, random games, lucky draw, raffle, online games, free games",
    ja: "ルーレット, ビンゴ, 宝くじ, サイコロ, ランダムゲーム, 抽選, オンラインゲーム, 無料ゲーム",
    zh: "轮盘, 宾果, 彩票, 骰子, 随机游戏, 幸运抽奖, 抽奖, 在线游戏, 免费游戏",
    es: "ruleta, bingo, lotería, dados, juegos aleatorios, sorteo, rifa, juegos online, juegos gratis",
    fr: "roulette, bingo, loterie, dés, jeux aléatoires, tirage au sort, tombola, jeux en ligne, jeux gratuits",
    de: "roulette, bingo, lotterie, würfel, zufallsspiele, verlosung, tombola, online spiele, kostenlose spiele",
    ru: "рулетка, бинго, лотерея, кости, случайные игры, розыгрыш, лотерея, онлайн игры, бесплатные игры",
    hi: "रूले, बिंगो, लॉटरी, पासा, रैंडम गेम्स, भाग्यशाली ड्रॉ, रैफल, ऑनलाइन गेम्स, मुफ्त गेम्स"
  }
};

export const gamesSEO: Record<string, SEOConfig> = {
  'wheel-of-fortune': {
    title: {
      ko: "운명의 룰렛 - 온라인 룰렛 게임",
      en: "Wheel of Fortune - Online Roulette Game",
      ja: "運命のルーレット - オンラインルーレットゲーム",
      zh: "命运之轮 - 在线轮盘游戏",
      es: "Rueda de la Fortuna - Juego de Ruleta Online",
      fr: "Roue de la Fortune - Jeu de Roulette en Ligne",
      de: "Glücksrad - Online Roulette Spiel",
      ru: "Колесо Фортуны - Онлайн Рулетка",
      hi: "भाग्य का चक्र - ऑनलाइन रूले गेम"
    },
    description: {
      ko: "커스터마이징 가능한 온라인 룰렛 게임! 자신만의 항목을 추가하고 공정한 랜덤 선택을 경험하세요. 무료로 플레이할 수 있습니다.",
      en: "Customizable online roulette game! Add your own items and experience fair random selection. Play for free.",
      ja: "カスタマイズ可能なオンラインルーレットゲーム！独自のアイテムを追加して公正なランダム選択を体験。無料でプレイ。",
      zh: "可自定义的在线轮盘游戏！添加您自己的项目，体验公平的随机选择。免费游戏。",
      es: "¡Juego de ruleta online personalizable! Añade tus propios elementos y experimenta una selección aleatoria justa. Juega gratis.",
      fr: "Jeu de roulette en ligne personnalisable ! Ajoutez vos propres éléments et vivez une sélection aléatoire équitable. Jouez gratuitement.",
      de: "Anpassbares Online-Roulette-Spiel! Fügen Sie Ihre eigenen Elemente hinzu und erleben Sie faire Zufallsauswahl. Kostenlos spielen.",
      ru: "Настраиваемая онлайн рулетка! Добавляйте свои элементы и испытайте честный случайный выбор. Играйте бесплатно.",
      hi: "अनुकूलन योग्य ऑनलाइन रूले गेम! अपने आइटम जोड़ें और निष्पक्ष रैंडम चयन का अनुभव करें। मुफ्त में खेलें।"
    },
    keywords: {
      ko: "룰렛, 운명의 룰렛, 랜덤 선택, 커스텀 룰렛, 온라인 룰렛, 무료 룰렛 게임",
      en: "roulette, wheel of fortune, random picker, custom roulette, online roulette, free roulette game",
      ja: "ルーレット, 運命のルーレット, ランダム選択, カスタムルーレット, オンラインルーレット, 無料ルーレットゲーム",
      zh: "轮盘, 命运之轮, 随机选择, 自定义轮盘, 在线轮盘, 免费轮盘游戏",
      es: "ruleta, rueda de la fortuna, selector aleatorio, ruleta personalizada, ruleta online, juego de ruleta gratis",
      fr: "roulette, roue de la fortune, sélecteur aléatoire, roulette personnalisée, roulette en ligne, jeu de roulette gratuit",
      de: "roulette, glücksrad, zufallsauswahl, benutzerdefinierte roulette, online roulette, kostenloses roulette spiel",
      ru: "рулетка, колесо фортуны, случайный выбор, настраиваемая рулетка, онлайн рулетка, бесплатная игра рулетка",
      hi: "रूले, भाग्य का चक्र, रैंडम चयनकर्ता, कस्टम रूले, ऑनलाइन रूले, मुफ्त रूले गेम"
    }
  }
};

export function generateMetadata(
  config: SEOConfig,
  locale: keyof LocalizedContent = 'ko',
  path?: string
): Metadata {
  const baseUrl = 'https://restato.github.io';
  const currentPath = path || '';
  const fullUrl = `${baseUrl}${currentPath}`;

  // Generate alternate language URLs
  const alternates: Record<string, string> = {};
  Object.keys(config.title).forEach(lang => {
    alternates[lang] = `${baseUrl}/${lang}${currentPath}`;
  });

  return {
    title: config.title[locale],
    description: config.description[locale],
    keywords: config.keywords[locale],
    openGraph: {
      title: config.title[locale],
      description: config.description[locale],
      url: fullUrl,
      siteName: config.title[locale],
      images: [
        {
          url: config.ogImage || '/og-image.png',
          width: 1200,
          height: 630,
          alt: config.title[locale],
        },
      ],
      locale: locale === 'ko' ? 'ko_KR' : 
              locale === 'en' ? 'en_US' :
              locale === 'ja' ? 'ja_JP' :
              locale === 'zh' ? 'zh_CN' :
              locale === 'es' ? 'es_ES' :
              locale === 'fr' ? 'fr_FR' :
              locale === 'de' ? 'de_DE' :
              locale === 'ru' ? 'ru_RU' :
              locale === 'hi' ? 'hi_IN' : 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title[locale],
      description: config.description[locale],
      images: [config.ogImage || '/og-image.png'],
      creator: '@restato_games',
      site: '@restato_games',
    },
    alternates: {
      canonical: fullUrl,
      languages: alternates,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: "0fZMxYcAOJmZ7jR9XHUZcwKhYUI6EMYHOknVEOpAC-Q",
      other: {
        "naver-site-verification": "8d89472cc05500529db6e589eb04fb89456800e4",
      },
    },
    other: {
      // 네이버 검색 최적화를 위한 추가 메타태그
      'naver-site-verification': '8d89472cc05500529db6e589eb04fb89456800e4',
      'msvalidate.01': 'your-bing-verification-code', // Bing 웹마스터 도구용
    },
  };
}

// 언어별 hreflang 매핑
export const languageMapping: Record<keyof LocalizedContent, string> = {
  ko: 'ko-KR',
  en: 'en-US', 
  ja: 'ja-JP',
  zh: 'zh-CN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  ru: 'ru-RU',
  hi: 'hi-IN',
};

// 국가별 주요 검색어 (네이버, 구글 등 고려)
export const countrySpecificKeywords: Record<keyof LocalizedContent, string[]> = {
  ko: ['네이버 게임', '다음 게임', '온라인 게임', '무료 게임', '랜덤 게임', '추첨 게임'],
  en: ['google games', 'online games', 'free games', 'random games', 'lucky draw'],
  ja: ['yahoo ゲーム', 'google ゲーム', 'オンラインゲーム', '無料ゲーム'],
  zh: ['百度游戏', '谷歌游戏', '在线游戏', '免费游戏', '随机游戏'],
  es: ['juegos google', 'juegos online', 'juegos gratis', 'juegos aleatorios'],
  fr: ['jeux google', 'jeux en ligne', 'jeux gratuits', 'jeux aléatoires'],
  de: ['google spiele', 'online spiele', 'kostenlose spiele', 'zufallsspiele'],
  ru: ['яндекс игры', 'гугл игры', 'онлайн игры', 'бесплатные игры'],
  hi: ['गूगल गेम्स', 'ऑनलाइन गेम्स', 'मुफ्त गेम्स', 'रैंडम गेम्स'],
};
