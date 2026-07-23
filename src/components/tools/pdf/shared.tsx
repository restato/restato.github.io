import { useRef, type ChangeEvent, type ReactNode } from 'react';
import { ToolPanel } from '../ui/ToolPanel';
import { ToolResult } from '../ui/ToolResult';

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
    <ToolPanel className="fc-tool-panel-pdf">
      <p className="fc-tool-privacy">
        <span aria-hidden="true">🔒</span>
        파일은 브라우저 안에서만 처리되며 서버로 업로드되지 않습니다. Processing stays in your browser.
      </p>
      {children}
      {error && <ToolResult status="error">{error}</ToolResult>}
    </ToolPanel>
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
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  };
  return (
    <>
      <ToolPanel
        variant="drop-zone"
        onActivate={() => inputRef.current?.click()}
        aria-label={label}
      >
        <span className="font-medium">{label}</span>
      </ToolPanel>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        aria-label={label}
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
    </>
  );
}

export const primaryButton = 'fc-button fc-button-primary';
export const fieldClass = 'fc-input';
