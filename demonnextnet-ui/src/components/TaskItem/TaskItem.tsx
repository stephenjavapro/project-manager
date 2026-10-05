import CompletionStatus from '@/components/CompletionStatus/CompletionStatus';
import { TaskItem as TaskItemType } from '@/types';
import styles from './TaskItem.module.scss';

interface TaskItemProps {
  task: TaskItemType;
  onToggle?: (id: number, isComplete: boolean) => void | Promise<void>;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <div className={styles.task}>
      <span className={styles.title}>{task.title}</span>
      {task.notes && <p className={styles.notes}>{task.notes}</p>}
      <div className={styles.status}>
        <CompletionStatus
          completed={task.isComplete}
          onChange={(next) => {
            if (next !== task.isComplete) {
              void onToggle?.(task.id, next);
            }
          }}
        />
      </div>
    </div>
  );
}

export default TaskItem;
