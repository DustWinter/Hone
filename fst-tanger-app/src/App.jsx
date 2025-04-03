import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import './utils/i18n';
import './App.css';

// Import layout components (to be created)
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import pages (to be created)
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Resources from './pages/Resources';
import Incidents from './pages/Incidents';
import Deliberations from './pages/Deliberations';
import NotFound from './pages/NotFound';

function App() {
  // Initialize the database with sample data in development mode
  useEffect(() => {
    if (import.meta.env.DEV) {
      import('./utils/initData').then(module => {
        module.default();
      });
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="courses/*" element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } />
            
            <Route path="students/*" element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            } />
            
            <Route path="resources/*" element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            } />
            
            <Route path="incidents/*" element={
              <ProtectedRoute>
                <Incidents />
              </ProtectedRoute>
            } />
            
            <Route path="deliberations/*" element={
              <ProtectedRoute>
                <Deliberations />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
