import { useState, useId, useRef, useEffect, type KeyboardEvent } from "react";
import { Check } from "lucide-react";
import styles from "./CompletionStatus.module.scss";

interface CompletionStatusProps {
  completed: boolean;
  onChange: (completed: boolean) => void;
}

export function CompletionStatus({ completed, onChange }: CompletionStatusProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [liveMsg, setLiveMsg] = useState("");
  const tooltipId = useId();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    setLiveMsg(completed ? "Task marked as Completed" : "Task marked as Pending");
    const t = setTimeout(() => setLiveMsg(""), 1500);
    return () => clearTimeout(t);
  }, [completed]);

  const toggle = () => {
    onChange(!completed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  const tooltipClass = [styles.tooltip, tooltipVisible && styles.visible]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {liveMsg}
      </span>

      <div className={styles.trackWrapper}>
        <div id={tooltipId} role="tooltip" className={tooltipClass}>
          {completed ? "Completed — click to reopen" : "Pending — click to complete"}
          <span aria-hidden="true" className={styles.tooltipArrow} />
        </div>

        <div
          role="switch"
          aria-checked={completed}
          aria-label="Task completion"
          aria-describedby={tooltipId}
          tabIndex={0}
          data-completed={completed}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          onFocus={() => setTooltipVisible(true)}
          onBlur={() => setTooltipVisible(false)}
          className={styles.track}
        >
          <div className={styles.thumb}>
            <span aria-hidden="true" className={styles.checkIcon}>
              <Check strokeWidth={3} color="#000" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompletionStatus;