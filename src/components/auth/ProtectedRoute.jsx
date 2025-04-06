import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute component - Restricts access to authenticated users
 * Optionally restricts to admin users only
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, hasRole, ROLES } = useAuth();
  const location = useLocation();
  
  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If this is an admin-only route, check for admin roles
  if (adminOnly) {
    const isAdmin = hasRole(ROLES.CHEF_DEPARTEMENT) || 
                   hasRole(ROLES.ADMIN) || 
                   hasRole(ROLES.COORDINATEUR);
                   
    if (!isAdmin) {
      // Redirect to dashboard if not an admin
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // User is authenticated (and has admin role if required)
  return children;
};

export default ProtectedRoute;
