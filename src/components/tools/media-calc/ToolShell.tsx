import type { PropsWithChildren } from 'react';
import { ToolPanel } from '../ui/ToolPanel';
import { ToolResult, type ToolResultProps } from '../ui/ToolResult';

export function ToolShell({ children, privacy = 'Your file stays in your browser and is never uploaded.' }: PropsWithChildren<{ privacy?: string }>) {
  return <ToolPanel className="fc-tool-panel-media">
    <p className="fc-tool-privacy"><span aria-hidden="true">🔒</span>{privacy}</p>
    {children}
  </ToolPanel>;
}

export function ToolStatus({ children, status = 'idle', title }: ToolResultProps) {
  return <ToolResult title={title} status={status}>{children}</ToolResult>;
}

export const fieldClass = 'fc-input';
export const buttonClass = 'fc-button fc-button-primary';
