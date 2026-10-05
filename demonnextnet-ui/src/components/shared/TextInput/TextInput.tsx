import { useState, useId, forwardRef } from 'react';
import type { CharacterLimitProps } from '../../../types';
import CharacterLimitWarning from '../CharacterLimitWarning/CharacterLimitWarning';
import styles from './TextInput.module.scss';

type TextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'maxLength' | 'value'
> & {
  label: string;
  value: string;
  autoFocus?: boolean;
  validationAttempted?: boolean;
  validateOnBlur?: boolean;
  onChange: (value: string) => void;
} & CharacterLimitProps;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      id: externalId,
      type = 'text',
      className,
      label,
      value,
      onChange,
      maxLength,
      warningBuffer,
      required = false,
      autoFocus = false,
      validationAttempted = false,
      validateOnBlur = true,
      ...rest
    },
    ref
  ) {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;
    const warningId = `${id}-warning`;

    const [touched, setTouched] = useState(false);

    const showWarning = maxLength !== undefined;
    const validate = (val: string): string | null => {
      if (required && !val.trim()) {
        return 'This field is required.';
      }
      return null;
    };
    const hasError =
      (validationAttempted || (validateOnBlur && touched)) && !!validate(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      onChange(val);
    };

    const handleBlur = () => {
      setTouched(true);
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
        <input
          id={id}
          ref={ref}
          type={type}
          autoFocus={autoFocus}
          className={`${styles.input} ${hasError ? styles.inputError : ''}`}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={maxLength}
          required={required}
          aria-required={required}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={describedBy}
          {...rest}
        />
        <span
          id={errorId}
          role="alert"
          aria-live="polite"
          className={styles.error}
        >
          {hasError ? validate(value) : ''}
        </span>
        {showWarning && (
          <CharacterLimitWarning
            id={warningId}
            currentLength={value.length}
            maxCharacterLimit={maxLength!}
            warningBuffer={warningBuffer!}
          />
        )}
      </div>
    );
  }
);

export default TextInput;
