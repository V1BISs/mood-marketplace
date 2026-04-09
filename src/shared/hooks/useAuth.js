import { useSelector } from 'react-redux'

export const useAuth = () => {
  const { user, isAuth } = useSelector((state) => state.auth)
  
  return {
    user,
    isAuth,
    userRole: user?.role,
  }
}