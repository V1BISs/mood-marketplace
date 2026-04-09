import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getOrdersByUser } from '../services/orderService';
import { setOrders, setLoading, setError } from '../store/ordersSlice';
import styles from './OrdersPage.module.css';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { orders, loading, error } = useSelector(state => state.orders);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      dispatch(setLoading(true));
      try {
        const userOrders = await getOrdersByUser(user.id);
        // Сортируем от новых к старым
        const sortedOrders = [...userOrders].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        dispatch(setOrders(sortedOrders));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    loadOrders();
  }, [dispatch, user]);

  const getStatusText = (status) => {
    const statusMap = {
      created: 'Ожидает оплаты',
      paid: 'Оплачен',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'created': return styles.statusCreated;
      case 'paid': return styles.statusPaid;
      case 'shipped': return styles.statusShipped;
      case 'delivered': return styles.statusDelivered;
      default: return '';
    }
  };

  const handlePay = (orderId) => {
    navigate(`/payment/${orderId}`);
  };

  if (loading) return <div className={styles.loading}>Загрузка заказов...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  if (orders.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📦</div>
        <h2>У вас пока нет заказов</h2>
        <p>Перейдите в каталог и оформите первый заказ</p>
        <button 
          className={styles.continueBtn}
          onClick={() => navigate('/catalog')}
        >
          Перейти в каталог
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Мои заказы</h1>
        
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
                {order.status === 'created' && (
                  <button 
                    className={styles.payBtn}
                    onClick={() => handlePay(order.id)}
                  >
                    Оплатить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;