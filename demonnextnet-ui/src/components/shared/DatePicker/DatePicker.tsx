import { useState, useId } from "react";
import styles from "./DatePicker.module.scss";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  name?: string;
  id?: string;
}

export default function DatePicker({
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  name,
  id: externalId,
}: DatePickerProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const errorId = `${id}-error`;

  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const formatDisplayDate = (isoDate: string): string => {
    const [year, month, day] = isoDate.split("-");
    return `${month}/${day}/${year}`;
  };

  const validate = (val: string): string | null => {
    if (required && !val) {
      return "This field is required.";
    }
    if (val) {
      const date = new Date(`${val}T00:00:00`);
      if (isNaN(date.getTime())) {
        return "Please enter a valid date.";
      }
      if (min) {
        const minDate = new Date(`${min}T00:00:00`);
        if (date < minDate) {
          return `Date must be on or after ${formatDisplayDate(min)}.`;
        }
      }
      if (max) {
        const maxDate = new Date(`${max}T00:00:00`);
        if (date > maxDate) {
          return `Date must be on or before ${formatDisplayDate(max)}.`;
        }
      }
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (touched) {
      setError(validate(val));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  const hasError = touched && !!error;

  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>
      {required && (
        <span className={styles.requiredHint}>* indicates required field</span>
      )}
      <input
        type="date"
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        required={required}
        aria-required={required}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={errorId}
        className={`${styles.input} ${hasError ? styles.inputError : ""}`}
      />
      <span
        id={errorId}
        role="alert"
        aria-live="polite"
        className={styles.error}
      >
        {hasError ? error : ""}
      </span>
    </div>
  );
}