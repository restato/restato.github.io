import type { ChangeEvent, ReactNode } from 'react';

export const pdfInputAccept = 'application/pdf,.pdf';
export const imageInputAccept = 'image/png,image/jpeg,.png,.jpg,.jpeg';

export const readFileBytes = async (file: File) => new Uint8Array(await file.arrayBuffer());

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export const downloadPdf = (bytes: Uint8Array, filename: string) =>
  downloadBlob(new Blob([bytes as BlobPart], { type: 'application/pdf' }), filename);

export function parsePageSelection(value: string): number[] {
  const pages: number[] = [];
  for (const token of value.split(',').map((part) => part.trim()).filter(Boolean)) {
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (end < start) throw new Error(`Invalid page range: ${token}`);
      for (let page = start; page <= end; page += 1) pages.push(page);
    } else if (/^\d+$/.test(token)) {
      pages.push(Number(token));
    } else {
      throw new Error(`Invalid page selection: ${token}`);
    }
  }
  if (pages.length === 0) throw new Error('Enter at least one page number.');
  return pages;
}

export function PdfToolShell({ children, error }: { children: ReactNode; error?: string }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
        🔒 파일은 브라우저 안에서만 처리되며 서버로 업로드되지 않습니다. Processing stays in your browser.
      </p>
      {children}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}

export function FilePicker({
  accept,
  multiple = false,
  label,
  onFiles,
}: {
  accept: string;
  multiple?: boolean;
  label: string;
  onFiles: (files: File[]) => void;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  };
  return (
    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] p-8 text-center">
      <span className="font-medium text-[var(--color-text)]">{label}</span>
      <input className="sr-only" type="file" accept={accept} multiple={multiple} onChange={handleChange} />
    </label>
  );
}

export const primaryButton = 'rounded-lg bg-primary-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50';
export const fieldClass = 'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]';
