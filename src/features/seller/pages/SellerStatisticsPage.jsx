import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAll } from '@/shared/lib/api'
import { STORAGE_KEYS } from '@/shared/lib/api'
import { FiDollarSign, FiShoppingBag, FiPackage } from 'react-icons/fi'
import styles from './SellerStatisticsPage.module.css'

const SellerStatisticsPage = () => {
  const { user } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalUnitsSold: 0,
    totalOrders: 0,
  })

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const ordersByUser = await getAll(STORAGE_KEYS.ORDERS_BY_USER)
        if (!ordersByUser) {
          setStatistics({ totalRevenue: 0, totalUnitsSold: 0, totalOrders: 0 })
          return
        }
        
        // Собираем все заказы всех пользователей
        const allOrders = []
        for (const userId in ordersByUser) {
          allOrders.push(...ordersByUser[userId])
        }
        
        // Фильтруем только оплаченные заказы (paid, shipped, delivered)
        const paidOrders = allOrders.filter(order => 
          order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered'
        )
        
        let totalRevenue = 0
        let totalUnitsSold = 0
        const sellerOrderIds = new Set()
        
        for (const order of paidOrders) {
          const sellerItems = order.items.filter(item => item.sellerId === user.id)
          if (sellerItems.length > 0) {
            sellerOrderIds.add(order.id)
            for (const item of sellerItems) {
              totalRevenue += item.price * item.quantity
              totalUnitsSold += item.quantity
            }
          }
        }
        
        setStatistics({
          totalRevenue: Math.round(totalRevenue),
          totalUnitsSold,
          totalOrders: sellerOrderIds.size,
        })
      } catch (err) {
        console.error('Ошибка загрузки статистики', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadStatistics()
  }, [user.id])

  if (loading) return <div className={styles.loading}>Загрузка статистики...</div>

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Статистика продаж</h1>
        
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <FiDollarSign />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>{statistics.totalRevenue.toLocaleString()} ₽</div>
              <div className={styles.cardLabel}>Общая прибыль</div>
            </div>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <FiPackage />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>{statistics.totalUnitsSold}</div>
              <div className={styles.cardLabel}>Продано единиц</div>
            </div>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <FiShoppingBag />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>{statistics.totalOrders}</div>
              <div className={styles.cardLabel}>Количество заказов</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerStatisticsPage