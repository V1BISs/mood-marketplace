import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createOrderByUser as createOrder } from '../services/orderService';
import { clearCart } from '../../cart/services/cartService';
import { setItems } from '../../cart/store/cartSlice';
import { useToast } from '@/shared/context/ToastContext';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { user } = useSelector(state => state.auth);
  const selectedItems = location.state?.selectedItems || [];

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = selectedItems.reduce((sum, item) => {
    const price = item.product.price * (100 - (item.product.discount || 0)) / 100;
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !phone) {
      setError('Заполните все поля');
      addToast('Заполните все поля', 'error');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: selectedItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price * (100 - (item.product.discount || 0)) / 100,
          quantity: item.quantity,
          sellerId: item.product.sellerId,
          imageUrl: item.product.imageUrl,
        })),
        total,
        address,
        phone,
      };

      const newOrder = await createOrder(user.id, orderData);

      // Очищаем корзину только от оплаченных товаров
      const { getCart } = await import('../../cart/services/cartService');
      const currentCart = await getCart(user.id);
      const updatedItems = currentCart.items.filter(
        cartItem => !selectedItems.some(selected => selected.productId === cartItem.productId)
      );
      await clearCart(user.id);
      for (const item of updatedItems) {
        const { addToCart } = await import('../../cart/services/cartService');
        await addToCart(user.id, item.product.id, item.product, item.quantity);
      }
      dispatch(setItems(updatedItems));

      addToast('Заказ успешно оформлен! Перенаправление на оплату...', 'success');
      navigate(`/payment/${newOrder.id}`);
    } catch (err) {
      setError(err.message || 'Ошибка оформления заказа');
      addToast(err.message || 'Ошибка оформления заказа', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (selectedItems.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Нет выбранных товаров</h2>
        <button onClick={() => navigate('/cart')}>Вернуться в корзину</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Оформление заказа</h1>

        <div className={styles.content}>
          <div className={styles.products}>
            <h2>Товары</h2>
            {selectedItems.map(item => (
              <div key={item.productId} className={styles.productItem}>
                <img src={item.product.imageUrl} alt={item.product.name} />
                <div>{item.product.name}</div>
                <div>{item.quantity} шт</div>
                <div>
                  {Math.round(item.product.price * (100 - (item.product.discount || 0)) / 100 * item.quantity)} ₽
                </div>
              </div>
            ))}
            <div className={styles.total}>Итого: {Math.round(total)} ₽</div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Данные доставки</h2>
            
            <div className={styles.field}>
              <label>Адрес доставки</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="г. Москва, ул. Примерная, д. 1"
                required
              />
            </div>

            <div className={styles.field}>
              <label>Телефон</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;