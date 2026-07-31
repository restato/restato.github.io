import type { ReactNode } from 'react';

export interface ToolResultProps {
  title?: string;
  status?: 'idle' | 'working' | 'success' | 'error';
  children: ReactNode;
}

export function ToolResult({ title, status = 'idle', children }: ToolResultProps) {
  const isError = status === 'error';
  return (
    <section
      className={`fc-tool-result fc-tool-result-${status}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      aria-busy={status === 'working'}
    >
      {title && <h3 className="fc-tool-result-title">{title}</h3>}
      {children}
    </section>
  );
}
