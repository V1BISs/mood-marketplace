import styles from './Button.module.css'

const Button = ({ children, onClick, variant, disabled, className, ...props }) => {
  return (
    <button
      className={`${styles.button} ${variant === 'primary' ? styles.primary : styles.secondary} ${disabled ? styles.disabled : ''} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button