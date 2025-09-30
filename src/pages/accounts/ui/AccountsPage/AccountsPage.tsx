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
        console.log('🔄 Loading banking instruments...')

        // Прямой вызов для проверки
        const response = await fetch('/api/v1/banking/instruments')
        const data = await response.json()
        console.log('📦 Raw API response:', data)

        setDebitCards(data.debit_cards || [])
        setSavingsAccounts(data.savings_accounts || [])
        setDeposits(data.deposits || [])
        setTotalBalance(data.total_balance || 0)

        console.log('✅ State updated:', {
          debitCards: data.debit_cards?.length || 0,
          savingsAccounts: data.savings_accounts?.length || 0,
          deposits: data.deposits?.length || 0,
          totalBalance: data.total_balance || 0
        })
      } catch (error) {
        console.error('❌ Failed to load banking instruments:', error)
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

  console.log('🎨 Render state:', {
    isLoading,
    debitCardsLength: debitCards.length,
    savingsLength: savingsAccounts.length,
    depositsLength: deposits.length,
    sectionsWithDataLength: sectionsWithData.length,
    sectionsWithData: sectionsWithData.map(s => ({ title: s.title, itemsCount: s.items.length }))
  })

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

          {/* DEBUG INFO */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px'
          }}>
            <h4>🔍 Debug Info</h4>
            <p>Loading: {String(isLoading)}</p>
            <p>Debit Cards: {debitCards.length} items</p>
            <p>Savings Accounts: {savingsAccounts.length} items</p>
            <p>Deposits: {deposits.length} items</p>
            <p>Total Balance: {totalBalance}</p>
            <p>Sections with data: {sectionsWithData.length}</p>
            <p>Section titles: {sectionsWithData.map(s => s.title).join(', ')}</p>
          </div>

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