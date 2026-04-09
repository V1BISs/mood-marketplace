import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { addReview, updateProductRating } from '../services/reviewService'
import { useToast } from '@/shared/context/ToastContext'
import styles from './ReviewForm.module.css'

const ReviewForm = ({ productId, userId, userName, onReviewSubmitted }) => {
  const { addToast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Поставьте оценку')
      addToast('Поставьте оценку товару', 'error')
      return
    }

    setLoading(true)
    setError('')

    try {
      await addReview({
        productId,
        userId,
        userName,
        rating,
        comment: comment.trim() || '',
      })
      await updateProductRating(productId)
      addToast('Спасибо за ваш отзыв!', 'success')
      onReviewSubmitted()
    } catch (err) {
      setError('Ошибка при отправке отзыва')
      addToast('Ошибка при отправке отзыва', 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Оставить отзыв</h3>
      
      <div className={styles.ratingInput}>
        <span>Ваша оценка:</span>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map(star => (
            <FaStar
              key={star}
              className={styles.star}
              color={(hoverRating || rating) >= star ? '#fbbf24' : '#e5e7eb'}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Поделитесь впечатлениями о товаре (необязательно)"
        rows={4}
      />
      
      {error && <div className={styles.error}>{error}</div>}
      
      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? 'Отправка...' : 'Отправить отзыв'}
      </button>
    </form>
  )
}

export default ReviewForm