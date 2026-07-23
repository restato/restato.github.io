import type { HTMLAttributes, KeyboardEvent, PropsWithChildren } from 'react';

export interface ToolPanelProps extends PropsWithChildren<Omit<HTMLAttributes<HTMLElement>, 'onClick'>> {
  variant?: 'surface' | 'soft' | 'drop-zone';
  onActivate?: () => void;
}

export function ToolPanel({
  children,
  className = '',
  variant = 'surface',
  onActivate,
  onKeyDown,
  ...props
}: ToolPanelProps) {
  const isDropZone = variant === 'drop-zone';
  const variantClass = variant === 'soft'
    ? 'fc-surface-soft'
    : isDropZone
      ? 'fc-tool-drop-zone'
      : 'fc-surface fc-surface-padding-md';

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (!event.defaultPrevented && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onActivate?.();
    }
  };

  return (
    <section
      {...props}
      className={`fc-tool-panel ${variantClass} ${className}`.trim()}
      role={isDropZone ? 'button' : props.role}
      tabIndex={isDropZone ? 0 : props.tabIndex}
      onClick={isDropZone ? onActivate : undefined}
      onKeyDown={isDropZone ? handleKeyDown : onKeyDown}
    >
      {children}
    </section>
  );
}
