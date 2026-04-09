import { Link } from 'react-router-dom'
import styles from './ProfilePage.module.css'

const AdminProfile = () => {
  return (
    <div>
      <h1 className={styles.title}>Админ-панель</h1>
      
      <div className={styles.sellerMenu}>
        <Link to="/admin/moderation" className={styles.menuCard}>
          <div className={styles.menuIcon}>✓</div>
          <h3>Модерация товаров</h3>
          <p>Одобрение и отклонение товаров продавцов</p>
        </Link>
        
        <Link to="/admin/users" className={styles.menuCard}>
          <div className={styles.menuIcon}>👥</div>
          <h3>Пользователи</h3>
          <p>Управление пользователями, блокировка</p>
        </Link>
        
        <Link to="/admin/orders" className={styles.menuCard}>
          <div className={styles.menuIcon}>📋</div>
          <h3>Все заказы</h3>
          <p>Просмотр всех заказов</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminProfile