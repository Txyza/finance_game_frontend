import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer } from '@shared/ui'
import { useUser } from '@shared/hooks'
import { bankingApi, BankingInstrument } from '@shared/api'
import { DebitCard } from '../DebitCard'
import { AccountSection } from '../AccountSection'
import styles from './AccountsPage.module.css'

export const AccountsPage: FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()

  const [debitCards, setDebitCards] = useState<BankingInstrument[]>([])
  const [savingsAccounts, setSavingsAccounts] = useState<BankingInstrument[]>([])
  const [deposits, setDeposits] = useState<BankingInstrument[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const cardType = user?.card_type || 'smart_mir' // smart_mir или supreme_mir

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await bankingApi.getInstruments()

        setDebitCards(data.debit_cards || [])
        setSavingsAccounts(data.savings_accounts || [])
        setDeposits(data.deposits || [])
        setTotalBalance(data.total_balance || 0)
      } catch (error) {
        console.error('Failed to load banking instruments:', error)
        setDebitCards([])
        setSavingsAccounts([])
        setDeposits([])
        setTotalBalance(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const sections = [
    {
      title: 'Накопительные счета',
      items: savingsAccounts,
      onNavigate: () => navigate('/savings'),
      emptyMessage: 'Нет накопительных счетов'
    },
    {
      title: 'Вклады',
      items: deposits,
      onNavigate: () => navigate('/deposits'),
      emptyMessage: 'Нет вкладов'
    },
    {
      title: 'Кредитные карты',
      items: [],
      onNavigate: () => navigate('/credit-cards'),
      emptyMessage: 'Нет кредитных карт'
    },
    {
      title: 'Ипотека',
      items: [],
      onNavigate: () => navigate('/mortgage'),
      emptyMessage: 'Нет ипотечных кредитов'
    },
    {
      title: 'Кредиты',
      items: [],
      onNavigate: () => navigate('/loans'),
      emptyMessage: 'Нет кредитов'
    }
  ]

  const sectionsWithData = sections.filter(section => section.items.length > 0)

  return (
    <div className="common-page-background">
      <ParticleBackground />
      <GameHeaderContainer />

      <div className={styles.content}>
        <div className={styles.container}>
          <h1 className={styles.title}>Счета</h1>

          {/* Дебетовая карта */}
          <DebitCard
            cardType={cardType}
            balance={debitCards.length > 0 ? debitCards[0].balance : totalBalance}
            name={debitCards.length > 0 ? debitCards[0].name : undefined}
            openedAt={debitCards.length > 0 ? debitCards[0].opened_at : undefined}
          />


          {/* Разделы счетов */}
          {isLoading ? (
            <div className={styles.loading}>
              <p>Загрузка данных...</p>
            </div>
          ) : sectionsWithData.length > 0 ? (
            <div className={styles.sections}>
              {sectionsWithData.map((section) => (
                <AccountSection
                  key={section.title}
                  title={section.title}
                  items={section.items}
                  onNavigate={section.onNavigate}
                  collapsible={section.title === 'Накопительные счета'}
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>У вас пока нет активных финансовых продуктов</p>
              <p>Посетите <strong>Город</strong>, чтобы начать инвестировать!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}