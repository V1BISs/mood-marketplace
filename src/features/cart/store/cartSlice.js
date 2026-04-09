import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload
    },
    addItem: (state, action) => {
      const { productId, product, quantity = 1 } = action.payload
      const existingItem = state.items.find(item => item.productId === productId)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({ productId, product, quantity })
      }
    },
    removeItem: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(item => item.productId !== productId)
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find(item => item.productId === productId)
      if (item && quantity >= 1) {
        item.quantity = quantity
      }
    },
    clearCart: (state) => {
      state.items = []
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setItems,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions

export default cartSlice.reducer