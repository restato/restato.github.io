'use client';

import Script from 'next/script';

interface GameStructuredDataProps {
  gameName: string;
  gameDescription: string;
  gameUrl: string;
  gameType: string;
  language?: string;
}

export function GameStructuredData({
  gameName,
  gameDescription,
  gameUrl,
  gameType,
  language = 'ko'
}: GameStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Game",
    "name": gameName,
    "description": gameDescription,
    "url": gameUrl,
    "gameItem": {
      "@type": "Thing",
      "name": gameName
    },
    "genre": "랜덤 게임",
    "gamePlatform": "웹 브라우저",
    "operatingSystem": "모든 OS",
    "applicationCategory": "Game",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW",
      "availability": "https://schema.org/InStock"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Restato Games",
      "url": "https://restato.github.io"
    },
    "inLanguage": language,
    "isAccessibleForFree": true,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/PlayAction",
      "userInteractionCount": "1000+"
    }
  };

  return (
    <Script id={`game-structured-data-${gameType}`} type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  );
}

interface WebPageStructuredDataProps {
  title: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function WebPageStructuredData({
  title,
  description,
  url,
  breadcrumbs = []
}: WebPageStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    "isPartOf": {
      "@type": "WebSite",
      "name": "럭키 드로우 게임",
      "url": "https://restato.github.io"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "이 게임은 무료인가요?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "네, 모든 게임은 완전히 무료로 플레이할 수 있습니다."
          }
        },
        {
          "@type": "Question", 
          "name": "게임 결과는 공정한가요?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "네, 모든 게임은 공정한 랜덤 알고리즘을 사용하여 결과를 생성합니다."
          }
        },
        {
          "@type": "Question",
          "name": "모바일에서도 플레이할 수 있나요?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "네, 모든 게임은 모바일 기기에서도 완벽하게 작동합니다."
          }
        }
      ]
    }
  };

  return (
    <Script id="webpage-structured-data" type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  );
}

// 조직 정보 구조화된 데이터
export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Restato Games",
    "url": "https://restato.github.io",
    "logo": "https://restato.github.io/logo.png",
    "description": "온라인 랜덤 게임 플랫폼",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Korean", "English", "Japanese", "Chinese", "Spanish", "French", "German", "Russian", "Hindi"]
    },
    "sameAs": [
      "https://github.com/restato"
    ]
  };

  return (
    <Script id="organization-structured-data" type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  );
}
