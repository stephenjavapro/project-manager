'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, ChevronDown } from 'lucide-react';
import { ProjectItem } from '@/types';
import Button from '@/components/shared/Button/Button';
import { PriorityLevel } from '@/components/shared/PriorityLevel/PriorityLevel';
import { TaskItem } from '@/components/TaskItem/TaskItem';
import { useSettings } from '@/context/settings/useSettings';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: ProjectItem;
  onEdit?: (data: ProjectItem) => void;
  onClose?: (id: number) => void;
  onReopen?: (id: number) => void;
  onDelete?: (id: number) => void;
  onToggleTask?: (id: number, isComplete: boolean) => void | Promise<void>;
}

function getDaysUntilDue(dueDateStr: string): number {
  const due = new Date(dueDateStr);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDisplayDate(dueDateStr: string): string {
  return new Date(dueDateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function ProjectCard({
  project,
  onEdit,
  onClose,
  onReopen,
  onDelete,
  onToggleTask,
}: ProjectCardProps) {
  const { settings } = useSettings();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPanelOverflowVisible, setIsPanelOverflowVisible] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const panelId = `task-panel-${project.id}`;

  const completedCount = project.tasks.filter((t) => t.isComplete).length;
  const totalCount = project.tasks.length;
  const allTasksCompleted = totalCount > 0 && completedCount === totalCount;
  const priorityLevel = project.priority.toLowerCase() as
    'low' | 'medium' | 'high';

  let warningText: string | null = null;
  if (project.dueDate && settings) {
    const daysUntilDue = getDaysUntilDue(project.dueDate);
    if (daysUntilDue <= settings.dueDateWarningDays) {
      if (daysUntilDue === 0) warningText = 'Due Today';
      else if (daysUntilDue > 0)
        warningText = `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`;
      else
        warningText = `${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) === 1 ? '' : 's'} overdue`;
    }
  }

  useEffect(() => {
    if (!isMenuOpen) return;

    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsMenuOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  const handleTogglePanel = () => {
    if (isPanelOpen) setIsPanelOverflowVisible(false); // must land before close animation
    setIsPanelOpen((prev) => !prev);
  };

  const handlePanelTransitionEnd = (
    e: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (e.propertyName !== 'grid-template-rows') return;
    if (isPanelOpen) setIsPanelOverflowVisible(true);
  };

  return (
    <article className={styles.card} aria-label={`Project: ${project.name}`}>
      <div className={styles.row1}>
        <div className={styles.nameGroup}>
          <PriorityLevel priority={priorityLevel} />
          <span className={styles.projectName}>{project.name}</span>
        </div>
        <div className={styles.dueDateTasksCompletionGroup}>
          {project.dueDate && (
            <span className={styles.dueDate}>
              Due: {formatDisplayDate(project.dueDate)}
            </span>
          )}
          {allTasksCompleted && !project.closedAt && (
            <span
              className={`${styles.notificationBadge} ${styles.allTasksCompletedBadge}`}
              role="status"
            >
              Ready to Close
            </span>
          )}
          {!allTasksCompleted && warningText && (
            <span
              className={`${styles.notificationBadge} ${styles.dueDateWarningBadge}`}
              role="status"
            >
              {warningText}
            </span>
          )}
        </div>
        <div className={styles.menuContainer} ref={menuRef}>
          <button
            className={styles.menuTrigger}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-label="Project options"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <MoreVertical size={20} aria-hidden="true" />
          </button>

          <div
            className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}
            role="menu"
            aria-label="Project actions"
          >
            <button
              className={styles.menuItem}
              role="menuitem"
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={() => {
                onEdit?.(project);
                setIsMenuOpen(false);
              }}
            >
              Edit Project
            </button>
            {project.closedAt === null ? (
              <button
                className={styles.menuItem}
                role="menuitem"
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => {
                  onClose?.(project.id);
                  setIsMenuOpen(false);
                }}
              >
                Close Project
              </button>
            ) : (
              <button
                className={styles.menuItem}
                role="menuitem"
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => {
                  onReopen?.(project.id);
                  setIsMenuOpen(false);
                }}
              >
                Reopen Project
              </button>
            )}
            <button
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              role="menuitem"
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={() => {
                onDelete?.(project.id);
                setIsMenuOpen(false);
              }}
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>
      {project.description && (
        <p className={styles.description}>{project.description}</p>
      )}
      <div
        className={`${styles.row3} ${allTasksCompleted ? styles.row3JustifyContentEnd : ''}`}
      >
        {!allTasksCompleted && (
          <span className={styles.taskStatus}>
            {totalCount === 0
              ? 'No tasks assigned'
              : `${completedCount} out of ${totalCount} task${totalCount !== 1 ? 's' : ''} completed`}
          </span>
        )}
        {project.tasks.length > 0 && (
          <Button
            label={`${totalCount} Task${totalCount !== 1 ? 's' : ''}`}
            variant="secondary"
            ariaExpanded={isPanelOpen}
            ariaControls={panelId}
            icon={
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`${styles.chevron} ${isPanelOpen ? styles.chevronOpen : ''}`}
              />
            }
            iconPlacement="right"
            onClick={() => handleTogglePanel()}
          />
        )}
      </div>
      <div
        id={panelId}
        className={`${styles.panel} ${isPanelOpen ? styles.panelOpen : ''}`}
        aria-hidden={!isPanelOpen}
        inert={!isPanelOpen}
        style={isPanelOverflowVisible ? { contain: 'none' } : undefined} // overflow issues
        onTransitionEnd={handlePanelTransitionEnd}
      >
        {project.tasks.length > 0 && (
          <div
            className={styles.panelInner}
            style={isPanelOverflowVisible ? { overflow: 'visible' } : undefined}
          >
            <div className={styles.panelContent}>
              <ul className={styles.taskList}>
                {project.tasks.map((task) => (
                  <li key={task.id}>
                    <TaskItem task={task} onToggle={onToggleTask} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
