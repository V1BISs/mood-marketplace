import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../../../features/auth/store/authSlice'
import { FiMenu, FiX } from 'react-icons/fi'
import styles from './Header.module.css'

const Header = () => {
  const { isAuth, user } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('user')
    navigate('/login')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)
  const displayCount = cartItemsCount > 100 ? '100+' : cartItemsCount

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/catalog" className={styles.logo} onClick={closeMenu}>
          MOOD
        </Link>

        <button 
          className={styles.menuBtn} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <Link
            to="/catalog"
            className={`${styles.navLink} ${isActive('/catalog') ? styles.navLinkActive : ''}`}
            onClick={closeMenu}
          >
            Каталог
          </Link>

          {isAuth ? (
            <>
              <div className={styles.cartLinkWrapper}>
                <Link
                  to="/cart"
                  className={`${styles.navLink} ${isActive('/cart') ? styles.navLinkActive : ''}`}
                  onClick={closeMenu}
                >
                  Корзина
                </Link>
                {cartItemsCount > 0 && (
                  <span className={styles.cartBadge}>{displayCount}</span>
                )}
              </div>
              <Link
                to="/profile/orders"
                className={`${styles.navLink} ${isActive('/profile/orders') ? styles.navLinkActive : ''}`}
                onClick={closeMenu}
              >
                Заказы
              </Link>
              <Link
                to="/profile"
                className={`${styles.navLink} ${isActive('/profile') ? styles.navLinkActive : ''}`}
                onClick={closeMenu}
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
              <Link to="/login" className={styles.authLink} onClick={closeMenu}>
                Войти
              </Link>
              <Link
                to="/register/buyer"
                className={`${styles.authLink} ${styles.authLinkPrimary}`}
                onClick={closeMenu}
              >
                Регистрация
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header