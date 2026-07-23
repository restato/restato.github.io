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
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
};

function controlClass(control: ReactElement<ControlProps>) {
  if (control.type === 'textarea') return 'fc-textarea';
  if (control.type === 'select') return 'fc-select';
  return 'fc-input';
}

export function ToolField({ id, label, hint, error, children }: ToolFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const control = isValidElement<ControlProps>(children)
    ? cloneElement(children, {
        id,
        className: `${controlClass(children)} ${children.props.className ?? ''}`.trim(),
        'aria-describedby': describedBy,
        'aria-invalid': Boolean(error),
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
