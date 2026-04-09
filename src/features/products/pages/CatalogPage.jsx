import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import getApprovedProducts from '../services/productService'
import { setItems, setLoading, setError, applyFiltersAndSort } from '../store/productsSlice'
import ProductList from '../components/ProductList'
import ProductFilters from '../components/ProductFilters'
import styles from './CatalogPage.module.css'

const CatalogPage = () => {
  const dispatch = useDispatch()
  const { filteredItems, loading, error } = useSelector((state) => state.products)
  
  useEffect(() => {
    const loadProducts = async () => {
      dispatch(setLoading(true))
      try {
        const products = await getApprovedProducts()
        dispatch(setItems(products))
        dispatch(applyFiltersAndSort())
      } catch (err) {
        dispatch(setError(err.message))
      } finally {
        dispatch(setLoading(false))
      }
    }
    
    loadProducts()
  }, [dispatch])

  if (loading) return <div className={styles.loading}>Загрузка товаров...</div>
  if (error) return <div className={styles.error}>Ошибка: {error}</div>

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Каталог товаров</h1>
          <p className={styles.subtitle}>
            {filteredItems.length} товаров в наличии
          </p>
        </div>

        <div className={styles.filtersSection}>
          <ProductFilters />
        </div>

        <div className={styles.productsSection}>
          <ProductList products={filteredItems} />
        </div>
      </div>
    </div>
  )
}

export default CatalogPage