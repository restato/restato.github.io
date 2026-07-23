export const fieldClass = 'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-[var(--color-text)]';
export const buttonClass = 'rounded-lg bg-primary-500 px-4 py-2 font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50';
export const secondaryButtonClass = 'rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 hover:bg-[var(--color-card-hover)] disabled:opacity-50';

export async function copyText(value: string): Promise<void> {
  if (value) await navigator.clipboard.writeText(value);
}

export function downloadText(value: string, filename: string, mimeType = 'text/plain'): void {
  if (!value) return;
  const anchor = document.createElement('a');
  anchor.href = `data:${mimeType};charset=utf-8,${encodeURIComponent(value)}`;
  anchor.download = filename;
  anchor.click();
}
