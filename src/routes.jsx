import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Resources from './pages/Resources';
import Incidents from './pages/Incidents';
import Deliberations from './pages/Deliberations';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

/**
 * Protected route component - redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="fstt-loading">Chargement...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * Main application routes
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="students" element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        } />
        
        <Route path="courses" element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        } />
        
        <Route path="resources" element={
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        } />
        
        <Route path="incidents" element={
          <ProtectedRoute>
            <Incidents />
          </ProtectedRoute>
        } />
        
        <Route path="deliberations" element={
          <ProtectedRoute>
            <Deliberations />
          </ProtectedRoute>
        } />
        
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
