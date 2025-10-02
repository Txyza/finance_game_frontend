import React from 'react'
import { TaskItem, Task } from '../TaskItem'
import styles from './TaskList.module.css'

interface TaskListProps {
  tasks: Task[]
  onTaskClaim: (taskId: string) => void
  className?: string
  emptyStateText?: string
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskClaim,
  className,
  emptyStateText = 'Нет доступных заданий'
}) => {
  // Фильтруем задания, исключая уже забранные
  const activeTasks = tasks.filter(task => task.status !== 'claimed')

  if (activeTasks.length === 0) {
    return (
      <div className={`${styles.taskList} ${className || ''}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <p className={styles.emptyText}>{emptyStateText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.taskList} ${className || ''}`}>
      <div className={styles.list}>
        {activeTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onClaim={onTaskClaim}
            className={styles.taskItem}
          />
        ))}
      </div>
    </div>
  )
}