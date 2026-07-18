import { useAuth } from '../features/auth/hooks/useAuth';
import { Navigate } from 'react-router';
import Loading from './Loading';

const ProtectedRoute = ({ children }) => {
    const { loading , user } = useAuth();

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <Navigate to="/user/login" />;
    }

    return children;
};

export default ProtectedRoute;