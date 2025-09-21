import { FC } from 'react'
import styles from './Header.module.css'

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          Финансовая игра
        </div>

        <nav className={styles.nav}>
          <a href="#" className={styles.navLink}>Главная</a>
          <a href="#" className={styles.navLink}>О проекте</a>
          <a href="#" className={styles.navLink}>Контакты</a>
        </nav>
      </div>
    </header>
  )
}