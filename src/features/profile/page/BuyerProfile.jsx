import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/features/auth/store/authSlice'
import styles from './ProfilePage.module.css'

const BuyerProfile = ({ user }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: обновить пользователя в localStorage и Redux
    dispatch(setUser({ ...user, ...formData }))
    alert('Данные сохранены')
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
          <label>Адрес доставки</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="г. Москва, ул. Примерная, д. 1"
          />
        </div>
        
        <button type="submit" className={styles.saveBtn}>
          Сохранить изменения
        </button>
      </form>
    </div>
  )
}

export default BuyerProfile