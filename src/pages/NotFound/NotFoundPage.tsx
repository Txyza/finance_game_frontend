import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ParticleBackground } from '@shared/ui'
import { use404 } from '@shared/hooks/use404'
import { SEO } from '@shared/components'
import styles from './NotFoundPage.module.css'

export const NotFoundPage: FC = () => {
  const navigate = useNavigate()
  use404() // Устанавливаем правильный 404 статус

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <>
      <SEO
        title="404 - Страница не найдена | Cash-lvl"
        description="Упс! Эта страница не существует. Вернитесь на главную страницу Cash-lvl и продолжите свое финансовое путешествие."
        keywords="404, страница не найдена, ошибка, cash-lvl"
      />
      <div className="common-page-background">
      <ParticleBackground
        particleCount={15}
        particleColor="#58ffff"
        animationSpeed="slow"
      />

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.title}>Страница не найдена</h1>
          <p className={styles.description}>
            Похоже, вы заблудились в финансовом лабиринте Cash-lvl.
            <br />
            Эта страница не существует или была перемещена.
          </p>

          <div className={styles.actions}>
            <Button
              variant="gradient-mint"
              size="large"
              onClick={handleGoHome}
            >
              На главную
            </Button>
            <Button
              variant="outline"
              size="large"
              onClick={handleGoBack}
            >
              Назад
            </Button>
          </div>

          <div className={styles.hint}>
            💡 Совет: Используйте навигацию снизу для перемещения по игре
          </div>
        </div>
      </div>
    </div>
    </>
  )
}