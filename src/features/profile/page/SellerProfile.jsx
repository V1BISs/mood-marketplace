import { Link } from "react-router-dom";
import styles from "./ProfilePage.module.css";

const SellerProfile = ({ user }) => {
  return (
    <div>
      <h1 className={styles.title}>Магазин {user.name}</h1>

      <div className={styles.sellerMenu}>
        <Link to="/seller/products" className={styles.menuCard}>
          <div className={styles.menuIcon}>📦</div>
          <h3>Мои товары</h3>
          <p>Управление товарами, добавление, редактирование</p>
        </Link>

        <Link to="/seller/orders" className={styles.menuCard}>
          <div className={styles.menuIcon}>📋</div>
          <h3>Заказы</h3>
          <p>Заказы с вашими товарами</p>
        </Link>

        <Link to="/seller/statistics" className={styles.menuCard}>
          <div className={styles.menuIcon}>📊</div>
          <h3>Статистика</h3>
          <p>Прибыль, продажи, количество заказов</p>
        </Link>
      </div>
    </div>
  );
};

export default SellerProfile;
