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
}

type ActionProps = {
  className?: string;
};

function styleActions(actions: ReactNode, variant: 'primary' | 'secondary') {
  return Children.map(actions, (action) => {
    if (!isValidElement<ActionProps>(action)) return action;
    if (action.type === Fragment) {
      return cloneElement(action, {
        children: styleActions(action.props.children, variant),
      });
    }
    const variantClass = variant === 'primary' ? 'fc-button-primary' : 'fc-button-secondary';
    const callerClasses = (action.props.className ?? '')
      .split(/\s+/)
      .filter((className) => className && className !== 'fc-button-primary' && className !== 'fc-button-secondary')
      .join(' ');
    return cloneElement(action as ReactElement<ActionProps>, {
      className: `fc-button ${variantClass} ${callerClasses}`.trim(),
    });
  });
}

export function ToolActions({ primary, secondary, className = '' }: ToolActionsProps) {
  return (
    <div className={`fc-tool-actions ${className}`.trim()} data-testid="tool-actions">
      {styleActions(primary, 'primary')}
      {styleActions(secondary, 'secondary')}
    </div>
  );
}
