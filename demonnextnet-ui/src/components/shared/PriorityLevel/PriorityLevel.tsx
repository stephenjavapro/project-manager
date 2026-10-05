import { SignalLow, SignalMedium, SignalHigh, LucideIcon } from 'lucide-react';
import styles from './PriorityLevel.module.scss';

export type Priority = 'low' | 'medium' | 'high';

interface PriorityConfig {
  Icon: LucideIcon;
  label: string;
}

const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  low:    { Icon: SignalLow,    label: 'Low priority'    },
  medium: { Icon: SignalMedium, label: 'Medium priority' },
  high:   { Icon: SignalHigh,   label: 'High priority'   },
};

interface PriorityLevelProps {
  priority: Priority;
}

export function PriorityLevel({ priority }: PriorityLevelProps) {
  const config = PRIORITY_CONFIG[priority];

  if (!config) return null;

  const { Icon, label } = config;

  return (
    <div
      role="img"
      aria-label={label}
      title={label}
      className={`${styles.badge} ${styles[priority]}`}
    >
      <Icon
        size={18}
        color="#ffffff"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </div>
  );
}