import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'
import { setUser } from '../store/authSlice'
import Button from '@/shared/ui/Button/Button'
import Input from '@/shared/ui/Input/Input'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    organizationName: '',
    inn: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (formData.password.length < 6) {
        throw new Error('Пароль должен быть не менее 6 символов')
      }
      
      const userData = { ...formData }
      if (userData.role !== 'seller') {
        delete userData.organizationName
        delete userData.inn
      }
      
      const user = await registerUser(userData)
      dispatch(setUser(user))
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Имя"
        required
      />
      <Input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <Input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Пароль (мин. 6 символов)"
        required
      />
      
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="buyer">Покупатель</option>
        <option value="seller">Продавец</option>
      </select>
      
      {formData.role === 'seller' && (
        <>
          <Input
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            placeholder="Название организации"
            required
          />
          <Input
            name="inn"
            value={formData.inn}
            onChange={handleChange}
            placeholder="ИНН"
            required
          />
        </>
      )}
      
      {error && <div style={{ color: 'var(--color-error)' }}>{error}</div>}
      
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </form>
  )
}

export default RegisterForm