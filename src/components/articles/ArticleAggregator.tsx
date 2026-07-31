import { useState, useEffect, useCallback } from 'react';

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';
const STORAGE_KEY = 'article-aggregator-data';

interface Article {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceId: string;
  sourceColor: string;
  sourceCategory: 'global' | 'korea' | 'tech-blog' | 'social';
  thumbnail?: string;
}

interface FeedSource {
  id: string;
  name: string;
  color: string;
  rssUrl?: string;
  directUrl: string;
  icon: string;
  description: string;
  type: 'rss' | 'link-only';
  category: 'global' | 'korea' | 'tech-blog' | 'social';
}

interface PickedArticle {
  id: string;
  title: string;
  link: string;
  description: string;
  memo?: string;
  addedAt: string;
}

interface StoredData {
  customSources: FeedSource[];
  pickedArticles: PickedArticle[];
  disabledSources: string[];
  lastUpdated?: string;
}

// 기본 RSS 피드 소스
const defaultFeedSources: FeedSource[] = [
  // === 글로벌 뉴스/커뮤니티 ===
  {
    id: 'geeknews',
    name: 'GeekNews',
    color: '#FF6B6B',
    rssUrl: 'https://news.hada.io/rss',
    directUrl: 'https://news.hada.io',
    icon: '📰',
    description: '개발/기술/스타트업 뉴스',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    color: '#FF6600',
    rssUrl: 'https://hnrss.org/frontpage',
    directUrl: 'https://news.ycombinator.com',
    icon: '🔶',
    description: 'Y Combinator 뉴스',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'devto',
    name: 'DEV.to',
    color: '#0A0A0A',
    rssUrl: 'https://dev.to/feed',
    directUrl: 'https://dev.to',
    icon: '👩‍💻',
    description: '개발자 커뮤니티',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    color: '#00A562',
    rssUrl: 'https://techcrunch.com/feed/',
    directUrl: 'https://techcrunch.com',
    icon: '💚',
    description: '테크 뉴스',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'producthunt',
    name: 'Product Hunt',
    color: '#DA552F',
    rssUrl: 'https://www.producthunt.com/feed',
    directUrl: 'https://www.producthunt.com',
    icon: '🐱',
    description: '신규 제품/서비스',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'infoq',
    name: 'InfoQ',
    color: '#007ACC',
    rssUrl: 'https://feed.infoq.com/',
    directUrl: 'https://www.infoq.com',
    icon: '📊',
    description: '소프트웨어 개발 뉴스',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'lobsters',
    name: 'Lobsters',
    color: '#AC130D',
    rssUrl: 'https://lobste.rs/rss',
    directUrl: 'https://lobste.rs',
    icon: '🦞',
    description: '프로그래밍 커뮤니티',
    type: 'rss',
    category: 'global',
  },

  // === 한국 매거진/커뮤니티 ===
  {
    id: 'yozm',
    name: '요즘IT',
    color: '#5B4FFF',
    rssUrl: 'https://yozm.wishket.com/magazine/feed/',
    directUrl: 'https://yozm.wishket.com',
    icon: '💜',
    description: '개발자 매거진',
    type: 'rss',
    category: 'korea',
  },

  // === 글로벌 빅테크 기술 블로그 ===
  {
    id: 'netflix',
    name: 'Netflix Tech',
    color: '#E50914',
    rssUrl: 'https://netflixtechblog.com/feed',
    directUrl: 'https://netflixtechblog.com',
    icon: '🎬',
    description: 'Netflix 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'uber',
    name: 'Uber Engineering',
    color: '#000000',
    rssUrl: 'https://eng.uber.com/feed/',
    directUrl: 'https://eng.uber.com',
    icon: '🚗',
    description: 'Uber 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'doordash',
    name: 'DoorDash',
    color: '#FF3008',
    rssUrl: 'https://doordash.engineering/feed/',
    directUrl: 'https://doordash.engineering',
    icon: '🚪',
    description: 'DoorDash 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'airbnb',
    name: 'Airbnb Tech',
    color: '#FF5A5F',
    rssUrl: 'https://medium.com/feed/airbnb-engineering',
    directUrl: 'https://medium.com/airbnb-engineering',
    icon: '🏠',
    description: 'Airbnb 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'spotify',
    name: 'Spotify Engineering',
    color: '#1DB954',
    rssUrl: 'https://engineering.atspotify.com/feed/',
    directUrl: 'https://engineering.atspotify.com',
    icon: '🎵',
    description: 'Spotify 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'stripe',
    name: 'Stripe Blog',
    color: '#635BFF',
    rssUrl: 'https://stripe.com/blog/feed.rss',
    directUrl: 'https://stripe.com/blog',
    icon: '💳',
    description: 'Stripe 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'github',
    name: 'GitHub Blog',
    color: '#24292E',
    rssUrl: 'https://github.blog/feed/',
    directUrl: 'https://github.blog',
    icon: '🐙',
    description: 'GitHub 공식 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Blog',
    color: '#F38020',
    rssUrl: 'https://blog.cloudflare.com/rss/',
    directUrl: 'https://blog.cloudflare.com',
    icon: '☁️',
    description: 'Cloudflare 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'discord',
    name: 'Discord Blog',
    color: '#5865F2',
    rssUrl: 'https://discord.com/blog/rss.xml',
    directUrl: 'https://discord.com/blog',
    icon: '🎮',
    description: 'Discord 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'slack',
    name: 'Slack Engineering',
    color: '#4A154B',
    rssUrl: 'https://slack.engineering/feed/',
    directUrl: 'https://slack.engineering',
    icon: '💬',
    description: 'Slack 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'dropbox',
    name: 'Dropbox Tech',
    color: '#0061FF',
    rssUrl: 'https://dropbox.tech/feed',
    directUrl: 'https://dropbox.tech',
    icon: '📦',
    description: 'Dropbox 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'pinterest',
    name: 'Pinterest Engineering',
    color: '#E60023',
    rssUrl: 'https://medium.com/feed/pinterest-engineering',
    directUrl: 'https://medium.com/pinterest-engineering',
    icon: '📌',
    description: 'Pinterest 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'lyft',
    name: 'Lyft Engineering',
    color: '#FF00BF',
    rssUrl: 'https://eng.lyft.com/feed',
    directUrl: 'https://eng.lyft.com',
    icon: '🚘',
    description: 'Lyft 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'linkedin-eng',
    name: 'LinkedIn Engineering',
    color: '#0A66C2',
    rssUrl: 'https://engineering.linkedin.com/blog.rss',
    directUrl: 'https://engineering.linkedin.com',
    icon: '💼',
    description: 'LinkedIn 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'shopify',
    name: 'Shopify Engineering',
    color: '#96BF48',
    rssUrl: 'https://shopify.engineering/blog.atom',
    directUrl: 'https://shopify.engineering',
    icon: '🛒',
    description: 'Shopify 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'atlassian',
    name: 'Atlassian Engineering',
    color: '#0052CC',
    rssUrl: 'https://www.atlassian.com/blog/feed',
    directUrl: 'https://www.atlassian.com/blog',
    icon: '🔷',
    description: 'Atlassian 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'mozilla',
    name: 'Mozilla Hacks',
    color: '#FF7139',
    rssUrl: 'https://hacks.mozilla.org/feed/',
    directUrl: 'https://hacks.mozilla.org',
    icon: '🦊',
    description: 'Mozilla 개발 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'vercel',
    name: 'Vercel Blog',
    color: '#000000',
    rssUrl: 'https://vercel.com/atom',
    directUrl: 'https://vercel.com/blog',
    icon: '▲',
    description: 'Vercel 공식 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'databricks',
    name: 'Databricks Blog',
    color: '#FF3621',
    rssUrl: 'https://www.databricks.com/blog/feed',
    directUrl: 'https://www.databricks.com/blog',
    icon: '🧱',
    description: 'Databricks 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'hashicorp',
    name: 'HashiCorp Blog',
    color: '#000000',
    rssUrl: 'https://www.hashicorp.com/blog/feed.xml',
    directUrl: 'https://www.hashicorp.com/blog',
    icon: '🔐',
    description: 'HashiCorp 기술 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'figma',
    name: 'Figma Blog',
    color: '#F24E1E',
    rssUrl: 'https://www.figma.com/blog/feed/',
    directUrl: 'https://www.figma.com/blog',
    icon: '🎨',
    description: 'Figma 블로그',
    type: 'rss',
    category: 'tech-blog',
  },
  {
    id: 'notion',
    name: 'Notion Blog',
    color: '#000000',
    rssUrl: 'https://www.notion.so/blog/rss.xml',
    directUrl: 'https://www.notion.so/blog',
    icon: '📓',
    description: 'Notion 공식 블로그',
    type: 'rss',
    category: 'tech-blog',
  },

  // === 개발자 매거진/블로그 ===
  {
    id: 'css-tricks',
    name: 'CSS-Tricks',
    color: '#F8A427',
    rssUrl: 'https://css-tricks.com/feed/',
    directUrl: 'https://css-tricks.com',
    icon: '🎭',
    description: 'CSS/프론트엔드 팁',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'smashing',
    name: 'Smashing Magazine',
    color: '#D33A2C',
    rssUrl: 'https://www.smashingmagazine.com/feed/',
    directUrl: 'https://www.smashingmagazine.com',
    icon: '💥',
    description: '웹 개발/디자인 매거진',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'freecodecamp',
    name: 'freeCodeCamp',
    color: '#0A0A23',
    rssUrl: 'https://www.freecodecamp.org/news/rss/',
    directUrl: 'https://www.freecodecamp.org/news',
    icon: '🏕️',
    description: '무료 코딩 교육',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'martinfowler',
    name: 'Martin Fowler',
    color: '#4A4A4A',
    rssUrl: 'https://martinfowler.com/feed.atom',
    directUrl: 'https://martinfowler.com',
    icon: '👨‍🏫',
    description: '소프트웨어 아키텍처',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'pragmatic',
    name: 'The Pragmatic Engineer',
    color: '#1A1A1A',
    rssUrl: 'https://newsletter.pragmaticengineer.com/feed',
    directUrl: 'https://newsletter.pragmaticengineer.com',
    icon: '🛠️',
    description: '실용주의 개발자 뉴스레터',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'bytebytego',
    name: 'ByteByteGo',
    color: '#FF5733',
    rssUrl: 'https://blog.bytebytego.com/feed',
    directUrl: 'https://blog.bytebytego.com',
    icon: '🔧',
    description: '시스템 디자인 뉴스레터',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'tldr',
    name: 'TLDR Newsletter',
    color: '#10B981',
    rssUrl: 'https://tldr.tech/api/rss/tech',
    directUrl: 'https://tldr.tech',
    icon: '📬',
    description: '테크 뉴스 요약',
    type: 'rss',
    category: 'global',
  },
  {
    id: 'hackernewsletter',
    name: 'Hacker Newsletter',
    color: '#FF6600',
    rssUrl: 'https://hackernewsletter.com/rss.xml',
    directUrl: 'https://hackernewsletter.com',
    icon: '📩',
    description: 'HN 주간 큐레이션',
    type: 'rss',
    category: 'global',
  },

  // === 한국 기술 블로그 ===
  {
    id: 'kakao',
    name: '카카오 기술블로그',
    color: '#FEE500',
    rssUrl: 'https://tech.kakao.com/feed/',
    directUrl: 'https://tech.kakao.com',
    icon: '💬',
    description: '카카오 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'woowahan',
    name: '우아한형제들',
    color: '#2AC1BC',
    rssUrl: 'https://techblog.woowahan.com/feed/',
    directUrl: 'https://techblog.woowahan.com',
    icon: '🍔',
    description: '배민 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'toss',
    name: '토스 기술블로그',
    color: '#0064FF',
    rssUrl: 'https://toss.tech/rss.xml',
    directUrl: 'https://toss.tech',
    icon: '💙',
    description: '토스 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'line',
    name: 'LINE Engineering',
    color: '#00C300',
    rssUrl: 'https://engineering.linecorp.com/ko/feed/',
    directUrl: 'https://engineering.linecorp.com/ko',
    icon: '💚',
    description: '라인 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'naver',
    name: 'NAVER D2',
    color: '#03C75A',
    rssUrl: 'https://d2.naver.com/d2.atom',
    directUrl: 'https://d2.naver.com',
    icon: '🟢',
    description: '네이버 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'daangn',
    name: '당근마켓',
    color: '#FF6F0F',
    rssUrl: 'https://medium.com/feed/daangn',
    directUrl: 'https://medium.com/daangn',
    icon: '🥕',
    description: '당근마켓 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'coupang',
    name: '쿠팡 기술블로그',
    color: '#F22C2C',
    rssUrl: 'https://medium.com/feed/coupang-engineering',
    directUrl: 'https://medium.com/coupang-engineering',
    icon: '📈',
    description: '쿠팡 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'banksalad',
    name: '뱅크샐러드',
    color: '#00D26A',
    rssUrl: 'https://blog.banksalad.com/feed.xml',
    directUrl: 'https://blog.banksalad.com',
    icon: '🥗',
    description: '뱅크샐러드 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'ridi',
    name: '리디',
    color: '#1E9EFF',
    rssUrl: 'https://ridicorp.com/feed/',
    directUrl: 'https://ridicorp.com/story-category/tech-blog',
    icon: '📚',
    description: '리디 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'devsisters',
    name: '데브시스터즈',
    color: '#F5A623',
    rssUrl: 'https://tech.devsisters.com/rss.xml',
    directUrl: 'https://tech.devsisters.com',
    icon: '🍪',
    description: '쿠키런 개발사 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'hyperconnect',
    name: '하이퍼커넥트',
    color: '#FF3366',
    rssUrl: 'https://hyperconnect.github.io/feed.xml',
    directUrl: 'https://hyperconnect.github.io',
    icon: '💑',
    description: '아자르 개발사 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'nhn',
    name: 'NHN Cloud',
    color: '#1D5CFE',
    rssUrl: 'https://meetup.nhncloud.com/rss',
    directUrl: 'https://meetup.nhncloud.com',
    icon: '☁️',
    description: 'NHN 클라우드 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'watcha',
    name: '왓챠',
    color: '#FF0558',
    rssUrl: 'https://medium.com/feed/watcha',
    directUrl: 'https://medium.com/watcha',
    icon: '🎬',
    description: '왓챠 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'spoqa',
    name: '스포카',
    color: '#4766FF',
    rssUrl: 'https://spoqa.github.io/rss',
    directUrl: 'https://spoqa.github.io',
    icon: '🏪',
    description: '도도포인트 개발사 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
  {
    id: 'kakaoenterprise',
    name: '카카오엔터프라이즈',
    color: '#FEE500',
    rssUrl: 'https://tech.kakaoenterprise.com/feed',
    directUrl: 'https://tech.kakaoenterprise.com',
    icon: '🏢',
    description: '카카오엔터프라이즈 기술 블로그',
    type: 'rss',
    category: 'korea',
  },
];


const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return '방금 전';
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
};

