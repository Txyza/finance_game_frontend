import { FC } from 'react'
import styles from './DebitCard.module.css'

interface DebitCardProps {
  cardType: 'smart_mir' | 'supreme_mir'
  balance: number
}

export const DebitCard: FC<DebitCardProps> = ({ cardType, balance }) => {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount)
  }

  const cardData = {
    smart_mir: {
      name: 'Умная дебетовая карта "Мир"',
      className: styles.cardSmart,
      cashback: '100%'
    },
    supreme_mir: {
      name: 'Премиальная карта Mir Supreme',
      className: styles.cardSupreme,
      cashback: null
    }
  }

  const card = cardData[cardType]

  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.cardVisual} ${card.className}`}>
        <div className={styles.cardContent}>
          <div className={styles.cardLogo}>ГАЗПРОМБАНК</div>
          <div className={styles.cardChip}></div>

          {cardType === 'smart_mir' ? (
            <div className={styles.cardCashback}>100%</div>
          ) : (
            <div className={styles.cardSupremeText}>
              <div>SUPREME</div>
              <div className={styles.mirLogo}>MIR<br/>SUPREME</div>
            </div>
          )}

          <div className={styles.cardBottom}>
            <div className={styles.cardBalance}>
              <div className={styles.balanceLabel}>Баланс</div>
              <div className={styles.balanceAmount}>{formatBalance(balance)} ₽</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cardInfo}>
        <h3 className={styles.cardName}>{card.name}</h3>
      </div>
    </div>
  )
}