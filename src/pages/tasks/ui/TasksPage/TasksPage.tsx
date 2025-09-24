import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TaskList,
  Task,
  ParticleBackground
} from '@shared/ui'
import { GameHeaderContainer } from '@shared/ui'
import styles from './TasksPage.module.css'

type TaskCategory = 'tasks' | 'daily' | 'weekly'

export const TasksPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<TaskCategory>('daily')
  const [tasks, setTasks] = useState<Record<TaskCategory, Task[]>>({
    tasks: [
      {
        id: 'task-1',
        title: 'Миллионер',
        description: 'Заработать 1,000,000 рублей',
        type: 'tasks',
        progress: { current: 750000, target: 1000000 },
        reward: { type: 'exp', amount: 500 },
        status: 'active',
        icon: '💎'
      },
      {
        id: 'task-2',
        title: 'Игровой гуру',
        description: 'Набрать 50,000 очков в 2048',
        type: 'tasks',
        progress: { current: 50000, target: 50000 },
        reward: { type: 'money', amount: 5000 },
        status: 'completed',
        icon: '🎮'
      }
    ],
    daily: [
      {
        id: 'daily-1',
        title: 'Трудолюбие',
        description: 'Поработать в 2048 - 3 раза',
        type: 'daily',
        progress: { current: 2, target: 3 },
        reward: { type: 'money', amount: 1000 },
        status: 'active',
        icon: '🎯'
      },
      {
        id: 'daily-2',
        title: 'Умственная активность',
        description: 'Поиграть в память - 2 раза',
        type: 'daily',
        progress: { current: 2, target: 2 },
        reward: { type: 'exp', amount: 50 },
        status: 'completed',
        icon: '🧠'
      },
      {
        id: 'daily-3',
        title: 'Аналитик',
        description: 'Проверить аналитику трат',
        type: 'daily',
        progress: { current: 0, target: 1 },
        reward: { type: 'energy', amount: 2 },
        status: 'active',
        icon: '📊'
      }
    ],
    weekly: [
      {
        id: 'weekly-1',
        title: 'Постоянство',
        description: 'Поработать 4 дня за неделю',
        type: 'weekly',
        progress: { current: 3, target: 4 },
        reward: { type: 'money', amount: 5000 },
        status: 'active',
        icon: '📅'
      },
      {
        id: 'weekly-2',
        title: 'Игровой марафон',
        description: 'Набрать 100,000 очков в играх за неделю',
        type: 'weekly',
        progress: { current: 85000, target: 100000 },
        reward: { type: 'exp', amount: 200 },
        status: 'active',
        icon: '🏆'
      }
    ]
  })

  // Mock данные игрока
  const playerStats = {
    level: 5,
    currentExp: 20,
    maxExp: 150,
    energy: 18,
    maxEnergy: 24,
    money: 12500,
    bankRate: 8.5,
    inflation: 4.2
  }

  const categories = [
    { key: 'daily' as const, label: 'Ежедневные', icon: '📅' },
    { key: 'weekly' as const, label: 'Еженедельные', icon: '📊' },
    { key: 'tasks' as const, label: 'Задания', icon: '🎯' }
  ]

  const handleCategoryChange = (category: TaskCategory) => {
    setActiveCategory(category)
  }

  const handleTaskClaim = useCallback((taskId: string) => {
    console.log('Task claimed:', taskId)

    // Обновляем статус задания на 'claimed' и удаляем из списка
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks }

      // Находим и обновляем задание во всех категориях
      Object.keys(newTasks).forEach(category => {
        const categoryKey = category as TaskCategory
        newTasks[categoryKey] = newTasks[categoryKey].map(task =>
          task.id === taskId ? { ...task, status: 'claimed' as const } : task
        )
      })

      return newTasks
    })
  }, [])



  const getEmptyStateText = (category: TaskCategory) => {
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

      <GameHeaderContainer
        bankRate={playerStats.bankRate}
        inflation={playerStats.inflation}
      />

      <div className="common-content">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Задания</h1>
          </div>

          {/* Категории */}
          <div className={styles.categories}>
            {categories.map((category) => (
              <button
                key={category.key}
                className={`${styles.categoryButton} ${
                  activeCategory === category.key ? styles.active : ''
                }`}
                onClick={() => handleCategoryChange(category.key)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryLabel}>{category.label}</span>
              </button>
            ))}
          </div>

          {/* Список заданий */}
          <div className={styles.tasksContainer}>
            <TaskList
              tasks={tasks[activeCategory]}
              onTaskClaim={handleTaskClaim}
              emptyStateText={getEmptyStateText(activeCategory)}
            />
          </div>
        </div>
      </div>

    </div>
  )
}