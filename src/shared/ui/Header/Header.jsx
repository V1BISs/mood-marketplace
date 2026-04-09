import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../../features/auth/store/authSlice";
import styles from "./Header.module.css";

const Header = () => {
  const { isAuth, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  const displayCount = cartItemsCount > 100 ? "100+" : cartItemsCount;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/catalog" className={styles.logo}>
          MOOD
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/catalog"
            className={`${styles.navLink} ${isActive("/catalog") ? styles.navLinkActive : ""}`}
          >
            Каталог
          </Link>

          {isAuth ? (
            <>
              <div className={styles.cartLinkWrapper}>
                <Link
                  to="/cart"
                  className={`${styles.navLink} ${isActive("/cart") ? styles.navLinkActive : ""}`}
                >
                  Корзина
                </Link>
                {cartItemsCount > 0 && (
                  <span className={styles.cartBadge}>{displayCount}</span>
                )}
              </div>
              <Link
                to="/profile/orders"
                className={`${styles.navLink} ${isActive("/profile/orders") ? styles.navLinkActive : ""}`}
              >
                Заказы
              </Link>
              <Link
                to="/profile"
                className={`${styles.navLink} ${isActive("/profile") ? styles.navLinkActive : ""}`}
              >
                Профиль
              </Link>

              <div className={styles.userSection}>
                <span className={styles.userName}>{user?.name}</span>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Выйти
                </button>
              </div>
            </>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.authLink}>
                Войти
              </Link>
              <Link
                to="/register"
                className={`${styles.authLink} ${styles.authLinkPrimary}`}
              >
                Регистрация
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;