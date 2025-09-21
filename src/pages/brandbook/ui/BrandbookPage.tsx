import { FC } from 'react'
import { Button, Bubble, Card } from '@shared/ui'
import { EventCard } from '@widgets/EventCard'
import { WorkshopCard } from '@widgets/WorkshopCard'
import styles from './BrandbookPage.module.css'

export const BrandbookPage: FC = () => {
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