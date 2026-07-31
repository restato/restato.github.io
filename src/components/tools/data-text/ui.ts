export const panelClass = 'fc-tool-panel';
export const fieldClass = 'fc-input';
export const buttonClass = 'fc-button fc-button-primary';
export const secondaryButtonClass = 'fc-button fc-button-secondary';
export const actionsClass = 'fc-tool-actions';
export const resultClass = 'fc-tool-result';
export const errorClass = 'fc-tool-result fc-tool-result-error';

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
