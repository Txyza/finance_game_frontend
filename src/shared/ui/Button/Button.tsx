import { FC, ReactNode, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'accent-mint' | 'accent-raspberry' | 'gradient-mint' | 'gradient-raspberry' | 'outline'
  size?: 'small' | 'medium' | 'large'
  children: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      <span className={loading ? styles.content : ''}>{children}</span>
    </button>
  )
}