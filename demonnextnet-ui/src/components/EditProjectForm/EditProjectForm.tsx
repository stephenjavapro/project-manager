import { useState, useId, useRef } from 'react';
import TextInput from '@/components/shared/TextInput/TextInput';
import TextArea from '@/components/shared/TextArea/TextArea';
import Button from '@/components/shared/Button/Button';
import PrioritySelector from '../PrioritySelector/PrioritySelector';
import { Priority, ProjectItem, TaskItem } from '@/types';
import styles from './EditProjectForm.module.scss';

interface NewTask {
  id: string;
  title: string;
  notes: string;
}

export interface EditProjectFormData {
  name: string;
  priority: Priority;
  dueDate: string | undefined;
  description: string;
  tasksToAdd: Omit<TaskItem, 'id'>[];
  tasksToDelete: number[];
}

interface EditProjectFormProps {
  project: ProjectItem;
  onSubmit?: (data: EditProjectFormData) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditProjectForm({
  project,
  onSubmit,
  onSuccess,
  onCancel,
}: EditProjectFormProps) {
  const dueDateId = useId();
  const projectNameRef = useRef<HTMLInputElement>(null);
  const taskTitleRef = useRef<HTMLInputElement>(null);

  const [projectName, setProjectName] = useState(project.name);
  const [projectNameValidationAttempted, setProjectNameValidationAttempted] =
    useState(false);
  const [priority, setPriority] = useState<Priority>(project.priority);
  const [dueDate, setDueDate] = useState(project.dueDate ?? '');
  const [description, setDescription] = useState(project.description ?? '');

  const [deletedTaskIds, setDeletedTaskIds] = useState<Set<number>>(new Set());
  const [newTasks, setNewTasks] = useState<NewTask[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTitleValidationAttempted, setTaskTitleValidationAttempted] =
    useState(false);
  const [taskNotes, setTaskNotes] = useState('');

  const existingTasks =
    project.tasks?.filter((t) => !deletedTaskIds.has(t.id)) ?? [];

  const handleMarkForDeletion = (id: number) => {
    setDeletedTaskIds((prev) => new Set(prev).add(id));
  };

  const handleAddTask = () => {
    const title = taskTitle.trim();
    if (!title) {
      setTaskTitleValidationAttempted(true);
      taskTitleRef.current?.focus();
      return;
    }
    setNewTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, notes: taskNotes.trim() },
    ]);
    setTaskTitle('');
    setTaskTitleValidationAttempted(false);
    setTaskNotes('');
    taskTitleRef.current?.focus();
  };

  const handleRemoveNewTask = (id: string) => {
    setNewTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setProjectNameValidationAttempted(true);
      projectNameRef.current?.focus();
      return;
    }
    onSubmit?.({
      name: projectName,
      priority,
      dueDate: dueDate || undefined,
      description,
      tasksToAdd: newTasks.map(({ title, notes }) => ({
        title,
        notes,
        projectItemId: project.id,
        isComplete: false,
      })),
      tasksToDelete: Array.from(deletedTaskIds),
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <TextInput
        className={styles.nameInput}
        ref={projectNameRef}
        label="Name"
        value={projectName}
        maxLength={100}
        warningBuffer={10}
        onChange={setProjectName}
        autoFocus
        required
        validationAttempted={projectNameValidationAttempted}
      />

      <div className={`${styles.row} ${styles.twoColumn}`}>
        <PrioritySelector value={priority} onChange={setPriority} />
        <div className={styles.dateWrapper}>
          <label htmlFor={dueDateId} className={styles.dateLabel}>
            Due Date
          </label>
          <input
            type="date"
            id={dueDateId}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>
      </div>

      <TextArea
        className={styles.descriptionInput}
        label="Description"
        value={description}
        onChange={setDescription}
        maxLength={500}
        warningBuffer={50}
      />

      <section className={styles.section} aria-labelledby="tasks-heading">
        <h3 id="tasks-heading" className={styles.sectionHeading}>
          Tasks
        </h3>

        <div className={styles.taskInputRow}>
          <TextInput
            className={styles.titleInput}
            ref={taskTitleRef}
            label="Task Title"
            value={taskTitle}
            required
            validationAttempted={taskTitleValidationAttempted}
            validateOnBlur={false}
            onChange={setTaskTitle}
          />
          <TextArea
            className={styles.notesInput}
            label="Notes"
            value={taskNotes}
            onChange={setTaskNotes}
            rows={3}
          />
          <Button
            className={styles.addTaskButton}
            label="Add Task"
            variant="secondary"
            onClick={handleAddTask}
          />
        </div>

        {(existingTasks.length > 0 || newTasks.length > 0) && (
          <ul className={styles.taskList} aria-label="Tasks">
            {existingTasks.map((task) => (
              <li key={task.id} className={styles.taskItem}>
                <div className={styles.taskDetails}>
                  <span className={styles.taskTitle}>{task.title}</span>
                  {task.notes && (
                    <span className={styles.taskNotes}>{task.notes}</span>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.removeTask}
                  onClick={() => handleMarkForDeletion(task.id)}
                  aria-label={`Remove task: ${task.title}`}
                >
                  ✕
                </button>
              </li>
            ))}
            {newTasks.map((task) => (
              <li
                key={task.id}
                className={`${styles.taskItem} ${styles.newTask}`}
              >
                <div className={styles.taskDetails}>
                  <span className={styles.taskTitle}>{task.title}</span>
                  {task.notes && (
                    <span className={styles.taskNotes}>{task.notes}</span>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.removeTask}
                  onClick={() => handleRemoveNewTask(task.id)}
                  aria-label={`Remove task: ${task.title}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className={styles.actions}>
        <Button label="Save Changes" variant="primary" htmlType="submit" />
        <Button label="Cancel" variant="secondary" onClick={onCancel} />
      </div>
    </form>
  );
}
