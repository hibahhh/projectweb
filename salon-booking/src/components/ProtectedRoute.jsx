import { Navigate } from 'react-router-dom';
import { useAuth } from '../App';

function ProtectedRoute({ children, requireAuth = true, requireRole = null }) {
    const { user } = useAuth();

    // If authentication is required but user is not logged in
    if (requireAuth && !user) {
        return <Navigate to="/login" replace />;
    }

    // If a specific role is required
    if (requireRole && user?.role !== requireRole) {
        // Redirect based on actual role
        if (user?.role === 'admin') {
            return <Navigate to="/admin" replace />;
        } else if (user?.role === 'user') {
            return <Navigate to="/user-dashboard" replace />;
        } else {
            return <Navigate to="/login" replace />;
        }
    }

    return children;
}

export default ProtectedRoute;
