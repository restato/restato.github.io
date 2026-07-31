import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';

export interface ToolFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

type ControlProps = {
  id?: string;
  className?: string;
  type?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
};

function controlClass(control: ReactElement<ControlProps>) {
  if (control.type === 'textarea') return 'fc-textarea';
  if (control.type === 'select') return 'fc-select';
  if (control.type === 'input') {
    switch (control.props.type) {
      case 'checkbox': return 'fc-check';
      case 'radio': return 'fc-radio';
      case 'range': return 'fc-range';
      case 'color': return 'fc-color-input';
      case 'file': return 'fc-file-input';
      default: return 'fc-input';
    }
  }
  return 'fc-input';
}

const sharedControlClasses = new Set([
  'fc-input',
  'fc-select',
  'fc-textarea',
  'fc-check',
  'fc-radio',
  'fc-range',
  'fc-color-input',
  'fc-file-input',
]);

function callerClasses(className = '') {
  return className
    .split(/\s+/)
    .filter((classToken) => classToken && !sharedControlClasses.has(classToken))
    .join(' ');
}

export function ToolField({ id, label, hint, error, children }: ToolFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const control = isValidElement<ControlProps>(children)
    ? cloneElement(children, {
        id,
        className: `${controlClass(children)} ${callerClasses(children.props.className)}`.trim(),
        'aria-describedby': [
          children.props['aria-describedby'],
          hintId,
          errorId,
        ].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? true : children.props['aria-invalid'],
      })
    : children;

  return (
    <div className="fc-tool-field">
      <label className="fc-label" htmlFor={id}>{label}</label>
      {control}
      {hint && <p className="fc-help" id={hintId}>{hint}</p>}
      {error && <p className="fc-error" id={errorId}>{error}</p>}
    </div>
  );
}
