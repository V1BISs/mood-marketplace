import LoginForm from '../components/LoginForm'
import styles from './AuthPage.module.css'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Вход в аккаунт</h1>
        <LoginForm />
        <div className={styles.link}>
          Нет аккаунта? <Link to="/register/buyer">Зарегистрироваться</Link>
        </div>
        <div className={styles.link}>
          <Link to="/register/seller">Зарегистрироваться как продавец</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage