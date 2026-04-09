import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const RequireRole = ({ children, role, redirectTo = '/' }) => {
  const { isAuth, userRole } = useAuth()
  
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }
  
  if (userRole !== role) {
    return <Navigate to={redirectTo} replace />
  }
  
  return children
}

export default RequireRole