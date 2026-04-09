import { getAll, saveAll, STORAGE_KEYS } from '@/shared/lib/api'

export const getProductReviews = async (productId) => {
  const reviews = await getAll(STORAGE_KEYS.REVIEWS)
  return reviews.filter(r => r.productId === productId)
}

export const getUserReviewForProduct = async (userId, productId) => {
  const reviews = await getAll(STORAGE_KEYS.REVIEWS)
  return reviews.find(r => r.userId === userId && r.productId === productId)
}

export const addReview = async (reviewData) => {
  const reviews = await getAll(STORAGE_KEYS.REVIEWS)
  const newReview = {
    id: crypto.randomUUID(),
    ...reviewData,
    createdAt: new Date().toISOString(),
  }
  const updatedReviews = [...reviews, newReview]
  await saveAll(STORAGE_KEYS.REVIEWS, updatedReviews)
  return newReview
}

export const updateProductRating = async (productId) => {
  const reviews = await getAll(STORAGE_KEYS.REVIEWS)
  const productReviews = reviews.filter(r => r.productId === productId)
  const ratingCount = productReviews.length
  const rating = ratingCount === 0 ? 0 : productReviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
  
  const products = await getAll(STORAGE_KEYS.PRODUCTS)
  const productIndex = products.findIndex(p => p.id === productId)
  if (productIndex !== -1) {
    products[productIndex].rating = Math.round(rating * 10) / 10
    products[productIndex].ratingCount = ratingCount
    await saveAll(STORAGE_KEYS.PRODUCTS, products)
  }
  
  return { rating, ratingCount }
}

export const updateReview = async (reviewId, updates) => {
  const reviews = await getAll(STORAGE_KEYS.REVIEWS)
  const index = reviews.findIndex(r => r.id === reviewId)
  if (index === -1) throw new Error('Отзыв не найден')
  
  reviews[index] = { ...reviews[index], ...updates, updatedAt: new Date().toISOString() }
  await saveAll(STORAGE_KEYS.REVIEWS, reviews)
  
  // Обновляем рейтинг товара
  await updateProductRating(reviews[index].productId)
  
  return reviews[index]
}

export const addReplyToReview = async (reviewId, replyText, sellerName) => {
  return updateReview(reviewId, {
    reply: replyText,
    replyBy: sellerName,
    replyAt: new Date().toISOString(),
  })
}