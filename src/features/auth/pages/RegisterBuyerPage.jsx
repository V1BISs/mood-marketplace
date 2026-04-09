import RegisterBuyerForm from '../components/RegisterBuyerForm'
import styles from './AuthPage.module.css'
import { Link } from 'react-router-dom'

const RegisterBuyerPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Регистрация покупателя</h1>
        <RegisterBuyerForm />
        <div className={styles.link}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
        <div className={styles.link}>
          <Link to="/register/seller">Зарегистрироваться как продавец</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterBuyerPage