import type { PropsWithChildren } from 'react';

export function ToolShell({ children, privacy = 'Your file stays in your browser and is never uploaded.' }: PropsWithChildren<{ privacy?: string }>) {
  return <section className="space-y-5">
    <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-[var(--color-text)]">🔒 {privacy}</p>
    {children}
  </section>;
}

export const fieldClass = 'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary-500';
export const buttonClass = 'rounded-lg bg-primary-500 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50';
