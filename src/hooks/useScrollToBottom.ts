import { useEffect, useRef } from 'react';

export function useScrollToBottom<T extends unknown[]>(dependency: T) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    // 메시지가 추가됐을 때만 스크롤 (초기 로드 시 스크롤 방지)
    if (dependency.length > prevLengthRef.current && dependency.length > 0) {
      const container = containerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
    prevLengthRef.current = dependency.length;
  }, [dependency]);

  return containerRef;
}
