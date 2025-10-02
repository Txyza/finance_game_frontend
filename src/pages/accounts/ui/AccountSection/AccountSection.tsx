import { FC, useState } from 'react'
import { Button } from '@shared/ui'
import { BankingInstrument } from '@shared/api'
import { formatGameDate, formatGameTerm, formatRemainingTime } from '@shared/utils'
import styles from './AccountSection.module.css'

interface AccountSectionProps {
  title: string
  items: BankingInstrument[]
  onNavigate: () => void
  collapsible?: boolean
}

export const AccountSection: FC<AccountSectionProps> = ({
  title,
  items,
  onNavigate,
  collapsible = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
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
    const balance = item.balance // Баланс уже в рублях

    return (
      <div key={item.id} className={styles.accountItem}>
        <div className={styles.accountIcon}>{getIcon(item)}</div>
        <div className={styles.accountDetails}>
          <div className={styles.accountName}>{item.name}</div>
          <div className={styles.accountBalance}>{formatAmount(balance)} ₽</div>
          <div className={styles.accountInfo}>
            {item.interest_rate && (
              <span className={styles.accountRate}>{item.interest_rate}% годовых</span>
            )}
            <span className={styles.accountDate}>
              Открыт {formatGameDate(item.opened_at)}
            </span>
            {item.expires_at && (
              <>
                <span className={styles.accountTerm}>
                  Срок: {formatGameTerm(item.expires_at, item.opened_at)}
                </span>
                <span className={styles.accountRemaining}>
                  {formatRemainingTime(item.expires_at)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const displayItems = collapsible ? (isExpanded ? items : items.slice(0, 3)) : items.slice(0, 3)

  return (
    <div className={styles.section}>
      <div
        className={`${styles.sectionHeader} ${collapsible ? styles.clickable : ''}`}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.headerRight}>
          <span className={styles.itemCount}>{items.length}</span>
          {collapsible && (
            <span className={styles.expandIcon}>
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
        </div>
      </div>

      {(!collapsible || isExpanded) && (
        <div className={styles.accountsList}>
          {displayItems.map(renderAccountItem)}
          {!collapsible && items.length > 3 && (
            <div className={styles.moreItems}>
              и еще {items.length - 3} {items.length - 3 === 1 ? 'продукт' : 'продуктов'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}