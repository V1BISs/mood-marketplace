const STORAGE_KEYS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CART: 'cart',
  REVIEWS: 'reviews',
  ORDERS_BY_USER: 'ordersByUser'
}

const getItem = (key) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = localStorage.getItem(key)
      resolve(data ? JSON.parse(data) : null)
    }, 200)
  })
}

const setItem = (key, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(data))
      resolve(data)
    }, 200)
  })
}

const getAll = (key) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = localStorage.getItem(key)
      resolve(data ? JSON.parse(data) : [])
    }, 200)
  })
}

const saveAll = (key, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(data))
      resolve(data)
    }, 200)
  })
}

export { STORAGE_KEYS, getItem, setItem, getAll, saveAll }