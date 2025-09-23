import { FC, useState } from 'react'
import {
  Button,
  Bubble,
  Card,
  MonthSelector,
  CategoryProgressBar,
  AnalyticsCard,
  TransactionItem,
  PieChart,
  CategoryTag,
  PeriodSelector,
  ExpandableAnalyticsCard,
  ShopItem,
  PremiumCard
} from '@shared/ui'
import { EventCard } from '@widgets/EventCard'
import { WorkshopCard } from '@widgets/WorkshopCard'
import { WorkCard, WorkGameData } from '@pages/work/ui/WorkCard'
import { GameTile } from '@pages/work/2048/ui/GameTile/GameTile'
import { GameNavigation } from '@pages/work/2048/ui/GameNavigation/GameNavigation'
import { GameHeader } from '@shared/ui'
import { GameEndModal } from '@pages/work/2048/ui/GameEndModal/GameEndModal'
import { MemoryCard } from '../../work/memory/ui/MemoryCard/MemoryCard'
import styles from './BrandbookPage.module.css'

export const BrandbookPage: FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  // Mock данные для карточек работы
  const mockGames: WorkGameData[] = [
    {
      id: '2048',
      name: '2048',
      description: 'Собери плитку 2048 на поле 4x4',
      icon: '🎲',
      multiplier: 2.0,
      energyCost: 5,
      isAvailable: true
    },
    {
      id: 'match3',
      name: 'Три в ряд',
      description: 'Собирай линии из одинаковых элементов',
      icon: '💎',
      multiplier: 1.5,
      energyCost: 3,
      isAvailable: true
    },
    {
      id: 'memory',
      name: 'Память',
      description: 'Находи пары одинаковых карточек',
      icon: '🧠',
      multiplier: 1.0,
      energyCost: 8,
      isAvailable: false
    }
  ]

  const handleGameStart = (gameId: string) => {
    console.log(`Starting game: ${gameId} (Brandbook demo - no navigation)`)
  }

  const handleBrandbookAction = (action: string) => {
    console.log(`${action} clicked (Brandbook demo - no action taken)`)
  }

  // Mock данные для плиток игры 2048
  const mockTiles = [
    { id: '1', value: 2, position: { row: 0, col: 0 } },
    { id: '2', value: 4, position: { row: 0, col: 1 } },
    { id: '3', value: 8, position: { row: 0, col: 2 } },
    { id: '4', value: 16, position: { row: 0, col: 3 } },
    { id: '5', value: 32, position: { row: 1, col: 0 } },
    { id: '6', value: 64, position: { row: 1, col: 1 } },
    { id: '7', value: 128, position: { row: 1, col: 2 } },
    { id: '8', value: 256, position: { row: 1, col: 3 } },
    { id: '9', value: 512, position: { row: 2, col: 0 } },
    { id: '10', value: 1024, position: { row: 2, col: 1 } },
    { id: '11', value: 2048, position: { row: 2, col: 2 } },
    { id: '12', value: 4096, position: { row: 2, col: 3 } }
  ]

  // Mock данные игрока для компонентов игры
  const mockPlayerStats = {
    level: 5,
    currentExp: 20,
    maxExp: 150,
    energy: 18,
    maxEnergy: 24,
    money: 12500
  }

  // Mock данные для карточек игры Memory
  const mockMemoryCards = [
    { id: '1', pairId: 'pair_1', emoji: '🎯', isFlipped: false, isMatched: false, position: 0 },
    { id: '2', pairId: 'pair_1', emoji: '🎯', isFlipped: true, isMatched: false, position: 1 },
    { id: '3', pairId: 'pair_2', emoji: '🎨', isFlipped: true, isMatched: true, position: 2 },
    { id: '4', pairId: 'pair_2', emoji: '🎨', isFlipped: true, isMatched: true, position: 3 },
    { id: '5', pairId: 'pair_3', emoji: '🎭', isFlipped: false, isMatched: false, position: 4 },
    { id: '6', pairId: 'pair_4', emoji: '🎪', isFlipped: false, isMatched: false, position: 5 }
  ]

  // Mock данные для компонентов аналитики
  const mockCategories = [
    { name: 'Переводы', amount: 19183, color: '#58ffff', percentage: 25 },
    { name: 'НКО', amount: 12000, color: '#ffeb3b', percentage: 15 },
    { name: 'Супермаркеты', amount: 9278, color: '#ff5722', percentage: 12 },
    { name: 'Фастфуд', amount: 9013, color: '#ff9800', percentage: 12 },
    { name: 'Маркетплейсы', amount: 6483, color: '#e91e63', percentage: 8 },
    { name: 'Остальное', amount: 22000, color: '#9e9e9e', percentage: 28 }
  ]

  const mockTransactions = [
    { icon: '🔄', name: 'Перевод округлений', category: 'Переводы', amount: -21.20, isPositive: false },
    { icon: '🛒', name: 'Мария РА', category: 'Супермаркеты', amount: -128.80, isPositive: false },
    { icon: '💳', name: 'Дружище А.', category: 'Переводы', amount: -2000, isPositive: false },
    { icon: '🏪', name: 'ООО "Инвест Ресторация"', category: 'Супермаркеты', amount: -479.96, isPositive: false },
    { icon: '💰', name: 'Зарплата', category: 'Доходы', amount: 75000, isPositive: true }
  ]

  const mockPieSegments = [
    { name: 'Переводы', value: 19183, percentage: 25, color: '#58ffff', icon: '🔄' },
    { name: 'НКО', value: 12000, percentage: 15, color: '#ffeb3b', icon: '?' },
    { name: 'Супермаркеты', value: 9278, percentage: 12, color: '#ff5722', icon: '🛒' },
    { name: 'Фастфуд', value: 9013, percentage: 12, color: '#ff9800', icon: '🍔' },
    { name: 'Маркетплейсы', value: 6483, percentage: 8, color: '#e91e63', icon: '👑' },
    { name: 'Остальное', value: 22000, percentage: 28, color: '#9e9e9e', icon: '•••' }
  ]

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Брендбук дизайн-системы</h1>
          <p className={styles.subtitle}>
            Компоненты и стили финансовой игры на основе брендбука Газпромбанк ТЕХ
          </p>
        </header>

        {/* Цветовая палитра */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Цветовая палитра</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Основные цвета</h3>
            <div className={styles.colorGrid}>
              <div className={styles.colorCard} style={{ backgroundColor: '#000000' }}>
                <span className={styles.colorName}>Черный</span>
                <span className={styles.colorCode}>#000000</span>
              </div>
              <div className={styles.colorCard} style={{ backgroundColor: '#1919ef' }}>
                <span className={styles.colorName}>Фиалка</span>
                <span className={styles.colorCode}>#1919ef</span>
              </div>
              <div className={styles.colorCard} style={{ backgroundColor: '#58ffff', color: '#000' }}>
                <span className={styles.colorName}>Мята</span>
                <span className={styles.colorCode}>#58ffff</span>
              </div>
              <div className={styles.colorCard} style={{ backgroundColor: '#dd41db' }}>
                <span className={styles.colorName}>Малина</span>
                <span className={styles.colorCode}>#dd41db</span>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Дополнительные цвета</h3>
            <div className={styles.colorGrid}>
              <div className={styles.colorCard} style={{ backgroundColor: '#3cfeb9', color: '#000' }}>
                <span className={styles.colorName}>Мелисса</span>
                <span className={styles.colorCode}>#3cfeb9</span>
              </div>
              <div className={styles.colorCard} style={{ backgroundColor: '#ff82be' }}>
                <span className={styles.colorName}>Сакура</span>
                <span className={styles.colorCode}>#ff82be</span>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Градиенты</h3>
            <div className={styles.gradientGrid}>
              <div className={styles.gradientCard} style={{ background: 'linear-gradient(135deg, #58ffff 0%, #3cfeb9 100%)' }}>
                <span className={styles.gradientName}>Мята → Мелисса</span>
              </div>
              <div className={styles.gradientCard} style={{ background: 'linear-gradient(135deg, #58ffff 0%, #1919ef 100%)' }}>
                <span className={styles.gradientName}>Мята → Фиалка</span>
              </div>
              <div className={styles.gradientCard} style={{ background: 'linear-gradient(135deg, #dd41db 0%, #ff82be 100%)' }}>
                <span className={styles.gradientName}>Малина → Сакура</span>
              </div>
              <div className={styles.gradientCard} style={{ background: 'linear-gradient(135deg, #dd41db 0%, #1919ef 100%)' }}>
                <span className={styles.gradientName}>Малина → Фиалка</span>
              </div>
            </div>
          </div>
        </section>

        {/* Кнопки */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Кнопки</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Варианты</h3>
            <div className={styles.buttonGrid}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent-mint">Accent Mint</Button>
              <Button variant="accent-raspberry">Accent Raspberry</Button>
              <Button variant="gradient-mint">Gradient Mint</Button>
              <Button variant="gradient-raspberry">Gradient Raspberry</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Размеры</h3>
            <div className={styles.buttonGrid}>
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Состояния</h3>
            <div className={styles.buttonGrid}>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width</Button>
            </div>
          </div>
        </section>

        {/* Баблы */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Баблы</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Варианты</h3>
            <div className={styles.bubbleGrid}>
              <Bubble variant="primary">Primary</Bubble>
              <Bubble variant="mint">Mint</Bubble>
              <Bubble variant="raspberry">Raspberry</Bubble>
              <Bubble variant="violet">Violet</Bubble>
              <Bubble variant="black">Black</Bubble>
              <Bubble variant="outline">Outline</Bubble>
              <Bubble variant="gradient-mint">Gradient Mint</Bubble>
              <Bubble variant="gradient-raspberry">Gradient Raspberry</Bubble>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Размеры</h3>
            <div className={styles.bubbleGrid}>
              <Bubble size="small">Small</Bubble>
              <Bubble size="medium">Medium</Bubble>
              <Bubble size="large">Large</Bubble>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>С иконками</h3>
            <div className={styles.bubbleGrid}>
              <Bubble icon="🚀">Митап</Bubble>
              <Bubble variant="raspberry" icon="🎯">Воркшоп</Bubble>
              <Bubble variant="mint" icon="📅">15 июля</Bubble>
              <Bubble variant="outline" icon="⏰">15:00</Bubble>
            </div>
          </div>
        </section>

        {/* Карточки */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Карточки</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Основные варианты</h3>
            <div className={styles.cardGrid}>
              <Card background="solid" backgroundColor="violet" padding="medium">
                <h4>Solid Violet</h4>
                <p>Карточка с фиолетовым фоном</p>
              </Card>

              <Card background="gradient" gradientType="mint-melissa" padding="medium">
                <h4 style={{ color: '#000' }}>Gradient Mint</h4>
                <p style={{ color: '#000' }}>Карточка с градиентом мята-мелисса</p>
              </Card>

              <Card background="gradient" gradientType="raspberry-sakura" padding="medium">
                <h4>Gradient Raspberry</h4>
                <p>Карточка с градиентом малина-сакура</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Составные компоненты */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Составные компоненты</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Event Cards</h3>
            <div className={styles.compositeGrid}>
              <EventCard
                title="ВОРКШОП BLENDER"
                description="Продвинутый уровень"
                date="15 июля"
                time="15:00"
                location="Москва"
                status="workshop"
              />

              <EventCard
                title="ПРИГЛАШАЕМ НА МИТАП"
                description="Трансляция будет открыта для всех желающих"
                date="15 июля"
                time="15:00"
                location="Онлайн"
                status="mitap"
              />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Workshop Cards</h3>
            <div className={styles.compositeGrid}>
              <WorkshopCard
                title="ВОРКШОП BLENDER"
                subtitle="Продвинутый уровень"
                level="PRO"
                participants={25}
                tags={['3D', 'Blender', 'Design']}
                gradient="violet-cumin"
              />

              <WorkshopCard
                title="ТЕХ"
                subtitle="Изучение основ"
                level="START"
                participants={15}
                tags={['Tech', 'Beginner']}
                gradient="mint-melissa"
              />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Work Game Cards</h3>
            <div className={styles.compositeGrid}>
              {mockGames.map((game) => (
                <WorkCard
                  key={game.id}
                  game={game}
                  onStart={handleGameStart}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Компоненты игры 2048 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Компоненты игры 2048</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Плитки игры</h3>
            <div className={styles.tilesGrid}>
              {mockTiles.map((tile) => (
                <div key={tile.id} className={styles.tileWrapper}>
                  <GameTile tile={tile} />
                  <span className={styles.tileLabel}>{tile.value}</span>
                </div>
              ))}
              <div className={styles.tileWrapper}>
                <GameTile tile={null} />
                <span className={styles.tileLabel}>Пустая</span>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Заголовок игры</h3>
            <div className={styles.gameComponentWrapper}>
              <GameHeader
                variant="work"
                level={mockPlayerStats.level}
                currentExp={mockPlayerStats.currentExp}
                maxExp={mockPlayerStats.maxExp}
                energy={mockPlayerStats.energy}
                maxEnergy={mockPlayerStats.maxEnergy}
                money={mockPlayerStats.money}
              />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Навигация игры</h3>
            <div className={styles.gameComponentWrapper}>
              <div className={styles.navigationDemo}>
                <div className={styles.leftSection}>
                  <Button
                    variant="gradient-mint"
                    size="small"
                    onClick={() => handleBrandbookAction('Back')}
                  >
                    ← Назад
                  </Button>
                </div>

                <div className={styles.centerSection}>
                  <div className={styles.gameTitle}>2048</div>
                  <div className={styles.scoreBlock}>
                    <div className={styles.scoreLabel}>Очки</div>
                    <div className={styles.scoreValue}>15,240</div>
                  </div>
                </div>

                <div className={styles.rightSection}>
                  <Button
                    variant="gradient-mint"
                    size="small"
                    onClick={() => handleBrandbookAction('New Game')}
                  >
                    Новая игра
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Модальное окно завершения</h3>
            <div className={styles.gameComponentWrapper}>
              <div className={styles.modalDemo}>
                <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>🎉 Победа!</h2>
                  </div>

                  <div className={styles.modalBody}>
                    <div className={styles.statsGrid}>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>Очки</div>
                        <div className={styles.statValue}>15,240</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>Максимальная плитка</div>
                        <div className={styles.statValue}>2048</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>Количество ходов</div>
                        <div className={styles.statValue}>127</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>Время игры</div>
                        <div className={styles.statValue}>5м 32с</div>
                      </div>
                    </div>

                    <div className={styles.achievement}>
                      <div className={styles.achievementText}>
                        Поздравляем! Вы достигли плитки 2048!
                      </div>
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <Button
                      variant="gradient-mint"
                      size="medium"
                      onClick={() => handleBrandbookAction('New Game from Modal')}
                    >
                      Новая игра
                    </Button>
                    <Button
                      variant="primary"
                      size="medium"
                      onClick={() => handleBrandbookAction('Back to Work')}
                    >
                      Вернуться к работам
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Компоненты игры Memory */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Компоненты игры Memory</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Карточки Memory</h3>
            <div className={styles.memoryCardsGrid}>
              {mockMemoryCards.map((card) => (
                <div key={card.id} className={styles.memoryCardWrapper}>
                  <MemoryCard
                    card={card}
                    onClick={() => handleBrandbookAction(`Memory Card: ${card.emoji}`)}
                  />
                  <span className={styles.memoryCardLabel}>{card.emoji} - {card.isFlipped ? 'Открыта' : 'Закрыта'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Заголовок игры Memory</h3>
            <div className={styles.gameComponentWrapper}>
              <GameHeader
                variant="work"
                level={mockPlayerStats.level}
                currentExp={mockPlayerStats.currentExp}
                maxExp={mockPlayerStats.maxExp}
                energy={mockPlayerStats.energy}
                maxEnergy={mockPlayerStats.maxEnergy}
                money={mockPlayerStats.money}
              />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Навигация игры Memory</h3>
            <div className={styles.gameComponentWrapper}>
              <div className={styles.memoryNavigationDemo}>
                <div className={styles.leftSection}>
                  <Button
                    variant="gradient-mint"
                    size="small"
                    onClick={() => handleBrandbookAction('Memory Back')}
                  >
                    ← Назад
                  </Button>
                </div>

                <div className={styles.centerSection}>
                  <div className={styles.gameTitle}>Memory</div>
                  <div className={styles.memoryGameStats}>
                    <div className={styles.memoryStatBlock}>
                      <div className={styles.statLabel}>Очки</div>
                      <div className={styles.statValue}>2,750</div>
                    </div>
                    <div className={styles.memoryStatBlock}>
                      <div className={styles.statLabel}>Время</div>
                      <div className={styles.statValue}>1:15</div>
                    </div>
                    <div className={styles.memoryStatBlock}>
                      <div className={styles.statLabel}>Раунд</div>
                      <div className={styles.statValue}>3</div>
                    </div>
                  </div>
                </div>

                <div className={styles.rightSection}>
                  <Button
                    variant="gradient-mint"
                    size="small"
                    onClick={() => handleBrandbookAction('Memory New Game')}
                  >
                    Новая игра
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Модальное окно завершения Memory</h3>
            <div className={styles.gameComponentWrapper}>
              <div className={styles.modalDemo}>
                <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>🧠 Время вышло!</h2>
                  </div>

                  <div className={styles.modalBody}>
                    <div className={styles.statsGrid}>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>Итоговые очки</div>
                        <div className={styles.statValue}>2,750</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>Раундов завершено</div>
                        <div className={styles.statValue}>3</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>Пар найдено</div>
                        <div className={styles.statValue}>22</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statLabel}>Точность</div>
                        <div className={styles.statValue}>85%</div>
                      </div>
                    </div>

                    <div className={styles.achievement}>
                      <div className={styles.achievementText}>
                        Отличная память! Вы завершили 3 раунда!
                      </div>
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <Button
                      variant="gradient-mint"
                      size="medium"
                      onClick={() => handleBrandbookAction('Memory New Game from Modal')}
                    >
                      Новая игра
                    </Button>
                    <Button
                      variant="primary"
                      size="medium"
                      onClick={() => handleBrandbookAction('Memory Back to Work')}
                    >
                      Вернуться к работам
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Компоненты аналитики */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Компоненты аналитики</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Селектор месяца</h3>
            <div className={styles.analyticsComponentWrapper}>
              <MonthSelector
                month="Сентябрь"
                onClear={() => handleBrandbookAction('Clear month')}
                onClick={() => handleBrandbookAction('Select month')}
              />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Селектор периода</h3>
            <div className={styles.analyticsComponentWrapper}>
              <PeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Полоска категорий</h3>
            <div className={styles.analyticsComponentWrapper}>
              <CategoryProgressBar categories={mockCategories} />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Карточки аналитики</h3>
            <div className={styles.analyticsCardsGrid}>
              <AnalyticsCard
                amount={77959}
                type="expenses"
                categories={mockCategories}
                onClick={() => handleBrandbookAction('Open expenses card')}
              />
              <AnalyticsCard
                amount={1740}
                type="income"
                categories={mockCategories.slice(0, 3)}
                onClick={() => handleBrandbookAction('Open income card')}
              />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Элементы транзакций</h3>
            <div className={styles.transactionsList}>
              {mockTransactions.map((transaction, index) => (
                <TransactionItem
                  key={index}
                  icon={transaction.icon}
                  name={transaction.name}
                  category={transaction.category}
                  amount={transaction.amount}
                  isPositive={transaction.isPositive}
                  onClick={() => handleBrandbookAction(`Transaction: ${transaction.name}`)}
                />
              ))}
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Круговая диаграмма</h3>
            <div className={styles.analyticsComponentWrapper}>
              <PieChart
                segments={mockPieSegments}
                size={200}
                strokeWidth={16}
              />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Теги категорий</h3>
            <div className={styles.categoryTagsGrid}>
              {mockPieSegments.slice(0, 4).map((segment, index) => (
                <CategoryTag
                  key={index}
                  icon={segment.icon}
                  name={segment.name}
                  amount={segment.value}
                  color={segment.color}
                  onClick={() => handleBrandbookAction(`Category: ${segment.name}`)}
                />
              ))}
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Развернутая карточка аналитики</h3>
            <div className={styles.analyticsComponentWrapper}>
              <ExpandableAnalyticsCard
                amount={77959}
                type="expenses"
                segments={mockPieSegments}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                onClose={() => handleBrandbookAction('Close expanded card')}
              />
            </div>
          </div>
        </section>

        {/* Компоненты магазина */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Компоненты магазина</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Премиум карточка</h3>
            <div className={styles.shopComponentWrapper}>
              <PremiumCard
                onPurchase={() => handleBrandbookAction('Premium purchase')}
              />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Товары магазина</h3>
            <div className={styles.shopItemsGrid}>
              <ShopItem
                title="Выпить кофе"
                icon="☕"
                reward="+4 энергии"
                price="4"
                currency="rub"
                onPurchase={() => handleBrandbookAction('Coffee purchase')}
              />
              <ShopItem
                title="Выпить энергетик"
                icon="🥤"
                reward="+12 энергии"
                price="8"
                currency="rub"
                onPurchase={() => handleBrandbookAction('Energy drink purchase')}
              />
              <ShopItem
                title="Кошель денег"
                icon="👛"
                reward="+15,000 ₽"
                price="15"
                currency="rub"
                onPurchase={() => handleBrandbookAction('Money wallet purchase')}
              />
              <ShopItem
                title="Премиум товар"
                icon="⭐"
                reward="+50 бонусов"
                price="10"
                currency="premium"
                onPurchase={() => handleBrandbookAction('Premium item purchase')}
              />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Заголовки разделов магазина</h3>
            <div className={styles.shopSectionHeadersWrapper}>
              <div className={styles.sectionHeaderExample}>
                <Bubble variant="gradient-mint" size="large" className={styles.shopSectionBubble}>
                  ⚡ Энергия
                </Bubble>
              </div>
              <div className={styles.sectionHeaderExample}>
                <Bubble variant="gradient-mint" size="large" className={styles.shopSectionBubble}>
                  ₽ Деньги
                </Bubble>
              </div>
              <div className={styles.sectionHeaderExample}>
                <Bubble variant="gradient-mint" size="large" className={styles.shopSectionBubble}>
                  ⭐ Премиум
                </Bubble>
              </div>
            </div>
          </div>
        </section>

        {/* Типографика */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Типографика</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Заголовки</h3>
            <div className={styles.typographyExample}>
              <h1 style={{ fontFamily: 'var(--font-accent)' }}>H1 - Заголовок первого уровня</h1>
              <h2 style={{ fontFamily: 'var(--font-accent)' }}>H2 - Заголовок второго уровня</h2>
              <h3 style={{ fontFamily: 'var(--font-accent)' }}>H3 - Заголовок третьего уровня</h3>
              <h4 style={{ fontFamily: 'var(--font-accent)' }}>H4 - Заголовок четвертого уровня</h4>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Текст</h3>
            <div className={styles.typographyExample}>
              <p style={{ fontSize: 'var(--font-size-lg)' }}>
                Большой текст - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p>
                Обычный текст - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>
                Мелкий текст - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}