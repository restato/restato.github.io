export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-CJKYE91FQM';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 게임 관련 이벤트 추적을 위한 헬퍼 함수들
export const trackGameStart = (gameName: string) => {
  event({
    action: 'game_start',
    category: 'Games',
    label: gameName,
  });
};

export const trackGameEnd = (gameName: string, result?: string) => {
  event({
    action: 'game_end',
    category: 'Games',
    label: `${gameName}_${result || 'completed'}`,
  });
};

export const trackLanguageChange = (language: string) => {
  event({
    action: 'language_change',
    category: 'User Interaction',
    label: language,
  });
};

export const trackColorModeChange = (mode: string) => {
  event({
    action: 'color_mode_change',
    category: 'User Interaction',
    label: mode,
  });
};
