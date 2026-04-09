import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { addToCart, getCart } from '@/features/cart/services/cartService'
import { setItems } from '@/features/cart/store/cartSlice'
import styles from './ProductCard.module.css'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      const currentCart = await getCart(user.id)
      const existingItem = currentCart.items.find(i => i.productId === product.id)
      const currentQuantity = existingItem ? existingItem.quantity : 0
      
      if (currentQuantity + 1 > product.stock) {
        alert(`Нельзя добавить больше ${product.stock} шт. товара "${product.name}"`)
        return
      }

      await addToCart(user.id, product.id, product, 1)
      const updatedCart = await getCart(user.id)
      dispatch(setItems(updatedCart.items))
    } catch (err) {
      console.error('Ошибка добавления в корзину', err)
      alert('Не удалось добавить товар в корзину')
    }
  }

  const handleCardClick = () => {
    navigate(`/product/${product.id}`)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} color="#fbbf24" size={14} />)
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" color="#fbbf24" size={14} />)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaRegStar key={i} color="#fbbf24" size={14} />)
    }
    
    return stars
  }

  return (
    <div className={styles.card}>
      <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <img src={product.images?.[0] || product.imageUrl} className={styles.image} />
        <div className={styles.content}>
          <h3 className={styles.title}>{product.name}</h3>
          <div className={styles.rating}>
            <div className={styles.stars}>{renderStars(product.rating)}</div>
            <span className={styles.ratingCount}>({product.ratingCount})</span>
          </div>
          <div className={styles.priceBlock}>
            {product.discount > 0 ? (
              <>
                <span className={styles.oldPrice}>{product.price} ₽</span>
                <span className={styles.price}>
                  {(product.price * (100 - product.discount)) / 100} ₽
                </span>
              </>
            ) : (
              <span className={styles.price}>{product.price} ₽</span>
            )}
          </div>
          <p className={styles.stock}>В наличии: {product.stock} шт</p>
        </div>
      </div>
      <button 
        className={styles.button} 
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Нет в наличии' : 'В корзину'}
      </button>
    </div>
  )
}

export default ProductCard