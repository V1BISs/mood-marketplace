import RegisterSellerForm from '../components/RegisterSellerForm'
import styles from './AuthPage.module.css'
import { Link } from 'react-router-dom'

const RegisterSellerPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Регистрация продавца</h1>
        <RegisterSellerForm />
        <div className={styles.link}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
        <div className={styles.link}>
          <Link to="/register/buyer">Зарегистрироваться как покупатель</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterSellerPage