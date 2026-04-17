import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/features/auth/store/authSlice'
import { updateUserProfile } from '@/features/auth/services/authService'
import { useToast } from '@/shared/context/ToastContext'
import styles from './ProfilePage.module.css'

const BuyerProfile = ({ user }) => {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedUser = await updateUserProfile(user.id, formData)
      dispatch(setUser(updatedUser))
      addToast('Данные профиля сохранены', 'success')
    } catch (err) {
      console.error('Ошибка сохранения профиля', err)
      addToast('Ошибка сохранения данных', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Профиль покупателя</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Имя</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.field}>
          <label>Телефон</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
        
        <div className={styles.field}>
          <label>Адрес доставки (город, улица, дом)</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Москва, ул. Тверская, д. 1"
          />
        </div>
        
        <button type="submit" disabled={loading} className={styles.saveBtn}>
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  )
}

export default BuyerProfile