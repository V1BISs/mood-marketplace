import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { getProductById } from '../services/productService'
import { addToCart, getCart } from '@/features/cart/services/cartService'
import { setItems } from '@/features/cart/store/cartSlice'
import { getProductReviews, getUserReviewForProduct } from '@/features/reviews/services/reviewService'
import { getAll, STORAGE_KEYS } from '@/shared/lib/api'
import ReviewForm from '@/features/reviews/components/ReviewForm'
import ReviewList from '@/features/reviews/components/ReviewList'
import styles from './ProductPage.module.css'

const ProductPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [reviews, setReviews] = useState([])
  const [userCanReview, setUserCanReview] = useState(false)
  const [userHasReviewed, setUserHasReviewed] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const found = await getProductById(productId)
        if (!found) {
          setError('Товар не найден')
        } else {
          setProduct(found)
        }
      } catch (err) {
        setError('Ошибка загрузки товара')
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [productId])

  useEffect(() => {
    const loadReviews = async () => {
      if (!product) return
      
      const productReviews = await getProductReviews(product.id)
      setReviews(productReviews)
      
      if (user) {
        const ordersByUser = await getAll(STORAGE_KEYS.ORDERS_BY_USER)
        const userOrders = ordersByUser?.[user.id] || []
        const deliveredOrders = userOrders.filter(order => order.status === 'delivered')
        const purchasedProductIds = deliveredOrders.flatMap(order => 
          order.items.map(item => item.productId)
        )
        setUserCanReview(purchasedProductIds.includes(product.id))
        
        const existingReview = await getUserReviewForProduct(user.id, product.id)
        setUserHasReviewed(!!existingReview)
      }
    }
    
    loadReviews()
  }, [product, user])

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setAddingToCart(true)
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
      alert('Товар добавлен в корзину')
    } catch (err) {
      console.error('Ошибка добавления в корзину', err)
      alert('Не удалось добавить товар в корзину')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleReviewSubmitted = async () => {
    const updatedReviews = await getProductReviews(product.id)
    setReviews(updatedReviews)
    setUserHasReviewed(true)
    const updatedProduct = await getProductById(product.id)
    setProduct(updatedProduct)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} color="#fbbf24" size={18} />)
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" color="#fbbf24" size={18} />)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaRegStar key={i} color="#fbbf24" size={18} />)
    }
    
    return stars
  }

  if (loading) return <div className={styles.loading}>Загрузка...</div>
  if (error) return <div className={styles.error}>{error}</div>
  if (!product) return <div className={styles.error}>Товар не найден</div>

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Назад
        </button>
        
        <div className={styles.content}>
          <div className={styles.gallery}>
            <img 
              src={product.images?.[0] || product.imageUrl} 
              alt={product.name}
              className={styles.mainImage}
            />
          </div>
          
          <div className={styles.info}>
            <h1 className={styles.title}>{product.name}</h1>
            
            <div className={styles.rating}>
              <div className={styles.stars}>{renderStars(product.rating)}</div>
              <span className={styles.ratingCount}>({product.ratingCount} отзывов)</span>
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
            
            {product.sizes?.length > 0 && (
              <div className={styles.sizes}>
                <h3>Размеры:</h3>
                <div className={styles.sizeList}>
                  {product.sizes.map(size => (
                    <span key={size} className={styles.sizeItem}>{size}</span>
                  ))}
                </div>
              </div>
            )}
            
            {product.colors?.length > 0 && (
              <div className={styles.colors}>
                <h3>Цвета:</h3>
                <div className={styles.colorList}>
                  {product.colors.map(color => (
                    <span key={color} className={styles.colorItem}>{color}</span>
                  ))}
                </div>
              </div>
            )}
            
            <p className={styles.stock}>В наличии: {product.stock} шт</p>
            
            <div className={styles.description}>
              <h3>Описание:</h3>
              <p>{product.description}</p>
            </div>
            
            <button 
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
            >
              {addingToCart ? 'Добавление...' : (product.stock === 0 ? 'Нет в наличии' : 'В корзину')}
            </button>
          </div>
        </div>
        
        <ReviewList reviews={reviews} onReviewUpdated={handleReviewSubmitted} />
        
        {user && userCanReview && !userHasReviewed && (
          <ReviewForm
            productId={product.id}
            userId={user.id}
            userName={user.name}
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}
        
        {user && userHasReviewed && (
          <div className={styles.alreadyReviewed}>
            Вы уже оставили отзыв на этот товар
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductPage