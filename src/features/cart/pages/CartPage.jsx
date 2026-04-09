import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getCart } from '../services/cartService'
import { setItems, setLoading, setError } from '../store/cartSlice'
import CartItem from '../components/CartItem'
import styles from './CartPage.module.css'

const CartPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, loading, error } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    const loadCart = async () => {
      if (!user) return
      
      dispatch(setLoading(true))
      try {
        const cart = await getCart(user.id)
        dispatch(setItems(cart.items))
      } catch (err) {
        dispatch(setError(err.message))
      } finally {
        dispatch(setLoading(false))
      }
    }
    
    loadCart()
  }, [dispatch, user])

  const total = items.reduce((sum, item) => {
    const price = item.product.price * (100 - (item.product.discount || 0)) / 100
    return sum + price * item.quantity
  }, 0)

  const toggleSelect = (productId) => {
    setSelectedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const selectAll = () => {
    setSelectedItems(items.map(item => item.productId))
  }

  const clearSelected = () => {
    setSelectedItems([])
  }

  const handleCheckout = () => {
    const selectedProducts = items.filter(item => selectedItems.includes(item.productId))
    const productsToCheckout = selectedProducts.length > 0 ? selectedProducts : items
    
    navigate('/checkout', { state: { selectedItems: productsToCheckout } })
  }

  if (loading) return <div className={styles.loading}>Загрузка корзины...</div>
  if (error) return <div className={styles.error}>Ошибка: {error}</div>

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога, чтобы оформить заказ</p>
        <button 
          className={styles.continueBtn}
          onClick={() => navigate('/catalog')}
        >
          Перейти в каталог
        </button>
      </div>
    )
  }

  const hasSelected = selectedItems.length > 0

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Корзина</h1>
        <p className={styles.subtitle}>{items.length} товара на сумму {Math.round(total)} ₽</p>
        
        <div className={styles.cartList}>
          {items.map(item => (
            <CartItem
              key={item.productId}
              item={item}
              isSelected={selectedItems.includes(item.productId)}
              onSelect={toggleSelect}
            />
          ))}
        </div>
        
        <div className={styles.summary}>
          <div className={styles.summaryLeft}>
            <div className={styles.total}>
              <span>Итого к оплате:</span>
              <span className={styles.totalAmount}>{Math.round(total)} ₽</span>
            </div>
            <div className={styles.delivery}>
              Доставка рассчитывается при оформлении заказа
            </div>
            <div className={styles.selectionActions}>
              <button onClick={selectAll} className={styles.selectBtn}>Выбрать всё</button>
              <button onClick={clearSelected} className={styles.selectBtn}>Снять всё</button>
            </div>
          </div>
          <button className={styles.checkoutBtn} onClick={handleCheckout}>
            {hasSelected ? 'Оформить выбранное' : 'Оформить всё'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage