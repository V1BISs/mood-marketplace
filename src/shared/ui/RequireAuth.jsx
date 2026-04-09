import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const RequireAuth = ({ children, redirectTo = '/login' }) => {
  const { isAuth } = useAuth()
  
  if (!isAuth) {
    return <Navigate to={redirectTo} replace />
  }
  
  return children
}

export default RequireAuth