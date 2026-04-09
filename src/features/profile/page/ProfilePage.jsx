import { useSelector } from 'react-redux'
import BuyerProfile from './BuyerProfile'
import SellerProfile from './SellerProfile'
import AdminProfile from './AdminProfile'
import styles from './ProfilePage.module.css'

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth)

  if (!user) return <div>Загрузка...</div>

  const renderProfile = () => {
    switch (user.role) {
      case 'seller':
        return <SellerProfile user={user} />
      case 'admin':
        return <AdminProfile user={user} />
      default:
        return <BuyerProfile user={user} />
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {renderProfile()}
      </div>
    </div>
  )
}

export default ProfilePage