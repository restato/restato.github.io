import { useEffect, useRef } from 'react';

export function useScrollToBottom<T>(dependency: T) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dependency]);

  return elementRef;
}
