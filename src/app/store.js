import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/store/authSlice'
import productsReducer from '@/features/products/store/productsSlice'
import cartReducer from '@/features/cart/store/cartSlice'
import ordersReducer from '@/features/orders/store/ordersSlice';

const savedUser = localStorage.getItem('user')
const preloadedState = savedUser ? {
  auth: {
    user: JSON.parse(savedUser),
    isAuth: true,
    loading: false,
    error: null,
  }
} : {}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
  preloadedState,
})