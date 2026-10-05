import styles from "./CharacterLimitWarning.module.scss";

interface CharacterLimitWarningProps {
  id: string;
  currentLength: number;
  maxCharacterLimit: number;
  warningBuffer: number;
}

export default function CharacterLimitWarning({
  id,
  currentLength,
  maxCharacterLimit,
  warningBuffer,
}: CharacterLimitWarningProps) {
  const remaining = maxCharacterLimit - currentLength;
  const isAtWarning = remaining <= warningBuffer;
  const isAtLimit = remaining <= 0;

  return (
    <div id={id} className={styles.wrapper}>
      {isAtWarning && (
        <span className={`${styles.countWarning} ${isAtLimit ? styles.countLimit : ""}`}>
          {remaining} of {maxCharacterLimit} characters remaining
        </span>
      )}
    </div>
  );
}