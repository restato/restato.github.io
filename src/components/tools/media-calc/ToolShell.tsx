import type { PropsWithChildren } from 'react';
import { ToolPanel } from '../ui/ToolPanel';
import { ToolResult, type ToolResultProps } from '../ui/ToolResult';

export function ToolShell({ children }: PropsWithChildren) {
  return <ToolPanel className="fc-tool-panel-media">{children}</ToolPanel>;
}

export function ToolStatus({ children, status = 'idle', title }: ToolResultProps) {
  return <ToolResult title={title} status={status}>{children}</ToolResult>;
}

export const fieldClass = 'fc-input';
export const buttonClass = 'fc-button fc-button-primary';
