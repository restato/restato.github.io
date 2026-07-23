import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type HTMLAttributes,
  type KeyboardEvent,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react';

export interface ToolPanelProps extends PropsWithChildren<Omit<HTMLAttributes<HTMLElement>, 'onClick'>> {
  variant?: 'surface' | 'soft' | 'drop-zone';
  onActivate?: () => void;
}

type NativeControlProps = {
  children?: ReactNode;
  className?: string;
  role?: string;
  type?: string;
};

function withToolControlClasses(node: ReactNode): ReactNode {
  if (!isValidElement<NativeControlProps>(node)) return node;
  const props = node.props;
  const className = props.className ?? '';
  let semanticClass = '';

  if (node.type === 'button') {
    semanticClass = className.includes('bg-primary-') || className.includes('bg-[var(--brand)]')
      ? 'fc-button fc-button-primary'
      : 'fc-button fc-button-secondary';
  } else if (node.type === 'textarea') {
    semanticClass = 'fc-textarea';
  } else if (node.type === 'select') {
    semanticClass = 'fc-select';
  } else if (node.type === 'input') {
    semanticClass = ['checkbox', 'radio', 'range', 'hidden'].includes(props.type ?? 'text')
      ? 'fc-tool-control'
      : 'fc-input';
  } else if (props.role === 'status' || props.role === 'alert') {
    semanticClass = props.role === 'alert'
      ? 'fc-tool-result fc-tool-result-error'
      : 'fc-tool-result';
  }

  const styledChildren = props.children
    ? Children.map(props.children, withToolControlClasses)
    : props.children;

  if (node.type === Fragment) {
    return cloneElement(node, { children: styledChildren });
  }

  return cloneElement(node as ReactElement<NativeControlProps>, {
    className: `${semanticClass} ${className}`.trim() || undefined,
    children: styledChildren,
  });
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
      {Children.map(children, withToolControlClasses)}
    </section>
  );
}
