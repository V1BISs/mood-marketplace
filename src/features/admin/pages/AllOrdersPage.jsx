import { useEffect, useState } from 'react'
import { getAll } from '@/shared/lib/api'
import { STORAGE_KEYS } from '@/shared/lib/api'
import styles from './AllOrdersPage.module.css'

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersByUser = await getAll(STORAGE_KEYS.ORDERS_BY_USER)
        if (!ordersByUser) {
          setOrders([])
          return
        }
        
        const allOrders = []
        for (const userId in ordersByUser) {
          allOrders.push(...ordersByUser[userId])
        }
        
        allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        
        setOrders(allOrders)
      } catch (err) {
        console.error('Ошибка загрузки заказов', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadOrders()
  }, [])

  const getStatusText = (status) => {
    const statusMap = {
      created: 'Ожидает оплаты',
      paid: 'Оплачен',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
    }
    return statusMap[status] || status
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'created': return styles.statusCreated
      case 'paid': return styles.statusPaid
      case 'shipped': return styles.statusShipped
      case 'delivered': return styles.statusDelivered
      default: return ''
    }
  }

  if (loading) return <div className={styles.loading}>Загрузка заказов...</div>

  if (orders.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Нет заказов</h2>
        <p>В системе пока нет ни одного заказа</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Все заказы</h1>
        
        <div className={styles.ordersList}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderNumber}>Заказ №{order.id.slice(0, 8)}</span>
                  <span className={styles.orderDate}>
                    от {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className={`${styles.status} ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>
              
              <div className={styles.orderInfo}>
                <p><strong>Покупатель:</strong> {order.userId}</p>
                <p><strong>Адрес:</strong> {order.address}</p>
                <p><strong>Телефон:</strong> {order.phone}</p>
              </div>
              
              <div className={styles.orderItems}>
                {order.items.map((item, idx) => (
                  <div key={idx} className={styles.orderItem}>
                    <img src={item.imageUrl} alt={item.name} />
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemDetails}>
                        {item.quantity} шт × {Math.round(item.price)} ₽
                      </div>
                    </div>
                    <div className={styles.itemTotal}>
                      {Math.round(item.price * item.quantity)} ₽
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.orderFooter}>
                <div className={styles.orderTotal}>
                  Итого: <span>{Math.round(order.total)} ₽</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllOrdersPage