import React from 'react'
import { Button } from '../Button'
import styles from './TaskItem.module.css'

export interface Task {
  id: string
  title: string
  description: string
  type: 'tasks' | 'daily' | 'weekly'
  progress: {
    current: number
    target: number
  }
  reward: {
    type: 'money' | 'exp' | 'energy'
    amount: number
  }
  status: 'active' | 'completed' | 'claimed'
  icon?: string
}

interface TaskItemProps {
  task: Task
  onClaim: (taskId: string) => void
  className?: string
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onClaim,
  className
}) => {
  const isCompleted = task.progress.current >= task.progress.target
  const isClaimed = task.status === 'claimed'
  const progressPercentage = Math.min((task.progress.current / task.progress.target) * 100, 100)

  const getRewardText = (reward: Task['reward']) => {
    switch (reward.type) {
      case 'money':
        return `${reward.amount.toLocaleString('ru-RU')} ₽`
      case 'exp':
        return `${reward.amount} опыта`
      case 'energy':
        return `${reward.amount} энергии`
      default:
        return `${reward.amount}`
    }
  }

  const getRewardIcon = (type: Task['reward']['type']) => {
    switch (type) {
      case 'money':
        return '💰'
      case 'exp':
        return '⭐'
      case 'energy':
        return '⚡'
      default:
        return '🎁'
    }
  }

  const handleClaimClick = () => {
    if (isCompleted && !isClaimed) {
      onClaim(task.id)
    }
  }

  return (
    <div className={`${styles.taskItem} ${isCompleted ? styles.completed : ''} ${className || ''}`}>
      <div className={styles.header}>
        <div className={styles.iconSection}>
          {task.icon && (
            <div className={styles.taskIcon}>
              {task.icon}
            </div>
          )}
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{task.title}</h3>
          <p className={styles.description}>{task.description}</p>
        </div>

        <div className={styles.reward}>
          <div className={styles.rewardIcon}>
            {getRewardIcon(task.reward.type)}
          </div>
          <div className={styles.rewardText}>
            {getRewardText(task.reward)}
          </div>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span className={styles.progressText}>
            {task.progress.current} / {task.progress.target}
          </span>
          <span className={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </span>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {isCompleted && !isClaimed && (
        <div className={styles.actionSection}>
          <Button
            onClick={handleClaimClick}
            variant="primary"
            size="sm"
            className={styles.claimButton}
          >
            Забрать награду
          </Button>
        </div>
      )}

      {isClaimed && (
        <div className={styles.claimedSection}>
          <div className={styles.claimedText}>
            ✅ Награда получена
          </div>
        </div>
      )}
    </div>
  )
}