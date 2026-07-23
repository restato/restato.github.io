import type { InputHTMLAttributes } from 'react';

interface ToolControlProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export function ToolControl({
  id,
  label,
  hint,
  error,
  className,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: ToolControlProps) {
  const describedBy = [
    ariaDescribedBy,
    hint && `${id}-hint`,
    error && `${id}-error`,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label className="fc-label" htmlFor={id}>{label}</label>
      <input
        {...inputProps}
        id={id}
        className={['fc-input', className].filter(Boolean).join(' ')}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
      />
      {hint && <p className="fc-help" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="fc-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}

export default ToolControl;
