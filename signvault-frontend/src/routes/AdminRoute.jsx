import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SUPERADMIN';
  return isAdmin ? children : <Navigate to="/dashboard" />;
}