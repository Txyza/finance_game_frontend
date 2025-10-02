import { FC } from 'react'
import styles from './Footer.module.css'

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            Финансовая игра
          </div>

          <div className={styles.info}>
            <p>Проект для хакатона ЛЦТ</p>
            <p>Повышение финансовой грамотности через игру</p>
          </div>

          <div className={styles.links}>
            <a href="#" className={styles.link}>О проекте</a>
            <a href="#" className={styles.link}>Контакты</a>
            <a href="#" className={styles.link}>Поддержка</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2024 Финансовая игра. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}