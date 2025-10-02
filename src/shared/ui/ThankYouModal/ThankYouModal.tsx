import React from 'react'
import { Button } from '../Button/Button'
import styles from './ThankYouModal.module.css'

interface ThankYouModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  isOpen,
  onClose,
  title = "Спасибо за интерес к игре!",
  message = "Скоро магазин станет активным!"
}) => {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.icon}>🙏</div>
          <h2 className={styles.title}>
            {title}
          </h2>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>
            {message}
          </p>
        </div>

        <div className={styles.actions}>
          <Button
            variant="gradient-mint"
            size="medium"
            onClick={onClose}
            className={styles.button}
          >
            Понятно
          </Button>
        </div>
      </div>
    </div>
  )
}