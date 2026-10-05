import { useState, useId, useRef } from 'react';
import TextInput from '@/components/shared/TextInput/TextInput';
import TextArea from '@/components/shared/TextArea/TextArea';
import Button from '@/components/shared/Button/Button';
import PrioritySelector from '../PrioritySelector/PrioritySelector';
import { Priority } from '@/types';
import styles from './CreateProjectForm.module.scss';

interface Task {
  id: string;
  title: string;
  notes: string;
}

export interface ProjectFormData {
  name: string;
  priority: Priority;
  dueDate: string | undefined;
  description: string;
  tasks: Omit<Task, 'id'>[];
}

interface CreateProjectFormProps {
  onSubmit?: (data: ProjectFormData) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateProjectForm({
  onSubmit,
  onSuccess,
  onCancel,
}: CreateProjectFormProps) {
  const dueDateId = useId();

  const projectNameRef = useRef<HTMLInputElement>(null);
  const taskTitleRef = useRef<HTMLInputElement>(null);

  const [projectName, setProjectName] = useState('');
  const [projectNameValidationAttempted, setProjectNameValidationAttempted] =
    useState(false);
  const [priority, setPriority] = useState<Priority>(Priority.Low);
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTitleValidationAttempted, setTaskTitleValidationAttempted] =
    useState(false);
  const [taskNotes, setTaskNotes] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = () => {
    const title = taskTitle.trim();
    if (!title) {
      setTaskTitleValidationAttempted(true);
      taskTitleRef.current?.focus();
      return;
    }
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        notes: taskNotes.trim(),
      },
    ]);
    setTaskTitle('');
    setTaskTitleValidationAttempted(false);
    setTaskNotes('');
    taskTitleRef.current?.focus();
  };

  const handleRemoveTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
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
      tasks: tasks.map(({ title, notes }) => ({ title, notes })),
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* Row 1: Project Name */}
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

      {/* Row 2: Priority + Due Date */}
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

      {/* Row 3: Description */}
      <TextArea
        className={styles.descriptionInput}
        label="Description"
        value={description}
        onChange={setDescription}
        maxLength={500}
        warningBuffer={50}
      />

      {/* Assign Tasks */}
      <section
        className={styles.section}
        aria-labelledby="assign-tasks-heading"
      >
        <h3 id="assign-tasks-heading" className={styles.sectionHeading}>
          Assign Tasks
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

        {tasks.length > 0 && (
          <ul className={styles.taskList} aria-label="Assigned tasks">
            {tasks.map((task) => (
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
                  onClick={() => handleRemoveTask(task.id)}
                  aria-label={`Remove task: ${task.title}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Form Actions */}
      <div className={styles.actions}>
        <Button label="Create Project" variant="primary" htmlType="submit" />
        <Button label="Cancel" variant="secondary" onClick={onCancel} />
      </div>
    </form>
  );
}
