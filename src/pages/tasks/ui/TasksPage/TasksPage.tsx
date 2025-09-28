import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TaskList,
  Task,
  ParticleBackground
} from '@shared/ui'
import { GameHeaderContainer } from '@shared/ui'
import { useTasks } from '@shared/hooks'
import { TaskListItem } from '@shared/api'
import styles from './TasksPage.module.css'

type TaskCategory = 'daely' | 'weakly' | 'quest'

// Функция для преобразования API данных в формат UI компонента
const adaptTaskToUIFormat = (apiTask: TaskListItem): Task => {
  const getTaskIcon = (type: string, name: string) => {
    if (name.toLowerCase().includes('работать')) return '💼'
    if (name.toLowerCase().includes('игра') || name.toLowerCase().includes('поиграть')) return '🎮'
    if (name.toLowerCase().includes('аналитика')) return '📊'
    if (name.toLowerCase().includes('память')) return '🧠'
    if (name.toLowerCase().includes('2048')) return '🎯'
    if (name.toLowerCase().includes('миллион')) return '💎'

    // По типу
    if (type === 'daely') return '📅'
    if (type === 'weakly') return '📊'
    if (type === 'quest') return '🎯'

    return '⭐'
  }

  return {
    id: apiTask.user_task_id,
    title: apiTask.name,
    description: apiTask.description,
    type: apiTask.type === 'daely' ? 'daily' : apiTask.type === 'weakly' ? 'weekly' : 'tasks',
    progress: {
      current: apiTask.progress,
      target: apiTask.progress_max_points
    },
    reward: {
      type: apiTask.reward_type === 'money' ? 'money' : 'exp',
      amount: apiTask.reward
    },
    status: apiTask.rewarded ? 'claimed' : (apiTask.progress >= apiTask.progress_max_points ? 'completed' : 'active'),
    icon: getTaskIcon(apiTask.type, apiTask.name)
  }
}

export const TasksPage: React.FC = () => {
  const navigate = useNavigate()
  const { tasks: apiTasks, loading, error, claimReward, refreshTasks } = useTasks()
  const [activeCategory, setActiveCategory] = useState<'daily' | 'weekly' | 'tasks'>('daily')

  // Преобразуем API задачи в формат UI и группируем по категориям
  const tasksByCategory = useMemo(() => {
    const adaptedTasks = apiTasks.map(adaptTaskToUIFormat)

    return {
      daily: adaptedTasks.filter(task => task.type === 'daily'),
      weekly: adaptedTasks.filter(task => task.type === 'weekly'),
      tasks: adaptedTasks.filter(task => task.type === 'tasks')
    }
  }, [apiTasks])

  // Подсчитываем количество готовых к получению награды задач в каждой категории
  const completedTasksCounts = useMemo(() => {
    return {
      daily: tasksByCategory.daily.filter(task => task.status === 'completed').length,
      weekly: tasksByCategory.weekly.filter(task => task.status === 'completed').length,
      tasks: tasksByCategory.tasks.filter(task => task.status === 'completed').length
    }
  }, [tasksByCategory])

  const categories = [
    { key: 'daily' as const, label: 'Ежедневные', icon: '📅' },
    { key: 'weekly' as const, label: 'Еженедельные', icon: '📊' },
    { key: 'tasks' as const, label: 'Задания', icon: '🎯' }
  ]

  const handleCategoryChange = (category: 'daily' | 'weekly' | 'tasks') => {
    setActiveCategory(category)
  }

  const handleTaskClaim = useCallback(async (taskId: string) => {
    console.log('Task claimed:', taskId)

    const success = await claimReward(taskId)
    if (success) {
      // Обновляем данные после успешного получения награды
      await refreshTasks()
    }
  }, [claimReward, refreshTasks])



  const getEmptyStateText = (category: 'daily' | 'weekly' | 'tasks') => {
    if (loading) return 'Загрузка заданий...'
    if (error) return 'Ошибка загрузки заданий'

    switch (category) {
      case 'daily':
        return 'Все ежедневные задания выполнены!'
      case 'weekly':
        return 'Все еженедельные задания выполнены!'
      case 'tasks':
        return 'Все задания выполнены!'
      default:
        return 'Нет доступных заданий'
    }
  }

  return (
    <div className="common-page-background">
      <ParticleBackground />

      <GameHeaderContainer />

      <div className="common-content">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Задания</h1>
          </div>

          {/* Категории */}
          <div className={styles.categories}>
            {categories.map((category) => {
              const completedCount = completedTasksCounts[category.key]
              const hasCompletedTasks = completedCount > 0

              return (
                <button
                  key={category.key}
                  className={`${styles.categoryButton} ${
                    activeCategory === category.key ? styles.active : ''
                  } ${hasCompletedTasks ? styles.highlighted : ''}`}
                  onClick={() => handleCategoryChange(category.key)}
                >
                  <div className={styles.categoryIconContainer}>
                    <span className={styles.categoryIcon}>{category.icon}</span>
                    {hasCompletedTasks && (
                      <div className={styles.categoryBadge}>
                        {completedCount}
                      </div>
                    )}
                  </div>
                  <span className={styles.categoryLabel}>{category.label}</span>
                </button>
              )
            })}
          </div>

          {/* Список заданий */}
          <div className={styles.tasksContainer}>
            <TaskList
              tasks={tasksByCategory[activeCategory]}
              onTaskClaim={handleTaskClaim}
              emptyStateText={getEmptyStateText(activeCategory)}
            />
          </div>

          {/* Показываем ошибки если есть */}
          {error && (
            <div style={{
              color: '#ff6b6b',
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              margin: '16px 0',
              textAlign: 'center'
            }}>
              Ошибка загрузки заданий: {error.message}
              <br />
              <button
                onClick={refreshTasks}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Попробовать еще раз
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}