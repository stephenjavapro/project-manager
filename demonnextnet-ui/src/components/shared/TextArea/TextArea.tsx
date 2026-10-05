import { useState, useId } from 'react';
import type { CharacterLimitProps } from '../../../types';
import CharacterLimitWarning from '../CharacterLimitWarning/CharacterLimitWarning';
import styles from './TextArea.module.scss';

type TextAreaProps = {
  className?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  warningBuffer?: number;
  required?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  rows?: number;
} & CharacterLimitProps;

export default function TextArea({
  className,
  label,
  value,
  onChange,
  maxLength,
  warningBuffer,
  required = false,
  id: externalId,
  name,
  placeholder,
  rows = 3,
}: TextAreaProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const errorId = `${id}-error`;
  const warningId = `${id}-warning`;

  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showWarning = maxLength !== undefined;
  const hasValidation = required;
  const hasError = touched && !!error;

  const validate = (val: string): string | null => {
    if (required && !val.trim()) return 'This field is required.';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    if (touched) setError(validate(val));
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  const describedBy =
    [showWarning ? warningId : null, hasError ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`.trim()}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={rows}
        required={required}
        aria-required={required}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={`${styles.textarea} ${hasError ? styles.textareaError : ''}`}
      />
      <div className={styles.footer}>
        {hasValidation && (
          <span
            id={errorId}
            role="alert"
            aria-live="polite"
            className={styles.error}
          >
            {hasError ? error : ''}
          </span>
        )}
        {showWarning && (
          <CharacterLimitWarning
            id={warningId}
            currentLength={value.length}
            maxCharacterLimit={maxLength!}
            warningBuffer={warningBuffer!}
          />
        )}
      </div>
    </div>
  );
}