const formatDateKey = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const loadStoredData = (): StoredData => {
  if (typeof window === 'undefined') {
    return { customSources: [], pickedArticles: [], disabledSources: [] };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load stored data:', e);
  }
  return { customSources: [], pickedArticles: [], disabledSources: [] };
};

const saveStoredData = (data: StoredData) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};

const loadFromGithub = async (): Promise<StoredData | null> => {
  try {
    const response = await fetch('/data/articles.json');
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error('Failed to load from static file:', e);
  }
  return null;
};

const groupByDate = (articles: PickedArticle[]): Map<string, PickedArticle[]> => {
  const groups = new Map<string, PickedArticle[]>();
  articles.forEach((article) => {
    const dateKey = formatDateKey(article.addedAt);
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, article]);
  });
  return groups;
};

export default function ArticleAggregator() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'picks'>('feed');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [customSources, setCustomSources] = useState<FeedSource[]>([]);
  const [pickedArticles, setPickedArticles] = useState<PickedArticle[]>([]);

  const [selectedSourceFilters, setSelectedSourceFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allFeedSources = [...defaultFeedSources, ...customSources];

  // 전체 소스를 이름순으로 정렬
  const sortedSources = [...allFeedSources].sort((a, b) => a.name.localeCompare(b.name, 'ko'));

  // 카테고리별 소스 (정렬됨)
  const sourcesByCategory = {
    korea: sortedSources.filter((s) => s.category === 'korea'),
    global: sortedSources.filter((s) => s.category === 'global'),
    'tech-blog': sortedSources.filter((s) => s.category === 'tech-blog'),
  };

  // 소스 필터 토글
  const toggleSourceFilter = (sourceId: string) => {
    setSelectedSourceFilters((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  // 카테고리 전체 선택/해제
  const toggleCategoryAll = (category: 'korea' | 'global' | 'tech-blog') => {
    const categorySourceIds = sourcesByCategory[category].map((s) => s.id);
    const allSelected = categorySourceIds.every((id) => selectedSourceFilters.includes(id));

    if (allSelected) {
      // 전체 해제
      setSelectedSourceFilters((prev) => prev.filter((id) => !categorySourceIds.includes(id)));
    } else {
      // 전체 선택
      setSelectedSourceFilters((prev) => [...new Set([...prev, ...categorySourceIds])]);
    }
  };

  // 전체 필터 초기화
  const clearAllFilters = () => {
    setSelectedSourceFilters([]);
  };

  // 초기 데이터 로드
  useEffect(() => {
    const initData = async () => {
      // GitHub 데이터 로드 (공개 데이터)
      const githubData = await loadFromGithub();
      if (githubData && (githubData.pickedArticles?.length > 0 || githubData.customSources?.length > 0)) {
        setCustomSources(githubData.customSources || []);
        setPickedArticles(githubData.pickedArticles || []);
        saveStoredData(githubData);
      } else {
        const stored = loadStoredData();
        setCustomSources(stored.customSources || []);
        setPickedArticles(stored.pickedArticles || []);
      }

      // 모든 소스 활성화 (소스 토글 기능이 제거되어 disabledSources 무시)
      const stored = loadStoredData();
      const allSources = [...defaultFeedSources, ...(stored.customSources || [])];
      setSelectedSources(allSources.map((s) => s.id));
    };

    initData();
  }, []);

  const fetchRssFeed = async (source: FeedSource): Promise<Article[]> => {
    if (!source.rssUrl) return [];

    try {
      const response = await fetch(`${RSS2JSON_API}${encodeURIComponent(source.rssUrl)}`);
      if (!response.ok) throw new Error('피드 로딩 실패');

      const data = await response.json();
      if (data.status !== 'ok') throw new Error(data.message || '피드 파싱 실패');

      return data.items.slice(0, 8).map(
        (item: {
          guid?: string;
          link: string;
          title: string;
          description?: string;
          content?: string;
          pubDate: string;
          thumbnail?: string;
          enclosure?: { link?: string };
        }) => ({
          id: `${source.id}-${item.guid || item.link}`,
          title: item.title,
          link: item.link,
          description: stripHtml(item.description || item.content || '').slice(0, 200),
          pubDate: item.pubDate,
          source: source.name,
          sourceId: source.id,
          sourceColor: source.color,
          sourceCategory: source.category,
          thumbnail: item.thumbnail || item.enclosure?.link,
        })
      );
    } catch (err) {
      console.error(`Failed to fetch ${source.name}:`, err);
      return [];
    }
  };

  const fetchAllFeeds = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      const activeSources = allFeedSources.filter((s) => selectedSources.includes(s.id));
      const results = await Promise.all(activeSources.map(fetchRssFeed));

      const allArticles = results.flat().sort((a, b) => {
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      });

      setArticles(allArticles);
    } catch (err) {
      setError('피드를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [selectedSources, customSources]);

  useEffect(() => {
    if (selectedSources.length > 0) {
      fetchAllFeeds();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSources.length]);

  // 선택된 소스로 필터링된 아티클 (선택된 게 없으면 전체 표시)
  const filteredArticles = selectedSourceFilters.length === 0
    ? articles
    : articles.filter((a) => selectedSourceFilters.includes(a.sourceId));

  // 날짜별 그룹화된 Pick
  const groupedPicks = groupByDate(pickedArticles);

  return (
    <div className="space-y-6">
      <section className="fc-surface fc-surface-padding-md">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">아티클 피드</h2>
          <a
            href="/articles/admin"
            className="fc-button fc-button-secondary text-sm"
          >
            🔐 관리자
          </a>
        </div>
        <p className="mb-4 text-[var(--text-muted)]">개발/기술 뉴스를 한 곳에서 모아보세요</p>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="fc-chip">
            <span className="text-[var(--text-muted)]">RSS</span>
            <span className="ml-2 font-bold">{allFeedSources.length}</span>
          </div>
          <div className="fc-chip">
            <span className="text-[var(--text-muted)]">아티클</span>
            <span className="ml-2 font-bold">{filteredArticles.length}</span>
          </div>
          {pickedArticles.length > 0 && (
            <div className="fc-chip">
              <span className="text-[var(--text-muted)]">수집</span>
              <span className="ml-2 font-bold">{pickedArticles.length}</span>
            </div>
          )}
          <button
            onClick={fetchAllFeeds}
            disabled={refreshing}
            className="fc-button fc-button-primary text-sm disabled:opacity-50"
          >
            {refreshing ? '로딩...' : '🔄 새로고침'}
          </button>
        </div>
      </section>

      {/* 탭 */}
      <div className="flex gap-2 overflow-x-auto border-b border-[var(--border-subtle)]">
        {[
          { id: 'feed', label: '📰 피드' },
          { id: 'picks', label: `⭐ 수집함${pickedArticles.length > 0 ? ` (${pickedArticles.length})` : ''}` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`fc-button fc-button-quiet whitespace-nowrap rounded-b-none ${
              activeTab === tab.id
                ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                : 'text-[var(--text-muted)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 피드 탭 */}
      {activeTab === 'feed' && (
        <div>
          {/* 필터 버튼 */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="fc-button fc-button-secondary mb-4 w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🔍</span>
              <span className="font-medium">소스 필터</span>
              {selectedSourceFilters.length > 0 && (
                <span className="fc-chip min-h-0 py-0.5 text-xs text-[var(--accent)]">
                  {selectedSourceFilters.length}개 선택
                </span>
              )}
            </div>
            <span className="text-[var(--text-muted)]">▼</span>
          </button>

          {/* 바텀시트 모달 */}
          {isFilterOpen && (
            <>
              {/* 오버레이 */}
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsFilterOpen(false)}
              />
              {/* 바텀시트 */}
              <div className="fc-surface fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-hidden rounded-b-none bg-[var(--surface-page)] animate-slide-up">
                {/* 핸들 */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="h-1 w-10 rounded-full bg-[var(--border-subtle)]" />
                </div>
                {/* 헤더 */}
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 pb-3">
                  <h3 className="font-semibold text-lg">소스 필터</h3>
                  <div className="flex items-center gap-2">
                    {selectedSourceFilters.length > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="fc-button fc-button-quiet px-2 text-sm text-[var(--accent)]"
                      >
                        초기화
                      </button>
                    )}
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="fc-button fc-button-quiet w-11 px-0"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {/* 필터 내용 */}
                <div className="p-4 overflow-y-auto max-h-[calc(80vh-100px)]">
                  <div className="mb-4 text-sm text-[var(--text-muted)]">
                    {selectedSourceFilters.length > 0
                      ? `${selectedSourceFilters.length}개 소스 선택됨`
                      : '전체 소스 표시 중'}
                  </div>

                  {/* 🇰🇷 한국 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => toggleCategoryAll('korea')}
                        className={`fc-button min-h-0 px-2.5 py-1 text-xs ${
                          sourcesByCategory.korea.every((s) => selectedSourceFilters.includes(s.id))
                            ? 'fc-button-primary'
                            : 'fc-button-secondary text-[var(--text-muted)]'
                        }`}
                      >
                        🇰🇷 한국 전체 ({sourcesByCategory.korea.length})
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 border-l-2 border-[var(--accent)] pl-3">
                      {sourcesByCategory.korea.map((source) => (
                        <button
                          key={source.id}
                          onClick={() => toggleSourceFilter(source.id)}
                          className={`fc-chip border px-2 py-1 text-xs ${
                            selectedSourceFilters.includes(source.id)
                              ? 'text-white'
                              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--brand)]'
                          }`}
                          style={selectedSourceFilters.includes(source.id) ? { backgroundColor: source.color } : {}}
                        >
                          {source.icon} {source.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 🌍 글로벌 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => toggleCategoryAll('global')}
                        className={`fc-button min-h-0 px-2.5 py-1 text-xs ${
                          sourcesByCategory.global.every((s) => selectedSourceFilters.includes(s.id))
                            ? 'fc-button-primary'
                            : 'fc-button-secondary text-[var(--text-muted)]'
                        }`}
                      >
                        🌍 글로벌 전체 ({sourcesByCategory.global.length})
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 border-l-2 border-[var(--brand)] pl-3">
                      {sourcesByCategory.global.map((source) => (
                        <button
                          key={source.id}
                          onClick={() => toggleSourceFilter(source.id)}
                          className={`fc-chip border px-2 py-1 text-xs ${
                            selectedSourceFilters.includes(source.id)
                              ? 'text-white'
                              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--brand)]'
                          }`}
                          style={selectedSourceFilters.includes(source.id) ? { backgroundColor: source.color } : {}}
                        >
                          {source.icon} {source.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 🏢 기술블로그 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => toggleCategoryAll('tech-blog')}
                        className={`fc-button min-h-0 px-2.5 py-1 text-xs ${
                          sourcesByCategory['tech-blog'].every((s) => selectedSourceFilters.includes(s.id))
                            ? 'fc-button-primary'
                            : 'fc-button-secondary text-[var(--text-muted)]'
                        }`}
                      >
                        🏢 기술블로그 전체 ({sourcesByCategory['tech-blog'].length})
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 border-l-2 border-[var(--accent)] pl-3">
                      {sourcesByCategory['tech-blog'].map((source) => (
                        <button
                          key={source.id}
                          onClick={() => toggleSourceFilter(source.id)}
                          className={`fc-chip border px-2 py-1 text-xs ${
                            selectedSourceFilters.includes(source.id)
                              ? 'text-white'
                              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--brand)]'
                          }`}
                          style={selectedSourceFilters.includes(source.id) ? { backgroundColor: source.color } : {}}
                        >
                          {source.icon} {source.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* 적용 버튼 */}
                <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-page)] p-4">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="fc-button fc-button-primary w-full"
                  >
                    {selectedSourceFilters.length > 0
                      ? `${selectedSourceFilters.length}개 소스로 필터 적용`
                      : '전체 소스 보기'}
                  </button>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="fc-surface animate-pulse p-4">
                  <div className="h-4 bg-[var(--color-border)] rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-[var(--color-border)] rounded w-full mb-2"></div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="fc-empty-state">
              <p className="text-4xl mb-4">📭</p>
              <p>표시할 아티클이 없습니다.</p>
              <p className="text-sm mt-2">소스를 선택하고 새로고침 해주세요.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((article) => (
                <a
                  key={article.id}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fc-surface group block p-4 transition-colors hover:border-[var(--brand)]"
                >
                  <div className="flex items-start gap-4">
                    {article.thumbnail && (
                      <img
                        src={article.thumbnail}
                        alt=""
                        className="w-20 h-20 object-cover rounded-lg shrink-0 hidden sm:block"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: article.sourceColor }}>
                          {article.source}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">{formatDate(article.pubDate)}</span>
                      </div>
                      <h3 className="mb-1 line-clamp-2 font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand)]">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="line-clamp-2 text-sm text-[var(--text-muted)]">{article.description}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-[var(--text-muted)] group-hover:text-[var(--brand)]">↗</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 수집함 탭 - 읽기 전용 */}
      {activeTab === 'picks' && (
        <div className="space-y-6">
          {pickedArticles.length === 0 ? (
            <div className="fc-empty-state">
              <p className="text-4xl mb-4">⭐</p>
              <p>아직 수집한 아티클이 없습니다.</p>
              <p className="text-sm mt-2">
                <a href="/articles/admin" className="text-[var(--brand)] hover:underline">
                  관리자 페이지
                </a>
                에서 아티클을 수집할 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from(groupedPicks.entries()).map(([dateKey, picks]) => (
                <div key={dateKey}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-3 w-3 rounded-full bg-[var(--accent)]"></div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{dateKey}</h3>
                    <span className="text-sm text-[var(--text-muted)]">({picks.length}개)</span>
                  </div>

                  <div className="ml-6 space-y-3 border-l-2 border-[var(--accent)] pl-4">
                    {picks.map((pick) => (
                      <div
                        key={pick.id}
                        className="fc-surface group p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <a
                              href={pick.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="line-clamp-2 font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--brand)]"
                            >
                              {pick.title}
                            </a>
                            {pick.memo && (
                              <p className="fc-surface-soft mt-2 rounded-lg p-2 text-sm text-[var(--accent)]">
                                💬 {pick.memo}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-[var(--text-muted)]">
                              {new Date(pick.addedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <a
                            href={pick.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-[var(--text-muted)] transition-colors hover:text-[var(--brand)]"
                          >
                            ↗
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
