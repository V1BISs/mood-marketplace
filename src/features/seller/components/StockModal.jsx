import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import styles from './StockModal.module.css'

const StockModal = ({ product, onClose, onUpdate }) => {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (quantity <= 0) {
      alert('Количество должно быть больше 0')
      return
    }

    setLoading(true)
    try {
      const newStock = product.stock + quantity
      await onUpdate(product.id, { stock: newStock })
      onClose()
    } catch (err) {
      console.error('Ошибка пополнения склада', err)
      alert('Не удалось пополнить склад')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Пополнение склада</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.content}>
          <p><strong>Товар:</strong> {product.name}</p>
          <p><strong>Текущий остаток:</strong> {product.stock} шт</p>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label>Добавить количество:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                autoFocus
              />
            </div>
            
            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Сохранение...' : 'Пополнить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default StockModal