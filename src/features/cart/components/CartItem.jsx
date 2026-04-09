import { useDispatch, useSelector } from 'react-redux'
import { updateQuantity, removeFromCart } from '../services/cartService'
import { setItems } from '../store/cartSlice'
import styles from './CartItem.module.css'

const CartItem = ({ item, isSelected, onSelect }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { items } = useSelector(state => state.cart)
  
  const handleQuantityChange = async (newQuantity) => {
    const maxStock = item.product.stock
    const validQuantity = Math.min(Math.max(1, newQuantity), maxStock)
    
    if (validQuantity !== item.quantity) {
      const updatedItems = items.map(i => 
        i.productId === item.productId ? { ...i, quantity: validQuantity } : i
      )
      dispatch(setItems(updatedItems))
      
      try {
        await updateQuantity(user.id, item.productId, validQuantity)
      } catch (err) {
        const { getCart } = await import('../services/cartService')
        const updatedCart = await getCart(user.id)
        dispatch(setItems(updatedCart.items))
      }
    }
  }
  
  const handleRemove = async () => {
    const updatedItems = items.filter(i => i.productId !== item.productId)
    dispatch(setItems(updatedItems))
    
    try {
      await removeFromCart(user.id, item.productId)
    } catch (err) {
      const { getCart } = await import('../services/cartService')
      const updatedCart = await getCart(user.id)
      dispatch(setItems(updatedCart.items))
    }
  }
  
  const priceWithDiscount = item.product.price * (100 - (item.product.discount || 0)) / 100
  const totalPrice = priceWithDiscount * item.quantity

  return (
    <div className={styles.cartItem}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(item.productId)}
        className={styles.checkbox}
      />
      <img src={item.product.imageUrl} alt={item.product.name} />
      <div className={styles.name}>{item.product.name}</div>
      <div className={styles.price}>{priceWithDiscount} ₽</div>
      <input 
        type="number" 
        className={styles.quantityInput}
        value={item.quantity}
        onChange={(e) => handleQuantityChange(Number(e.target.value))}
        min="1"
        max={item.product.stock}
      />
      <div className={styles.total}>{Math.round(totalPrice)} ₽</div>
      <button className={styles.removeBtn} onClick={handleRemove}>
        Удалить
      </button>
    </div>
  )
}

export default CartItem