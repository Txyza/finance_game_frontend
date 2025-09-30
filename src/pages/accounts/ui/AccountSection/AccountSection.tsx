import { FC } from 'react'
import { Button } from '@shared/ui'
import { BankingInstrument } from '@shared/api'
import styles from './AccountSection.module.css'

interface AccountSectionProps {
  title: string
  items: BankingInstrument[]
  onNavigate: () => void
}

export const AccountSection: FC<AccountSectionProps> = ({
  title,
  items,
  onNavigate
}) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount)
  }

  const getIcon = (item: BankingInstrument) => {
    switch (item.type) {
      case 'savings_account':
        return '💳'
      case 'deposit':
        return '🏦'
      case 'debit_card':
        return '💳'
      default:
        return '💼'
    }
  }

  const renderAccountItem = (item: BankingInstrument, index: number) => {
    const balance = item.balance / 100 // Переводим из копеек в рубли

    return (
      <div key={item.id} className={styles.accountItem}>
        <div className={styles.accountIcon}>{getIcon(item)}</div>
        <div className={styles.accountDetails}>
          <div className={styles.accountName}>{item.name}</div>
          <div className={styles.accountBalance}>{formatAmount(balance)} ₽</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <span className={styles.itemCount}>{items.length}</span>
      </div>

      <div className={styles.accountsList}>
        {items.slice(0, 3).map(renderAccountItem)}
        {items.length > 3 && (
          <div className={styles.moreItems}>
            и еще {items.length - 3} {items.length - 3 === 1 ? 'продукт' : 'продуктов'}
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="small"
        onClick={onNavigate}
        className={styles.viewAllButton}
      >
        Посмотреть все
      </Button>
    </div>
  )
}