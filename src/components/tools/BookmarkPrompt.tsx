import { useState, useEffect } from 'react';

const STORAGE_KEY = 'restato_bookmark_dismissed';

export default function BookmarkPrompt() {
  const [show, setShow] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Show after 5 seconds of tool usage
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="relative max-w-sm p-4 rounded-xl bg-[var(--color-card)]
        border border-[var(--color-border)] shadow-xl"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-lg
            hover:bg-[var(--color-card-hover)] transition-colors"
          aria-label="닫기"
        >
          <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-3 pr-6">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-medium text-[var(--color-text)] mb-1">
              유용하셨다면 북마크하세요!
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {isMac ? '⌘' : 'Ctrl'} + D를 눌러 북마크에 추가하면<br/>
              다음에 더 쉽게 찾을 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
