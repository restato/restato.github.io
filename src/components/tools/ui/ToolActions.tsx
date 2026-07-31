import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';

export interface ToolActionsProps {
  primary: ReactNode;
  secondary?: ReactNode;
  className?: string;
  selection?: boolean;
}

type ActionProps = {
  children?: ReactNode;
  className?: string;
  'aria-pressed'?: boolean | 'true' | 'false';
};

function styleActions(actions: ReactNode, variant: 'primary' | 'secondary' | 'selection'): ReactNode {
  return Children.map(actions, (action) => {
    if (!isValidElement<ActionProps>(action)) return action;
    if (action.type === Fragment) {
      return cloneElement(action as ReactElement<ActionProps>, {
        children: styleActions(action.props.children, variant),
      });
    }
    const selected = action.props['aria-pressed'] === true || action.props['aria-pressed'] === 'true';
    const variantClass = variant === 'selection'
      ? selected ? 'fc-button-primary' : 'fc-button-secondary'
      : variant === 'primary' ? 'fc-button-primary' : 'fc-button-secondary';
    const callerClasses = (action.props.className ?? '')
      .split(/\s+/)
      .filter((className) => className && className !== 'fc-button-primary' && className !== 'fc-button-secondary')
      .join(' ');
    return cloneElement(action as ReactElement<ActionProps>, {
      className: `fc-button ${variantClass} ${callerClasses}`.trim(),
    });
  });
}

export function ToolActions({ primary, secondary, className = '', selection = false }: ToolActionsProps) {
  return (
    <div className={`fc-tool-actions ${className}`.trim()} data-testid="tool-actions" data-selection={selection || undefined}>
      {styleActions(primary, selection ? 'selection' : 'primary')}
      {styleActions(secondary, selection ? 'selection' : 'secondary')}
    </div>
  );
}
