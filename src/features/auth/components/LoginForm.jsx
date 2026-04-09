import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'
import { setUser } from '../store/authSlice'
import Button from '@/shared/ui/Button/Button'
import Input from '@/shared/ui/Input/Input'
import styles from '../pages/AuthPage.module.css'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await loginUser(email, password)
      dispatch(setUser(user))
      localStorage.setItem('user', JSON.stringify(user))  // добавить здесь
      navigate('/catalog')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <div className={styles.formGroup}>
        <label>Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Пароль</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
          required
        />
      </div>

      {error && <div className={styles.errorText}>{error}</div>}

      <Button type="submit" variant="primary" disabled={loading} className={styles.button}>
        {loading ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  )
}

export default LoginForm