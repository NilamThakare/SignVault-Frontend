import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SuperAdminRoute({ children }) {
  const { user, token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  const isSuperAdmin = user?.role === 'ROLE_SUPERADMIN';
  return isSuperAdmin ? children : <Navigate to="/dashboard" />;
}