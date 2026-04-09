import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    priceMin: '',
    priceMax: '',
  },
  sort: 'default',
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload
      state.filteredItems = action.payload
    },
    setItems: (state, action) => {
      state.items = action.payload
      state.filteredItems = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setSort: (state, action) => {
      state.sort = action.payload
    },
    applyFiltersAndSort: (state) => {
      let result = [...state.items]
      
      if (state.filters.search) {
        result = result.filter(item => 
          item.name.toLowerCase().includes(state.filters.search.toLowerCase())
        )
      }
      if (state.filters.category) {
        result = result.filter(item => item.category === state.filters.category)
      }
      if (state.filters.priceMin) {
        result = result.filter(item => item.price >= Number(state.filters.priceMin))
      }
      if (state.filters.priceMax) {
        result = result.filter(item => item.price <= Number(state.filters.priceMax))
      }
      
      if (state.sort === 'price_asc') {
        result.sort((a, b) => a.price - b.price)
      } else if (state.sort === 'price_desc') {
        result.sort((a, b) => b.price - a.price)
      } else if (state.sort === 'date_desc') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
      
      state.filteredItems = result
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        priceMin: '',
        priceMax: '',
      }
      state.sort = 'default'
      state.filteredItems = state.items
    },
  },
})

export const { 
  setProducts,
  setItems, 
  setLoading, 
  setError, 
  setFilters, 
  setSort, 
  applyFiltersAndSort,
  resetFilters,
} = productsSlice.actions

export default productsSlice.reducer