import { useAuth } from '../features/auth/hooks/useAuth';
import { Navigate } from 'react-router';
import Loading from './Loading';

const PublicRoute = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) return <Loading />;
  
  if (user) return <Navigate to="/" replace />;

  return children;
};

export default PublicRoute