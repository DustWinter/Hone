import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Resources from './pages/Resources';
import Incidents from './pages/Incidents';
import Deliberations from './pages/Deliberations';
import Internships from './pages/Internships';
import Administration from './pages/Administration';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Evaluations from './pages/Evaluations';
import ProtectedRoute from './components/auth/ProtectedRoute';

import './App.css';

/**
 * Main application component
 */
function App() {
  const { t } = useTranslation();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState(null);

  // Try to initialize the database but continue regardless of outcome
  useEffect(() => {
    const initDb = async () => {
      try {
        // Import the database module
        const dbModule = await import('./utils/db');
        const db = dbModule.default;

        // Check if we need to initialize the database
        const needsInit = !(await db.isDatabaseInitialized().catch(() => false));
        
        if (needsInit) {
          try {
            // Try to initialize with sample data
            const initData = await import('./utils/initData').then(module => module.default);
            await initData();
            console.log('Database initialized successfully');
          } catch (initError) {
            console.error('Error initializing database with sample data:', initError);
          }
        }
        else {
          console.log("Database not initialized.")
        }
        
        setDbInitialized(true);
      } catch (error) {
        console.error('Error initializing database:', error);
        setDbError(error.message);
        setDbInitialized(true); // Continue anyway
      }
    };

    initDb();
  }, []);

  // Show loading while initializing database
  if (!dbInitialized) {
    return (
      <div className="fstt-app-loading">
        <h2>{t('common.loading') || 'Chargement...'}</h2>
        <p>{t('common.initializing') || 'Initialisation de l\'application'}</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
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
              <Route path="courses" element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } />
              <Route path="students" element={
                <ProtectedRoute>
                  <Students />
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
              <Route path="internships" element={
                <ProtectedRoute>
                  <Internships />
                </ProtectedRoute>
              } />
              <Route path="evaluations" element={
                <ProtectedRoute>
                  <Evaluations />
                </ProtectedRoute>
              } />
              <Route path="administration" element={
                <ProtectedRoute adminOnly>
                  <Administration />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute adminOnly>
                  <Users />
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
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
