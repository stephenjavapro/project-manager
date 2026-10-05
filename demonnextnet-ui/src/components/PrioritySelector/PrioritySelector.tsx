import { SignalLow, SignalMedium, SignalHigh } from "lucide-react";

import { Priority } from "@/types";

import styles from "./PrioritySelector.module.scss";

interface PrioritySelectorProps {
  value: Priority;
  onChange: (value: Priority) => void;
}

const priorities: { value: Priority; label: string; Icon: React.ElementType }[] = [
  { value: Priority.Low, label: "Low", Icon: SignalLow },
  { value: Priority.Medium, label: "Medium", Icon: SignalMedium },
  { value: Priority.High, label: "High", Icon: SignalHigh },
];

export default function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Priority</legend>
      <div className={styles.group}>
        {priorities.map(({ value: pValue, label, Icon }) => (
          <label
            key={pValue}
            className={`${styles.option} ${value === pValue ? styles.selected : ""}`}
          >
            <input
              type="radio"
              name="priority"
              value={pValue}
              checked={value === pValue}
              onChange={() => onChange(pValue)}
              className={styles.input}
            />
            <Icon size={20} />
            <span className={styles.label}>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}