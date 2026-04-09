import { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaStar, FaEdit, FaReply } from 'react-icons/fa'
import { updateReview, addReplyToReview } from '../services/reviewService'
import { useToast } from '@/shared/context/ToastContext'
import styles from './ReviewList.module.css'

const ReviewList = ({ reviews, onReviewUpdated }) => {
  const { user } = useSelector(state => state.auth)
  const { addToast } = useToast()
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editRating, setEditRating] = useState(0)
  const [editComment, setEditComment] = useState('')
  const [replyingToReviewId, setReplyingToReviewId] = useState(null)
  const [replyText, setReplyText] = useState('')

  const handleEdit = (review) => {
    setEditingReviewId(review.id)
    setEditRating(review.rating)
    setEditComment(review.comment || '')
  }

  const handleUpdate = async (reviewId) => {
    try {
      await updateReview(reviewId, {
        rating: editRating,
        comment: editComment.trim(),
      })
      setEditingReviewId(null)
      addToast('Отзыв обновлён', 'success')
      onReviewUpdated()
    } catch (err) {
      console.error('Ошибка обновления отзыва', err)
      addToast('Ошибка при обновлении отзыва', 'error')
    }
  }

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) {
      addToast('Введите текст ответа', 'error')
      return
    }
    
    try {
      await addReplyToReview(reviewId, replyText.trim(), user?.name || 'Продавец')
      setReplyingToReviewId(null)
      setReplyText('')
      addToast('Ответ добавлен', 'success')
      onReviewUpdated()
    } catch (err) {
      console.error('Ошибка добавления ответа', err)
      addToast('Ошибка при добавлении ответа', 'error')
    }
  }

  if (reviews.length === 0) {
    return <div className={styles.empty}>Пока нет отзывов. Будьте первым!</div>
  }

  return (
    <div className={styles.reviews}>
      <h3>Отзывы ({reviews.length})</h3>
      {reviews.map(review => (
        <div key={review.id} className={styles.reviewCard}>
          {editingReviewId === review.id ? (
            // Режим редактирования
            <div className={styles.editForm}>
              <div className={styles.ratingInput}>
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar
                    key={star}
                    className={styles.star}
                    color={star <= editRating ? '#fbbf24' : '#e5e7eb'}
                    onClick={() => setEditRating(star)}
                  />
                ))}
              </div>
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={3}
              />
              <div className={styles.editActions}>
                <button onClick={() => handleUpdate(review.id)}>Сохранить</button>
                <button onClick={() => setEditingReviewId(null)}>Отмена</button>
              </div>
            </div>
          ) : (
            // Режим просмотра
            <>
              <div className={styles.reviewHeader}>
                <span className={styles.userName}>{review.userName}</span>
                <div className={styles.rating}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar
                      key={star}
                      size={14}
                      color={star <= review.rating ? '#fbbf24' : '#e5e7eb'}
                    />
                  ))}
                </div>
                <span className={styles.date}>
                  {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                </span>
                
                {user?.id === review.userId && (
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(review)}
                    title="Редактировать отзыв"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
              
              {review.comment && <p className={styles.comment}>{review.comment}</p>}
              
              {/* Ответ продавца */}
              {review.reply && (
                <div className={styles.reply}>
                  <strong>Ответ продавца ({review.replyBy}):</strong>
                  <p>{review.reply}</p>
                  <span className={styles.replyDate}>
                    {new Date(review.replyAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
              
              {/* Кнопка ответа для продавца */}
              {user?.role === 'seller' && !review.reply && replyingToReviewId !== review.id && (
                <button
                  className={styles.replyBtn}
                  onClick={() => setReplyingToReviewId(review.id)}
                >
                  <FaReply /> Ответить
                </button>
              )}
              
              {/* Форма ответа */}
              {replyingToReviewId === review.id && (
                <div className={styles.replyForm}>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Введите ответ на отзыв..."
                    rows={3}
                  />
                  <div className={styles.replyActions}>
                    <button onClick={() => handleReply(review.id)}>Отправить</button>
                    <button onClick={() => setReplyingToReviewId(null)}>Отмена</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReviewList