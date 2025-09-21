import { FC } from 'react'
import { Header } from '@widgets/header'
import { Footer } from '@widgets/footer'
import { Button } from '@shared/ui'
import styles from './HomePage.module.css'

export const HomePage: FC = () => {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>
              Финансовая игра
            </h1>
            <p className={styles.subtitle}>
              Изучайте основы финансовой грамотности через увлекательную игру
            </p>
            <Button size="large">
              Начать игру
            </Button>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.container}>
            <h2>Возможности</h2>
            <div className={styles.featureGrid}>
              <div className={styles.feature}>
                <h3>🎮 Игровой процесс</h3>
                <p>Интерактивные сценарии для изучения финансов</p>
              </div>
              <div className={styles.feature}>
                <h3>📊 Статистика</h3>
                <p>Отслеживайте свой прогресс и достижения</p>
              </div>
              <div className={styles.feature}>
                <h3>🏆 Рейтинг</h3>
                <p>Соревнуйтесь с другими игроками</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}