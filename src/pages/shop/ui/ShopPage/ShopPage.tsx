import { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ShopItem,
  PremiumCard,
  Bubble,
  GameHeaderContainer,
  ParticleBackground,
  ThankYouModal
} from '@shared/ui'
import { useStore } from '@shared/hooks'
import styles from './ShopPage.module.css'

export const ShopPage: FC = () => {
  const [searchParams] = useSearchParams()
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const { items: storeItems, loading: storeLoading, error: storeError, buyItem } = useStore()

  // Mock данные игрока
  const playerStats = {
    level: 5,
    currentExp: 20,
    maxExp: 150,
    energy: 18,
    maxEnergy: 24,
    money: 12500,
    bankRate: 8.5,
    inflation: 2
  }

  // Скролл к нужной секции при переходе с параметром tab
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setTimeout(() => {
        const element = document.getElementById(`section-${tab}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [searchParams])

  const handlePurchase = async (itemName: string, cost: string) => {
    console.log(`Покупка: ${itemName} за ${cost}`)
    // Показываем модал с благодарностью
    setShowThankYouModal(true)
  }

  const handleStorePurchase = async (itemName: string) => {
    const success = await buyItem(itemName)
    if (success) {
      setShowThankYouModal(true)
    }
  }

  // Функция для получения иконки из image ID
  const getItemIcon = (imageId: string | null): string => {
    if (!imageId) return '🛍️'

    // Маппинг ID иконок на эмодзи
    const iconMap: Record<string, string> = {
      'coffee': '☕',
      'energy_drink': '🥤',
      'sleep': '😴',
      'wallet': '👛',
      'bucket': '🪣',
      'cart': '🛒',
      'food': '🍔',
      'pizza': '🍕',
      'cake': '🎂',
      'drink': '🥤',
      'gift': '🎁',
      'star': '⭐',
      'diamond': '💎',
      'coin': '🪙',
      'bag': '🎒'
    }

    return iconMap[imageId] || '🛍️'
  }

  const handleCloseThankYouModal = () => {
    setShowThankYouModal(false)
  }

  const energyItems = [
    {
      title: 'Выпить кофе',
      icon: '☕',
      reward: '+4 энергии',
      price: '4'
    },
    {
      title: 'Выпить энергетик',
      icon: '🥤',
      reward: '+12 энергии',
      price: '8'
    },
    {
      title: 'Дневной сон',
      icon: '😴',
      reward: '+24 энергии',
      price: '15'
    }
  ]

  const moneyItems = [
    {
      title: 'Кошель денег',
      icon: '👛',
      reward: '+15,000 ₽',
      price: '15'
    },
    {
      title: 'Ведро денег',
      icon: '🪣',
      reward: '+50,000 ₽',
      price: '30'
    },
    {
      title: 'Тележка денег',
      icon: '🛒',
      reward: '+100,000 ₽',
      price: '50'
    }
  ]

  return (
    <div className="common-page-background">
      {/* Анимированный фон с частицами */}
      <ParticleBackground
        particleCount={30}
        particleColor="#58ffff"
        animationSpeed="slow"
      />

      {/* Шапка со статистикой игрока */}
      <GameHeaderContainer
        bankRate={playerStats.bankRate}
        inflation={playerStats.inflation}
      />

      {/* Основной контент */}
      <div className="common-content">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Магазин</h1>
          </div>

          <div className={styles.content}>
            {/* Премиум секция */}
            <section id="section-premium" className={styles.section}>
              <div className={styles.premiumContainer}>
                <PremiumCard
                  onPurchase={() => handlePurchase('Премиум подписка', '25 ₽')}
                />
              </div>
            </section>

            {/* Супермаркет секция */}
            {storeItems.length > 0 && (
              <section id="section-supermarket" className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Bubble variant="gradient-mint" size="large" className={styles.sectionBubble}>
                    🛒 Супермаркет
                  </Bubble>
                </div>
                {storeLoading ? (
                  <div className={styles.loadingState}>Загрузка товаров...</div>
                ) : storeError ? (
                  <div className={styles.errorState}>
                    Ошибка загрузки товаров: {storeError.message}
                  </div>
                ) : (
                  <div className={styles.itemsGrid}>
                    {storeItems.map((item, index) => (
                      <ShopItem
                        key={index}
                        title={item.name}
                        icon={getItemIcon(item.image)}
                        reward={item.description}
                        price={item.price.toString()}
                        currency="game"
                        disabled={!item.exists}
                        onPurchase={() => handleStorePurchase(item.name)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Энергия секция */}
            <section id="section-energy" className={styles.section}>
              <div className={styles.sectionHeader}>
                <Bubble variant="gradient-mint" size="large" className={styles.sectionBubble}>
                  ⚡ Энергия
                </Bubble>
              </div>
              <div className={styles.itemsGrid}>
                {energyItems.map((item, index) => (
                  <ShopItem
                    key={index}
                    title={item.title}
                    icon={item.icon}
                    reward={item.reward}
                    price={item.price}
                    currency="rub"
                    onPurchase={() => handlePurchase(item.title, `${item.price} ₽`)}
                  />
                ))}
              </div>
            </section>

            {/* Деньги секция */}
            <section id="section-money" className={styles.section}>
              <div className={styles.sectionHeader}>
                <Bubble variant="gradient-mint" size="large" className={styles.sectionBubble}>
                  ₽ Деньги
                </Bubble>
              </div>
              <div className={styles.itemsGrid}>
                {moneyItems.map((item, index) => (
                  <ShopItem
                    key={index}
                    title={item.title}
                    icon={item.icon}
                    reward={item.reward}
                    price={item.price}
                    currency="rub"
                    onPurchase={() => handlePurchase(item.title, `${item.price} ₽`)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Модал с благодарностью */}
      <ThankYouModal
        isOpen={showThankYouModal}
        onClose={handleCloseThankYouModal}
      />
    </div>
  )
}