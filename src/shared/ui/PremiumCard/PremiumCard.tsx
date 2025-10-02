import { FC } from 'react'
import { Bubble } from '@shared/ui'
import styles from './PremiumCard.module.css'

interface PremiumCardProps {
  onPurchase: () => void
  className?: string
}

export const PremiumCard: FC<PremiumCardProps> = ({
  onPurchase,
  className = ''
}) => {
  const benefits = [
    { icon: '💼', text: 'Премия на работе', value: '+25%' },
    { icon: '📈', text: 'Ставка по вкладам', value: '+2%' },
    { icon: '🏠', text: 'Ставка по ипотеке', value: '-2%' },
    { icon: '💳', text: 'Ставка по кредитам', value: '-2%' },
    { icon: '🎯', text: 'Дополнительные задания', value: '' }
  ]

  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.header}>
        <div className={styles.icon}>⭐</div>
        <div className={styles.title}>
          <h2>Премиум</h2>
          <p>Получите все преимущества</p>
        </div>
      </div>

      <div className={styles.benefits}>
        {benefits.map((benefit, index) => (
          <div key={index} className={styles.benefit}>
            <span className={styles.benefitIcon}>{benefit.icon}</span>
            <span className={styles.benefitText}>{benefit.text}</span>
            {benefit.value && (
              <span className={styles.benefitValue}>{benefit.value}</span>
            )}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Bubble
          variant="gradient-raspberry"
          size="large"
          onClick={onPurchase}
        >
          Получить за 25 ₽
        </Bubble>
      </div>
    </div>
  )
}