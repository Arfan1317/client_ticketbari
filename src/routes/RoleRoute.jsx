import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};
export default RoleRoute;
