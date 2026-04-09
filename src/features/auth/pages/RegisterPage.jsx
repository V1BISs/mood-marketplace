import RegisterForm from '../components/RegisterForm'
import styles from './AuthPage.module.css'
import { Link } from 'react-router-dom'

const RegisterPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Регистрация</h1>
        <RegisterForm />
        <div className={styles.link}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage