// 네이버 검색 최적화를 위한 유틸리티

export const naverMetaTags = {
  // 네이버 웹마스터 도구 인증
  verification: '8d89472cc05500529db6e589eb04fb89456800e4',
  
  // 네이버 검색 최적화 메타태그
  description: '온라인에서 즐기는 재미있고 공정한 랜덤 게임들! 룰렛, 빙고, 복권, 주사위, 카드 게임 등 다양한 게임을 무료로 플레이하세요.',
  keywords: '네이버 게임, 다음 게임, 온라인 게임, 무료 게임, 랜덤 게임, 추첨 게임, 룰렛, 빙고, 복권, 주사위',
  
  // 네이버 블로그/카페 최적화 키워드
  blogKeywords: [
    '네이버 게임 추천',
    '무료 온라인 게임',
    '랜덤 게임 사이트', 
    '룰렛 게임 무료',
    '온라인 추첨 게임',
    '심심할때 할 게임',
    '브라우저 게임 추천'
  ],
  
  // 네이버 검색 트렌드 키워드 (2024년 기준)
  trendingKeywords: [
    '온라인 게임',
    '무료 게임',
    '브라우저 게임', 
    '심심풀이 게임',
    '랜덤 선택',
    '운명의 룰렛',
    '추첨 프로그램'
  ]
};

// 네이버 검색 로봇을 위한 메타태그 생성
export function generateNaverMeta(pageType: 'home' | 'game', gameName?: string) {
  const baseTitle = '럭키 드로우 게임 - 재미있는 랜덤 게임';
  const gameTitle = gameName ? `${gameName} - ${baseTitle}` : baseTitle;
  
  return {
    title: gameTitle,
    description: pageType === 'game' && gameName 
      ? `${gameName}을 무료로 플레이하세요! 공정한 랜덤 알고리즘으로 결과를 생성합니다.`
      : naverMetaTags.description,
    keywords: pageType === 'game' && gameName
      ? `${gameName}, ${naverMetaTags.keywords}`
      : naverMetaTags.keywords,
    
    // 네이버 검색 봇 최적화
    robots: 'index,follow',
    revisitAfter: '7 days',
    
    // 네이버 뉴스/블로그 수집 최적화
    articleTag: pageType === 'game' ? gameName : '온라인 게임',
    classification: '게임/오락',
    
    // 네이버 모바일 최적화
    mobileOptimized: 'width=device-width',
    handHeldFriendly: 'true',
  };
}

// 네이버 검색 노출을 위한 구조화된 데이터
export function generateNaverStructuredData(pageType: 'home' | 'game', gameName?: string) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '럭키 드로우 게임',
    alternateName: ['랜덤 게임', '온라인 게임', '무료 게임'],
    url: 'https://restato.github.io',
    description: naverMetaTags.description,
    inLanguage: 'ko-KR',
    publisher: {
      '@type': 'Organization',
      name: 'Restato Games',
      url: 'https://restato.github.io'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://restato.github.io/games/{search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  if (pageType === 'game' && gameName) {
    return {
      ...baseData,
      '@type': 'Game',
      name: gameName,
      genre: '랜덤 게임',
      gamePlatform: '웹 브라우저',
      operatingSystem: '모든 OS',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'KRW',
        availability: 'https://schema.org/InStock'
      }
    };
  }

  return baseData;
}

// 네이버 검색 최적화를 위한 콘텐츠 가이드라인
export const naverContentGuidelines = {
  // 제목 최적화 (네이버는 30자 이내 권장)
  titleLength: { min: 10, max: 30 },
  
  // 설명 최적화 (네이버는 160자 이내 권장)
  descriptionLength: { min: 50, max: 160 },
  
  // 키워드 최적화 (네이버는 5-10개 권장)
  keywordCount: { min: 5, max: 10 },
  
  // 네이버 검색 노출을 위한 필수 요소
  requiredElements: [
    'title',
    'meta description', 
    'h1 태그',
    'alt 속성',
    '내부 링크',
    '구조화된 데이터'
  ],
  
  // 네이버 검색 품질 가이드라인
  qualityFactors: [
    '독창적인 콘텐츠',
    '정확한 정보',
    '사용자 경험',
    '모바일 최적화',
    '빠른 로딩 속도',
    '정기적인 업데이트'
  ]
};
